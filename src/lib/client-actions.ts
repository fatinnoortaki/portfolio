'use client';

import { doc, setDoc, type Firestore } from 'firebase/firestore';
import type { FunFact } from './definitions';

export async function saveBioClient(firestore: Firestore, bio: string, funFacts: FunFact[], photoUrl: string) {
    if (!firestore) {
        throw new Error("Firestore is not initialized.");
    }
    try {
        const aboutRef = doc(firestore, 'about', 'main');
        await setDoc(aboutRef, { bio, funFacts, photoUrl }, { merge: true });
    } catch (error) {
        console.error("Error saving bio on client:", error);
        // Re-throw the error to be caught by the calling component
        throw error;
    }
}
