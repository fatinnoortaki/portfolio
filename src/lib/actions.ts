'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

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

  return { message: 'Thank you for your message! I will get back to you soon.' };
}


const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    const validated = loginSchema.parse(Object.fromEntries(formData));
    console.log('Attempting login for user:', validated.email);
    // In a real app, you'd validate credentials against a database
  } catch (error) {
    if (error instanceof Error) {
      return 'Invalid credentials.';
    }
    throw error;
  }
  redirect('/admin');
}
