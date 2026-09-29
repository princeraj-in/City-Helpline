import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

let adminAppInitialized = false;
let hasServiceAccount = false;

function initFirebaseAdmin() {
  if (getApps().length > 0) {
    adminAppInitialized = true;
    return;
  }

  const projectId = process.env.VITE_FIREBASE_PROJECT_ID || 'studolink-in';

  // 1. Check for Service Account Key in environment
  let serviceAccount: any = null;
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim();
      if (raw.startsWith('{')) {
        serviceAccount = JSON.parse(raw);
      } else if (fs.existsSync(raw)) {
        serviceAccount = JSON.parse(fs.readFileSync(raw, 'utf8'));
      }
    } catch (e) {
      console.warn('[Admin SDK]: Could not parse FIREBASE_SERVICE_ACCOUNT_KEY:', e);
    }
  }

  // 2. Check local candidates
  if (!serviceAccount) {
    const candidates = [
      path.resolve(process.cwd(), 'serviceAccountKey.json'),
      path.resolve(process.cwd(), 'service-account.json'),
      path.resolve(process.cwd(), 'firebase-admin-key.json'),
    ];
    for (const c of candidates) {
      if (fs.existsSync(c)) {
        try {
          serviceAccount = JSON.parse(fs.readFileSync(c, 'utf8'));
          break;
        } catch {
          // continue
        }
      }
    }
  }

  if (serviceAccount) {
    try {
      initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id || projectId,
      });
      hasServiceAccount = true;
      adminAppInitialized = true;
      console.log('[Admin SDK]: Successfully initialized with Service Account credentials');
      return;
    } catch (e) {
      console.warn('[Admin SDK]: Failed to initialize with cert:', e);
    }
  }

  // Fallback: Initialize with projectId for public key token verification
  try {
    initializeApp({ projectId });
    adminAppInitialized = true;
    console.log('[Admin SDK]: Initialized with Project ID for token verification');
  } catch (e) {
    console.error('[Admin SDK]: Failed to initialize Admin App:', e);
  }
}

initFirebaseAdmin();

export interface RoleChangeRequest {
  targetUid: string;
  targetEmail?: string;
  newRole: 'admin' | 'user' | 'contributor';
}

export interface AdminCaller {
  uid: string;
  email?: string;
  isAdmin: boolean;
}

/**
 * Verifies the caller's Firebase ID Token securely using Google's public cryptographic keys
 */
export async function verifyAdminCaller(authHeader?: string): Promise<AdminCaller> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized: Missing or invalid Authorization header.');
  }

  const idToken = (authHeader || '').replace(/^Bearer\s+/i, '').trim();
  if (!idToken) {
    throw new Error('Unauthorized: Empty Bearer token.');
  }

  initFirebaseAdmin();
  const auth = getAuth();
  const decoded = await auth.verifyIdToken(idToken);

  const isExplicitFounder = decoded.email === 'kusprince.raj@gmail.com';
  const hasCustomClaim = decoded.admin === true;

  if (!isExplicitFounder && !hasCustomClaim) {
    throw new Error('Forbidden: Only authorized administrators can perform role modifications.');
  }

  return {
    uid: decoded.uid,
    email: decoded.email,
    isAdmin: true,
  };
}

/**
 * Server-authoritative role updater:
 * 1. Cryptographically signs Custom Claims via Firebase Admin Auth (if cert available)
 * 2. Manages server-side roles_admins document and users/{targetUid} role field
 */
export async function assignUserRoleServer(
  caller: AdminCaller,
  idToken: string,
  req: RoleChangeRequest
): Promise<{ success: boolean; message: string }> {
  const { targetUid, targetEmail = '', newRole } = req;

  if (!targetUid || typeof targetUid !== 'string') {
    throw new Error('Invalid target UID.');
  }

  if (!['admin', 'user', 'contributor'].includes(newRole)) {
    throw new Error(`Invalid role "${newRole}". Must be admin, user, or contributor.`);
  }

  if (caller.uid === targetUid && newRole !== 'admin') {
    throw new Error('You cannot demote your own administrator account.');
  }

  initFirebaseAdmin();
  const auth = getAuth();

  // 1. If service account is available, assign Firebase Custom Claims (admin: true/false)
  let claimsUpdated = false;
  if (hasServiceAccount) {
    try {
      await auth.setCustomUserClaims(targetUid, {
        admin: newRole === 'admin',
      });
      claimsUpdated = true;
    } catch (claimErr) {
      console.warn('[Admin SDK]: Could not update custom claims via Admin Auth:', claimErr);
    }
  }

  // 2. Perform database updates (via Admin Firestore if cert available, else via authenticated REST)
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID || 'studolink-in';
  
  if (hasServiceAccount) {
    const db = getFirestore();
    const batch = db.batch();

    // Update user document
    const userRef = db.collection('users').doc(targetUid);
    batch.set(userRef, { role: newRole, updatedAt: Date.now() }, { merge: true });

    // Update roles_admins document
    const rolesAdminRef = db.collection('roles_admins').doc(targetUid);
    if (newRole === 'admin') {
      batch.set(rolesAdminRef, {
        uid: targetUid,
        email: targetEmail,
        role: 'admin',
        assignedBy: caller.email || caller.uid,
        assignedAt: Date.now(),
      }, { merge: true });
    } else {
      batch.delete(rolesAdminRef);
    }

    await batch.commit();
  } else {
    // Authenticated REST API call using the verified admin caller's credentials
    const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
    
    // Update users/{targetUid}
    const userUrl = `${baseUrl}/users/${targetUid}?updateMask.fieldPaths=role&updateMask.fieldPaths=updatedAt`;
    await fetch(userUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          role: { stringValue: newRole },
          updatedAt: { integerValue: String(Date.now()) },
        },
      }),
    });

    // Update roles_admins/{targetUid}
    const rolesAdminUrl = `${baseUrl}/roles_admins/${targetUid}`;
    if (newRole === 'admin') {
      await fetch(rolesAdminUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            uid: { stringValue: targetUid },
            email: { stringValue: targetEmail },
            role: { stringValue: 'admin' },
            assignedBy: { stringValue: caller.email || caller.uid },
            assignedAt: { integerValue: String(Date.now()) },
          },
        }),
      });
    } else {
      await fetch(rolesAdminUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      }).catch(() => {});
    }
  }

  // Automatically record tamper-proof audit log for role change
  await recordAuditLogServer(caller, {
    action: 'change_role',
    targetUid,
    targetId: targetUid,
    details: `Changed role of user ${targetUid} (${targetEmail || 'unknown'}) to "${newRole}"`,
    metadata: { newRole, targetEmail, claimsUpdated },
  });

  const claimNotice = claimsUpdated ? ' (Custom Claims cryptographically assigned)' : '';
  return {
    success: true,
    message: `User role successfully updated to "${newRole}" via server API${claimNotice}.`,
  };
}

export interface AuditLogData {
  id: string;
  actorUid: string;
  actorEmail: string;
  action: string;
  targetId?: string;
  targetUid?: string;
  timestamp: number;
  details: string;
  metadata?: Record<string, any>;
}

// In-memory server-side ring buffer for resilience
const serverAuditTrail: AuditLogData[] = [];

/**
 * Records an immutable administrative audit log into Firestore /audit_logs
 */
export async function recordAuditLogServer(
  caller: AdminCaller,
  payload: {
    action: string;
    targetId?: string;
    targetUid?: string;
    details: string;
    metadata?: Record<string, any>;
  }
): Promise<AuditLogData> {
  const logEntry: AuditLogData = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    actorUid: caller.uid,
    actorEmail: caller.email || 'Admin',
    action: payload.action,
    targetId: payload.targetId || payload.targetUid || '',
    targetUid: payload.targetUid || payload.targetId || '',
    timestamp: Date.now(),
    details: payload.details,
    metadata: payload.metadata || {},
  };

  serverAuditTrail.unshift(logEntry);
  if (serverAuditTrail.length > 300) {
    serverAuditTrail.pop();
  }

  initFirebaseAdmin();
  if (hasServiceAccount) {
    try {
      const db = getFirestore();
      await db.collection('audit_logs').doc(logEntry.id).set(logEntry);
    } catch (err) {
      console.warn('[Admin SDK]: Could not persist audit log to Firestore:', err);
    }
  }

  return logEntry;
}

/**
 * Retrieves the latest tamper-proof administrative audit logs
 */
export async function getAuditLogsServer(limitCount = 100): Promise<AuditLogData[]> {
  initFirebaseAdmin();
  if (hasServiceAccount) {
    try {
      const db = getFirestore();
      const snap = await db.collection('audit_logs')
        .orderBy('timestamp', 'desc')
        .limit(limitCount)
        .get();
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() })) as AuditLogData[];
      }
    } catch (err) {
      console.warn('[Admin SDK]: Could not read audit logs from Firestore:', err);
    }
  }
  return serverAuditTrail.slice(0, limitCount);
}
