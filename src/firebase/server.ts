import { initializeApp, getApps, getApp, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

interface AdminApp {
  app: App;
  auth: Auth;
  firestore: Firestore;
}

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function getAdminApp(): AdminApp {
  if (getApps().length) {
    const app = getApp();
    return {
      app,
      auth: getAuth(app),
      firestore: getFirestore(app),
    };
  }

  const app = initializeApp();
  
  return {
    app,
    auth: getAuth(app),
    firestore: getFirestore(app),
  };
}
