import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';

import { getFirebaseConfig } from './config';
import { FirebaseProvider, useFirebase, useFirebaseApp, useAuth, useFirestore } from './provider';
import { FirebaseClientProvider } from './client-provider';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';
import { useUser } from './auth/use-user';


let firebaseApp: FirebaseApp | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;

function initializeFirebase() {
  if (firebaseApp) {
    return { firebaseApp, auth, firestore };
  }

  const firebaseConfig = getFirebaseConfig();
  if (!firebaseConfig) {
    throw new Error('Firebase config not found');
  }

  if (getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);

    if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR) {
        connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
        connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
    }
  }

  return { firebaseApp, auth, firestore };
}

export { 
    initializeFirebase, 
    FirebaseProvider, 
    FirebaseClientProvider, 
    useCollection, 
    useDoc,
    useUser,
    useFirebase, 
    useFirebaseApp, 
    useAuth, 
    useFirestore 
};
