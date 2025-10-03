import { z } from 'zod';

export const contactSchema = z.object({
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

export type SocialLink = {
  name: 'GitHub' | 'LinkedIn' | 'Twitter';
  url: string;
};

export type FunFact = {
  icon: string;
  text: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  imageUrl: string;
  imageHint: string;
  liveUrl?: string;
  repoUrl?: string;
  featured?: boolean;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
};

export type Education = {
  id:string;
  institution: string;
  degree: string;
  period: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  sentAt: Date;
};

export type PortfolioData = {
  name: string;
  logo: string;
  favicon: string;
  tagline: string;
  bio: string;
  profilePhotoUrl: string;
  profilePhotoHint: string;
  funFacts: FunFact[];
  socialLinks: SocialLink[];
  projects: Project[];
  experiences: Experience[];
  educations: Education[];
  cvUrl: string;
};
