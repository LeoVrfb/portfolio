import { HeroSection } from "@/components/sections/hero";
import { TechBand } from "@/components/sections/tech-band";
import { AboutIntro } from "@/components/sections/about-intro";
import { ProjetsSection } from "@/components/sections/projets";
import { ServicesSection } from "@/components/sections/services";
import { ContactCTA } from "@/components/sections/contact-cta";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TechBand />
      <AboutIntro />
      <ProjetsSection />
      <ServicesSection />
      <ContactCTA />
    </>
  );
}
