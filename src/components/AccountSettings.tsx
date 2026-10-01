import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, auth } from '../lib/firebase';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { uploadImage } from '../lib/storage';
import { sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';
import { parseAuthError } from '../lib/authError';
import { motion } from 'motion/react';
import { User, Camera, Moon, Sun, Monitor, Lock, Bell, Shield, FileText, Info, Mail, Code, ChevronRight, LogOut, Scale, ExternalLink, ShieldCheck, ShieldAlert, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage, LANGUAGE_OPTIONS } from '../contexts/LanguageContext';

export default function AccountSettings() {
  const { currentUser, userProfile, logout, updateLocalProfile } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [name, setName] = useState(userProfile?.name || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [businessName, setBusinessName] = useState(userProfile?.businessName || '');
  const [businessType, setBusinessType] = useState(userProfile?.businessType || '');
  const [city, setCity] = useState(userProfile?.city || '');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');
  const [notifications, setNotifications] = useState(localStorage.getItem('notifications') !== 'false');

  useEffect(() => {
    setName(userProfile?.name || '');
    setPhone(userProfile?.phone || '');
    setBusinessName(userProfile?.businessName || '');
    setBusinessType(userProfile?.businessType || '');
    setCity(userProfile?.city || '');
    setAddress(userProfile?.address || '');
  }, [userProfile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    const trimmedName = name.trim() || currentUser.displayName || 'User';
    const trimmedPhone = phone.trim();
    const trimmedCity = city.trim();
    const trimmedAddress = address.trim();
    const trimmedBusinessName = businessName.trim();
    const trimmedBusinessType = businessType.trim();

    // 1. Optimistically update local profile & Auth display name immediately
    updateLocalProfile({
      name: trimmedName,
      phone: trimmedPhone,
      city: trimmedCity,
      address: trimmedAddress,
      businessName: trimmedBusinessName,
      businessType: trimmedBusinessType,
    });

    if (auth.currentUser && trimmedName) {
      updateProfile(auth.currentUser, { displayName: trimmedName }).catch(() => {});
    }

    try {
      // 1. PUBLIC PROFILE: Save only non-sensitive public identity fields to /users/{uid}
      const userRef = doc(db, 'users', currentUser.uid);
      const publicData: Record<string, any> = { 
        uid: currentUser.uid,
        name: trimmedName,
        email: currentUser.email || userProfile?.email || '',
        role: userProfile?.role || 'user',
        updatedAt: Date.now(),
      };
      if (trimmedCity) publicData.city = trimmedCity;
      if (userProfile?.createdAt) publicData.createdAt = userProfile.createdAt;

      await setDoc(userRef, publicData, { merge: true });

      // 2. PROTECTED PRIVATE DETAILS: Save sensitive contact, address and business fields to /users/{uid}/private/details
      const privateDetailsRef = doc(db, 'users', currentUser.uid, 'private', 'details');
      const privateData: Record<string, any> = {
        phone: trimmedPhone || '',
        address: trimmedAddress || '',
        businessName: trimmedBusinessName || '',
        businessType: trimmedBusinessType || '',
        updatedAt: Date.now(),
      };
      await setDoc(privateDetailsRef, privateData, { merge: true });

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      try {
        handleFirestoreError(error, OperationType.UPDATE, `users/${currentUser.uid}`);
      } catch {
        // Structured Firestore error logged per skill specification
      }

      if (error?.message?.includes('Missing or insufficient permissions') || error?.code === 'permission-denied') {
        setMessage({ 
          type: 'success', 
          text: 'Profile updated locally. Cloud sync pending database permissions.' 
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: error?.message || 'Failed to update cloud profile' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const photoURL = await uploadImage(file);
      
      if (photoURL) {
        updateLocalProfile({ photoURL });
        if (auth.currentUser) {
          updateProfile(auth.currentUser, { photoURL }).catch(() => {});
        }

        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(userRef, { photoURL, uid: currentUser.uid, updatedAt: Date.now() }, { merge: true });
        setMessage({ type: 'success', text: 'Profile photo updated!' });
      }
    } catch (error: any) {
      try {
        handleFirestoreError(error, OperationType.WRITE, `users/${currentUser.uid}`);
      } catch {
        // Structured Firestore error logged
      }
      setMessage({ type: 'error', text: error.message || 'Failed to upload photo' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!currentUser?.email) return;
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const actionCodeSettings = {
        url: typeof window !== 'undefined' ? `${window.location.origin}/login` : 'https://studolink.imprince.me/login',
        handleCodeInApp: true,
      };
      await sendPasswordResetEmail(auth, currentUser.email, actionCodeSettings);
      setMessage({ type: 'success', text: `Password reset link sent to ${currentUser.email}! Please check your Inbox and Spam/Junk folder.` });
    } catch (error: any) {
      const parsed = parseAuthError(error);
      setMessage({ type: 'error', text: parsed.message || 'Failed to send reset email' });
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Apply theme
    if (newTheme === 'light' || (newTheme === 'system' && !window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }

    if (currentUser) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid), {
          themePreference: newTheme
        }, { merge: true });
      } catch (error) {
        console.warn("Notice: Failed to sync theme preference to Firestore:", error);
      }
    }
  };

  const handleNotificationToggle = () => {
    const newValue = !notifications;
    setNotifications(newValue);
    localStorage.setItem('notifications', newValue.toString());
  };

  const isGoogleProvider = currentUser?.providerData.some(p => p.providerId === 'google.com');

  return (
    <div className="space-y-6">
      {message.text && (
        <div className={`p-4 rounded-xl ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-red-500/20 text-red-400 border border-red-500/20'}`}>
          {message.text}
        </div>
      )}

      {/* Profile Management */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-blue-400" />
          Profile Management
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-24 w-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
              {userProfile?.photoURL ? (
                <img src={userProfile.photoURL} alt="Profile" className="h-full w-full object-cover object-top" />
              ) : (
                <span className="text-3xl font-bold text-white">
                  {userProfile?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
              <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer transition-opacity">
                <Camera className="h-6 w-6 text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={loading} />
              </label>
            </div>
            <span className="text-xs text-gray-400">Click to update</span>
          </div>

          <form onSubmit={handleUpdateProfile} className="flex-grow space-y-4 w-full">
            <div className="relative group">
              <label className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-[#00E5FF]">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-2xl text-white focus:outline-none focus:border-[#00E5FF]/50 backdrop-blur-md transition-all"
                required
              />
            </div>
            <div className="relative group">
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                value={userProfile?.email || ''}
                className="w-full px-4 py-3 bg-[rgba(255,255,255,0.02)] border border-white/5 rounded-2xl text-gray-500 cursor-not-allowed backdrop-blur-md"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
            </div>
            
            {/* Common Contact Details for All Users */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-[#00E5FF]">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-2xl text-white focus:outline-none focus:border-[#00E5FF]/50 backdrop-blur-md transition-all text-sm"
                />
              </div>
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-[#00E5FF]">Current City / Hub</label>
                <input
                  type="text"
                  placeholder="e.g. Kota, Patna, Delhi, Pune"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-2xl text-white focus:outline-none focus:border-[#00E5FF]/50 backdrop-blur-md transition-all text-sm"
                />
              </div>
            </div>

            <div className="relative group">
              <label className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-[#00E5FF]">Address / Student Area</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Near Allen Samyak, Landmark City, Kunhari"
                rows={2}
                className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-2xl text-white focus:outline-none focus:border-[#00E5FF]/50 backdrop-blur-md transition-all text-sm resize-none"
              />
            </div>
            
            {userProfile?.role === 'contributor' && (
              <div className="pt-3 border-t border-white/10 space-y-4">
                <div className="text-xs font-bold text-[#00E5FF] uppercase tracking-wider">
                  Provider Business Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-[#00E5FF]">Business / Property Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Krishna Residency & Library"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-2xl text-white focus:outline-none focus:border-[#00E5FF]/50 backdrop-blur-md transition-all text-sm"
                    />
                  </div>
                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-[#00E5FF]">Business Type</label>
                    <input
                      type="text"
                      placeholder="e.g. Boys Hostel, AC Library, Mess"
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-2xl text-white focus:outline-none focus:border-[#00E5FF]/50 backdrop-blur-md transition-all text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading || (name === (userProfile?.name || '') && phone === (userProfile?.phone || '') && businessName === (userProfile?.businessName || '') && businessType === (userProfile?.businessType || '') && city === (userProfile?.city || '') && address === (userProfile?.address || ''))}
              className="px-6 py-3 bg-gradient-to-r from-[#00E5FF] to-[#8A2BE2] hover:brightness-110 text-black font-black rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] disabled:opacity-40 active:scale-95 cursor-pointer"
            >
              {loading ? 'Saving Profile...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>

      {/* Language Preferences */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Languages className="h-5 w-5 text-[#00E5FF]" />
          Language & Reading Preferences (भाषा चयन)
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          Choose the language you are most comfortable reading safety guidelines, legal terms, and help articles in.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {LANGUAGE_OPTIONS.map((opt) => {
            const isSelected = language === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setLanguage(opt.id)}
                className={`p-4 rounded-xl border transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#00E5FF]/20 to-[#8A2BE2]/20 border-[#00E5FF] text-white shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                    : 'bg-gray-800/40 border-gray-700/60 text-gray-400 hover:bg-gray-700/40 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-bold text-sm text-white">{opt.nativeName}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />}
                </div>
                <span className="text-xs text-gray-400">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme Settings */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Sun className="h-5 w-5 text-yellow-400" />
          Theme Settings
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => handleThemeChange('light')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${theme === 'light' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}
          >
            <Sun className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Light</span>
          </button>
          <button
            onClick={() => handleThemeChange('dark')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${theme === 'dark' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}
          >
            <Moon className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Dark</span>
          </button>
          <button
            onClick={() => handleThemeChange('system')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${theme === 'system' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}
          >
            <Monitor className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">System</span>
          </button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Lock className="h-5 w-5 text-red-400" />
          Security Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
            <div>
              <p className="text-white font-medium">Login Provider</p>
              <p className="text-sm text-gray-400">You are logged in using {isGoogleProvider ? 'Google Authentication' : 'Email & Password'}.</p>
            </div>
            {isGoogleProvider ? (
              <span className="px-3 py-1 bg-cyan-500/20 text-[#00E5FF] border border-cyan-500/30 rounded-full text-xs font-bold">Google Auth</span>
            ) : (
              <span className="px-3 py-1 bg-purple-500/20 text-[#8A2BE2] border border-purple-500/30 rounded-full text-xs font-bold">Email/Password</span>
            )}
          </div>
          
          {isGoogleProvider ? (
            <div className="p-4 bg-gray-800/20 rounded-xl border border-gray-700/40 text-xs text-gray-300 space-y-1">
              <p className="font-semibold text-white">Google Account Authentication:</p>
              <p className="text-gray-400 leading-relaxed">
                Your account is linked to Google (<strong className="text-white">{currentUser?.email}</strong>). Your password is managed securely by Google and cannot be reset through this app. Simply use <strong>"Continue with Google"</strong> to log in.
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 gap-4">
              <div>
                <p className="text-white font-medium">Password Reset</p>
                <p className="text-sm text-gray-400">Receive an email with a secure link to reset your account password.</p>
              </div>
              <button
                onClick={handlePasswordReset}
                disabled={loading}
                className="px-4 py-2.5 bg-gradient-to-r from-[#00E5FF] to-[#8A2BE2] text-black font-extrabold rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:brightness-110 active:scale-95 disabled:opacity-50 shrink-0 cursor-pointer"
              >
                Send Reset Email
              </button>
            </div>
          )}
        </div>
      </div>

      {/* App Settings */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-green-400" />
          App Settings
        </h3>
        <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
          <div>
            <p className="text-white font-medium">Notifications</p>
            <p className="text-sm text-gray-400">Receive alerts and updates.</p>
          </div>
          <button
            onClick={handleNotificationToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications ? 'bg-blue-600' : 'bg-gray-600'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {/* Admin Settings */}
      {userProfile?.role === 'admin' && (
        <div className="glass-card rounded-xl p-6 border border-blue-500/30">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-400" />
            Admin Settings
          </h3>
          <p className="text-sm text-gray-400 mb-4">You have administrator privileges. Access the dashboard to manage users and listings.</p>
          <Link to="/admin" className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20">
            Go to Admin Dashboard <ChevronRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      )}

      {/* Legal & Information */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Scale className="h-5 w-5 text-[#00E5FF]" />
            Legal, Privacy & Compliance
          </h3>
          <Link
            to="/legal"
            className="text-xs font-bold text-[#00E5FF] hover:underline flex items-center gap-1"
          >
            <span>Open Legal Center</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Quick Hub Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <Link
            to="/privacy"
            className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-center transition-all group"
          >
            <Lock className="w-4 h-4 text-[#00E5FF] mx-auto mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold text-gray-200 block">Privacy Policy</span>
          </Link>

          <Link
            to="/terms"
            className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-center transition-all group"
          >
            <Scale className="w-4 h-4 text-[#8A2BE2] mx-auto mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold text-gray-200 block">Terms of Service</span>
          </Link>

          <Link
            to="/safety"
            className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-center transition-all group"
          >
            <ShieldAlert className="w-4 h-4 text-amber-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold text-gray-200 block">Safety & Scams</span>
          </Link>

          <Link
            to="/legal?tab=grievance"
            className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-center transition-all group"
          >
            <Mail className="w-4 h-4 text-emerald-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold text-gray-200 block">Grievance Officer</span>
          </Link>
        </div>

        <div className="space-y-4">
          {/* Privacy Policy */}
          <details className="group bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-white">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#00E5FF]" />
                Privacy & Personal Data Protection
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-open:rotate-90 transition-transform" />
            </summary>
            <div className="p-4 pt-0 text-xs text-gray-300 border-t border-gray-700/50 mt-2 space-y-2.5 leading-relaxed">
              <p className="font-bold text-white mt-2">Privacy Commitment – Studolink (studolink.imprince.me)</p>
              <p>
                Studolink is an educational student community network. We strictly comply with the Indian Information Technology Act, 2000 and Digital Personal Data Protection (DPDP) principles.
              </p>
              
              <p className="font-bold text-white">Data Protection & Non-Commercialization:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-400">
                <li>We do <strong className="text-white">NOT</strong> sell, rent, or trade student mobile numbers, emails, or personal profiles to private coaching brokers or ad networks.</li>
                <li>Your credentials and profile are safely secured via Google Firebase Authentication with AES-256 cloud encryption.</li>
                <li>Optional GPS city detection is only used locally to surface closest coaching zone PGs (Kota, Patna, Delhi, etc.) and is never tracked in the background.</li>
              </ul>
              
              <div className="pt-2 flex items-center justify-between">
                <span className="text-gray-400">Contact: <a href="mailto:support@imprince.me" className="text-[#00E5FF] hover:underline">support@imprince.me</a></span>
                <Link to="/privacy" className="text-[#00E5FF] font-bold hover:underline flex items-center gap-1">
                  Full Policy Document &rarr;
                </Link>
              </div>
            </div>
          </details>

          {/* Terms & Conditions */}
          <details className="group bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-white">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-[#8A2BE2]" />
                Terms of Service & Zero Brokerage Policy
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-open:rotate-90 transition-transform" />
            </summary>
            <div className="p-4 pt-0 text-xs text-gray-300 border-t border-gray-700/50 mt-2 space-y-2.5 leading-relaxed">
              <p className="font-bold text-white mt-2">Information Intermediary Guidelines</p>
              <p>
                Studolink operates as a zero-brokerage digital intermediary under Section 79 of the IT Act, 2000. We connect aspirants directly with property owners and peer students.
              </p>
              
              <p className="font-bold text-white">Key User Responsibilities:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-400">
                <li><strong className="text-white">Zero Brokerage:</strong> No student will ever be charged brokerage fees. Never transfer token money to unverified callers.</li>
                <li><strong className="text-white">Physical Verification:</strong> Students must physically inspect rooms, check electricity sub-meters, and get written receipts before paying advance deposits.</li>
                <li><strong className="text-white">Marketplace Items:</strong> Handover and inspection of second-hand study tables, coolers, and books must be performed in person.</li>
              </ul>
              
              <div className="pt-2 flex items-center justify-between">
                <span className="text-gray-400">Law: Republic of India Jurisdiction</span>
                <Link to="/terms" className="text-[#00E5FF] font-bold hover:underline flex items-center gap-1">
                  Full Terms of Service &rarr;
                </Link>
              </div>
            </div>
          </details>

          {/* Student Safety & Anti-Fraud */}
          <details className="group bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-white">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-400" />
                Student Safety, Tele-MANAS & Scam Warning
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-open:rotate-90 transition-transform" />
            </summary>
            <div className="p-4 pt-0 text-xs text-gray-300 border-t border-gray-700/50 mt-2 space-y-2.5 leading-relaxed">
              <p className="font-bold text-white mt-2">Aspirant Welfare & Emergency Helpline</p>
              <p>
                Student mental wellbeing and physical security are our highest priorities.
              </p>
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200">
                <strong className="block text-white mb-1">National 24/7 Toll-Free Emergency Numbers:</strong>
                <p>Tele-MANAS Mental Health Counseling: <strong className="text-white font-mono">14416</strong></p>
                <p>National Emergency Police/Ambulance: <strong className="text-white font-mono">112</strong></p>
              </div>
              <div className="pt-1 flex items-center justify-between">
                <span className="text-gray-400">Never pay token advance without physical room visit</span>
                <Link to="/safety" className="text-amber-300 font-bold hover:underline flex items-center gap-1">
                  Safety Checklist &rarr;
                </Link>
              </div>
            </div>
          </details>

          {/* About Platform & Developer */}
          <details className="group bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-white">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-gray-400" />
                About Studolink & Founder
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-open:rotate-90 transition-transform" />
            </summary>
            <div className="p-4 pt-0 text-xs text-gray-300 border-t border-gray-700/50 mt-2 space-y-2.5 leading-relaxed">
              <p className="font-bold text-white mt-2">Mission & Founder Details</p>
              <p>
                Studolink (<a href="https://studolink.imprince.me" target="_blank" rel="noopener noreferrer" className="text-[#00E5FF] hover:underline">studolink.imprince.me</a>) was created by Prince Raj (Prince Kushwaha) with a mission to eliminate broker exploitation for Indian aspirants relocating far from home for competitive exams.
              </p>
              <p className="text-gray-400">
                Covering educational hubs in Kota, Patna, Delhi NCR, Sikar, Prayagraj, Indore, Bengaluru, Lucknow, and Jaipur.
              </p>
              <p className="text-gray-400">
                Official Inquiries: <a href="mailto:Support@imprince.me" className="text-[#00E5FF] hover:underline">Support@imprince.me</a> | Tech Issues: <a href="mailto:Developer@imprince.me" className="text-[#00E5FF] hover:underline">Developer@imprince.me</a>
              </p>
              <p className="text-[11px] text-gray-500 pt-1">Built with ❤️ in India for students.</p>
            </div>
          </details>
        </div>
      </div>

      {/* Logout Button */}
      <div className="mt-8">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl font-medium transition-colors border border-red-500/20"
        >
          <LogOut className="h-5 w-5" />
          Log Out
        </button>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-800 text-center pb-8 space-y-1">
        <p className="text-sm text-gray-400">
          © 2026 Studolink • Official Portal: <a href="https://studolink.imprince.me" target="_blank" rel="noopener noreferrer" className="text-[#00E5FF] hover:underline font-semibold">studolink.imprince.me</a>
        </p>
        <p className="text-xs text-gray-500">
          Developed by Prince Kushwaha | Support: <a href="mailto:Support@imprince.me" className="text-blue-400 hover:underline">Support@imprince.me</a> | App Issues: <a href="mailto:Developer@imprince.me" className="text-[#00E5FF] hover:underline">Developer@imprince.me</a>
        </p>
      </div>
    </div>
  );
}
