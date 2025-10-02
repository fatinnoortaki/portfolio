'use server';
import { config } from 'dotenv';
config();

import { initializeApp, getApps, getApp, cert, type App, type ServiceAccount } from 'firebase-admin/app';
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

  let serviceAccount: ServiceAccount | undefined;
  try {
    if (process.env.SERVICE_ACCOUNT) {
      serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);
    }
  } catch (e) {
    console.error('Failed to parse SERVICE_ACCOUNT environment variable.', e);
  }

  const app = initializeApp({
    credential: serviceAccount ? cert(serviceAccount) : undefined,
  });
  
  return {
    app,
    auth: getAuth(app),
    firestore: getFirestore(app),
  };
}

export const adminDb = getAdminApp().firestore;
export const adminAuth = getAdminApp().auth;
