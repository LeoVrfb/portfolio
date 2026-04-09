import { Metadata } from "next";
import { ProjetsGrid } from "@/components/sections/projets-grid";

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
        <p className="text-xs font-semibold text-accent mb-3 tracking-[0.3em] uppercase">
          Réalisations
        </p>
        <h1 className="text-5xl sm:text-6xl font-black tracking-tighter leading-[0.92] mb-4">
          Projets
          <br />
          <span className="text-foreground/20">sélectionnés.</span>
        </h1>
        <p className="text-muted-foreground text-base max-w-lg leading-relaxed">
          Une sélection de projets qui m'ont particulièrement marqué — réalisés en entreprise, en freelance ou pour moi-même. Applications, plateformes et sites web.
        </p>
      </div>

      {/* Grid + filters */}
      <ProjetsGrid />
    </div>
  );
}
