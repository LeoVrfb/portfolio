import { headers } from "next/headers";
import { HeroSection } from "@/components/sections/hero";
import { TechBand } from "@/components/sections/tech-band";
import { AboutIntro } from "@/components/sections/about-intro";
import { ProjetsSection } from "@/components/sections/projets";
import { ServicesSection } from "@/components/sections/services";
import { isBotUserAgent } from "@/lib/seo/is-bot";

export default async function Home() {
  // Pour les bots, l'intro overlay est désactivée dans le layout. Sans signal
  // d'intro, le hero ne quitte jamais son état initial `ready=false` et son
  // <h1> n'est jamais rendu côté serveur — créant une page sans H1 à l'œil
  // de Bing/Google. On force donc le hero à démarrer immédiatement sur les UA
  // crawlers pour que le HTML servi soit complet pour le SEO.
  const requestHeaders = await headers();
  const skipIntro = isBotUserAgent(requestHeaders.get("user-agent"));

  return (
    <>
      <HeroSection skipIntro={skipIntro} />
      <TechBand />
      <AboutIntro />
      <ProjetsSection />
      <ServicesSection />
    </>
  );
}
