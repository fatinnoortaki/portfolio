'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// This is a mock import. In a real app, you'd get the admin app instance.
import { getAdminApp } from '@/firebase/server'; 
import { doc, setDoc, deleteDoc } from 'firebase/firestore';


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
  
  // Here you would typically save the data to a database or send an email.
  // For this example, we'll just log it to the console.
  console.log('New contact form submission:');
  console.log(validatedFields.data);

  // In a real app, you'd likely want to append this message to a list
  // For this demo, we'll just return a success message
  return { message: 'Thank you for your message! I will get back to you soon.' };
}

export async function toggleAdminRole(uid: string, isAdmin: boolean) {
  try {
    const { firestore } = getAdminApp();
    const roleRef = doc(firestore, 'roles_admin', uid);

    if (isAdmin) {
      // Add the user to the admin roles
      await setDoc(roleRef, {});
    } else {
      // Remove the user from admin roles
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
