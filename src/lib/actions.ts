'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getAdminApp } from '@/firebase/server';
import { doc, setDoc, deleteDoc, writeBatch, getDocs, collection } from 'firebase/firestore';
import type { FunFact, Project, Experience, Education } from './definitions';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

export type ContactFormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
};

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
) {
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
    const { firestore } = getAdminApp();
    const messageId = `msg-${Date.now()}`;
    await setDoc(doc(firestore, 'contactMessages', messageId), {
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
    const { firestore } = getAdminApp();
    const roleRef = doc(firestore, 'roles_admin', uid);

    if (isAdmin) {
      await setDoc(roleRef, {});
    } else {
      await deleteDoc(roleRef);
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
        const { firestore } = getAdminApp();
        const aboutRef = doc(firestore, 'about', 'main');
        await setDoc(aboutRef, { bio, funFacts, photoUrl }, { merge: true });
        revalidatePath('/');
        revalidatePath('/admin');
        return { success: true, message: 'Bio updated successfully.' };
    } catch (error) {
        console.error('Error saving bio:', error);
        return { success: false, message: 'Failed to save bio.' };
    }
}


export async function saveProjects(projects: Project[]) {
    try {
        const { firestore } = getAdminApp();
        const batch = writeBatch(firestore);
        projects.forEach(project => {
            const projectRef = doc(firestore, 'projects', project.id);
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
        const { firestore } = getAdminApp();
        const batch = writeBatch(firestore);

        experiences.forEach(exp => {
            const docRef = doc(firestore, 'resumeEntries', exp.id);
            batch.set(docRef, {...exp, type: 'experience'});
        });
        educations.forEach(edu => {
            const docRef = doc(firestore, 'resumeEntries', edu.id);
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
    const { firestore } = getAdminApp();
    const adminRolesQuery = await getDocs(collection(firestore, 'roles_admin'));
    const hasAdmins = !adminRolesQuery.empty;

    // Save user info to Firestore
    await setDoc(doc(firestore, 'users', uid), {
      uid: uid,
      email: email,
    });

    // If no admins exist, make this new user an admin
    if (!hasAdmins) {
      await setDoc(doc(firestore, 'roles_admin', uid), {});
      return { success: true, isAdmin: true, message: 'Admin account created!' };
    }
    
    return { success: true, isAdmin: false, message: 'User account created.' };

  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message };
  }
}