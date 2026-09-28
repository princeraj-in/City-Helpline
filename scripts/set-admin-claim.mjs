/**
 * Script to safely assign Firebase Auth Custom Claims (admin: true)
 * 
 * SECURITY:
 * - No secrets or credentials are hardcoded in this script.
 * - Credentials are read dynamically from:
 *   1. Environment variable FIREBASE_SERVICE_ACCOUNT_KEY (JSON string or file path)
 *   2. Or local file 'serviceAccountKey.json' (strictly ignored by .gitignore)
 *   3. Or passed as a CLI flag: node scripts/set-admin-claim.mjs --key=./path-to-key.json
 * 
 * Usage:
 *   node scripts/set-admin-claim.mjs [UID]
 *   e.g.: node scripts/set-admin-claim.mjs jp8bei6qkaStTgV2OuHefDapYaO2
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const targetUidArg = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
const DEFAULT_UID = targetUidArg || process.env.ADMIN_TARGET_UID || 'jp8bei6qkaStTgV2OuHefDapYaO2';

function loadServiceAccountKey() {
  // Check CLI argument --key=<path>
  const keyArg = process.argv.find((arg) => arg.startsWith('--key='));
  if (keyArg) {
    const keyPath = keyArg.split('=')[1];
    if (fs.existsSync(keyPath)) {
      return JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    }
    throw new Error(`File specified in --key does not exist: ${keyPath}`);
  }

  // Check env variable FIREBASE_SERVICE_ACCOUNT_KEY
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim();
    if (raw.startsWith('{')) {
      return JSON.parse(raw);
    }
    if (fs.existsSync(raw)) {
      return JSON.parse(fs.readFileSync(raw, 'utf8'));
    }
  }

  // Check standard local gitignored paths
  const localCandidates = [
    path.resolve(process.cwd(), 'serviceAccountKey.json'),
    path.resolve(process.cwd(), 'service-account.json'),
    path.resolve(process.cwd(), 'firebase-admin-key.json'),
  ];

  for (const candidate of localCandidates) {
    if (fs.existsSync(candidate)) {
      console.log(`Using service account file from: ${candidate}`);
      return JSON.parse(fs.readFileSync(candidate, 'utf8'));
    }
  }

  return null;
}

async function main() {
  const targetUid = DEFAULT_UID;

  if (!targetUid) {
    console.error('❌ Error: No target UID specified.');
    console.error('Usage: node scripts/set-admin-claim.mjs <UID>');
    process.exit(1);
  }

  const serviceAccount = loadServiceAccountKey();
  if (!serviceAccount) {
    console.error('❌ Error: Service Account credentials not found.');
    console.log('\n--- HOW TO PROVIDE CREDENTIALS SAFELY ---');
    console.log('1. Go to Firebase Console -> Project Settings -> Service Accounts');
    console.log('2. Click "Generate new private key" to download the JSON file.');
    console.log('3. Save it as "serviceAccountKey.json" in this project directory (it is ignored by git),');
    console.log('   OR put the JSON content in your .env file as:');
    console.log('   FIREBASE_SERVICE_ACCOUNT_KEY=\'{"type":"service_account",...}\'');
    console.log('4. Then re-run this script: node scripts/set-admin-claim.mjs');
    process.exit(1);
  }

  console.log(`🔐 Initializing Firebase Admin for project: ${serviceAccount.project_id || 'studolink-in'}...`);

  const app = initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id || 'studolink-in',
  });

  const auth = getAuth(app);

  console.log(`🔍 Looking up user with UID: ${targetUid}...`);
  const user = await auth.getUser(targetUid);
  console.log(`✅ User found:`);
  console.log(`   - Email: ${user.email || 'N/A'}`);
  console.log(`   - Display Name: ${user.displayName || 'N/A'}`);
  console.log(`   - Current Claims: ${JSON.stringify(user.customClaims || {})}`);

  console.log(`🚀 Setting Custom Claim: { admin: true } on UID: ${targetUid}...`);
  await auth.setCustomUserClaims(targetUid, {
    ...(user.customClaims || {}),
    admin: true,
  });

  // Verify the updated claims
  const updatedUser = await auth.getUser(targetUid);
  console.log('\n🎉 SUCCESS! Custom Claims successfully set:');
  console.log(`   - UID: ${updatedUser.uid}`);
  console.log(`   - Updated Claims: ${JSON.stringify(updatedUser.customClaims)}`);
  console.log('\n💡 Important Next Step:');
  console.log('The user should log out and log back in, or refresh the app token (getIdTokenResult(true))');
  console.log('to immediately activate Admin Access in the browser!');
}

main().catch((err) => {
  console.error('❌ Failed to set admin claims:', err.message || err);
  process.exit(1);
});
