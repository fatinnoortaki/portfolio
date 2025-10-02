import type { PortfolioData } from './definitions';
import { PlaceHolderImages } from './placeholder-images';

const getImageData = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  return {
    url: image?.imageUrl || `https://picsum.photos/seed/error/600/400`,
    hint: image?.imageHint || ''
  };
};

export const portfolioData: PortfolioData = {
  name: 'A. B. Choudhury',
  tagline: 'AgriTech Innovator & Data Science Enthusiast',
  bio: "I'm a student from Bangladesh Agricultural University, exploring sustainable farming, crop science, and innovative agricultural technologies. I love learning, experimenting, and sharing knowledge, and I'm passionate about applying data science and ML in the agricultural field (AgriTech).",
  profilePhotoUrl: getImageData('profilePhoto').url,
  profilePhotoHint: getImageData('profilePhoto').hint,
  funFacts: [
    { icon: "🌱", text: "Passionate about sustainable farming" },
    { icon: "🔬", text: "Loves experimenting with crop science" },
    { icon: "🤖", text: "Enthusiast of AgriTech innovations" },
    { icon: "📈", text: "Applies data science to agriculture" },
  ],
  socialLinks: [
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'LinkedIn', url: 'https://linkedin.com' },
    { name: 'Twitter', url: 'https://twitter.com' },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Crop Yield Prediction Model',
      description: 'A machine learning model to predict crop yields based on historical data, weather patterns, and soil types, helping farmers make informed decisions.',
      techStack: ['Python', 'Scikit-learn', 'Pandas', 'Jupyter'],
      imageUrl: getImageData('project1').url,
      imageHint: getImageData('project1').hint,
      liveUrl: '#',
      repoUrl: '#',
      featured: true,
    },
    {
      id: 'proj-2',
      title: 'Smart Irrigation System UI',
      description: 'A web-based dashboard for monitoring and controlling an IoT-based smart irrigation system, optimizing water usage for different crops.',
      techStack: ['React', 'Firebase', 'Chart.js', 'Tailwind CSS'],
      imageUrl: getImageData('project2').url,
      imageHint: getImageData('project2').hint,
      liveUrl: '#',
      repoUrl: '#',
      featured: true,
    },
    {
      id: 'proj-3',
      title: 'Pest Detection App',
      description: 'A mobile app concept that uses computer vision to identify crop pests from images, providing instant recommendations for treatment.',
      techStack: ['React Native', 'TensorFlow Lite', 'Firebase'],
      imageUrl: getImageData('project3').url,
      imageHint: getImageData('project3').hint,
      liveUrl: '#',
    },
    {
      id: 'proj-4',
      title: 'Farmer Community Platform',
      description: 'A social platform for farmers to share knowledge, ask questions, and sell produce directly to consumers.',
      techStack: ['Next.js', 'Firestore', 'Vercel'],
      imageUrl: getImageData('project4').url,
      imageHint: getImageData('project4').hint,
      repoUrl: '#',
    },
  ],
  experiences: [
    {
      id: 'exp-1',
      company: 'Ag-Data Solutions',
      role: 'Data Science Intern',
      period: 'Summer 2023',
      description: 'Analyzed agricultural datasets to identify trends in crop performance and resource management. Developed a prototype for a soil health monitoring dashboard.',
    },
    {
      id: 'exp-2',
      company: 'University Research Lab',
      role: 'Research Assistant',
      period: '2022 - 2023',
      description: 'Assisted in a study on drought-resistant crop varieties. Responsible for data collection, entry, and preliminary statistical analysis.',
    },
    {
      id: 'exp-3',
      company: 'Local Farm Co-op',
      role: 'Volunteer',
      period: '2021',
      description: 'Gained hands-on experience in modern farming techniques and helped implement a new inventory tracking system.',
    },
  ],
  educations: [
    {
      id: 'edu-1',
      institution: 'Bangladesh Agricultural University',
      degree: 'B.S. in Agriculture',
      period: '2020 - Present',
    },
    {
      id: 'edu-2',
      institution: 'Dhaka College',
      degree: 'Higher Secondary Certificate, Science',
      period: '2018 - 2020',
    },
  ],
  cvUrl: '#',
};


// In a real application, these would be fetched from a database.
export const contactMessages = [
    {
        id: 'msg-1',
        name: 'Jane Smith',
        email: 'jane@example.com',
        message: 'Loved your portfolio! Let\'s connect.',
        timestamp: new Date('2024-05-20T10:00:00Z'),
    },
    {
        id: 'msg-2',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        message: 'I have a project opportunity I\'d like to discuss.',
        timestamp: new Date('2024-05-19T15:30:00Z'),
    },
]
