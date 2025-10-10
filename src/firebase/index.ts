import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

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
  
  // If config is not found, return undefined for all services
  if (!firebaseConfig) {
    console.warn("Firebase config not found, Firebase will not be initialized.");
    return { firebaseApp: undefined, auth: undefined, firestore: undefined };
  }

  if (getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
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
