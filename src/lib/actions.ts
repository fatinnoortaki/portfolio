'use server';

import { z } from 'zod';
import { contactSchema, type ContactFormState } from './definitions';

// This is a placeholder for a real email sending service or database call.
// In a real app, you would integrate with something like Resend, SendGrid, or save to a database.
async function sendContactMessage(data: z.infer<typeof contactSchema>) {
  console.log('--- New Contact Message ---');
  console.log('Name:', data.name);
  console.log('Email:', data.email);
  console.log('Message:', data.message);
  console.log('---------------------------');
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  // In a real scenario, this is where you'd handle potential errors from your email/DB service.
  // For this example, we'll assume it always succeeds.
}


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
    await sendContactMessage(validatedFields.data);
    return { message: 'Thank you for your message! I will get back to you soon.' };
  } catch (error: any) {
    console.error("Failed to send contact message:", error);
    return { 
        message: `An unexpected error occurred. Please try again later.`,
        errors: {},
    };
  }
}
