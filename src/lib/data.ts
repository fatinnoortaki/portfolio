import type { PortfolioData } from './definitions';
import { PlaceHolderImages } from './placeholder-images';

const getImageData = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  if (!image) {
    // Fallback for when an image is not found.
    return {
      url: `https://picsum.photos/seed/${id}/600/400`,
      hint: 'placeholder image'
    };
  }
  return {
    url: image.imageUrl,
    hint: image.imageHint
  };
};

export const portfolioData: PortfolioData = {
  name: "Fatin Noor Taki",
  tagline: "Agriculture Student & AgriTech Enthusiast",
  bio: "I'm a student from Bangladesh Agricultural University, exploring sustainable farming, crop science, and innovative agricultural technologies. I love learning, experimenting, and sharing knowledge, and I'm passionate about applying data science and ML in the agricultural field (AgriTech).",
  profilePhotoUrl: getImageData('profilePhoto').url,
  profilePhotoHint: getImageData('profilePhoto').hint,
  funFacts: [
    { icon: "🔬", text: "Conducting research on hydroponics and vertical farming." },
    { icon: "🌱", text: "Passionate about sustainable agriculture and food security." },
    { icon: "🤖", text: "Exploring AI applications for crop disease detection." },
    { icon: "📈", text: "Analyzing agricultural data to optimize crop yields." },
  ],
  socialLinks: [
    { name: "GitHub", url: "https://github.com/your-username" },
    { name: "LinkedIn", url: "https://linkedin.com/in/your-username" },
    { name: "Twitter", url: "https://twitter.com/your-username" },
  ],
  projects: [
    {
      id: "1",
      title: "Crop Yield Prediction",
      description: "A machine learning model to predict crop yields based on weather patterns and soil data.",
      techStack: ["Python", "TensorFlow", "Scikit-learn"],
      imageUrl: getImageData('project1').url,
      imageHint: getImageData('project1').hint,
      liveUrl: "#",
      repoUrl: "#",
      featured: true,
    },
    {
      id: "2",
      title: "Smart Irrigation System",
      description: "An IoT-based system that automates irrigation based on real-time soil moisture levels.",
      techStack: ["Arduino", "React", "Firebase"],
      imageUrl: getImageData('project2').url,
      imageHint: getImageData('project2').hint,
      liveUrl: "#",
      repoUrl: "#",
      featured: true,
    },
    {
      id: "3",
      title: "Plant Disease Identifier",
      description: "A mobile app that uses computer vision to identify plant diseases from photos.",
      techStack: ["Flutter", "TensorFlow Lite", "Firebase"],
      imageUrl: getImageData('project3').url,
      imageHint: getImageData('project3').hint,
      liveUrl: "#",
      repoUrl: "#",
    },
    {
      id: "4",
      title: "Farm-to-Table Marketplace",
      description: "An e-commerce platform connecting local farmers directly with consumers.",
      techStack: ["Next.js", "Stripe", "PostgreSQL"],
      imageUrl: getImageData('project4').url,
      imageHint: getImageData('project4').hint,
      liveUrl: "#",
      repoUrl: "#",
    },
  ],
  experiences: [
    {
      id: "exp1",
      company: "AgriTech Innovations",
      role: "Data Science Intern",
      period: "Summer 2023",
      description: "Developed and trained machine learning models for precision agriculture applications, improving crop yield forecasts by 15%.",
    },
    {
      id: "exp2",
      company: "BAU Research Lab",
      role: "Research Assistant",
      period: "2022 - Present",
      description: "Assisting in research projects focused on soil health and sustainable farming practices. Published a paper on compost analysis.",
    },
  ],
  educations: [
    {
      id: "edu1",
      institution: "Bangladesh Agricultural University",
      degree: "B.Sc. in Agriculture",
      period: "2020 - 2024",
    },
    {
      id: "edu2",
      institution: "Online Learning Platforms",
      degree: "Certifications in Data Science & ML",
      period: "Ongoing",
    },
  ],
  cvUrl: "/Fatin_Noor_Taki_CV.pdf",
};
