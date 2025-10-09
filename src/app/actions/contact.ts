
'use server';

import { z } from 'zod';
import { contactSchema, type ContactFormState } from '@/lib/definitions';
import { saveContactMessage } from '@/ai/flows/contact-flow';

export async function sendContactMessage(
  values: z.infer<typeof contactSchema>
): Promise<ContactFormState> {
  console.log('Received contact form submission:', values);
  const validatedFields = contactSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error('Validation failed:', validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Send Message.',
    };
  }

  const { name, email, message } = validatedFields.data;

  try {
    console.log('Attempting to send email...');
    const result = await saveContactMessage({ name, email, message });
    console.log('Email send result:', result);
    return { message: 'Message sent successfully!' };
  } catch (error) {
    console.error('Error sending message via flow:', error);
    return { message: 'Error: Failed to Send Message.' };
  }
}
