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

export type PortfolioData = {
  name: string;
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
  contactMessages: ContactMessage[];
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: Date;
};
