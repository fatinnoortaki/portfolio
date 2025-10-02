'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import type { PortfolioData, FunFact, Experience, Education, Project } from './definitions';
import { portfolioData as currentData } from './data';
import { PlaceHolderImages } from './placeholder-images';


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

async function updatePortfolioDataFile(updatedData: PortfolioData) {
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
    
    // We need to handle Data URIs for uploaded images
    const projectsWithHandledImages = updatedData.projects.map(p => {
        if (p.imageUrl.startsWith('data:image')) {
            // In a real app, you'd upload this to a storage bucket and get a URL.
            // For this demo, we'll keep the data URI.
            return p;
        }
        // It's a placeholder, reconstruct the function call
        const placeholderId = p.id.replace('proj-', 'project');
        return {
            ...p,
            imageUrl: `getImageData('${placeholderId}').url`,
            imageHint: `getImageData('${placeholderId}').hint`
        };
    });
    
    let profilePhotoUrlString = `'${updatedData.profilePhotoUrl}'`;
    let profilePhotoHintString = `'${updatedData.profilePhotoHint}'`;

    if (updatedData.profilePhotoUrl.startsWith('data:image')) {
        profilePhotoUrlString = `'${updatedData.profilePhotoUrl}'`;
    } else {
        profilePhotoUrlString = `getImageData('profilePhoto').url`;
        profilePhotoHintString = `getImageData('profilePhoto').hint`;
    }

    const finalData = {
        ...updatedData,
        profilePhotoUrl: 'PROFILE_PHOTO_URL_PLACEHOLDER',
        profilePhotoHint: 'PROFILE_PHOTO_HINT_PLACEHOLDER',
        projects: projectsWithHandledImages.map(p => ({
            ...p,
            imageUrl: p.imageUrl.startsWith('data:image') ? p.imageUrl : 'IMAGE_URL_PLACEHOLDER',
            imageHint: p.imageUrl.startsWith('data:image') ? p.imageHint : 'IMAGE_HINT_PLACEHOLDER',
        }))
    };

    let dataObjectString = JSON.stringify(finalData, null, 2)
        .replace(`"PROFILE_PHOTO_URL_PLACEHOLDER"`, profilePhotoUrlString)
        .replace(`"PROFILE_PHOTO_HINT_PLACEHOLDER"`, profilePhotoHintString);

    // This is getting complex, but we need to put back the function calls for placeholders
    finalData.projects.forEach((p, index) => {
        if (!p.imageUrl.startsWith('data:image')) {
            const placeholderId = updatedData.projects[index].id.replace('proj-', 'project');
            dataObjectString = dataObjectString.replace(`"IMAGE_URL_PLACEHOLDER"`, `getImageData('${placeholderId}').url`);
            dataObjectString = dataObjectString.replace(`"IMAGE_HINT_PLACEHOLDER"`, `getImageData('${placeholderId}').hint`);
        }
    });

    // Clean up any remaining placeholders if a project was removed
    dataObjectString = dataObjectString.replace(/"IMAGE_URL_PLACEHOLDER",/g, "");
    dataObjectString = dataObjectString.replace(/"IMAGE_HINT_PLACEHOLDER",/g, "");


    const fileContent = `${fileHeader}\n\nexport const portfolioData: PortfolioData = ${dataObjectString};\n`;
    
    await fs.writeFile(filePath, fileContent, 'utf-8');
}


async function updatePortfolioData(newData: Partial<PortfolioData>) {
  try {
    const updatedData: PortfolioData = { 
        ...currentData, 
        ...newData,
        // Make sure we're not overwriting the whole arrays, but merging if needed
        experiences: newData.experiences || currentData.experiences,
        educations: newData.educations || currentData.educations,
        projects: newData.projects || currentData.projects,
        socialLinks: currentData.socialLinks, // Not editable in UI yet
        contactMessages: currentData.contactMessages, // Not editable in UI
        cvUrl: currentData.cvUrl, // Not editable in UI
    };
    
    await updatePortfolioDataFile(updatedData);

    return { success: true, message: "Portfolio data updated successfully." };

  } catch (error) {
    console.error("Failed to update portfolio data:", error);
    return { success: false, message: "Failed to update portfolio data." };
  }
}

export async function saveBio(bio: string, funFacts: FunFact[], profilePhotoUrl: string) {
    return await updatePortfolioData({ bio, funFacts, profilePhotoUrl });
}

export async function saveResume(experiences: Experience[], educations: Education[]) {
    return await updatePortfolioData({ experiences, educations });
}

export async function saveProjects(projects: Project[]) {
    return await updatePortfolioData({ projects });
}
