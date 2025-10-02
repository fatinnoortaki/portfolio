'use client';

import { doc, setDoc, writeBatch, collection, getDocs, query, where, type Firestore, deleteDoc } from 'firebase/firestore';
import type { FunFact, Project, Experience, Education } from './definitions';

export async function saveBioClient(firestore: Firestore, bio: string, funFacts: FunFact[], photoUrl: string) {
    if (!firestore) {
        throw new Error("Firestore is not initialized.");
    }
    try {
        const aboutRef = doc(firestore, 'about', 'main');
        await setDoc(aboutRef, { bio, funFacts, photoUrl }, { merge: true });
    } catch (error) {
        console.error("Error saving bio on client:", error);
        throw error;
    }
}

export async function saveProjectsClient(firestore: Firestore, projects: Project[]) {
    if (!firestore) throw new Error("Firestore not initialized");

    const batch = writeBatch(firestore);
    const projectsCol = collection(firestore, 'projects');

    // Delete existing projects
    const snapshot = await getDocs(projectsCol);
    snapshot.docs.forEach(doc => batch.delete(doc.ref));

    // Add new projects
    projects.forEach(project => {
        const projectRef = doc(firestore, 'projects', project.id);
        batch.set(projectRef, project);
    });

    await batch.commit();
}


export async function saveResumeClient(firestore: Firestore, experiences: Experience[], educations: Education[]) {
    if (!firestore) throw new Error("Firestore not initialized");

    const batch = writeBatch(firestore);
    const resumeCol = collection(firestore, 'resumeEntries');

    // Clear existing experience entries
    const expSnapshot = await getDocs(query(resumeCol, where('type', '==', 'experience')));
    expSnapshot.docs.forEach(doc => batch.delete(doc.ref));

    // Clear existing education entries
    const eduSnapshot = await getDocs(query(resumeCol, where('type', '==', 'education')));
    eduSnapshot.docs.forEach(doc => batch.delete(doc.ref));

    // Add new entries
    experiences.forEach(exp => {
        const docRef = doc(firestore, 'resumeEntries', exp.id);
        batch.set(docRef, { ...exp, type: 'experience' });
    });
    educations.forEach(edu => {
        const docRef = doc(firestore, 'resumeEntries', edu.id);
        batch.set(docRef, { ...edu, type: 'education' });
    });

    await batch.commit();
}

export async function toggleAdminRoleClient(firestore: Firestore, uid: string, isAdmin: boolean) {
    if (!firestore) throw new Error("Firestore not initialized");
    
    const roleRef = doc(firestore, 'roles_admin', uid);
    if (isAdmin) {
        await setDoc(roleRef, {});
    } else {
        await deleteDoc(roleRef);
    }
}

export async function createUserClient(firestore: Firestore, uid: string, email: string | null) {
    if (!firestore) throw new Error("Firestore not initialized");
    
    const userRef = doc(firestore, 'users', uid);
    // We can use set with merge to avoid overwriting if the user already exists
    // from a different sign-up flow.
    await setDoc(userRef, { uid, email }, { merge: true });
}
