/**
 * Firebase Auth Error Parser and Formatter
 * Provides user-friendly error messages and troubleshooting guides
 */

import appletConfig from '../../firebase-applet-config.json';

export interface AuthErrorInfo {
  title: string;
  message: string;
  isUnauthorizedDomain?: boolean;
  isNetworkError?: boolean;
  isProviderDisabled?: boolean;
  providerName?: string;
  domain?: string;
  consoleUrl?: string;
  callbackUrl?: string;
}

export function parseAuthError(error: any): AuthErrorInfo {
  const code = error?.code || '';
  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'app.imprince.me';
  const projectId = appletConfig.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID || 'studolink-in';
  const consoleSettingsUrl = `https://console.firebase.google.com/project/${projectId}/authentication/settings`;
  const consoleProvidersUrl = `https://console.firebase.google.com/project/${projectId}/authentication/providers`;
  const callbackUrl = `https://${projectId}.firebaseapp.com/__/auth/handler`;

  switch (code) {
    case 'auth/unauthorized-domain':
      return {
        title: 'Domain Not Authorized in Firebase',
        message: `The domain "${currentHost}" is not added to your Firebase project's Authorized Domains list. Login and Signup cannot complete until this domain is whitelisted.`,
        isUnauthorizedDomain: true,
        domain: currentHost,
        consoleUrl: consoleSettingsUrl
      };

    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return {
        title: 'Invalid Credentials',
        message: 'The email address or password you entered is incorrect. Please check and try again.'
      };

    case 'auth/user-not-found':
      return {
        title: 'Account Not Found',
        message: 'No account was found with this email. Please sign up to create a new account.'
      };

    case 'auth/email-already-in-use':
      return {
        title: 'Email Already In Use',
        message: 'An account with this email address already exists. Please log in instead.'
      };

    case 'auth/weak-password':
      return {
        title: 'Weak Password',
        message: 'Your password must be at least 6 characters long with a mix of letters and numbers.'
      };

    case 'auth/invalid-email':
      return {
        title: 'Invalid Email',
        message: 'Please enter a valid email address (e.g. name@example.com).'
      };

    case 'auth/popup-closed-by-user':
      return {
        title: 'Sign-in Cancelled',
        message: 'The sign-in popup was closed before completing authentication.'
      };

    case 'auth/popup-blocked':
      return {
        title: 'Popup Blocked',
        message: 'Your browser blocked the sign-in popup. Please allow popups for this site and try again.'
      };

    case 'auth/network-request-failed':
      return {
        title: 'Network / Cross-Origin Blocked',
        message: 'Could not connect to Firebase Authentication. If you are using Brave, an ad-blocker, or incognito mode, please allow popups & cross-site cookies, or log in using Email & Password.',
        isNetworkError: true,
        domain: currentHost,
        consoleUrl: consoleSettingsUrl
      };

    case 'auth/operation-not-allowed':
    case 'auth/configuration-not-found':
    case 'auth/admin-restricted-operation':
      return {
        title: 'GitHub Sign-in Not Configured in Firebase',
        message: 'GitHub login is currently not enabled in Firebase Console. It requires a GitHub OAuth Client ID & Secret in Firebase Authentication > Sign-in method. Please use Google Sign-in or Email & Password to log in.',
        isProviderDisabled: true,
        providerName: 'GitHub',
        consoleUrl: consoleProvidersUrl,
        callbackUrl
      };

    case 'auth/too-many-requests':
      return {
        title: 'Too Many Attempts',
        message: 'Access to this account has been temporarily disabled due to many failed login attempts. Please reset your password or try again later.'
      };

    case 'auth/account-exists-with-different-credential':
      return {
        title: 'Account Exists With Different Provider',
        message: 'An account already exists with this email address using Google or Email/Password. Please sign in with that method to link your accounts.'
      };

    default:
      return {
        title: 'Authentication Failed',
        message: error?.message?.replace(/^Firebase:\s*/, '') || 'An unexpected authentication error occurred. Please try again.'
      };
  }
}

