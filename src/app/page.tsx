
'use client';
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { PortfolioSection } from "@/components/portfolio-section";
import { ResumeSection } from "@/components/resume-section";
import { SocialsSection } from "@/components/socials-section";
import { useScrollSpy } from "@/hooks/use-scroll-spy";

const sections = ["hero", "about", "portfolio", "resume", "socials"];

export default function HomePage() {
  const { activeId, refs } = useScrollSpy(sections);

  return (
    <>
      <div ref={refs.hero}><HeroSection /></div>
      <div ref={refs.about}><AboutSection /></div>
      <div ref={refs.portfolio}><PortfolioSection /></div>
      <div ref={refs.resume}><ResumeSection /></div>
      <div ref={refs.socials}><SocialsSection /></div>
    </>
  );
}
