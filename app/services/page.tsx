import { Metadata } from "next";
import Link from "next/link";
import { Check, X, ArrowRight, Clock, ShoppingCart, ChevronDown } from "lucide-react";
import { BlurFade } from "@/components/animations/blur-fade";

export const metadata: Metadata = {
  title: "Services & Tarifs — Léo Hengebaert",
  description:
    "3 formules claires pour la création de votre site web : Essentiel à 599€, Standard à 1 199€, Sur mesure à 2 199€+. Next.js professionnel pour artisans, PME et artistes.",
};

const formules = [
  {
    nom: "Essentiel",
    prix: "599 €",
    accroche: "Votre vitrine professionnelle en ligne",
    delai: "1 semaine",
    description: "Une vitrine professionnelle rapidement en ligne. Vous fournissez textes et photos — je m'occupe du reste.",
    pourquoi: "Next.js sur Vercel, pas WordPress. Zéro plugin à maintenir, SEO natif, hébergement inclus.",
    inclus: [
      "4 pages : Accueil, À propos, Services, Contact",
      "Design sur mesure + responsive mobile",
      "Formulaire de contact (envoi email)",
      "Mise en ligne Vercel + configuration domaine",
      "SEO de base (title, meta, sitemap)",
      "Fiche Google Business Profile",
    ],
    non_inclus: [
      "Rédaction des textes",
      "E-commerce",
    ],
    ecommerce: false,
    highlighted: false,
    slug: "essentiel",
    colorClass: "text-accent",
    borderClass: "border-accent/25 bg-accent/[0.03]",
    hoverBorder: "hover:border-accent/50",
    badgeClass: "",
    priceColor: undefined as string | undefined,
  },
  {
    nom: "Standard",
    prix: "1 199 €",
    accroche: "Un vrai outil de communication",
    delai: "2 semaines",
    description: "Site complet, rédigé et optimisé SEO local. Avec Analytics pour suivre vos visiteurs.",
    pourquoi: "Rédaction professionnelle incluse + SEO complet. Votre site trouve des clients pendant que vous travaillez.",
    inclus: [
      "Tout ce qui est dans Essentiel",
      "Jusqu'à 7 pages",
      "Rédaction des textes (à partir de votre brief)",
      "SEO on-page : H1/H2, balises, sitemap",
      "Google Analytics 4 intégré",
      "Formulaire de devis ou lien réservation",
      "1 round de modifications après livraison",
    ],
    non_inclus: [] as string[],
    ecommerce: true,
    highlighted: true,
    slug: "standard",
    colorClass: "text-[var(--lavender)]",
    borderClass: "border-[var(--lavender)]/30 bg-[var(--lavender)]/[0.03]",
    hoverBorder: "hover:border-[var(--lavender)]/55",
    badgeClass: "bg-[var(--lavender)] text-black",
    priceColor: "var(--lavender)",
  },
  {
    nom: "Sur mesure",
    prix: "2 199 €+",
    accroche: "Un site professionnel qui vous distingue",
    delai: "3 à 4 semaines",
    description: "Design sur mesure, interface admin, SEO avancé. Un site clé en main sans aucun compromis.",
    pourquoi: "Design + admin + SEO avancé. Un site qui se distingue, livré clé en main avec formation incluse.",
    inclus: [
      "Tout ce qui est dans Standard",
      "Interface admin sur mesure",
      "Galerie dynamique avec filtres",
      "SEO avancé : Schema.org, Core Web Vitals",
      "Blog / actualités (publication en autonomie)",
      "Option : backend temps réel ou CMS headless",
    ],
    non_inclus: [] as string[],
    ecommerce: true,
    highlighted: false,
    slug: "premium",
    colorClass: "text-[var(--gold)]",
    borderClass: "border-[var(--gold)]/25 bg-[var(--gold)]/[0.03]",
    hoverBorder: "hover:border-[var(--gold)]/50",
    badgeClass: "",
    priceColor: "var(--gold)",
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-28 pb-20 layout-container">
      {/* Header */}
      <div className="mb-10">
        <BlurFade delay={0}>
          <p className="text-xs font-semibold text-accent uppercase tracking-[0.45em] mb-3">
            Tarifs
          </p>
        </BlurFade>
        <BlurFade delay={0.08}>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white leading-tight mb-4">
            3 formules claires.
            <br />
            <span className="text-foreground/60">0 mauvaise surprise.</span>
          </h1>
        </BlurFade>
        <BlurFade delay={0.14}>
          <p className="text-sm text-foreground/50 max-w-xl leading-relaxed">
            Next.js professionnel — pas WordPress. Chaque formule inclut le déploiement Vercel et la configuration du domaine.
          </p>
        </BlurFade>
      </div>

      {/* Formules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
        {formules.map((formule, i) => (
          <BlurFade key={formule.nom} delay={0.2 + i * 0.08}>
            <Link
              href={`/services/${formule.slug}`}
              className={`relative rounded-2xl border flex flex-col cursor-pointer group transition-all duration-200 h-full ${formule.borderClass} ${formule.hoverBorder} ${formule.highlighted ? "hover:scale-[1.015]" : "hover:scale-[1.008]"}`}
            >
              {formule.highlighted && (
                <div className="absolute -top-3 left-5">
                  <span className="text-[10px] font-bold px-3 py-1 bg-[var(--lavender)] text-black rounded-full tracking-wide">
                    Le plus demandé
                  </span>
                </div>
              )}

              {/* Card header */}
              <div className="p-5 pb-4 border-b border-white/5">
                <div className="flex items-start justify-between mb-2">
                  <p className={`text-[10px] font-bold uppercase tracking-[0.4em] ${formule.colorClass}`}>
                    {formule.nom}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-foreground/40">
                    <Clock size={9} />
                    {formule.delai}
                  </div>
                </div>
                <div
                  className="text-3xl font-black tracking-tight leading-none mb-1"
                  style={formule.priceColor ? { color: formule.priceColor } : undefined}
                >
                  {formule.prix}
                </div>
                <p className={`text-xs italic ${formule.colorClass} opacity-80`}>
                  « {formule.accroche} »
                </p>
                {formule.ecommerce && (
                  <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-[var(--gold)]/80 bg-[var(--gold)]/8 border border-[var(--gold)]/15 px-2 py-0.5 rounded-full">
                    <ShoppingCart size={9} />
                    Option e-commerce disponible
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="p-5 pt-4 flex-1 flex flex-col">
                <p className="text-xs text-white/60 mb-3 leading-relaxed">
                  {formule.description}
                </p>

                <div className="space-y-1.5 mb-4 flex-1">
                  {formule.inclus.map((item) => (
                    <div key={item} className="flex items-start gap-2 text-xs text-white">
                      <Check size={11} className={`mt-0.5 shrink-0 ${formule.colorClass}`} />
                      <span className="text-white/90">{item}</span>
                    </div>
                  ))}
                  {formule.non_inclus.map((item) => (
                    <div key={item} className="flex items-start gap-2 text-xs">
                      <X size={11} className="mt-0.5 shrink-0 text-white/25" />
                      <span className="text-white/40">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Pourquoi ce prix */}
                <div className="text-[10px] text-white/40 border-t border-white/6 pt-3 mb-4 leading-relaxed italic">
                  {formule.pourquoi}
                </div>

                <div
                  className={`block text-center py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    formule.highlighted
                      ? "bg-[var(--lavender)]/12 border-[var(--lavender)]/25 text-[var(--lavender)] group-hover:bg-[var(--lavender)]/22"
                      : "bg-white/4 border-white/7 text-foreground/60 group-hover:bg-white/7 group-hover:text-foreground"
                  }`}
                >
                  Configurer cette formule →
                </div>
              </div>
            </Link>
          </BlurFade>
        ))}
      </div>

      {/* Scroll hint + séparateur */}
      <div className="flex flex-col items-center gap-2 py-8 text-white/30">
        <span className="text-[10px] tracking-[0.3em] uppercase">Questions fréquentes</span>
        <ChevronDown size={16} className="animate-bounce" />
      </div>

      {/* FAQ */}
      <div className="mb-10">
        <h2 className="text-xl font-black text-white tracking-tight mb-5">Questions fréquentes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              q: "Pourquoi Next.js et pas WordPress ?",
              r: "Next.js produit des sites plus rapides, mieux référencés, entièrement sécurisés. Pas d'extensions à maintenir, pas de failles. Même technologie que TotalEnergies ou les Aéroports de Paris.",
            },
            {
              q: "Combien de temps pour avoir mon site ?",
              r: "1 semaine pour l'Essentiel, 2 semaines pour le Standard, 3 à 4 semaines pour le Sur mesure. Le délai démarre dès réception de vos éléments (textes, photos, logo).",
            },
            {
              q: "Et si je veux modifier mon site après livraison ?",
              r: "Les modifications post-livraison sont à 60€/h. 1 round de modifications est inclus dans Standard et Sur mesure. Ou optez pour la maintenance mensuelle à 50€/mois.",
            },
            {
              q: "Je n'ai pas de nom de domaine. Que faire ?",
              r: "Je m'occupe de tout : achat du domaine, DNS, mise en ligne. Le coût du domaine (~10-15€/an) reste à votre charge. Vous n'avez rien à gérer techniquement.",
            },
          ].map(({ q, r }) => (
            <div key={q} className="p-5 rounded-2xl border border-white/7 bg-white/2">
              <h3 className="font-semibold text-sm text-foreground/85 mb-2">{q}</h3>
              <p className="text-xs text-foreground/50 leading-relaxed">{r}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-foreground/40 mb-4 text-sm">
          Pas sûr de quelle formule choisir ?
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-black text-sm font-bold rounded-full hover:bg-accent/90 transition-colors cursor-pointer"
        >
          Me parler de votre projet <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
