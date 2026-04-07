import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { projets } from "@/lib/projets";

export const metadata: Metadata = {
  title: "Projets — Léo Hengebaert",
  description:
    "Découvrez mes réalisations web : applications, sites vitrines et landing pages pour des clients comme TotalEnergies, Aéroports de Paris et des PME locales.",
};

export default function ProjetsPage() {
  return (
    <div className="pt-32 pb-24 layout-container">
      <div className="mb-16">
        <p className="text-sm font-medium text-accent mb-3 tracking-wide uppercase">
          Réalisations
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Projets sélectionnés
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {projets.map((projet) => (
          <Link
            key={projet.slug}
            href={`/projets/${projet.slug}`}
            className="group grid grid-cols-1 lg:grid-cols-2 gap-6 rounded-2xl border border-border/50 bg-card overflow-hidden hover:border-border transition-colors cursor-pointer"
          >
            <div className="relative aspect-video lg:aspect-auto overflow-hidden">
              <Image
                src={projet.img}
                alt={projet.titre}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <p className="text-xs font-medium text-accent mb-3 uppercase tracking-wide">
                {projet.client}
              </p>
              <h2 className="text-xl font-semibold mb-3 group-hover:text-foreground/80 transition-colors">
                {projet.titre}
              </h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {projet.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {projet.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="flex items-center gap-1.5 text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors">
                Voir le projet <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
