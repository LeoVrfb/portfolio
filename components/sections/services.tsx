"use client"

import Link from "next/link"
import { Check, Clock, ArrowRight } from "lucide-react"
import { BlurFade } from "@/components/animations/blur-fade"

const formules = [
  {
    nom: "Essentiel",
    prix: "600 €",
    accroche: "Être visible sur Google",
    delai: "5 à 7 jours ouvrés",
    description: "Un site professionnel et rapide. Vous fournissez les textes et photos.",
    inclus: [
      "4 pages : Accueil, À propos, Services, Contact",
      "Design adapté à votre identité",
      "Formulaire de contact par email",
      "Responsive mobile",
      "Mise en ligne + configuration du domaine",
      "Fiche Google Business Profile",
    ],
    highlighted: false,
    slug: "essentiel",
  },
  {
    nom: "Standard",
    prix: "1 200 €",
    accroche: "Un vrai outil de communication",
    delai: "10 à 15 jours ouvrés",
    description: "Contenu rédigé, SEO local, Analytics. Le site qui travaille pour vous.",
    inclus: [
      "Tout ce qui est dans Essentiel",
      "Jusqu'à 7 pages",
      "Rédaction des textes (à partir de votre brief)",
      "SEO on-page : titres, structure H1/H2, sitemap",
      "Google Analytics 4",
      "1 round de modifications après livraison",
      "Formulaire de devis ou réservation",
    ],
    highlighted: true,
    slug: "standard",
  },
  {
    nom: "Premium",
    prix: "2 200 €+",
    accroche: "Votre site travaille à votre place",
    delai: "3 à 4 semaines",
    description: "Maquette Figma, interface admin, SEO avancé. Zéro compromis.",
    inclus: [
      "Tout ce qui est dans Standard",
      "Maquette Figma avant développement",
      "Interface admin sur mesure (photos, textes)",
      "Galerie dynamique avec filtres",
      "SEO avancé : Schema.org, Core Web Vitals",
      "Blog ou actualités (publication autonome)",
      "Menu interactif ou galerie réalisations",
    ],
    highlighted: false,
    slug: "premium",
  },
]

export function ServicesSection() {
  return (
    <section className="py-28 bg-background">
      <div className="layout-container">
        <BlurFade delay={0.1} direction="up" inView>
          <div className="mb-16">
            <p className="text-xs uppercase tracking-[0.45em] text-zinc-600 font-semibold mb-3">
              Tarifs
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
              3 formules claires.
              <br />
              <span className="text-zinc-600">0 mauvaise surprise.</span>
            </h2>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
          {formules.map((formule, i) => {
            const cardColors = [
              { border: "border-accent/40 bg-accent/5 shadow-accent/10", price: "text-accent" },
              { border: "border-[var(--lavender)]/50 bg-[var(--lavender)]/5 shadow-[var(--lavender)]/10", price: "text-[var(--lavender)]" },
              { border: "border-[var(--mauve)]/40 bg-[var(--mauve)]/5 shadow-[var(--mauve)]/10", price: "text-[var(--mauve)]" },
            ]
            const c = formule.highlighted ? cardColors[1] : i === 0 ? cardColors[0] : cardColors[2]
            return (
            <BlurFade key={formule.nom} delay={0.2 + i * 0.1} direction="up" inView>
              <Link
                href={`/services/${formule.slug}`}
                className={`group relative flex flex-col h-full rounded-2xl border p-7 transition-all duration-300 hover:translate-y-[-4px] cursor-pointer ${
                  formule.highlighted
                    ? `${c.border} shadow-lg`
                    : "border-white/7 bg-white/2 hover:border-white/15"
                }`}
              >
                {formule.highlighted && (
                  <div className="absolute -top-3.5 left-6">
                    <span className="text-xs font-bold px-3.5 py-1.5 bg-accent text-accent-foreground rounded-full tracking-wide">
                      Le plus demandé
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.4em] mb-3">
                    {formule.nom}
                  </p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`text-4xl font-bold tracking-tight ${c.price}`}>
                      {formule.prix}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground italic mb-2">
                    « {formule.accroche} »
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
                    <Clock className="w-3.5 h-3.5" />
                    {formule.delai}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  {formule.description}
                </p>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {formule.inclus.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/70">
                      <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className={`flex items-center justify-between pt-4 border-t border-white/6 text-sm font-semibold transition-colors ${c.price} group-hover:opacity-80`}>
                  <span>Voir la formule</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </BlurFade>
          )})}
        </div>

        {/* Options à la carte */}
        <BlurFade delay={0.5} direction="up" inView>
          <div className="rounded-2xl border border-white/7 bg-white/2 p-7 hover:border-white/10 transition-colors">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="font-bold text-white mb-1 text-lg">Options à la carte</h3>
                <p className="text-sm text-zinc-600">
                  À ajouter à n'importe quelle formule.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Page supplémentaire", prix: "150 €" },
                { label: "Création du logo", prix: "200 €" },
                { label: "Google Business Profile", prix: "80 €" },
                { label: "Pixel Meta (Facebook Ads)", prix: "60 €" },
                { label: "Google Analytics 4", prix: "50 €" },
                { label: "Maintenance mensuelle", prix: "50 €/mois" },
                { label: "Modification post-livraison", prix: "60 €/h" },
                { label: "Traduction anglais", prix: "sur devis" },
              ].map(({ label, prix }) => (
                <div
                  key={label}
                  className="flex flex-col gap-1.5 p-4 rounded-xl bg-white/4 border border-white/5 hover:border-white/10 hover:bg-white/6 transition-all"
                >
                  <span className="text-xs text-zinc-500">{label}</span>
                  <span className="text-sm font-bold text-accent">{prix}</span>
                </div>
              ))}
            </div>
          </div>
        </BlurFade>

        <BlurFade delay={0.6} direction="up" inView>
          <div className="text-center mt-8">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-white transition-colors group"
            >
              Voir tous les détails
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
