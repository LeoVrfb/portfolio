import { Metadata } from "next";
import { ProjetsGrid } from "@/components/sections/projets-grid";
import { BlurFade } from "@/components/animations/blur-fade";

export const metadata: Metadata = {
  title: "Projets — Léo Hengebaert",
  description:
    "Découvrez mes réalisations web : applications, sites vitrines et landing pages pour des clients comme BNP Paribas, TotalEnergies, Aéroports de Paris et des PME locales.",
};

export default function ProjetsPage() {
  return (
    <div className="pt-32 pb-24 layout-container">
      {/* Header */}
      <div className="mb-12">
        <BlurFade delay={0}>
          <p className="text-xs font-semibold text-accent mb-3 tracking-[0.3em] uppercase">
            Réalisations
          </p>
        </BlurFade>
        <BlurFade delay={0.08}>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter leading-[0.92] mb-4">
            Projets
            <br />
            <span className="text-foreground/20">sélectionnés</span>
          </h1>
        </BlurFade>
        <BlurFade delay={0.14}>
          <p className="text-foreground/70 text-base max-w-lg leading-relaxed">
            Une sélection de projets qui m'ont particulièrement marqué — réalisés en entreprise, en freelance ou pour moi-même. Applications, plateformes et sites web.
          </p>
        </BlurFade>
      </div>

      {/* Grid + filters */}
      <ProjetsGrid />
    </div>
  );
}
