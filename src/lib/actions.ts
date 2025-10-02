'use server';

import { revalidatePath } from 'next/cache';
import { adminDb } from '@/firebase/server';
import { contactSchema, type ContactFormState, type FunFact, type Project, type Experience, type Education, type UserProfile } from './definitions';

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const validatedFields = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check your input.',
    };
  }

  try {
    await adminDb.collection('contactMessages').add({
      ...validatedFields.data,
      sentAt: new Date(),
    });
    revalidatePath('/admin');
    return { message: 'Thank you for your message! I will get back to you soon.' };
  } catch (error) {
    return { message: 'Failed to send message.' };
  }
}

export async function toggleAdminRole(uid: string, isAdmin: boolean) {
  try {
    const roleRef = adminDb.collection('roles_admin').doc(uid);

    if (isAdmin) {
      await roleRef.set({});
    } else {
      await roleRef.delete();
    }
    revalidatePath('/admin');
    return { success: true, message: 'User role updated.' };
  } catch (error) {
    console.error('Error toggling admin role:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message };
  }
}

export async function saveBio(bio: string, funFacts: FunFact[], photoUrl: string) {
    try {
        await adminDb.collection('about').doc('main').set({ bio, funFacts, photoUrl }, { merge: true });
        revalidatePath('/');
        revalidatePath('/admin');
        return { success: true, message: 'Bio updated successfully.' };
    } catch (error: any) {
        console.error('Full error object in saveBio:', error);
        const message = error.message || 'An unknown error occurred.';
        return { success: false, message: `Failed to save bio: ${message}` };
    }
}


export async function saveProjects(projects: Project[]) {
    try {
        const batch = adminDb.batch();
        
        const snapshot = await adminDb.collection('projects').get();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));

        projects.forEach(project => {
            const projectRef = adminDb.collection('projects').doc(project.id);
            batch.set(projectRef, project);
        });
        
        await batch.commit();

        revalidatePath('/');
        revalidatePath('/admin');
        return { success: true, message: 'Projects saved successfully.' };
    } catch (error) {
        console.error('Error saving projects:', error);
        return { success: false, message: 'Failed to save projects.' };
    }
}


export async function saveResume(experiences: Experience[], educations: Education[]) {
    try {
        const batch = adminDb.batch();

        const expSnapshot = await adminDb.collection('resumeEntries').where('type', '==', 'experience').get();
        expSnapshot.docs.forEach(doc => batch.delete(doc.ref));

        const eduSnapshot = await adminDb.collection('resumeEntries').where('type', '==', 'education').get();
        eduSnapshot.docs.forEach(doc => batch.delete(doc.ref));

        experiences.forEach(exp => {
            const docRef = adminDb.collection('resumeEntries').doc(exp.id);
            batch.set(docRef, {...exp, type: 'experience'});
        });
        educations.forEach(edu => {
            const docRef = adminDb.collection('resumeEntries').doc(edu.id);
            batch.set(docRef, {...edu, type: 'education'});
        });
        
        await batch.commit();
        revalidatePath('/');
        revalidatePath('/admin');
        return { success: true, message: 'Resume saved successfully.' };
    } catch (error) {
        console.error('Error saving resume:', error);
        return { success: false, message: 'Failed to save resume.' };
    }
}

export async function createUser(uid: string, email: string | null) {
  try {
    const userRef = adminDb.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
       const newUser: UserProfile = { uid, email };
       await userRef.set(newUser);
    }
    
    revalidatePath('/admin');
    return { success: true, message: 'User account processed.' };
  } catch (error) {
    console.error('Error creating user record:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message };
  }
}
