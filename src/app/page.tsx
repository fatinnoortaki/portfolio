
'use client';
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { PortfolioSection } from "@/components/portfolio-section";
import { ResumeSection } from "@/components/resume-section";
import { SocialsSection } from "@/components/socials-section";
import { useScrollSpy } from "@/hooks/use-scroll-spy";

const sections = ["hero", "about", "portfolio", "resume", "socials"];

export default function HomePage() {
  useScrollSpy(sections);

  return (
    <>
      <div id="hero"><HeroSection /></div>
      <div id="about"><AboutSection /></div>
      <div id="portfolio"><PortfolioSection /></div>
      <div id="resume"><ResumeSection /></div>
      <div id="socials"><SocialsSection /></div>
    </>
  );
}
