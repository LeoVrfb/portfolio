import { Metadata } from "next";
import Link from "next/link";
import { Check, X, ArrowRight, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Services & Tarifs — Léo Hengebaert",
  description:
    "3 formules claires pour la création de votre site web : Essentiel à 600€, Standard à 1 200€, Premium à 2 200€. Artisans, restaurants, PME.",
};

const formules = [
  {
    nom: "Essentiel",
    prix: "600 €",
    accroche: "Être visible sur Google",
    delai: "5 à 7 jours ouvrés",
    description:
      "Vous avez besoin d'une présence en ligne rapide et professionnelle. Le client fournit les textes et les photos — je m'occupe du reste.",
    inclus: [
      "4 pages : Accueil, À propos, Services, Contact",
      "Design adapté à votre identité (couleurs, logo)",
      "Formulaire de contact (envoi par email)",
      "Responsive mobile",
      "Mise en ligne sur Vercel + configuration du domaine",
      "Fiche Google Business Profile (création ou optimisation)",
    ],
    non_inclus: [
      "Rédaction des textes",
      "E-commerce ou système de réservation",
      "Modifications post-livraison (hors bug)",
    ],
    highlighted: false,
    slug: "essentiel",
    colorClass: "text-accent",
    borderFull: "border-accent/30 bg-accent/3",
    priceColor: undefined as string | undefined,
  },
  {
    nom: "Standard",
    prix: "1 200 €",
    accroche: "Un vrai outil de communication",
    delai: "10 à 15 jours ouvrés",
    description:
      "Un site complet, rédigé, optimisé pour le SEO local. Avec Google Analytics pour suivre vos visiteurs.",
    inclus: [
      "Tout ce qui est dans Essentiel",
      "Jusqu'à 7 pages",
      "Rédaction des textes (à partir de votre brief)",
      "SEO on-page : balises title/description, H1/H2, sitemap",
      "Google Analytics 4 intégré",
      "Formulaire de devis (artisans) ou lien réservation",
      "1 round de modifications après livraison",
    ],
    non_inclus: [
      "Maquette Figma personnalisée",
      "Interface de gestion de contenu",
    ],
    highlighted: true,
    slug: "standard",
    colorClass: "text-[var(--lavender)]",
    borderFull: "border-[var(--lavender)]/35 bg-[var(--lavender)]/3",
    priceColor: "var(--lavender)",
  },
  {
    nom: "Premium",
    prix: "2 200 €+",
    accroche: "Votre site travaille à votre place",
    delai: "3 à 4 semaines",
    description:
      "Un site sur mesure avec maquette Figma validée, interface admin et SEO avancé. Zéro compromis.",
    inclus: [
      "Tout ce qui est dans Standard",
      "Maquette Figma avant développement",
      "Interface admin sur mesure (photos, textes, produits)",
      "Galerie dynamique avec filtres par catégorie",
      "Blog ou actualités (publication en autonomie)",
      "SEO avancé : Schema.org, Core Web Vitals",
      "Menu interactif ou galerie réalisations filtrée",
    ],
    non_inclus: [],
    highlighted: false,
    slug: "premium",
    colorClass: "text-[var(--gold)]",
    borderFull: "border-[var(--gold)]/30 bg-[var(--gold)]/3",
    priceColor: "var(--gold)",
  },
];

const options = [
  { label: "Page supplémentaire", prix: "150 €" },
  { label: "Création du logo", prix: "200 €" },
  { label: "Google Business Profile", prix: "80 €" },
  { label: "Pixel Meta (Facebook Ads)", prix: "60 €" },
  { label: "Google Analytics 4 seul", prix: "50 €" },
  { label: "Maintenance mensuelle", prix: "50 €/mois" },
  { label: "Modification post-livraison", prix: "60 €/h" },
  { label: "Traduction EN", prix: "sur devis" },
];

export default function ServicesPage() {
  return (
    <div className="pt-32 pb-24 layout-container">
      <div className="mb-16">
        <p className="text-xs font-semibold text-accent uppercase tracking-[0.45em] mb-3">
          Tarifs
        </p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white leading-tight mb-5">
          3 formules claires.
          <br />
          <span className="text-foreground/75">0 mauvaise surprise.</span>
        </h1>
        <p className="text-base text-foreground/55 max-w-xl leading-relaxed">
          Chaque formule inclut des livrables précis. Vous savez exactement ce que vous obtenez avant de signer.
        </p>
      </div>

      {/* Formules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-12">
        {formules.map((formule) => (
          <div
            key={formule.nom}
            className={`relative rounded-2xl border p-7 flex flex-col ${formule.borderFull}`}
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
              <div
                className="text-4xl font-black tracking-tight mb-1"
                style={formule.priceColor ? { color: formule.priceColor } : undefined}
              >
                {formule.prix}
              </div>
              <p className={`text-sm font-medium italic mb-2 ${formule.colorClass}`}>
                « {formule.accroche} »
              </p>
              <div className="flex items-center gap-1.5 text-xs text-foreground/60">
                <Clock size={12} />
                {formule.delai}
              </div>
            </div>

            <p className="text-sm text-foreground/65 mb-5 leading-relaxed">
              {formule.description}
            </p>

            <div className="flex-1 space-y-2 mb-7">
              {formule.inclus.map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm text-foreground/90">
                  <Check size={13} className={`mt-0.5 shrink-0 ${formule.colorClass}`} />
                  <span>{item}</span>
                </div>
              ))}
              {formule.non_inclus.map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm">
                  <X size={13} className="mt-0.5 shrink-0 text-foreground/25" />
                  <span className="text-foreground/35">{item}</span>
                </div>
              ))}
            </div>

            <Link
              href={`/services/${formule.slug}`}
              className={`block text-center py-3 rounded-xl text-sm font-bold transition-all cursor-pointer border ${
                formule.highlighted
                  ? "bg-[var(--lavender)]/15 border-[var(--lavender)]/30 text-[var(--lavender)] hover:bg-[var(--lavender)]/25"
                  : "bg-white/4 border-white/8 text-foreground/70 hover:bg-white/8 hover:text-foreground"
              }`}
            >
              Configurer cette formule
            </Link>
          </div>
        ))}
      </div>

      {/* Options à la carte */}
      <div className="rounded-2xl border border-white/7 bg-white/2 p-7 mb-12">
        <h2 className="text-lg font-bold text-white mb-1">Options à la carte</h2>
        <p className="text-sm text-foreground/45 mb-6">
          Ajoutables sur n&apos;importe quelle formule lors de la configuration.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map(({ label, prix }) => (
            <div
              key={label}
              className="flex flex-col gap-1.5 p-4 rounded-xl bg-white/3 border border-white/5 hover:border-white/10 transition-all"
            >
              <span className="text-xs text-foreground/55">{label}</span>
              <span className="text-sm font-bold text-accent">{prix}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-12">
        <h2 className="text-2xl font-black text-white tracking-tight mb-6">Questions fréquentes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              q: "Pourquoi Next.js et pas WordPress ?",
              r: "Next.js produit des sites plus rapides, mieux référencés par Google, et entièrement sécurisés. Pas d'extensions à maintenir, pas de failles. C'est la même technologie qu'utilisent TotalEnergies ou les Aéroports de Paris.",
            },
            {
              q: "Combien de temps pour avoir mon site ?",
              r: "5 à 7 jours pour l'Essentiel, 10 à 15 jours pour le Standard, 3 à 4 semaines pour le Premium. Le délai démarre dès que vous m'avez fourni les éléments (textes, photos, logo).",
            },
            {
              q: "Et si je veux modifier mon site après ?",
              r: "Les modifications post-livraison sont facturées 60€/h. Un round de modifications est inclus dans la formule Standard. Je recommande de préparer soigneusement les textes avant le début du projet.",
            },
            {
              q: "Je n'ai pas de nom de domaine. Que faire ?",
              r: "Je m'occupe de tout : achat du domaine, configuration DNS, mise en ligne sur Vercel. Vous n'avez rien à gérer. Le coût du domaine (~10-15€/an) est à votre charge.",
            },
          ].map(({ q, r }) => (
            <div key={q} className="p-6 rounded-2xl border border-white/7 bg-white/2">
              <h3 className="font-semibold text-sm text-foreground/90 mb-3">{q}</h3>
              <p className="text-sm text-foreground/55 leading-relaxed">{r}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-foreground/45 mb-5 text-sm">
          Pas sûr de quelle formule choisir ?
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-black text-sm font-bold rounded-full hover:bg-accent/90 transition-colors cursor-pointer"
        >
          Me parler de votre projet <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
