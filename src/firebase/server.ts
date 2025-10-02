import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import serviceAccount from '../../service-account.json';

let app: App;

if (!getApps().length) {
  app = initializeApp({
    // The type assertion is necessary because the `cert` function expects a specific format
    // that doesn't perfectly align with the inferred type from the JSON import.
    credential: cert(serviceAccount as any),
  });
} else {
  app = getApps()[0];
}

const adminDb: Firestore = getFirestore(app);
const adminAuth: Auth = getAuth(app);

export { adminDb, adminAuth };
