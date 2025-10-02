import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import serviceAccount from '../../service-account.json';

interface AdminApp {
  app: App;
  auth: Auth;
  firestore: Firestore;
}

// Cached AdminApp instance
let adminApp: AdminApp | null = null;

function getAdminApp(): AdminApp {
  // If the instance already exists, return it
  if (adminApp) {
    return adminApp;
  }

  // If no apps are initialized, create a new one.
  if (!getApps().length) {
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

    const newApp = initializeApp({
      credential: cert(serviceAccountParams),
    });

    // Create and cache the new instance
    adminApp = {
      app: newApp,
      auth: getAuth(newApp),
      firestore: getFirestore(newApp),
    };

    return adminApp;
  }

  // An app is already initialized, but our singleton wasn't.
  // This can happen in some server environments.
  // We'll use the existing app to create our instance.
  const existingApp = getApps()[0];
  adminApp = {
    app: existingApp,
    auth: getAuth(existingApp),
    firestore: getFirestore(existingApp),
  };

  return adminApp;
}

export const adminDb = getAdminApp().firestore;
export const adminAuth = getAdminApp().auth;
