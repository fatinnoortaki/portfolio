'use server';

import { initializeApp, getApps, getApp, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import serviceAccount from '../../service-account.json';

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

  // Type assertion to satisfy the 'cert' function's expectation.
  const serviceAccountParams = {
    type: serviceAccount.type,
    projectId: serviceAccount.project_id,
    privateKeyId: serviceAccount.private_key_id,
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
    clientId: serviceAccount.client_id,
    authUri: serviceAccount.auth_uri,
    tokenUri: serviceAccount.token_uri,
    authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
    clientC509CertUrl: serviceAccount.client_x509_cert_url,
  };

  const app = initializeApp({
    credential: cert(serviceAccountParams),
  });
  
  return {
    app,
    auth: getAuth(app),
    firestore: getFirestore(app),
  };
}

export const adminDb = getAdminApp().firestore;
export const adminAuth = getAdminApp().auth;
