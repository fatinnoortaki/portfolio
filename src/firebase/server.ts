import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let app: App;

if (!getApps().length) {
  // Initialize without arguments to use Application Default Credentials
  app = initializeApp();
} else {
  app = getApps()[0];
}

const adminDb: Firestore = getFirestore(app);
const adminAuth: Auth = getAuth(app);

export { adminDb, adminAuth };
