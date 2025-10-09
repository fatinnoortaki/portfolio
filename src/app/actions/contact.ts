
'use server';

import { z } from 'zod';
import { contactSchema, type ContactFormState } from '@/lib/definitions';
import { saveContactMessage } from '@/ai/flows/contact-flow';

export async function sendContactMessage(
  values: z.infer<typeof contactSchema>
): Promise<ContactFormState> {
  const validatedFields = contactSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Send Message.',
    };
  }

  const { name, email, message } = validatedFields.data;

  try {
    // In a real app, you might send an email here.
    // For this example, we'll save it to the database.
    await saveContactMessage({ name, email, message });
    return { message: 'Message sent successfully!' };
  } catch (error) {
    console.error('Error sending message:', error);
    return { message: 'Database Error: Failed to Send Message.' };
  }
}
