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
  name: 'Alex Doe',
  tagline: 'Full-Stack Developer & Creative Technologist',
  bio: "I'm a passionate developer with a knack for building beautiful, user-friendly web applications. With a strong foundation in both front-end and back-end technologies, I enjoy bringing ideas to life from concept to deployment. My goal is to create software that is not only functional but also delightful to use.",
  profilePhotoUrl: getImageData('profilePhoto').url,
  profilePhotoHint: getImageData('profilePhoto').hint,
  funFacts: [
    { icon: "☕", text: "Fueled by coffee" },
    { icon: "⛰️", text: "Mountain hiking enthusiast" },
    { icon: "🎵", text: "Aspiring musician" },
    { icon: "🎨", text: "Loves digital art" },
  ],
  socialLinks: [
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'LinkedIn', url: 'https://linkedin.com' },
    { name: 'Twitter', url: 'https://twitter.com' },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Project Alpha',
      description: 'A web-based project management tool designed for small teams. It features a Kanban board, task tracking, and real-time collaboration.',
      techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Firebase'],
      imageUrl: getImageData('project1').url,
      imageHint: getImageData('project1').hint,
      liveUrl: '#',
      repoUrl: '#',
      featured: true,
    },
    {
      id: 'proj-2',
      title: 'E-commerce Platform',
      description: 'A fully-featured e-commerce site with a custom CMS for product management, order processing, and customer accounts.',
      techStack: ['React', 'Node.js', 'Express', 'MongoDB'],
      imageUrl: getImageData('project2').url,
      imageHint: getImageData('project2').hint,
      liveUrl: '#',
      repoUrl: '#',
      featured: true,
    },
    {
      id: 'proj-3',
      title: 'Data Visualizer',
      description: 'An interactive dashboard for visualizing complex datasets. Built with D3.js for custom charts and graphs.',
      techStack: ['Svelte', 'D3.js', 'Python', 'Flask'],
      imageUrl: getImageData('project3').url,
      imageHint: getImageData('project3').hint,
      liveUrl: '#',
    },
    {
      id: 'proj-4',
      title: 'Mobile Banking App',
      description: 'A concept mobile app for a modern banking experience, focusing on intuitive UI and security.',
      techStack: ['React Native', 'Firebase Auth', 'Firestore'],
      imageUrl: getImageData('project4').url,
      imageHint: getImageData('project4').hint,
      repoUrl: '#',
    },
  ],
  experiences: [
    {
      id: 'exp-1',
      company: 'Tech Solutions Inc.',
      role: 'Senior Software Engineer',
      period: '2020 - Present',
      description: 'Led development of a new SaaS platform. Mentored junior developers and improved code quality across the team.',
    },
    {
      id: 'exp-2',
      company: 'Innovate Co.',
      role: 'Software Engineer',
      period: '2018 - 2020',
      description: 'Worked on the front-end of a major e-commerce website, improving performance and user experience.',
    },
    {
      id: 'exp-3',
      company: 'Web Wizards',
      role: 'Junior Web Developer',
      period: '2016 - 2018',
      description: 'Built and maintained websites for a variety of clients using WordPress and custom themes.',
    },
  ],
  educations: [
    {
      id: 'edu-1',
      institution: 'University of Technology',
      degree: 'M.S. in Computer Science',
      period: '2014 - 2016',
    },
    {
      id: 'edu-2',
      institution: 'State College',
      degree: 'B.S. in Information Systems',
      period: '2010 - 2014',
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
