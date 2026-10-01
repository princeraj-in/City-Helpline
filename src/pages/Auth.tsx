import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { auth, googleProvider, githubProvider, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  fetchSignInMethodsForEmail, 
  linkWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Role } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Eye, EyeOff, Lock, User, AlertCircle, Phone, 
  Building2, MapPin, Briefcase, Github, ExternalLink, 
  Copy, Check, ShieldAlert, KeyRound, X, RefreshCw, CheckCircle2
} from 'lucide-react';
import { CATEGORIES, STATE_CITIES } from '../lib/constants';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { parseAuthError, AuthErrorInfo } from '../lib/authError';
import '../styles/auth-talanov.css';

const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(location.pathname !== '/signup');

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && currentUser) {
      navigate('/');
    }
  }, [currentUser, authLoading, navigate]);

  // Update state if URL changes
  useEffect(() => {
    setIsLogin(location.pathname !== '/signup');
  }, [location.pathname]);

  // Support browser Back/Forward buttons smoothly
  useEffect(() => {
    const handlePopState = () => {
      setIsLogin(window.location.pathname !== '/signup');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const toggleAuthMode = (targetIsLogin?: boolean) => {
    const nextMode = targetIsLogin !== undefined ? targetIsLogin : !isLogin;
    setIsLogin(nextMode);
    // Smooth in-place URL update to trigger sliding animation without component unmount
    window.history.replaceState(null, '', nextMode ? '/login' : '/signup');
  };

  // Shared State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [domainError, setDomainError] = useState<AuthErrorInfo | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Forgot Password State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotNotice, setForgotNotice] = useState<string | null>(null);

  // First Time User State
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [pendingUser, setPendingUser] = useState<any>(null);

  // Account Linking State
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkEmail, setLinkEmail] = useState('');
  const [linkProvider, setLinkProvider] = useState('');
  const [pendingCred, setPendingCred] = useState<any>(null);
  const [linkPassword, setLinkPassword] = useState('');

  // Signup Specific State
  const [role, setRole] = useState<Role>('user');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const cityOptions = Object.entries(STATE_CITIES).flatMap(([state, cities]) => 
    cities.map(c => ({ value: c, label: c, group: state }))
  );

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setDomainError(null);

    try {
      try {
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      } catch (pErr) {
        console.warn("Could not set auth persistence:", pErr);
      }

      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.banned) {
          await auth.signOut();
          toast.error('Your account has been banned. Please contact support.');
          setLoading(false);
          return;
        }

        // Update lastLogin safely without blocking successful authentication
        try {
          await setDoc(doc(db, 'users', userCredential.user.uid), { lastLogin: serverTimestamp() }, { merge: true });
        } catch (lErr) {
          console.warn("Could not update lastLogin timestamp:", lErr);
        }

        toast.success('Logged in successfully');
        if (userData.role === 'contributor') {
          navigate('/profile');
        } else {
          navigate('/');
        }
      } else {
        toast.success('Logged in successfully');
        navigate('/');
      }
    } catch (err: any) {
      if (err?.code === 'permission-denied' || err?.message?.includes('permission')) {
        console.warn("Notice: background permission check during login handled:", err);
        return;
      }
      const parsed = parseAuthError(err);
      if (parsed.isUnauthorizedDomain) {
        setDomainError(parsed);
      }
      toast.error(parsed.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDomainError(null);

    if (!acceptedTerms) {
      toast.error('Please accept the Terms of Service & Safety Advisory to create an account.');
      return;
    }
    
    if (role === 'contributor') {
      if (!phone || !businessName || !businessType || !city || !address) {
        toast.error('Please fill in all business details');
        return;
      }
    }
    
    setLoading(true);

    try {
      try {
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      } catch (pErr) {
        console.warn("Could not set auth persistence:", pErr);
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      const userProfile: any = {
        uid: user.uid,
        name: name.trim(),
        email: email.trim(),
        role: role,
        city: city || '',
        banned: false,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);

      // Save contributor sensitive details to protected private subcollection
      if (role === 'contributor') {
        const privateDetails = {
          phone: phone.trim(),
          businessName: businessName.trim(),
          businessType: businessType,
          address: address.trim(),
          updatedAt: Date.now(),
        };
        await setDoc(doc(db, 'users', user.uid, 'private', 'details'), privateDetails);
      }
      toast.success('Account created successfully');
      navigate(role === 'contributor' ? '/profile' : '/');
    } catch (err: any) {
      const parsed = parseAuthError(err);
      if (parsed.isUnauthorizedDomain) {
        setDomainError(parsed);
      }
      toast.error(parsed.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = forgotEmail.trim();
    if (!cleanEmail) {
      toast.error('Please enter your email address');
      return;
    }

    setForgotLoading(true);
    setDomainError(null);
    setForgotNotice(null);

    try {
      let isGoogleOnly = false;
      try {
        const methods = await fetchSignInMethodsForEmail(auth, cleanEmail);
        if (methods.includes('google.com') && !methods.includes('password')) {
          isGoogleOnly = true;
        }
      } catch {
        // Email enumeration protection
      }

      if (isGoogleOnly) {
        setForgotNotice('This email was registered using Google Sign-In. Password reset is not needed—please log in using "Continue with Google".');
        toast.info('Account uses Google Sign-In');
        setForgotLoading(false);
        return;
      }

      const actionCodeSettings = {
        url: typeof window !== 'undefined' ? `${window.location.origin}/login` : 'https://studolink.imprince.me/login',
        handleCodeInApp: true,
      };

      await sendPasswordResetEmail(auth, cleanEmail, actionCodeSettings);
      setForgotSuccess(true);
      toast.success('Password reset link sent!');
    } catch (err: any) {
      const parsed = parseAuthError(err);
      if (parsed.isUnauthorizedDomain) {
        setDomainError(parsed);
      }
      toast.error(parsed.message);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSocialAuth = async (provider: any, isRetry = false) => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      let isAdminClaim = false;
      try {
        const tokenResult = await user.getIdTokenResult(true);
        isAdminClaim = tokenResult.claims.admin === true;
      } catch {}

      if (!userDoc.exists()) {
        // First Time User: Immediately persist baseline profile to Firestore
        const cleanName = user.displayName || (user.email ? user.email.split('@')[0] : 'User');
        const cleanEmail = user.email || '';
        const baseProfile: any = {
          uid: user.uid,
          name: cleanName,
          email: cleanEmail,
          photoURL: user.photoURL || '',
          role: isAdminClaim ? 'admin' : 'user',
          banned: false,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          updatedAt: Date.now(),
        };
        try {
          await setDoc(doc(db, 'users', user.uid), baseProfile, { merge: true });
        } catch (setErr) {
          console.warn("Notice: could not initialize baseline user profile:", setErr);
        }

        if (isAdminClaim) {
          toast.success('Signed in as Administrator');
          navigate('/');
        } else {
          setPendingUser(user);
          setShowRoleModal(true);
        }
      } else {
        // Returning User
        const userData = userDoc.data();
        if (userData.banned) {
          await auth.signOut();
          toast.error('Your account has been banned. Please contact support.');
          setLoading(false);
          return null;
        }
        
        // Update lastLogin and sync admin role safely without blocking authentication
        try {
          const updatePayload: any = { lastLogin: serverTimestamp() };
          if (isAdminClaim && userData.role !== 'admin') {
            updatePayload.role = 'admin';
          }
          await setDoc(doc(db, 'users', user.uid), updatePayload, { merge: true });
        } catch (lErr) {
          console.warn("Could not update lastLogin / role sync:", lErr);
        }

        toast.success(isAdminClaim ? 'Logged in as Administrator' : 'Logged in successfully');
        if (userData.role === 'contributor') {
          navigate('/profile');
        } else {
          navigate('/');
        }
      }
      return user;
    } catch (err: any) {
      console.warn("Social Auth notice:", err?.code || err?.message || err);

      if (err?.code === 'auth/network-request-failed' && !isRetry) {
        toast.loading('Connection interrupted, retrying...', { duration: 1200 });
        await new Promise(resolve => setTimeout(resolve, 800));
        return handleSocialAuth(provider, true);
      }

      const parsed = parseAuthError(err);
      if (parsed.isUnauthorizedDomain || parsed.isNetworkError || parsed.isProviderDisabled) {
        setDomainError(parsed);
      }
      if (err.code === 'auth/popup-blocked') {
        toast.error('Popup blocked by browser. Please allow popups for this site.');
        setLoading(false);
        return;
      }
      if (err.code === 'auth/account-exists-with-different-credential') {
        const emailVal = err.customData?.email;
        let pendingCredential;
        if (provider.providerId === 'google.com') {
          pendingCredential = GoogleAuthProvider.credentialFromError(err);
        } else if (provider.providerId === 'github.com') {
          pendingCredential = GithubAuthProvider.credentialFromError(err);
        }

        if (emailVal && pendingCredential) {
          let primaryProvider = 'google.com';
          try {
            const methods = await fetchSignInMethodsForEmail(auth, emailVal);
            if (methods && methods.length > 0) {
              if (methods.includes('google.com')) primaryProvider = 'google.com';
              else if (methods.includes('password')) primaryProvider = 'password';
              else primaryProvider = methods[0] || 'google.com';
            }
          } catch (fetchErr) {
            console.warn('Notice fetching sign-in methods:', fetchErr);
          }

          setLinkEmail(emailVal);
          setLinkProvider(primaryProvider);
          setPendingCred(pendingCredential);
          setShowLinkModal(true);
          setLoading(false);
          toast.info(`Account with ${emailVal} exists. Sign in with ${primaryProvider === 'google.com' ? 'Google' : 'your password'} to link your account.`);
          return;
        }
      }
      if (err?.code === 'permission-denied' || err?.message?.includes('permission')) {
        console.warn("Notice: background permission check during social auth handled:", err);
        return;
      }
      toast.error(parsed.message);
    } finally {
      if (!showLinkModal) {
        setLoading(false);
      }
    }
  };

  const loginWithGithub = async () => {
    return handleSocialAuth(githubProvider);
  };

  const handleLinkAccount = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setDomainError(null);
    try {
      let userCredential;
      if (linkProvider === 'google.com') {
        userCredential = await signInWithPopup(auth, googleProvider);
      } else if (linkProvider === 'github.com') {
        userCredential = await signInWithPopup(auth, githubProvider);
      } else if (linkProvider === 'password') {
        userCredential = await signInWithEmailAndPassword(auth, linkEmail, linkPassword);
      }

      if (userCredential && pendingCred) {
        const providerToLink = pendingCred.providerId === 'github.com' ? githubProvider : googleProvider;
        await linkWithPopup(userCredential.user, providerToLink);
        toast.success('Accounts linked successfully!');
        
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.banned) {
            await auth.signOut();
            toast.error('Your account has been banned.');
            setLoading(false);
            setShowLinkModal(false);
            return;
          }
          await setDoc(doc(db, 'users', userCredential.user.uid), { lastLogin: serverTimestamp() }, { merge: true });
          
          if (userData.role === 'contributor') {
            navigate('/profile');
          } else {
            navigate('/');
          }
        } else {
          setPendingUser(userCredential.user);
          setShowRoleModal(true);
        }
        setShowLinkModal(false);
      }
    } catch (err: any) {
      const parsed = parseAuthError(err);
      if (parsed.isUnauthorizedDomain) {
        setDomainError(parsed);
      }
      toast.error(parsed.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelection = async (selectedRole: Role) => {
    if (!pendingUser) return;
    setLoading(true);
    setDomainError(null);
    try {
      const userProfile: any = {
        uid: pendingUser.uid,
        name: pendingUser.displayName || 'User',
        email: pendingUser.email,
        photoURL: pendingUser.photoURL || '',
        role: selectedRole,
        banned: false,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', pendingUser.uid), userProfile);
      setShowRoleModal(false);
      toast.success('Account created successfully');
      navigate(selectedRole === 'contributor' ? '/profile' : '/');
    } catch (err: any) {
      const parsed = parseAuthError(err);
      if (parsed.isUnauthorizedDomain) {
        setDomainError(parsed);
      }
      toast.error(parsed.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07090E]">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-[#00E5FF] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-400 font-medium text-sm">Loading Studolink Authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page-container">
      <p className="tip">
        Direct & Zero-Brokerage Student Housing • Studolink
      </p>

      {/* Main Sliding Double Card */}
      <div className={`cont ${!isLogin ? 's--signup' : ''}`}>
        
        {/* Mobile Tab Switcher (< 940px) */}
        <div className="mobile-tab-switch">
          <button
            type="button"
            className={isLogin ? 'active' : ''}
            onClick={() => toggleAuthMode(true)}
          >
            Sign In
          </button>
          <button
            type="button"
            className={!isLogin ? 'active' : ''}
            onClick={() => toggleAuthMode(false)}
          >
            Sign Up
          </button>
        </div>

        {/* 1. Form: Sign In */}
        <form className="form sign-in" onSubmit={handleLoginSubmit}>
          <h2>Welcome Back,</h2>
          <p className="form-subtitle">Log in to manage rooms, bookings & preferences</p>

          {/* Domain Error Notice */}
          {domainError && (
            <div className="p-3 mb-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs space-y-2 text-left">
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{domainError.message}</div>
                <button type="button" onClick={() => setDomainError(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {domainError.consoleUrl && (
                <a
                  href={domainError.consoleUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 underline"
                >
                  <span>Open Firebase Settings</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          <label>
            <span>Email Address</span>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            <span>Password</span>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#718096',
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '280px', margin: '12px auto 0' }}>
            <label className="remember-wrap" style={{ margin: 0, width: 'auto' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <span>Remember me</span>
            </label>

            <span
              className="forgot-pass"
              style={{ margin: 0 }}
              onClick={() => {
                setForgotEmail(email);
                setShowForgotModal(true);
              }}
            >
              Forgot password?
            </span>
          </div>

          <button type="submit" className="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="or-divider">
            <span>Or continue with</span>
          </div>

          <button
            type="button"
            className="social-btn google-btn"
            onClick={() => handleSocialAuth(googleProvider)}
            disabled={loading}
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            className="social-btn github-btn"
            onClick={loginWithGithub}
            disabled={loading}
          >
            <Github size={16} />
            <span>Continue with GitHub</span>
          </button>

          <p className="terms-note-text">
            By signing in, you agree to our{' '}
            <Link to="/terms" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </Link>{' '}
            &{' '}
            <Link to="/safety" target="_blank" rel="noopener noreferrer">
              Safety Policy
            </Link>.
          </p>

          <p className="desktop-switch-hint text-center text-xs text-gray-500 mt-2">
            New to Studolink?{' '}
            <button
              type="button"
              onClick={() => toggleAuthMode(false)}
              className="text-[#00E5FF] font-bold hover:underline cursor-pointer"
              style={{ display: 'inline', width: 'auto', margin: 0, padding: 0, height: 'auto', background: 'none' }}
            >
              Sign Up here
            </button>
          </p>
        </form>

        {/* 2. Sub-Container (Sliding Overlay Image + Sign-Up Form) */}
        <div className="sub-cont">
          <div className="img">
            <div className="img__text m--up">
              <h2>New here?</h2>
              <p>Sign up and discover verified zero-brokerage student rooms, mess & marketplace!</p>
            </div>
            <div className="img__text m--in">
              <h2>One of us?</h2>
              <p>If you already have an account, just sign in. We've missed you!</p>
            </div>
            <div className="img__btn" onClick={() => toggleAuthMode(!isLogin)}>
              <span className="m--up">Sign Up</span>
              <span className="m--in">Sign In</span>
            </div>
          </div>

          {/* Form: Sign Up */}
          <form className="form sign-up" onSubmit={handleSignupSubmit}>
            <h2>Create Account,</h2>
            <p className="form-subtitle">Join thousands of students and verified service contributors</p>

            {/* Role Switcher */}
            <div className="role-pill-switch">
              <button
                type="button"
                className={role === 'user' ? 'active' : ''}
                onClick={() => setRole('user')}
              >
                User (Student / Aspirant)
              </button>
              <button
                type="button"
                className={role === 'contributor' ? 'active' : ''}
                onClick={() => setRole('contributor')}
              >
                Contributor (Business / Service Owner)
              </button>
            </div>

            <label>
              <span>Full Name</span>
              <input
                type="text"
                required
                placeholder="Rahul Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label>
              <span>Email Address</span>
              <input
                type="email"
                required
                placeholder="rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label>
              <span>Password</span>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '6px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#718096',
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            {role === 'contributor' && (
              <>
                <label>
                  <span>Contact / Phone Number</span>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </label>

                <label>
                  <span>Business / Service Name</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sharda Boys PG / Saraswati Library / Anand Mess"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </label>

                <label>
                  <span>Category</span>
                  <select
                    required
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                  >
                    <option value="" disabled>Select Business / Service Category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>City</span>
                  <select
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option value="" disabled>Select City</option>
                    {cityOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} ({opt.group})
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Business Address / Locality</span>
                  <textarea
                    rows={2}
                    required
                    placeholder="Street, Landmark, Coaching Hub Area"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </label>
              </>
            )}

            {/* Terms of Service & Safety Advisory Checkbox */}
            <div className="terms-checkbox-wrap">
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', margin: 0, width: '100%' }}>
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  required
                />
                <span>
                  I accept the{' '}
                  <Link to="/terms" target="_blank" rel="noopener noreferrer">
                    Terms of Service
                  </Link>{' '}
                  &{' '}
                  <Link to="/safety" target="_blank" rel="noopener noreferrer">
                    Safety Advisory
                  </Link>
                </span>
              </label>
            </div>

            <button type="submit" className="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Sign Up'}
            </button>

            <div className="or-divider">
              <span>Or join with</span>
            </div>

            <button
              type="button"
              className="social-btn google-btn"
              onClick={() => handleSocialAuth(googleProvider)}
              disabled={loading}
            >
              <GoogleIcon />
              <span>Join with Google</span>
            </button>

            <button
              type="button"
              className="social-btn github-btn"
              onClick={loginWithGithub}
              disabled={loading}
            >
              <Github size={16} />
              <span>Join with GitHub</span>
            </button>

            <p className="desktop-switch-hint text-center text-xs text-gray-500 mt-3 pb-3">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => toggleAuthMode(true)}
                className="text-[#00E5FF] font-bold hover:underline cursor-pointer"
                style={{ display: 'inline', width: 'auto', margin: 0, padding: 0, height: 'auto', background: 'none' }}
              >
                Sign In here
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Role Selection Modal (For First Time Social Login Users) */}
      <AnimatePresence>
        {showRoleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#0e121b] border border-white/10 rounded-3xl p-8 shadow-2xl z-10 text-center"
            >
              <h3 className="text-2xl font-bold text-white mb-2">Select Your Role</h3>
              <p className="text-gray-400 text-xs mb-6">Choose how you plan to use Studolink</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleRoleSelection('user')}
                  className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#00E5FF] hover:bg-[#00E5FF]/10 transition-all text-center group cursor-pointer flex flex-col items-center justify-center"
                >
                  <User className="w-8 h-8 text-[#00E5FF] mb-2 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-white text-sm">User (Student / Aspirant)</div>
                  <div className="text-[11px] text-gray-400 mt-1">Search PGs, mess, libraries & marketplace</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelection('contributor')}
                  className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#8A2BE2] hover:bg-[#8A2BE2]/10 transition-all text-center group cursor-pointer flex flex-col items-center justify-center"
                >
                  <Building2 className="w-8 h-8 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-white text-sm">Contributor (Business / Service Owner)</div>
                  <div className="text-[11px] text-gray-400 mt-1">List PGs, mess, libraries, coaching & services</div>
                </button>
              </div>

              <p className="text-[11px] text-gray-400 mt-6 leading-relaxed">
                By continuing, you agree to Studolink's{' '}
                <Link to="/terms" target="_blank" rel="noopener noreferrer" className="text-[#00E5FF] underline font-semibold">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/safety" target="_blank" rel="noopener noreferrer" className="text-[#00E5FF] underline font-semibold">
                  Safety Advisory
                </Link>.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Account Linking Modal */}
      <AnimatePresence>
        {showLinkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#0e121b] border border-white/10 rounded-3xl p-8 shadow-2xl z-10"
            >
              <div className="text-center mb-6">
                <AlertCircle className="w-12 h-12 text-[#00E5FF] mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white">Link Existing Account</h3>
                <p className="text-gray-400 text-xs mt-1">
                  An account with <strong>{linkEmail}</strong> already exists. Please verify your identity to link accounts.
                </p>
              </div>

              {linkProvider === 'password' ? (
                <form onSubmit={handleLinkAccount} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Enter your password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={linkPassword}
                      onChange={(e) => setLinkPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-sm focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-[#00E5FF] hover:bg-[#00c8e0] text-black font-bold text-xs transition-colors cursor-pointer"
                  >
                    {loading ? 'Linking...' : 'Verify & Link Account'}
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => handleLinkAccount()}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <GoogleIcon />
                  <span>Verify with Google</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowLinkModal(false);
                  setPendingCred(null);
                }}
                className="w-full mt-4 text-xs text-gray-400 hover:text-white"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowForgotModal(false);
                setForgotSuccess(false);
                setForgotNotice(null);
              }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#0e121b] border border-white/10 rounded-3xl p-8 shadow-2xl z-10"
            >
              {forgotSuccess ? (
                <div className="text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Reset Link Sent</h3>
                  <p className="text-gray-300 text-xs">
                    Password reset link email bhej diya gaya hai to <strong className="text-[#00E5FF]">{forgotEmail}</strong>.
                  </p>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-left text-xs text-gray-400 space-y-1">
                    <p>• Apna <strong>Inbox</strong> aur <strong>Spam</strong> folder check karein.</p>
                    <p>• Email link par click karke naya password set karein.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      setForgotSuccess(false);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#00E5FF] hover:bg-[#00c8e0] text-black font-bold text-xs"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <KeyRound className="w-10 h-10 text-[#00E5FF] mx-auto mb-2" />
                    <h3 className="text-xl font-bold text-white">Reset Password</h3>
                    <p className="text-gray-400 text-xs mt-1">
                      Enter your email address to receive password reset instructions.
                    </p>
                  </div>

                  {forgotNotice && (
                    <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-200 text-xs">
                      {forgotNotice}
                    </div>
                  )}

                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-sm focus:outline-none focus:border-[#00E5FF]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-3 rounded-xl bg-[#00E5FF] hover:bg-[#00c8e0] text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {forgotLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Sending Link...</span>
                        </>
                      ) : (
                        'Send Reset Link'
                      )}
                    </button>
                  </form>

                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="w-full mt-4 text-xs text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
