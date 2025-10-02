import { initializeApp, getApps, getApp, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

interface AdminApp {
  app: App;
  auth: Auth;
  firestore: Firestore;
}

function getAdminApp(): AdminApp {
  if (getApps().length) {
    const app = getApp();
    return {
      app,
      auth: getAuth(app),
      firestore: getFirestore(app),
    };
  }

  // When running in a Google Cloud environment, the SDK can automatically
  // discover the service account credentials.
  const app = initializeApp();
  
  return {
    app,
    auth: getAuth(app),
    firestore: getFirestore(app),
  };
}

export const adminDb = getAdminApp().firestore;
export const adminAuth = getAdminApp().auth;
