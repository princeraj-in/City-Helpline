import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  collection, query, getDocs, doc, updateDoc, deleteDoc, orderBy, limit, setDoc, serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Listing, UserProfile, MarketplaceItem, Role } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

// Child components
import { AdminHeader } from './AdminHeader';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { AdminMobileNav } from './AdminMobileNav';
import { AdminOverviewTab } from './AdminOverviewTab';
import { AdminListingsTab } from './AdminListingsTab';
import { AdminUsersTab } from './AdminUsersTab';
import { AdminMarketplaceTab } from './AdminMarketplaceTab';
import { AdminHubsTab } from './AdminHubsTab';
import { AdminBroadcastTab } from './AdminBroadcastTab';
import { AdminAuditTab, AuditLogEntry } from './AdminAuditTab';
import { ListingInspectModal } from './ListingInspectModal';

interface AdminConsoleProps {
  onSwitchToStudentView: () => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({ onSwitchToStudentView }) => {
  const { currentUser, userProfile, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Data state
  const [listings, setListings] = useState<Listing[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [globalSearch, setGlobalSearch] = useState('');
  const [inspectListing, setInspectListing] = useState<Listing | null>(null);

  const addAuditLog = async (
    action: string, 
    details: string, 
    targetId?: string, 
    metadata?: Record<string, any>
  ) => {
    const entry: AuditLogEntry = {
      id: `temp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actorUid: currentUser?.uid || '',
      actorEmail: currentUser?.email || 'admin',
      action,
      targetId,
      targetUid: targetId,
      details,
      actor: userProfile?.name || currentUser?.email || 'Admin',
      timestamp: Date.now(),
      metadata,
    };

    // Optimistically prepend to active log list
    setAuditLogs(prev => [entry, ...prev].slice(0, 100));

    // Send authorized write to dedicated server API for immutable Firestore persistence
    try {
      const idToken = await currentUser?.getIdToken();
      if (idToken) {
        await fetch('/api/admin/audit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            action,
            targetId,
            targetUid: targetId,
            details,
            metadata,
          }),
        });
      }
    } catch (e) {
      console.warn("Could not sync audit log to server:", e);
    }
  };

  const fetchAuditTrail = async () => {
    try {
      // 1. Try fetching directly from Firestore audit_logs collection (read-only for admins)
      const auditQuery = query(collection(db, 'audit_logs'), orderBy('timestamp', 'desc'), limit(100));
      const auditSnap = await getDocs(auditQuery);
      if (!auditSnap.empty) {
        const loadedLogs = auditSnap.docs.map(d => ({ id: d.id, ...d.data() })) as AuditLogEntry[];
        setAuditLogs(loadedLogs);
        return;
      }
    } catch (fErr) {
      console.warn("Direct Firestore audit_logs query notice:", fErr);
    }

    // 2. Fallback to trusted backend server audit API
    try {
      const idToken = await currentUser?.getIdToken();
      if (idToken) {
        const res = await fetch('/api/admin/audit', {
          headers: { 'Authorization': `Bearer ${idToken}` }
        });
        if (res.ok) {
          const serverLogs = await res.json();
          if (Array.isArray(serverLogs) && serverLogs.length > 0) {
            setAuditLogs(serverLogs);
          }
        }
      }
    } catch (sErr) {
      console.warn("Server audit trail fetch error:", sErr);
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Listings
      const listingsQuery = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
      const listingsSnap = await getDocs(listingsQuery);
      setListings(listingsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Listing[]);

      // 2. Fetch Users: query ALL documents from 'users' collection without orderBy
      // (Firestore orderBy drops any document where the ordered field is missing/undefined)
      const usersSnap = await getDocs(collection(db, 'users'));
      const userList = usersSnap.docs.map(d => {
        const data = d.data();
        return {
          uid: d.id,
          ...data,
          createdAt: data.createdAt || data.updatedAt || data.lastLogin || null,
        } as UserProfile;
      });

      // Safely sort in JavaScript
      userList.sort((a, b) => {
        const getMs = (val: any) => {
          if (!val) return 0;
          if (typeof val === 'number') return val;
          if (typeof val.toMillis === 'function') return val.toMillis();
          if (typeof val.seconds === 'number') return val.seconds * 1000;
          return 0;
        };
        const timeA = getMs(a.createdAt) || getMs(a.updatedAt) || getMs(a.lastLogin);
        const timeB = getMs(b.createdAt) || getMs(b.updatedAt) || getMs(b.lastLogin);
        return timeB - timeA;
      });
      setUsers(userList);

      // Auto-heal: If any existing document in Firestore lacks createdAt, repair it
      for (const u of userList) {
        if (!u.createdAt && u.uid) {
          updateDoc(doc(db, 'users', u.uid), {
            createdAt: serverTimestamp(),
            updatedAt: Date.now(),
          }).catch(() => {});
        }
      }

      // 3. Fetch Marketplace Items
      try {
        const marketQuery = query(collection(db, 'marketplace_items'), orderBy('createdAt', 'desc'));
        const marketSnap = await getDocs(marketQuery);
        setMarketplaceItems(marketSnap.docs.map(d => ({ id: d.id, ...d.data() })) as MarketplaceItem[]);
      } catch (mErr) {
        console.warn("Marketplace fetch skipped or empty:", mErr);
      }

      // 4. Fetch Dedicated Tamper-Proof Audit Trail
      await fetchAuditTrail();
    } catch (error) {
      console.error("Error fetching admin telemetry data:", error);
      toast.error("Failed to sync some admin data from Cloud Firestore");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Handlers for Listings
  const handleApproveListing = async (id: string) => {
    try {
      await updateDoc(doc(db, 'listings', id), { status: 'approved' });
      setListings(prev => prev.map(l => l.id === id ? { ...l, status: 'approved' } : l));
      const target = listings.find(l => l.id === id);
      addAuditLog('approve_listing', `Approved listing "${target?.title || id}"`, id, { title: target?.title, category: target?.category });
      toast.success("Listing approved and published to student directory");
    } catch (error) {
      console.error("Error approving listing:", error);
      toast.error("Failed to approve listing");
    }
  };

  const handleRejectListing = async (id: string) => {
    try {
      await updateDoc(doc(db, 'listings', id), { status: 'rejected' });
      setListings(prev => prev.map(l => l.id === id ? { ...l, status: 'rejected' } : l));
      const target = listings.find(l => l.id === id);
      addAuditLog('reject_listing', `Rejected listing "${target?.title || id}"`, id, { title: target?.title });
      toast.info("Listing status marked as rejected");
    } catch (error) {
      console.error("Error rejecting listing:", error);
      toast.error("Failed to reject listing");
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      await updateDoc(doc(db, 'listings', id), { featured: !currentFeatured });
      setListings(prev => prev.map(l => l.id === id ? { ...l, featured: !currentFeatured } : l));
      const target = listings.find(l => l.id === id);
      addAuditLog('toggle_featured', `${!currentFeatured ? 'Featured' : 'Unfeatured'} "${target?.title || id}"`, id, { featured: !currentFeatured });
      toast.success(`Listing ${!currentFeatured ? 'marked as Featured' : 'unfeatured'}`);
    } catch (error) {
      console.error("Error toggling featured:", error);
      toast.error("Failed to update featured status");
    }
  };

  const handleDeleteListing = async (id: string) => {
    const target = listings.find(l => l.id === id);
    if (!window.confirm(`Are you sure you want to permanently delete "${target?.title || 'this listing'}"?`)) return;

    try {
      await deleteDoc(doc(db, 'listings', id));
      setListings(prev => prev.filter(l => l.id !== id));
      addAuditLog('delete_listing', `Deleted listing "${target?.title || id}"`, id, { title: target?.title });
      toast.success("Listing deleted successfully");
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Failed to delete listing");
    }
  };

  // Handlers for Users
  const handleRoleChange = async (uid: string, newRole: Role) => {
    const target = users.find(u => u.uid === uid);
    if (uid === currentUser?.uid && newRole !== 'admin') {
      toast.error("You cannot demote your own administrator account.");
      return;
    }

    try {
      const idToken = await currentUser?.getIdToken(true);
      if (!idToken) {
        toast.error("Authentication expired. Please sign in again.");
        return;
      }

      // Authoritative role assignment via trusted server API
      const response = await fetch('/api/admin/role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          targetUid: uid,
          targetEmail: target?.email || '',
          newRole,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update user role');
      }

      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u));
      addAuditLog('change_role', `Changed role of ${target?.name || uid} to "${newRole}" via server API`, uid, { newRole, email: target?.email });
      toast.success(result.message || `User role updated to ${newRole}`);
    } catch (error: any) {
      console.error("Error updating user role via server API:", error);
      toast.error(error.message || "Failed to update user role");
    }
  };

  const handleBanToggle = async (uid: string, currentBanned: boolean) => {
    const target = users.find(u => u.uid === uid);
    if (uid === currentUser?.uid) {
      toast.error("You cannot ban your own administrator account.");
      return;
    }

    try {
      await updateDoc(doc(db, 'users', uid), { banned: !currentBanned });
      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, banned: !currentBanned } : u));
      addAuditLog(!currentBanned ? 'ban_user' : 'unban_user', `${!currentBanned ? 'Banned' : 'Unbanned'} user "${target?.name || uid}"`, uid, { banned: !currentBanned, email: target?.email });
      toast.success(`User account ${!currentBanned ? 'banned' : 'unbanned'}`);
    } catch (error) {
      console.error("Error toggling ban:", error);
      toast.error("Failed to change ban status");
    }
  };

  const handleDeleteUser = async (uid: string) => {
    const target = users.find(u => u.uid === uid);
    if (uid === currentUser?.uid) {
      toast.error("You cannot delete your own administrator account.");
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently remove user "${target?.name || uid}"?`)) return;

    try {
      // If user was an admin, revoke administrative role via server API
      if (target?.role === 'admin') {
        const idToken = await currentUser?.getIdToken(true);
        if (idToken) {
          await fetch('/api/admin/role', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({
              targetUid: uid,
              targetEmail: target?.email || '',
              newRole: 'user',
            }),
          }).catch(() => {});
        }
      }

      await deleteDoc(doc(db, 'users', uid));
      addAuditLog('delete_user', `Permanently deleted user "${target?.name || uid}"`, uid, { email: target?.email });
      setUsers(prev => prev.filter(u => u.uid !== uid));
      toast.success("User account deleted");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleCreateOrLinkUser = async (userData: {
    uid: string;
    email: string;
    name?: string;
    role?: Role;
    phone?: string;
  }) => {
    try {
      const cleanUid = userData.uid.trim();
      const cleanEmail = userData.email.trim();
      if (!cleanUid) {
        toast.error("User UID is required");
        return;
      }
      if (!cleanEmail) {
        toast.error("User Email is required");
        return;
      }
      const newDoc: any = {
        uid: cleanUid,
        email: cleanEmail,
        name: userData.name?.trim() || cleanEmail.split('@')[0] || 'User',
        role: userData.role || 'user',
        banned: false,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        updatedAt: Date.now(),
      };
      if (userData.phone) newDoc.phone = userData.phone.trim();

      await setDoc(doc(db, 'users', cleanUid), newDoc, { merge: true });
      addAuditLog('create_user' as any, `Registered user "${newDoc.email}" into Firestore`);
      toast.success(`User ${newDoc.email} registered in Firestore!`);
      await fetchAdminData();
    } catch (err: any) {
      console.error("Error creating/linking user:", err);
      toast.error(err.message || "Failed to link user");
    }
  };

  // Handlers for Student & PG Verification Badges
  const handleApproveStudentVerification = async (uid: string) => {
    const target = users.find(u => u.uid === uid);
    try {
      const now = Date.now();
      const reviewer = currentUser?.email || 'Admin';

      // 1. PUBLIC PROFILE: Only update verification status and timestamp (no private data in /users/{uid})
      await updateDoc(doc(db, 'users', uid), {
        isStudentVerified: true,
        studentVerificationStatus: 'verified',
        updatedAt: now,
      });

      // 2. PROTECTED PRIVATE SUBCOLLECTION: Store verification review details
      await setDoc(doc(db, 'users', uid, 'private', 'verification'), {
        verifiedAt: now,
        reviewedBy: reviewer,
        updatedAt: now,
      }, { merge: true }).catch((pErr) => console.warn('Private subcollection sync warning:', pErr));

      setUsers(prev => prev.map(u => u.uid === uid ? {
        ...u,
        isStudentVerified: true,
        studentVerificationStatus: 'verified',
        studentVerificationData: {
          ...(u.studentVerificationData || { collegeOrCoaching: '', rollOrIdNumber: '', courseOrExam: '' }),
          verifiedAt: now,
          reviewedBy: reviewer,
        }
      } : u));

      addAuditLog('approve_student_badge', `Issued "Verified Student" Badge to ${target?.name || uid}`, uid, { studentName: target?.name, studentEmail: target?.email });
      toast.success(`"Verified Student" Badge successfully issued to ${target?.name || 'student'}!`);
    } catch (err: any) {
      console.error("Error approving student verification:", err);
      toast.error("Failed to approve student verification: " + (err.message || ''));
    }
  };

  const handleRejectStudentVerification = async (uid: string, reason?: string) => {
    const target = users.find(u => u.uid === uid);
    try {
      const now = Date.now();
      const reviewer = currentUser?.email || 'Admin';
      const note = reason || 'Verification documents could not be validated';

      // 1. PUBLIC PROFILE: Only update verification status and timestamp
      await updateDoc(doc(db, 'users', uid), {
        isStudentVerified: false,
        studentVerificationStatus: 'rejected',
        updatedAt: now,
      });

      // 2. PROTECTED PRIVATE SUBCOLLECTION: Store rejection notes and reviewer
      await setDoc(doc(db, 'users', uid, 'private', 'verification'), {
        reviewedBy: reviewer,
        note: note,
        updatedAt: now,
      }, { merge: true }).catch((pErr) => console.warn('Private subcollection sync warning:', pErr));

      setUsers(prev => prev.map(u => u.uid === uid ? {
        ...u,
        isStudentVerified: false,
        studentVerificationStatus: 'rejected',
        studentVerificationData: {
          ...(u.studentVerificationData || { collegeOrCoaching: '', rollOrIdNumber: '', courseOrExam: '' }),
          reviewedBy: reviewer,
          note: note,
        }
      } : u));

      addAuditLog('reject_student_badge', `Rejected/Revoked Student Badge for ${target?.name || uid}`, uid, { reason: note, studentEmail: target?.email });
      toast.info(`Student verification status updated for ${target?.name || 'student'}.`);
    } catch (err: any) {
      console.error("Error updating student verification:", err);
      toast.error("Failed to update student verification status");
    }
  };

  const handleApprovePGVerification = async (id: string) => {
    const target = listings.find(l => l.id === id);
    try {
      const now = Date.now();
      const reviewer = currentUser?.email || 'Admin';

      await updateDoc(doc(db, 'listings', id), {
        isVerifiedPG: true,
        pgVerificationStatus: 'verified',
        'pgVerificationData.verifiedAt': now,
        'pgVerificationData.physicalInspectionDone': true,
        'pgVerificationData.reviewedBy': reviewer,
      });

      // Also sync to private listing verification subcollection
      await setDoc(doc(db, 'listings', id, 'private', 'verification'), {
        verifiedAt: now,
        physicalInspectionDone: true,
        reviewedBy: reviewer,
      }, { merge: true }).catch((pErr) => console.warn('Private listing subcollection sync warning:', pErr));

      setListings(prev => prev.map(l => l.id === id ? {
        ...l,
        isVerifiedPG: true,
        pgVerificationStatus: 'verified',
        pgVerificationData: {
          ...(l.pgVerificationData || {}),
          verifiedAt: now,
          physicalInspectionDone: true,
          reviewedBy: reviewer,
        }
      } : l));

      if (inspectListing && inspectListing.id === id) {
        setInspectListing(prev => prev ? {
          ...prev,
          isVerifiedPG: true,
          pgVerificationStatus: 'verified',
          pgVerificationData: {
            ...(prev.pgVerificationData || {}),
            verifiedAt: now,
            physicalInspectionDone: true,
            reviewedBy: reviewer,
          }
        } : null);
      }

      addAuditLog('approve_pg_badge', `Issued "Verified PG" Trust Badge to "${target?.title || id}"`, id, { title: target?.title });
      toast.success(`"Verified PG" Badge issued to "${target?.title || 'Listing'}"!`);
    } catch (err: any) {
      console.error("Error approving PG verification:", err);
      toast.error("Failed to approve PG verification: " + (err.message || ''));
    }
  };

  const handleRejectPGVerification = async (id: string, reason?: string) => {
    const target = listings.find(l => l.id === id);
    try {
      const now = Date.now();
      const reviewer = currentUser?.email || 'Admin';
      const note = reason || 'Verification documents could not be validated';

      await updateDoc(doc(db, 'listings', id), {
        isVerifiedPG: false,
        pgVerificationStatus: 'rejected',
        'pgVerificationData.reviewedBy': reviewer,
        'pgVerificationData.note': note,
      });

      // Also sync to private listing verification subcollection
      await setDoc(doc(db, 'listings', id, 'private', 'verification'), {
        reviewedBy: reviewer,
        note: note,
      }, { merge: true }).catch((pErr) => console.warn('Private listing subcollection sync warning:', pErr));

      setListings(prev => prev.map(l => l.id === id ? {
        ...l,
        isVerifiedPG: false,
        pgVerificationStatus: 'rejected',
        pgVerificationData: {
          ...(l.pgVerificationData || {}),
          reviewedBy: reviewer,
          note: note,
        }
      } : l));

      if (inspectListing && inspectListing.id === id) {
        setInspectListing(prev => prev ? {
          ...prev,
          isVerifiedPG: false,
          pgVerificationStatus: 'rejected',
          pgVerificationData: {
            ...(prev.pgVerificationData || {}),
            reviewedBy: reviewer,
            note: note,
          }
        } : null);
      }

      addAuditLog('reject_pg_badge', `Rejected/Revoked PG Badge for "${target?.title || id}"`, id, { reason: note, title: target?.title });
      toast.info(`PG verification rejected/revoked for "${target?.title || 'Listing'}".`);
    } catch (err: any) {
      console.error("Error updating PG verification:", err);
      toast.error("Failed to update PG verification status");
    }
  };

  // Handlers for Marketplace
  const handleToggleMarketStatus = async (id: string, current: 'available' | 'sold') => {
    const nextStatus = current === 'available' ? 'sold' : 'available';
    try {
      await updateDoc(doc(db, 'marketplace_items', id), { status: nextStatus });
      setMarketplaceItems(prev => prev.map(i => i.id === id ? { ...i, status: nextStatus } : i));
      toast.success(`Marketplace item marked as ${nextStatus}`);
    } catch (error) {
      console.error("Error updating item status:", error);
      toast.error("Failed to update marketplace status");
    }
  };

  const handleToggleMarketFeatured = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'marketplace_items', id), { featured: !current });
      setMarketplaceItems(prev => prev.map(i => i.id === id ? { ...i, featured: !current } : i));
      toast.success(`Marketplace item ${!current ? 'featured' : 'unfeatured'}`);
    } catch (error) {
      console.error("Error toggling marketplace featured:", error);
      toast.error("Failed to toggle featured status");
    }
  };

  const handleDeleteMarketItem = async (id: string) => {
    if (!window.confirm('Delete this marketplace item?')) return;
    try {
      await deleteDoc(doc(db, 'marketplace_items', id));
      setMarketplaceItems(prev => prev.filter(i => i.id !== id));
      toast.success("Marketplace item removed");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to remove item");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const pendingListingsCount = listings.filter(l => l.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col selection:bg-[#00E5FF] selection:text-black">
      
      {/* 1. Executive Top Header */}
      <AdminHeader
        userProfile={userProfile}
        pendingCount={pendingListingsCount}
        totalListings={listings.length}
        totalUsers={users.length}
        searchQuery={globalSearch}
        onSearchChange={setGlobalSearch}
        onRefresh={fetchAdminData}
        onSwitchToStudentView={onSwitchToStudentView}
        onOpenCreateListing={() => navigate('/add-listing')}
        onLogout={handleLogout}
        loading={loading}
      />

      {/* 2. Main Admin Workspace (Sidebar + Content Canvas) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingCount={pendingListingsCount}
          totalListingsCount={listings.length}
          totalUsersCount={users.length}
          totalMarketplaceCount={marketplaceItems.length}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onLogout={handleLogout}
        />

        {/* Dynamic Content Canvas */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-12 custom-scrollbar">
          <div className="max-w-[1920px] mx-auto">
            
            {activeTab === 'overview' && (
              <AdminOverviewTab
                listings={listings}
                users={users}
                marketplaceItems={marketplaceItems}
                onNavigateTab={setActiveTab}
                onInspectListing={(l) => setInspectListing(l)}
                onApproveListing={handleApproveListing}
                onRejectListing={handleRejectListing}
              />
            )}

            {activeTab === 'listings' && (
              <AdminListingsTab
                listings={listings}
                onApprove={handleApproveListing}
                onReject={handleRejectListing}
                onToggleFeatured={handleToggleFeatured}
                onDelete={handleDeleteListing}
                onEdit={(id) => navigate(`/edit-listing/${id}`)}
                onInspect={(l) => setInspectListing(l)}
                onCreateNew={() => navigate('/add-listing')}
                onApprovePGVerification={handleApprovePGVerification}
                onRejectPGVerification={handleRejectPGVerification}
              />
            )}

            {activeTab === 'users' && (
              <AdminUsersTab
                users={users}
                onRoleChange={handleRoleChange}
                onBanToggle={handleBanToggle}
                onDeleteUser={handleDeleteUser}
                onCreateOrLinkUser={handleCreateOrLinkUser}
                onRefreshUsers={fetchAdminData}
                onApproveStudentVerification={handleApproveStudentVerification}
                onRejectStudentVerification={handleRejectStudentVerification}
              />
            )}

            {activeTab === 'marketplace' && (
              <AdminMarketplaceTab
                items={marketplaceItems}
                onToggleStatus={handleToggleMarketStatus}
                onToggleFeatured={handleToggleMarketFeatured}
                onDeleteItem={handleDeleteMarketItem}
              />
            )}

            {activeTab === 'hubs' && (
              <AdminHubsTab
                listings={listings}
                onFilterByCity={(city) => {
                  setActiveTab('listings');
                }}
              />
            )}

            {activeTab === 'broadcast' && (
              <AdminBroadcastTab />
            )}

            {activeTab === 'audit' && (
              <AdminAuditTab
                logs={auditLogs}
                onRefresh={fetchAuditTrail}
                isLoading={loading}
              />
            )}

          </div>
        </main>
      </div>

      {/* 3. Mobile Navigation Bar for Admin */}
      <AdminMobileNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        pendingCount={pendingListingsCount}
      />

      {/* 4. Inspection Modal Drawer */}
      <ListingInspectModal
        listing={inspectListing}
        onClose={() => setInspectListing(null)}
        onApprove={handleApproveListing}
        onReject={handleRejectListing}
        onToggleFeatured={handleToggleFeatured}
        onEdit={(id) => {
          setInspectListing(null);
          navigate(`/edit-listing/${id}`);
        }}
        onApprovePGVerification={handleApprovePGVerification}
        onRejectPGVerification={handleRejectPGVerification}
      />

    </div>
  );
};
