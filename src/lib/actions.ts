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
    
    // Handle different image URL types for projects
    const projectsWithHandledImages = updatedData.projects.map(p => {
        const isDataUri = p.imageUrl.startsWith('data:image');
        const isPlaceholderFunc = p.imageUrl.startsWith('getImageData');

        if (isDataUri || isPlaceholderFunc) {
            // It's a data URI or already a function call, keep it as is.
             return { ...p, imageUrl: `'${p.imageUrl}'` };
        }
        
        // It's likely a placeholder ID or an external URL
        const placeholder = PlaceHolderImages.find(img => img.id === p.id.replace('proj-', 'project'));
        if (placeholder && p.imageUrl === placeholder.imageUrl) {
             return {
                ...p,
                imageUrl: `getImageData('${placeholder.id}').url`,
                imageHint: `getImageData('${placeholder.id}').hint`
             };
        }

        // It's a normal URL, so stringify it.
        return { ...p, imageUrl: `'${p.imageUrl}'` };
    });
    
    let profilePhotoUrlString = `'${updatedData.profilePhotoUrl}'`;
    let profilePhotoHintString = `'${updatedData.profilePhotoHint}'`;

    if (!updatedData.profilePhotoUrl.startsWith('data:image')) {
        profilePhotoUrlString = `getImageData('profilePhoto').url`;
        profilePhotoHintString = `getImageData('profilePhoto').hint`;
    }
    
    // We need to use placeholders before JSON.stringify to avoid escaping issues
    const finalData = { ...updatedData };
    
    let dataString = JSON.stringify(finalData, (key, value) => {
        if (key === 'imageUrl' || key === 'imageHint') return `%%${key}%%`;
        return value;
    }, 2);

    dataString = dataString.replace(/"%%profilePhotoUrl%%"/g, profilePhotoUrlString);
    dataString = dataString.replace(/"%%profilePhotoHint%%"/g, profilePhotoHintString);

    updatedData.projects.forEach((p, index) => {
        const handledProject = projectsWithHandledImages[index];
        dataString = dataString.replace('"%%imageUrl%%"', handledProject.imageUrl);
        // Special handling for imageHint to prevent double replacement if it's also a placeholder
        if(handledProject.imageHint.startsWith('getImageData')) {
             dataString = dataString.replace('"%%imageHint%%"', handledProject.imageHint);
        } else {
             dataString = dataString.replace('"%%imageHint%%"', `'${p.imageHint}'`);
        }
    });

    const fileContent = `${fileHeader}\n\nexport const portfolioData: PortfolioData = ${dataString};\n`;
    
    await fs.writeFile(filePath, fileContent, 'utf-8');
}


async function updatePortfolioData(newData: Partial<PortfolioData>) {
  try {
    const updatedData: PortfolioData = { 
        ...currentData, 
        ...newData,
        experiences: newData.experiences || currentData.experiences,
        educations: newData.educations || currentData.educations,
        projects: newData.projects || currentData.projects,
        socialLinks: currentData.socialLinks,
        contactMessages: currentData.contactMessages,
        cvUrl: currentData.cvUrl,
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
