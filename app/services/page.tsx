import { Metadata } from "next";
import Link from "next/link";
import { Check, X, ArrowRight, Clock, ChevronDown } from "lucide-react";
import { BlurFade } from "@/components/animations/blur-fade";

export const metadata: Metadata = {
  title: "Services & Tarifs — Léo Hengebaert",
  description:
    "3 formules claires pour la création de votre site web : Essentiel à 590€, Standard à 990€, Premium à 1 890€. Next.js professionnel pour artisans, PME et artistes.",
};

const formules = [
  {
    nom: "Essentiel",
    prix: "590 €",
    accroche: "Un site simple et propre, fait par un pro, en quelques jours.",
    delai: "5 jours ouvrés",
    inclus: [
      "Une page, plusieurs sections",
      "Design moderne, simple et responsive",
      "Formulaire de contact",
      "SEO de base",
      "Galerie 10 images optimisées",
      "Mise en ligne et configuration du domaine",
      "2h de retouches incluses",
    ],
    non_inclus: [
      "Pages séparées",
      "Design 100% personnalisé",
      "Rédaction des textes",
      "Google Analytics",
      "Formation à la gestion du site",
    ],
    highlighted: false,
    slug: "essentiel",
    colorClass: "text-accent",
    borderClass: "border-accent/25 bg-accent/[0.03]",
    hoverBorder: "hover:border-accent/50",
    ctaClass: "bg-accent/12 border-accent/30 text-accent group-hover:bg-accent/22",
    priceColor: undefined as string | undefined,
  },
  {
    nom: "Standard",
    prix: "990 €",
    accroche: "Un vrai site complet, à votre image, pensé pour convaincre vos visiteurs.",
    delai: "10 jours ouvrés",
    inclus: [
      "Les fondamentaux de l'Essentiel",
      "5 à 7 pages séparées",
      "Design personnalisé",
      "Rédaction des textes",
      "SEO+",
      "Google Analytics",
      "Formulaire de devis personnalisé",
      "Formation 30 min en visio",
      "5h de retouches incluses",
    ],
    non_inclus: [
      "Design 100% sur mesure",
      "Pack animations",
      "Pack performance",
      "CMS Headless Sanity",
      "Multilingue FR + EN",
      "SEO Pro",
    ],
    highlighted: true,
    slug: "standard",
    colorClass: "text-[var(--lavender)]",
    borderClass: "border-[var(--lavender)]/30 bg-[var(--lavender)]/[0.03]",
    hoverBorder: "hover:border-[var(--lavender)]/55",
    ctaClass: "bg-[var(--lavender)]/14 border-[var(--lavender)]/35 text-[var(--lavender)] group-hover:bg-[var(--lavender)]/26",
    priceColor: "var(--lavender)",
  },
  {
    nom: "Premium",
    prix: "1 890 €",
    accroche: "Un site sur mesure, design 100% unique, autonomie totale sur vos contenus.",
    delai: "3 semaines",
    inclus: [
      "Les fondamentaux du Standard",
      "Jusqu'à 10 pages",
      "Design 100% sur mesure",
      "Pack animations inclus",
      "SEO Pro",
      "Pack performance inclus",
      "CMS Headless Sanity inclus",
      "Multilingue FR + EN inclus",
      "10h de retouches + 1 mois de support post-livraison",
    ],
    non_inclus: [] as string[],
    highlighted: false,
    slug: "premium",
    colorClass: "text-[var(--gold)]",
    borderClass: "border-[var(--gold)]/25 bg-[var(--gold)]/[0.03]",
    hoverBorder: "hover:border-[var(--gold)]/50",
    ctaClass: "bg-[var(--gold)]/12 border-[var(--gold)]/30 text-[var(--gold)] group-hover:bg-[var(--gold)]/22",
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
          <p className="text-sm text-white/65 max-w-xl leading-relaxed">
            Sites faits main, pas générés par un outil no-code. Chaque formule inclut la mise en ligne et la configuration du domaine.
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
                    La formule la plus choisie
                  </span>
                </div>
              )}

              {/* Card header */}
              <div className="p-5 pb-4 border-b border-white/5">
                <div className="flex items-start justify-between mb-2">
                  <p className={`text-[10px] font-bold uppercase tracking-[0.4em] ${formule.colorClass}`}>
                    {formule.nom}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-white/55">
                    <Clock size={9} />
                    {formule.delai}
                  </div>
                </div>
                <div
                  className="text-3xl font-black tracking-tight leading-none mb-2"
                  style={formule.priceColor ? { color: formule.priceColor } : undefined}
                >
                  {formule.prix}
                </div>
                <p className={`text-xs italic ${formule.colorClass} opacity-90`}>
                  « {formule.accroche} »
                </p>
              </div>

              {/* Features */}
              <div className="p-5 pt-4 flex-1 flex flex-col">
                <div className="space-y-1.5 mb-4 flex-1">
                  {formule.inclus.map((item) => (
                    <div key={item} className="flex items-start gap-2 text-xs">
                      <Check size={11} className={`mt-0.5 shrink-0 ${formule.colorClass}`} />
                      <span className="text-white/90">{item}</span>
                    </div>
                  ))}
                  {formule.non_inclus.map((item) => (
                    <div key={item} className="flex items-start gap-2 text-xs">
                      <X size={11} className="mt-0.5 shrink-0 text-rose-400/65" />
                      <span className="text-white/60">{item}</span>
                    </div>
                  ))}
                </div>

                <div
                  className={`block text-center py-2.5 rounded-xl text-xs font-bold transition-all border ${formule.ctaClass}`}
                >
                  Configurer cette formule →
                </div>
              </div>
            </Link>
          </BlurFade>
        ))}
      </div>

      {/* Scroll hint + séparateur */}
      <div className="flex flex-col items-center gap-2 py-8 text-white/65">
        <span className="text-[10px] tracking-[0.3em] uppercase">Questions fréquentes</span>
        <ChevronDown size={16} className="animate-bounce" />
      </div>

      {/* FAQ */}
      <div className="mb-10">
        <h2 className="text-xl font-black text-white tracking-tight mb-5">Questions fréquentes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              q: "Pourquoi pas un outil no-code (Wix, Squarespace, Webflow) ?",
              r: "Les outils no-code sont pratiques pour démarrer, mais ils plafonnent vite : design contraint par les templates, performance limitée, SEO bridé, et code propriétaire que vous ne possédez pas. Je code des sites faits main, performants, et dont vous êtes propriétaire à 100%.",
            },
            {
              q: "Combien de temps pour avoir mon site ?",
              r: "5 jours ouvrés pour l'Essentiel, 10 jours pour le Standard, 3 semaines pour le Premium. Le délai démarre dès réception de vos éléments (textes, photos, logo).",
            },
            {
              q: "Et si je veux une option qui n'est pas dans ma formule ?",
              r: "Chaque formule a un périmètre clair. Si vous voulez une option qui n'y figure pas (par exemple un design 100% sur mesure ou un CMS en Essentiel), il faut passer à la formule supérieure. Je ne fais pas de mélange à la carte hors des options listées : ça garde les délais courts et les prix clairs.",
            },
            {
              q: "Comment se passe la collaboration concrètement ?",
              r: "Visio brief de 30 à 60 min pour cadrer le projet, vous m'envoyez vos éléments (textes, photos, logo), je livre une première version sous le délai annoncé, on itère via les heures de retouches incluses, puis on met en ligne. Vous suivez l'avancement via une URL de preview tout du long.",
            },
            {
              q: "Et si je veux modifier mon site après livraison ?",
              r: "2h de retouches sont incluses en Essentiel, 5h en Standard, 10h en Premium. Au-delà : 60€/h avec devis avant intervention. Ou maintenance mensuelle à 50€/mois (1h de modifs incluse + suivi technique).",
            },
            {
              q: "Je n'ai pas de nom de domaine. Que faire ?",
              r: "Je vous accompagne pour acheter votre domaine en votre nom. Cela vous appartient, vous gardez le contrôle. Le coût (~10 à 15€/an) reste à votre charge.",
            },
          ].map(({ q, r }) => (
            <div key={q} className="p-5 rounded-2xl border border-white/10 bg-white/[0.025]">
              <h3 className="font-semibold text-sm text-accent mb-2">{q}</h3>
              <p className="text-xs text-white/85 leading-relaxed">{r}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-white/75 mb-4 text-sm">
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
