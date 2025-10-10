
'use client';
import { useEffect } from 'react';
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { PortfolioSection } from "@/components/portfolio-section";
import { ResumeSection } from "@/components/resume-section";
import { SocialsSection } from "@/components/socials-section";
import { ContactSection } from "@/components/contact-section";
import { useActiveSectionContext } from '@/contexts/active-section-context';

const sections = ["hero", "about", "portfolio", "resume", "socials", "contact"];

export default function HomePage() {
  const { setActiveId } = useActiveSectionContext();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            entry.target.classList.add('section-visible');
          }
        });
      },
      { rootMargin: '-20% 0px -20% 0px' }
    );

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [setActiveId]);


  return (
    <>
      <div id="hero"><HeroSection /></div>
      <div id="about"><AboutSection /></div>
      <div id="portfolio"><PortfolioSection /></div>
      <div id="resume"><ResumeSection /></div>
      <div id="socials"><SocialsSection /></div>
      <div id="contact"><ContactSection /></div>
    </>
  );
}
