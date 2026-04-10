"use client"

import Link from "next/link"
import { Check, Clock, ArrowRight } from "lucide-react"
import { BlurFade } from "@/components/animations/blur-fade"

const formules = [
  {
    nom: "Essentiel",
    accroche: "« Être visible sur Google »",
    delai: "5 à 7 jours ouvrés",
    description: "Un site professionnel et rapide. Design adapté à votre identité, mise en ligne incluse.",
    points: [
      "4 pages : Accueil, À propos, Services, Contact",
      "Responsive mobile",
      "Fiche Google Business Profile",
      "Mise en ligne + domaine configuré",
    ],
    highlighted: false,
    slug: "essentiel",
    colorClass: "text-accent",
    borderClass: "border-accent/25 hover:border-accent/40",
  },
  {
    nom: "Standard",
    accroche: "« Un vrai outil de communication »",
    delai: "10 à 15 jours ouvrés",
    description: "Contenu rédigé par mes soins, SEO local, Analytics. Le site qui travaille pour vous.",
    points: [
      "Jusqu'à 7 pages avec rédaction des textes",
      "SEO on-page : H1/H2, sitemap, balises",
      "Google Analytics 4",
      "1 round de modifications inclus",
    ],
    highlighted: true,
    slug: "standard",
    colorClass: "text-[var(--lavender)]",
    borderClass: "border-[var(--lavender)]/40 hover:border-[var(--lavender)]/60",
  },
  {
    nom: "Premium",
    accroche: "« Votre site travaille à votre place »",
    delai: "3 à 4 semaines",
    description: "Maquette Figma validée, interface admin, SEO avancé. Zéro compromis.",
    points: [
      "Maquette Figma avant développement",
      "Interface admin pour gérer votre contenu",
      "Blog ou actualités (publication autonome)",
      "SEO avancé : Schema.org, Core Web Vitals",
    ],
    highlighted: false,
    slug: "premium",
    colorClass: "text-[var(--gold)]",
    borderClass: "border-[var(--gold)]/25 hover:border-[var(--gold)]/40",
  },
]

export function ServicesSection() {
  return (
    <section className="py-28 bg-background">
      <div className="layout-container">
        <BlurFade delay={0.1} direction="up" inView>
          <div className="mb-16">
            <p className="text-xs uppercase tracking-[0.45em] text-accent font-semibold mb-3">
              Sites web sur mesure
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
              Vous avez un projet web ?
              <br />
              <span className="text-foreground/75">Je suis là pour vous aider.</span>
            </h2>
            <p className="mt-5 text-base text-foreground/55 max-w-lg leading-relaxed">
              En parallèle de mon activité en agence, je crée des sites sur mesure pour artisans, restaurants et petites entreprises. Trois formules claires, des livrables précis.
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
          {formules.map((formule, i) => (
            <BlurFade key={formule.nom} delay={0.2 + i * 0.1} direction="up" inView>
              <Link
                href={`/services/${formule.slug}`}
                className={`group relative flex flex-col h-full rounded-2xl border p-7 bg-white/2 transition-all duration-300 hover:translate-y-[-4px] cursor-pointer ${formule.borderClass}`}
              >
                {formule.highlighted && (
                  <div className="absolute -top-3.5 left-6">
                    <span className="text-xs font-bold px-3.5 py-1.5 bg-accent text-accent-foreground rounded-full tracking-wide">
                      Le plus demandé
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <p className={`text-[10px] font-bold uppercase tracking-[0.4em] mb-2 ${formule.colorClass}`}>
                    {formule.nom}
                  </p>
                  <p className={`text-sm font-medium italic mb-3 ${formule.colorClass}`}>
                    {formule.accroche}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-foreground/60">
                    <Clock className="w-3.5 h-3.5" />
                    {formule.delai}
                  </div>
                </div>

                <p className="text-sm text-foreground/65 mb-5 leading-relaxed">
                  {formule.description}
                </p>

                <ul className="space-y-2 mb-8 flex-1">
                  {formule.points.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80">
                      <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${formule.colorClass}`} />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className={`flex items-center justify-between pt-4 border-t border-white/6 text-sm font-semibold transition-colors ${formule.colorClass} group-hover:opacity-80`}>
                  <span>Voir la formule</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </BlurFade>
          ))}
        </div>

        <BlurFade delay={0.5} direction="up" inView>
          <div className="text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-accent transition-colors group cursor-pointer"
            >
              Voir toutes les formules & tarifs
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
