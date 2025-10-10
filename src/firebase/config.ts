
// It's better to return null and handle it gracefully than to throw an error.
// This prevents the entire app from crashing if the .env file is not set up.
export function getFirebaseConfig() {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  // Check if all required environment variables are present
  if (Object.values(firebaseConfig).some(value => !value)) {
    console.warn("Firebase config is missing or incomplete. Please check your .env file.");
    return null;
  }

  return firebaseConfig;
}
