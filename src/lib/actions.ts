'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import type { PortfolioData, FunFact, Experience, Education } from './definitions';
import { portfolioData } from './data';

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

async function updatePortfolioData(newData: Partial<PortfolioData>) {
  try {
    const updatedData: PortfolioData = { ...portfolioData, ...newData };
    
    // This is a simplified approach to show data persistence.
    // In a real-world application, you would update a database.
    // Here we are modifying the `data.ts` file directly.
    const filePath = path.join(process.cwd(), 'src', 'lib', 'data.ts');
    
    // We need to read the placeholder images logic to keep it in the file.
    const fileHeader = `import type { PortfolioData } from './definitions';
import { PlaceHolderImages } from './placeholder-images';

const getImageData = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  return {
    url: image?.imageUrl || \`https://picsum.photos/seed/error/600/400\`,
    hint: image?.imageHint || ''
  };
};`;
    
    const dataObjectString = JSON.stringify(updatedData, (key, value) => {
      // The profilePhotoUrl and imageUrl are dynamically generated, so we need to reconstruct the function call.
      if (key === 'profilePhotoUrl') {
        return `getImageData('profilePhoto').url`;
      }
      if (key === 'profilePhotoHint') {
        return `getImageData('profilePhoto').hint`;
      }
      const projectMatch = updatedData.projects.find(p => p.imageUrl === value);
      if (key === 'imageUrl' && projectMatch) {
        return `getImageData('${projectMatch.id.replace('proj-', 'project')}').url`;
      }
       if (key === 'imageHint' && projectMatch) {
        return `getImageData('${projectMatch.id.replace('proj-', 'project')}').hint`;
      }
      return value;
    }, 2)
    // Replace string representations of function calls with the actual function calls
    .replace(/"getImageData\((.*?)\).url"/g, "getImageData($1).url")
    .replace(/"getImageData\((.*?)\).hint"/g, "getImageData($1).hint");


    const fileContent = `${fileHeader}\n\nexport const portfolioData: PortfolioData = ${dataObjectString};\n\n\n// In a real application, these would be fetched from a database.\nexport const contactMessages = ${JSON.stringify(portfolioData.contactMessages, null, 2)}`;
    
    await fs.writeFile(filePath, fileContent, 'utf-8');

    return { success: true, message: "Portfolio data updated successfully." };

  } catch (error) {
    console.error("Failed to update portfolio data:", error);
    return { success: false, message: "Failed to update portfolio data." };
  }
}

export async function saveBio(bio: string, funFacts: FunFact[]) {
    return await updatePortfolioData({ bio, funFacts });
}

export async function saveResume(experiences: Experience[], educations: Education[]) {
    return await updatePortfolioData({ experiences, educations });
}
