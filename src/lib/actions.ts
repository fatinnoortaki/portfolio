'use server';

import { revalidatePath } from 'next/cache';
import { adminDb } from '@/firebase/server';
import { contactSchema, type ContactFormState } from './definitions';

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
    const sentAt = new Date();
    await adminDb.collection('contactMessages').add({
      ...validatedFields.data,
      sentAt,
    });
    revalidatePath('/admin');
    return { message: 'Thank you for your message! I will get back to you soon.' };
  } catch (error: any) {
    console.error("Server authentication failed:", error);
    // This custom error message is more informative for debugging the environment.
    return { 
        message: `Server authentication failed using Application Default Credentials. Please check the environment configuration. Original error: ${error.message}`,
        errors: {},
    };
  }
}
