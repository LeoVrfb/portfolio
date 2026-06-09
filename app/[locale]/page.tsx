import { headers } from "next/headers";
import { HeroSection } from "@/components/sections/hero";
import { TechBand } from "@/components/sections/tech-band";
import { AboutIntro } from "@/components/sections/about-intro";
import { ProjetsSection } from "@/components/sections/projets";
import { ServicesSection } from "@/components/sections/services";
import { IntroOverlay } from "@/components/sections/intro-overlay";
import { isBotUserAgent } from "@/lib/seo/is-bot";

// L'IntroOverlay est rendu UNIQUEMENT sur la home page. Il joue à chaque
// chargement de `/` (pas de cookie de skip pour les visiteurs récurrents).
// L'animation est non-skippable côté client : il faut attendre les 4.2s.
//
// Skips serveur (avant rendu) :
//  - bot (Googlebot, Bingbot, GPTBot…) → contenu SSR complet pour les crawlers,
//    sinon ils voient une page vide masquée par l'overlay → SEO cassé.
//
// Skips client (dans IntroOverlay) :
//  - prefers-reduced-motion → accessibilité
//  - navigator.webdriver → Lighthouse / Selenium / Playwright
export default async function Home() {
  const requestHeaders = await headers();
  const isBot = isBotUserAgent(requestHeaders.get("user-agent"));

  return (
    <>
      {!isBot && <IntroOverlay />}
      <HeroSection skipIntro={isBot} />
      <TechBand />
      <AboutIntro />
      <ProjetsSection />
      <ServicesSection />
    </>
  );
}
