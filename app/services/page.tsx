import { Metadata } from "next";
import Link from "next/link";
import { Check, X, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Services & Tarifs — Léo Hengebaert",
  description:
    "3 formules claires pour la création de votre site web : Essentiel à 600€, Standard à 1 200€, Premium à 2 200€. Artisans, restaurants, PME.",
};

const formules = [
  {
    nom: "Essentiel",
    prix: "600 €",
    accroche: "Je suis présent sur internet",
    delai: "5 à 7 jours ouvrés",
    description:
      "Vous avez besoin d'une présence en ligne rapide et professionnelle. Le client fournit les textes et les photos — je m'occupe du reste.",
    inclus: [
      "4 pages : Accueil, À propos, Services, Contact",
      "Design adapté à votre identité (couleurs, logo)",
      "Formulaire de contact (envoi par email via Resend)",
      "Responsive mobile",
      "Mise en ligne sur Vercel + configuration du domaine",
      "Fiche Google Business Profile (création ou optimisation)",
    ],
    non_inclus: [
      "Rédaction des textes",
      "Photos professionnelles",
      "E-commerce ou système de réservation",
      "Modifications post-livraison (hors bug)",
    ],
    highlighted: false,
  },
  {
    nom: "Standard",
    prix: "1 200 €",
    accroche: "Un vrai outil de communication",
    delai: "10 à 15 jours ouvrés",
    description:
      "Un site complet, rédigé, optimisé pour le SEO local. Avec Google Analytics pour suivre vos visiteurs et voir d'où viennent vos clients.",
    inclus: [
      "Tout ce qui est dans Essentiel",
      "Jusqu'à 7 pages",
      "Rédaction des textes (à partir de votre brief)",
      "SEO on-page : balises title/description, structure H1/H2, sitemap",
      "Google Analytics 4 intégré",
      "Formulaire de devis (artisans) ou lien réservation (restaurants)",
      "1 round de modifications après livraison",
    ],
    non_inclus: [
      "Maquette Figma personnalisée",
      "Interface de gestion de contenu",
    ],
    highlighted: true,
  },
  {
    nom: "Premium",
    prix: "2 200 €+",
    accroche: "Mon site travaille à ma place",
    delai: "3 à 4 semaines",
    description:
      "Un site sur mesure avec maquette Figma validée avant développement, une interface pour gérer votre contenu en autonomie, et un SEO avancé.",
    inclus: [
      "Tout ce qui est dans Standard",
      "Maquette Figma avant développement",
      "Interface admin sur mesure (ajout photos, textes, produits)",
      "Galerie dynamique avec filtres par catégorie",
      "Blog ou actualités (publication en autonomie)",
      "SEO avancé : données structurées Schema.org, Core Web Vitals",
      "Menu interactif (restaurants) ou galerie réalisations filtrée (artisans)",
    ],
    non_inclus: [],
    highlighted: false,
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
      <div className="text-center mb-20">
        <p className="text-sm font-medium text-accent mb-3 tracking-wide uppercase">
          Tarifs
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
          Des offres claires, sans surprise
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
          Chaque formule inclut des livrables précis. Vous savez exactement ce
          que vous obtenez avant de signer.
        </p>
      </div>

      {/* Formules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
        {formules.map((formule) => (
          <div
            key={formule.nom}
            className={`relative rounded-2xl border p-8 flex flex-col ${
              formule.highlighted
                ? "border-accent/50 bg-accent/5"
                : formule.nom === "Premium"
                  ? "border-[var(--gold)]/30 bg-[var(--gold)]/5"
                  : "border-border/50 bg-card"
            }`}
          >
            {formule.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="text-xs font-semibold px-3 py-1 bg-accent text-accent-foreground rounded-full">
                  Populaire
                </span>
              </div>
            )}

            <div className="mb-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                {formule.nom}
              </p>
              <div
                className="text-4xl font-bold mb-2"
                style={formule.nom === "Premium" ? { color: "var(--gold)" } : undefined}
              >
                {formule.prix}
              </div>
              <p className="text-sm font-medium text-muted-foreground italic mb-2">
                « {formule.accroche} »
              </p>
              <p className="text-xs text-foreground/90">
                Délai : {formule.delai}
              </p>
            </div>

            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              {formule.description}
            </p>

            <div className="flex-1 space-y-2 mb-8">
              {formule.inclus.map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-sm text-foreground/90">
                  <Check size={14} className="text-accent mt-0.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
              {formule.non_inclus.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-muted-foreground"
                >
                  <X size={14} className="mt-0.5 shrink-0 opacity-40" />
                  <span className="opacity-60">{item}</span>
                </div>
              ))}
            </div>

            <Link
              href="/contact"
              className={`block text-center py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                formule.highlighted
                  ? "bg-accent text-accent-foreground hover:bg-accent/90"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              Démarrer avec {formule.nom}
            </Link>
          </div>
        ))}
      </div>

      {/* Options à la carte */}
      <div className="rounded-2xl border border-border/50 bg-card p-8 mb-16">
        <h2 className="text-xl font-semibold mb-2">Options à la carte</h2>
        <p className="text-sm text-muted-foreground mb-8">
          Ajoutables sur n&apos;importe quelle formule. Listées dans votre devis
          si vous les demandez.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {options.map(({ label, prix }) => (
            <div
              key={label}
              className="flex flex-col gap-1 p-4 rounded-xl bg-secondary/50"
            >
              <span className="text-sm">{label}</span>
              <span className="text-sm font-semibold text-accent">{prix}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ rapide */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-8">Questions fréquentes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              q: "Pourquoi Next.js et pas WordPress ?",
              r: "Next.js produit des sites plus rapides, mieux référencés par Google, et entièrement sécurisés. Pas d'extensions à maintenir, pas de failles de sécurité. C'est la même technologie qu'utilisent des entreprises comme TotalEnergies ou les Aéroports de Paris.",
            },
            {
              q: "Combien de temps pour avoir mon site ?",
              r: "5 à 7 jours pour l'Essentiel, 10 à 15 jours pour le Standard, 3 à 4 semaines pour le Premium. Le délai démarre dès que vous m'avez fourni les éléments nécessaires (textes, photos, logo).",
            },
            {
              q: "Et si je veux modifier mon site après ?",
              r: "Les modifications post-livraison sont facturées 60€/h. Pour éviter ça, je vous recommande de préparer soigneusement vos textes avant le début du projet. Un round de modifications est inclus dans la formule Standard.",
            },
            {
              q: "Je n'ai pas de nom de domaine. Que faire ?",
              r: "Je m'occupe de tout : achat du domaine, configuration DNS, mise en ligne sur Vercel. Vous n'avez rien à gérer de technique. Le coût du domaine (~10-15€/an) est à votre charge.",
            },
          ].map(({ q, r }) => (
            <div
              key={q}
              className="p-6 rounded-2xl border border-border/50 bg-card"
            >
              <h3 className="font-semibold mb-3 text-sm">{q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{r}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-muted-foreground mb-6">
          Pas sûr de quelle formule choisir ?
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background text-sm font-semibold rounded-full hover:bg-foreground/90 transition-colors cursor-pointer"
        >
          Me parler de votre projet <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
