import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Shield, Ban, Trash2, CheckCircle2, 
  Briefcase, Phone, MapPin, Calendar, ExternalLink, Info,
  UserPlus, RefreshCw, Copy, Check, X, ShieldAlert, Sparkles,
  GraduationCap, Clock, ShieldCheck, Camera, Lock
} from 'lucide-react';
import { UserProfile, Role, StudentVerificationData, isSuperAdminEmail } from '../../types';
import { VerifiedStudentBadge } from '../common/TrustBadge';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'sonner';

interface AdminUsersTabProps {
  users: UserProfile[];
  onRoleChange: (uid: string, newRole: Role) => void;
  onBanToggle: (uid: string, currentBanned: boolean) => void;
  onDeleteUser: (uid: string) => void;
  onCreateOrLinkUser?: (userData: {
    uid: string;
    email: string;
    name?: string;
    role?: Role;
    phone?: string;
  }) => Promise<void>;
  onRefreshUsers?: () => Promise<void>;
  onApproveStudentVerification?: (uid: string) => void;
  onRejectStudentVerification?: (uid: string, reason?: string) => void;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  users,
  onRoleChange,
  onBanToggle,
  onDeleteUser,
  onCreateOrLinkUser,
  onRefreshUsers,
  onApproveStudentVerification,
  onRejectStudentVerification,
}) => {
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'contributor' | 'admin' | 'student_pending' | 'student_verified'>('all');
  const [search, setSearch] = useState('');
  const [inspectUser, setInspectUser] = useState<UserProfile | null>(null);
  const [inspectStudentVerification, setInspectStudentVerification] = useState<UserProfile | null>(null);
  const [privateVerificationData, setPrivateVerificationData] = useState<StudentVerificationData | null>(null);
  const [isLoadingPrivateData, setIsLoadingPrivateData] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch private verification subcollection /users/{uid}/private/verification when inspecting a student
  useEffect(() => {
    if (!inspectStudentVerification) {
      setPrivateVerificationData(null);
      setIsLoadingPrivateData(false);
      return;
    }
    const uid = inspectStudentVerification.id || inspectStudentVerification.uid;
    if (!uid) return;

    let isMounted = true;
    setIsLoadingPrivateData(true);
    getDoc(doc(db, 'users', uid, 'private', 'verification'))
      .then((snap) => {
        if (!isMounted) return;
        if (snap.exists()) {
          setPrivateVerificationData(snap.data() as StudentVerificationData);
        } else {
          // Fallback to legacy record on user profile if exists
          setPrivateVerificationData(inspectStudentVerification.studentVerificationData || null);
        }
      })
      .catch((err) => {
        console.warn('Could not read private verification doc:', err);
        if (isMounted) {
          setPrivateVerificationData(inspectStudentVerification.studentVerificationData || null);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingPrivateData(false);
      });

    return () => {
      isMounted = false;
    };
  }, [inspectStudentVerification]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedUid, setCopiedUid] = useState<string | null>(null);

  // New user form state
  const [newUid, setNewUid] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<Role>('user');
  const [newPhone, setNewPhone] = useState('');
  const [submittingUser, setSubmittingUser] = useState(false);

  const studentPendingCount = users.filter(u => u.studentVerificationStatus === 'pending').length;
  const studentVerifiedCount = users.filter(u => u.isStudentVerified).length;

  const filtered = users.filter((u) => {
    let matchesRole = true;
    if (roleFilter === 'student_pending') {
      matchesRole = u.studentVerificationStatus === 'pending';
    } else if (roleFilter === 'student_verified') {
      matchesRole = !!u.isStudentVerified;
    } else if (roleFilter !== 'all') {
      matchesRole = u.role === roleFilter;
    }

    const q = search.toLowerCase();
    const matchesSearch = search === '' ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.city?.toLowerCase().includes(q) ||
      u.businessName?.toLowerCase().includes(q) ||
      u.studentVerificationData?.collegeOrCoaching?.toLowerCase().includes(q) ||
      u.studentVerificationData?.rollOrIdNumber?.toLowerCase().includes(q) ||
      u.phone?.includes(q) ||
      u.uid?.toLowerCase().includes(q);

    return matchesRole && matchesSearch;
  });

  const contributorsCount = users.filter(u => u.role === 'contributor').length;
  const adminsCount = users.filter(u => u.role === 'admin').length;
  const studentsCount = users.filter(u => u.role === 'user').length;
  const bannedCount = users.filter(u => u.banned).length;

  const handleRefresh = async () => {
    if (!onRefreshUsers) return;
    setIsRefreshing(true);
    try {
      await onRefreshUsers();
      toast.success("User list synced from Firestore!");
    } catch {
      toast.error("Failed to refresh users");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCopyUid = (uid: string) => {
    navigator.clipboard.writeText(uid);
    setCopiedUid(uid);
    toast.success("UID copied to clipboard");
    setTimeout(() => setCopiedUid(null), 2000);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUid.trim() || !newEmail.trim()) {
      toast.error("Please fill in both UID and Email");
      return;
    }
    if (!onCreateOrLinkUser) return;

    setSubmittingUser(true);
    try {
      await onCreateOrLinkUser({
        uid: newUid.trim(),
        email: newEmail.trim(),
        name: newName.trim(),
        role: newRole,
        phone: newPhone.trim(),
      });
      setShowAddModal(false);
      setNewUid('');
      setNewEmail('');
      setNewName('');
      setNewPhone('');
      setNewRole('user');
    } catch {
      // Handled in parent
    } finally {
      setSubmittingUser(false);
    }
  };

  const formatJoinDate = (val: any) => {
    if (!val) return 'Active';
    try {
      if (typeof val === 'number') {
        return new Date(val).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      }
      if (typeof val.toDate === 'function') {
        return val.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      }
      if (val.seconds) {
        return new Date(val.seconds * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      }
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      }
    } catch {
      return 'Active';
    }
    return 'Active';
  };

  return (
    <div className="space-y-6">
      
      {/* Top Filter and Actions Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Role Pills */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              roleFilter === 'all' ? 'bg-white/15 text-white shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            All Users ({users.length})
          </button>
          <button
            onClick={() => setRoleFilter('contributor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              roleFilter === 'contributor' ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30' : 'text-gray-400 hover:text-[#00E5FF]'
            }`}
          >
            Contributors ({contributorsCount})
          </button>
          <button
            onClick={() => setRoleFilter('user')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              roleFilter === 'user' ? 'bg-[#8A2BE2]/20 text-[#8A2BE2] border border-[#8A2BE2]/30' : 'text-gray-400 hover:text-[#8A2BE2]'
            }`}
          >
            Students ({studentsCount})
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              roleFilter === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-gray-400 hover:text-amber-300'
            }`}
          >
            Admins ({adminsCount})
          </button>

          {/* Student Verification Filters */}
          <button
            onClick={() => setRoleFilter('student_pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              roleFilter === 'student_pending' 
                ? 'bg-gradient-to-r from-[#00E5FF]/20 to-[#8A2BE2]/20 text-[#00E5FF] border border-[#00E5FF]/40 shadow-[0_0_15px_rgba(0,229,255,0.25)]' 
                : 'text-gray-400 hover:text-[#00E5FF]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>ID Review Pending</span>
            {studentPendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-[#00E5FF] text-black">
                {studentPendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setRoleFilter('student_verified')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              roleFilter === 'student_verified' 
                ? 'bg-[#8A2BE2]/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(138,43,226,0.25)]' 
                : 'text-gray-400 hover:text-purple-300'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
            <span>Verified Students ({studentVerifiedCount})</span>
          </button>
          {bannedCount > 0 && (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 whitespace-nowrap">
              {bannedCount} Banned
            </span>
          )}
        </div>

        {/* Search & Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone, UID..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#00E5FF]/50"
            />
          </div>

          {onRefreshUsers && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-gray-300 hover:text-white transition-all disabled:opacity-50"
              title="Refresh and sync users from Firestore"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#00E5FF]' : ''}`} />
            </button>
          )}

          {onCreateOrLinkUser && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#8A2BE2] text-black font-black text-xs hover:brightness-110 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.3)] shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Link / Add User</span>
            </button>
          )}
        </div>

      </div>

      {/* Users Table */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/10 text-gray-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">User Profile</th>
                <th className="py-3.5 px-4">Contact & Location</th>
                <th className="py-3.5 px-4">Account Role</th>
                <th className="py-3.5 px-4">Registered Date</th>
                <th className="py-3.5 px-4 text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-gray-300">
              {filtered.map((u) => (
                <tr 
                  key={u.uid} 
                  className={`hover:bg-white/[0.03] transition-colors ${
                    u.banned ? 'opacity-60 bg-rose-500/[0.03]' : ''
                  }`}
                >
                  {/* Name & Avatar & UID */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center font-bold text-white text-sm shrink-0 overflow-hidden">
                        {u.photoURL ? (
                          <img src={u.photoURL} alt={u.name} className="w-full h-full object-cover" />
                        ) : (
                          u.name?.charAt(0).toUpperCase() || u.email?.charAt(0).toUpperCase() || 'U'
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm truncate">{u.name || 'Unnamed User'}</span>
                          {u.isStudentVerified && (
                            <VerifiedStudentBadge size="sm" />
                          )}
                          {u.studentVerificationStatus === 'pending' && (
                            <span
                              onClick={() => setInspectStudentVerification(u)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 animate-pulse cursor-pointer hover:bg-[#00E5FF]/30 transition-all"
                              title="Click to review student verification request"
                            >
                              <Clock className="w-3 h-3" /> ID Pending
                            </span>
                          )}
                          {u.banned && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">
                              Banned
                            </span>
                          )}
                          {isSuperAdminEmail(u.email) && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Superadmin
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-[11px] truncate">{u.email || 'No email'}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-gray-500 font-mono">
                            UID: {u.uid?.substring(0, 10)}...
                          </span>
                          <button
                            onClick={() => handleCopyUid(u.uid)}
                            className="text-gray-500 hover:text-[#00E5FF] transition-colors"
                            title="Copy full UID"
                          >
                            {copiedUid === u.uid ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact & Location */}
                  <td className="py-3.5 px-4">
                    <div className="text-white font-medium">{u.phone || 'No phone'}</div>
                    <div className="text-gray-400 text-[11px]">{u.city || 'Location unassigned'}</div>
                  </td>

                  {/* Role Selector */}
                  <td className="py-3.5 px-4">
                    {isSuperAdminEmail(u.email) ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        Super Admin
                      </span>
                    ) : (
                      <select
                        value={u.role || 'user'}
                        onChange={(e) => onRoleChange(u.uid, e.target.value as Role)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border focus:outline-none transition-all [&>option]:bg-[#0B0E14] ${
                          u.role === 'admin' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                          u.role === 'contributor' ? 'bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/40' :
                          'bg-white/5 text-gray-300 border-white/10'
                        }`}
                      >
                        <option value="user">Student / User</option>
                        <option value="contributor">Contributor (Provider)</option>
                        <option value="admin">System Admin</option>
                      </select>
                    )}
                  </td>

                  {/* Joined Date */}
                  <td className="py-3.5 px-4 text-gray-400">
                    {formatJoinDate(u.createdAt)}
                  </td>

                  {/* Controls */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      
                      {/* View Student Verification Modal */}
                      {(u.studentVerificationStatus === 'pending' || u.isStudentVerified || u.studentVerificationData) && (
                        <button
                          onClick={() => setInspectStudentVerification(u)}
                          className={`p-2 rounded-xl transition-colors ${
                            u.studentVerificationStatus === 'pending'
                              ? 'text-[#00E5FF] bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 animate-pulse'
                              : 'text-purple-400 hover:text-purple-300 hover:bg-purple-500/10'
                          }`}
                          title="Review Student Verification Application"
                        >
                          <GraduationCap className="w-4 h-4" />
                        </button>
                      )}

                      {/* View Provider Info Drawer */}
                      {u.role === 'contributor' && (
                        <button
                          onClick={() => setInspectUser(u)}
                          className="p-2 rounded-xl text-gray-400 hover:text-[#00E5FF] hover:bg-white/5 transition-colors"
                          title="View Business Profile"
                        >
                          <Briefcase className="w-4 h-4" />
                        </button>
                      )}

                      {/* Ban / Unban */}
                      {isSuperAdminEmail(u.email) ? (
                        <span className="p-2 rounded-xl text-gray-600 cursor-not-allowed" title="Super Admin cannot be banned">
                          <Ban className="w-4 h-4" />
                        </span>
                      ) : (
                        <button
                          onClick={() => onBanToggle(u.uid, u.banned || false)}
                          className={`p-2 rounded-xl transition-colors ${
                            u.banned 
                              ? 'text-emerald-400 hover:bg-emerald-500/10' 
                              : 'text-amber-400 hover:bg-amber-500/10'
                          }`}
                          title={u.banned ? "Unban Account" : "Ban Account"}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}

                      {/* Delete */}
                      {isSuperAdminEmail(u.email) ? (
                        <span className="p-2 rounded-xl text-gray-600 cursor-not-allowed" title="Super Admin cannot be deleted">
                          <Trash2 className="w-4 h-4" />
                        </span>
                      ) : (
                        <button
                          onClick={() => onDeleteUser(u.uid)}
                          className="p-2 rounded-xl text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete User Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-gray-500">
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="font-bold text-white text-sm">No users found</p>
                    <p className="text-xs text-gray-500 mt-1">Try adjusting search parameters or role filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Link User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-[#0B0E14] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-white font-bold">
                <UserPlus className="w-5 h-5 text-[#00E5FF]" />
                <span>Link User from Firebase Auth to Database</span>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              If an account was created in <strong className="text-white">Firebase Console &gt; Authentication</strong> but isn't listed in this directory yet, enter its <strong className="text-[#00E5FF]">User UID</strong> and <strong className="text-white">Email</strong> below to register it into Firestore.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  User UID <span className="text-[#00E5FF]">*</span> (from Firebase Authentication console)
                </label>
                <input
                  type="text"
                  required
                  value={newUid}
                  onChange={(e) => setNewUid(e.target.value)}
                  placeholder="e.g. bpT3jt8HWserk... or XuCPpvxHQqM..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Email Address <span className="text-[#00E5FF]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. user@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Display Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Neha / Test User"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Role
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as Role)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-[#00E5FF] [&>option]:bg-[#0B0E14]"
                  >
                    <option value="user">Student / User</option>
                    <option value="contributor">Contributor (Provider)</option>
                    <option value="admin">System Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingUser}
                  className="px-5 py-2 rounded-xl text-xs font-black text-black bg-[#00E5FF] hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,229,255,0.4)] disabled:opacity-50"
                >
                  {submittingUser ? 'Linking...' : 'Register in Firestore'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contributor Inspect Modal */}
      {inspectUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0B0E14] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-white font-bold">
                <Briefcase className="w-5 h-5 text-[#00E5FF]" />
                <span>Provider Business Profile</span>
              </div>
              <button 
                onClick={() => setInspectUser(null)}
                className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded bg-white/5"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-gray-400">Business Name</p>
                <p className="text-white font-bold text-sm mt-0.5">{inspectUser.businessName || inspectUser.name}</p>
              </div>
              <div>
                <p className="text-gray-400">Business Type</p>
                <p className="text-white font-semibold mt-0.5">{inspectUser.businessType || 'PG / Hostel / Mess'}</p>
              </div>
              <div>
                <p className="text-gray-400">Phone & Contact</p>
                <p className="text-[#00E5FF] font-semibold mt-0.5">{inspectUser.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-400">City & Address</p>
                <p className="text-white mt-0.5">{inspectUser.city ? `${inspectUser.city} (${inspectUser.pincode || ''})` : 'Unassigned'}</p>
                <p className="text-gray-400 mt-0.5">{inspectUser.address || ''}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Verification Inspection & Moderation Modal */}
      {inspectStudentVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0B0E14] border border-[#00E5FF]/30 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-white max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#00E5FF]/20 to-[#8A2BE2]/20 border border-[#00E5FF]/40 text-[#00E5FF]">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">Student Verification Review</h3>
                    {inspectStudentVerification.isStudentVerified && <VerifiedStudentBadge size="sm" />}
                  </div>
                  <p className="text-xs text-gray-400">
                    City Helpline Trust & Aspirant Verification
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setInspectStudentVerification(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Applicant Profile Bar */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center font-bold text-white text-base shrink-0 overflow-hidden">
                {inspectStudentVerification.photoURL ? (
                  <img src={inspectStudentVerification.photoURL} alt="" className="w-full h-full object-cover" />
                ) : (
                  inspectStudentVerification.name?.charAt(0).toUpperCase() || 'S'
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-white text-sm truncate">{inspectStudentVerification.name || 'Student Aspirant'}</p>
                <p className="text-gray-400 text-xs truncate">{inspectStudentVerification.email}</p>
                <p className="text-[11px] text-[#00E5FF] mt-0.5">📞 {inspectStudentVerification.phone || 'No phone'}</p>
              </div>
              <div className="shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                  inspectStudentVerification.isStudentVerified
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : inspectStudentVerification.studentVerificationStatus === 'pending'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                      : inspectStudentVerification.studentVerificationStatus === 'rejected'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-white/10 text-gray-400 border-white/10'
                }`}>
                  {inspectStudentVerification.isStudentVerified ? 'Verified' : inspectStudentVerification.studentVerificationStatus === 'pending' ? 'Pending Review' : inspectStudentVerification.studentVerificationStatus === 'rejected' ? 'Rejected' : 'Not Applied'}
                </span>
              </div>
            </div>

            {/* Application Data */}
            {isLoadingPrivateData ? (
              <div className="flex flex-col items-center justify-center p-8 bg-black/40 rounded-2xl border border-white/5 text-gray-400 gap-2.5">
                <RefreshCw className="w-5 h-5 animate-spin text-[#00E5FF]" />
                <span className="text-xs font-medium">Loading private verification document...</span>
              </div>
            ) : (privateVerificationData || inspectStudentVerification.studentVerificationData) ? (
              (() => {
                const verificationData = privateVerificationData || inspectStudentVerification.studentVerificationData!;
                return (
                  <div className="space-y-3 bg-black/40 p-4 rounded-2xl border border-white/5 text-xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1.5">
                        <Lock className="w-3 h-3 text-emerald-400" />
                        <span>Protected Private Storage ({privateVerificationData ? 'users/{id}/private/verification' : 'Legacy record'})</span>
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {verificationData.isLiveCameraCaptured ? 'Live Camera Capture' : 'URL Link'}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 block mb-0.5 font-medium">Coaching Institute / College / University:</span>
                      <p className="text-base font-bold text-[#00E5FF]">
                        {verificationData.collegeOrCoaching || 'Not provided'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5">
                      <div>
                        <span className="text-gray-400 block mb-0.5 font-medium">Roll No. / Student ID:</span>
                        <span className="font-mono text-white font-bold bg-white/5 px-2.5 py-1 rounded inline-block">
                          {verificationData.rollOrIdNumber || 'Not provided'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block mb-0.5 font-medium">Exam / Course:</span>
                        <span className="text-purple-300 font-bold bg-purple-500/10 px-2.5 py-1 rounded inline-block border border-purple-500/20">
                          {verificationData.courseOrExam || 'Not specified'}
                        </span>
                      </div>
                    </div>

                    {verificationData.idProofUrl && (
                      <div className="pt-2 border-t border-white/5 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 font-medium">Student ID Proof:</span>
                            {verificationData.isLiveCameraCaptured ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1">
                                <Camera className="w-3 h-3" /> Live Camera Clicked
                              </span>
                            ) : (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" /> Provided via URL Link
                              </span>
                            )}
                          </div>
                          <a
                            href={verificationData.idProofUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-[#00E5FF] hover:underline flex items-center gap-1 font-semibold"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>View Full Size / Link</span>
                          </a>
                        </div>
                        <div className="rounded-xl overflow-hidden border border-white/10 max-h-56 bg-black flex items-center justify-center p-1">
                          <img 
                            src={verificationData.idProofUrl} 
                            alt="Student ID Card" 
                            className="max-h-56 object-contain rounded-lg"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5 text-[11px] text-gray-400">
                          🔍 <strong>AI vs Real Verification Check:</strong> Verify student photo lighting consistency, official coaching watermark/hologram, aligned fonts, and match roll number format with coaching standard.
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-white/5 text-[11px] text-gray-500">
                      <span>Application Submitted: {verificationData.submittedAt ? new Date(verificationData.submittedAt).toLocaleString() : 'Recent'}</span>
                    </div>
                  </div>
                );
              })()
            ) : (
              <p className="text-xs text-gray-400 italic bg-white/[0.02] p-4 rounded-xl">
                No formal student verification submission on record for this user.
              </p>
            )}

            {/* Moderation Actions */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setInspectStudentVerification(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {onRejectStudentVerification && (inspectStudentVerification.isStudentVerified || inspectStudentVerification.studentVerificationStatus === 'pending') && (
                  <button
                    type="button"
                    onClick={() => {
                      onRejectStudentVerification(inspectStudentVerification.uid);
                      setInspectStudentVerification(null);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
                  >
                    {inspectStudentVerification.isStudentVerified ? 'Revoke Badge' : 'Reject Verification'}
                  </button>
                )}

                {onApproveStudentVerification && !inspectStudentVerification.isStudentVerified && (
                  <button
                    type="button"
                    onClick={() => {
                      onApproveStudentVerification(inspectStudentVerification.uid);
                      setInspectStudentVerification(null);
                    }}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#8A2BE2] text-black text-xs font-black hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,229,255,0.4)] cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Issue "Verified Student" Badge</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
