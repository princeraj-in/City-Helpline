import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { initializeFirestore, setLogLevel, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import appletConfig from '../../firebase-applet-config.json';

// Silence internal Firestore network polling warnings that occur in iframe/sandboxed preview environments
setLogLevel('silent');

// Intercept any internal Firestore offline reconnection or transient auth network messages that bubble up
if (typeof window !== 'undefined') {
  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    const msg = typeof args[0] === 'string' ? args[0] : (args[0] instanceof Error ? args[0].message : '');
    const errObj = args[1] instanceof Error ? args[1].message : (typeof args[1] === 'string' ? args[1] : '');
    const combined = `${msg} ${errObj}`;

    if (
      combined.includes('Could not reach Cloud Firestore backend') ||
      combined.includes('Backend didn\'t respond within 10 seconds') ||
      combined.includes('@firebase/firestore') ||
      combined.includes('INTERNAL ASSERTION FAILED') ||
      combined.includes('auth/network-request-failed') ||
      combined.includes('Social Auth Error')
    ) {
      console.warn('[Handled Auth/Network Notice]:', ...args);
      return;
    }
    originalConsoleError.apply(console, args);
  };

  window.addEventListener('error', (event) => {
    if (
      event?.message &&
      (event.message.includes('FIRESTORE') || event.message.includes('INTERNAL ASSERTION FAILED'))
    ) {
      event.preventDefault();
      console.warn('[Handled Firestore Internal State Notice]:', event.message);
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event?.reason?.message || String(event?.reason || '');
    if (reason.includes('FIRESTORE') || reason.includes('INTERNAL ASSERTION FAILED')) {
      event.preventDefault();
      console.warn('[Handled Firestore Unhandled Promise]:', reason);
    }
  });
}

const firebaseConfig = {
  apiKey: appletConfig.apiKey || import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: appletConfig.authDomain || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: appletConfig.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: appletConfig.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: appletConfig.messagingSenderId || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: appletConfig.appId || import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: appletConfig.measurementId || import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Set persistence to local
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Auth persistence error:", error);
});

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
export const githubProvider = new GithubAuthProvider();
githubProvider.setCustomParameters({
  allow_signup: 'true'
});

const databaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID || appletConfig.firestoreDatabaseId;

export const db = initializeFirestore(
  app,
  {},
  databaseId && databaseId !== '(default)' ? databaseId : undefined
);

export const storage = getStorage(app);

