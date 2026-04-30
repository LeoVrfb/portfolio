import { Metadata } from "next";
import Link from "next/link";
import { Check, X, ArrowRight, Clock, ChevronDown, Sliders, Mail } from "lucide-react";
import { BlurFade } from "@/components/animations/blur-fade";
import {
  BookingDiscoveryCard,
  BookingDiscoveryButton,
} from "@/components/sections/booking-discovery-cta";

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
    colorClass: "text-(--lavender)",
    borderClass: "border-(--lavender)/45 bg-(--lavender)/5",
    hoverBorder: "hover:border-(--lavender)/65",
    ctaClass: "bg-(--lavender)/18 border-(--lavender)/40 text-(--lavender) group-hover:bg-(--lavender)/28",
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
    colorClass: "text-(--gold)",
    borderClass: "border-(--gold)/25 bg-(--gold)/3",
    hoverBorder: "hover:border-(--gold)/50",
    ctaClass: "bg-(--gold)/12 border-(--gold)/30 text-(--gold) group-hover:bg-(--gold)/22",
    priceColor: "var(--gold)",
  },
];

const faq = [
  {
    q: "Pourquoi pas un outil no-code (Wix, Squarespace, Webflow) ?",
    r: "Les outils no-code sont pratiques pour démarrer, mais ils plafonnent vite : design contraint par les templates, performance limitée, SEO bridé, et abonnement à vie. Je code des sites faits main, performants, et dont vous êtes propriétaire à 100% — sans coût mensuel récurrent.",
  },
  {
    q: "Combien de temps pour avoir mon site ?",
    r: "5 jours ouvrés pour l'Essentiel, 10 jours pour le Standard, 3 semaines pour le Premium. Le délai démarre dès réception de vos éléments (textes, photos, logo).",
  },
  {
    q: "Vous faites des maquettes Figma avant de coder ?",
    r: "Non, et c'est volontaire. Je vous propose une direction (palette, style, ambiance), puis je passe directement au code. Vous voyez votre site progresser en vrai — pas une maquette figée à valider en aveugle. Ça va plus vite, et le résultat est forcément fidèle au final.",
  },
  {
    q: "Comment se passe la collaboration concrètement ?",
    r: "On commence par un appel visio pour comprendre votre activité et votre univers. Je vous propose une direction visuelle, puis je code la première page. À partir de là vous me faites confiance jusqu'à la livraison — itérations via les heures de retouches incluses, mise en ligne, et c'est parti.",
  },
  {
    q: "Puis-je voir des exemples de sites que vous avez faits ?",
    r: "Oui, vous trouverez une sélection sur la page projets, et 3 réalisations sont mises en avant directement sur chaque page formule. Du e-commerce d'artiste à des applications déployées sur des centaines de tablettes en stations TotalEnergies — chaque projet a sa propre identité.",
  },
  {
    q: "Et si je veux une option qui n'est pas dans ma formule ?",
    r: "Chaque formule a un périmètre clair. Si vous voulez une option qui n'y figure pas (par exemple un design 100% sur mesure ou un CMS en Essentiel), il faut passer à la formule supérieure. Pas de mélange à la carte hors des options listées : ça garde les délais courts et les prix clairs.",
  },
  {
    q: "Et si je veux modifier mon site après livraison ?",
    r: "2h de retouches sont incluses en Essentiel, 5h en Standard, 10h en Premium. Au-delà : 60€/h avec devis avant intervention. Ou maintenance mensuelle à 50€/mois (1h de modifs incluse + suivi technique).",
  },
  {
    q: "Je n'ai pas de nom de domaine. Que faire ?",
    r: "Je vous accompagne pour acheter votre domaine en votre nom. Cela vous appartient, vous gardez le contrôle. Le coût (~10 à 15€/an) reste à votre charge.",
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
            Site entièrement codé, jamais généré par un outil no-code comme Wix ou WordPress. Pas d&apos;abonnement à vie, pas de modèle interchangeable.
          </p>
        </BlurFade>
      </div>

      {/* Formules — Standard légèrement scalée + glow lavande pour ressortir */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5 mb-16 items-stretch">
        {formules.map((formule, i) => (
          <BlurFade key={formule.nom} delay={0.2 + i * 0.08} className="h-full">
            <Link
              href={`/services/${formule.slug}`}
              className={`relative rounded-2xl border flex flex-col cursor-pointer group transition-all duration-300 h-full ${formule.borderClass} ${formule.hoverBorder} ${
                formule.highlighted
                  ? "lg:scale-[1.04] hover:scale-[1.055] lg:shadow-[0_0_0_1px_color-mix(in_oklab,var(--lavender)_25%,transparent),0_20px_60px_-20px_color-mix(in_oklab,var(--lavender)_40%,transparent)]"
                  : "lg:scale-[0.97] hover:scale-[0.985]"
              }`}
            >
              {formule.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 lg:left-5 lg:translate-x-0 z-10">
                  <span
                    className="text-[10px] font-bold px-3 py-1.5 bg-(--lavender) text-black rounded-full tracking-[0.12em] uppercase shadow-[0_4px_16px_-4px_color-mix(in_oklab,var(--lavender)_60%,transparent)]"
                  >
                    ★ La plus choisie
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
                <p
                  className="text-sm leading-snug opacity-90"
                  style={formule.priceColor ? { color: formule.priceColor } : undefined}
                >
                  {formule.accroche}
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
                  Configurer cette formule
                  <ArrowRight size={12} className="inline ml-1.5 -mt-0.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          </BlurFade>
        ))}
      </div>

      {/* Bloc 2 cartes : Discuter / Configurer — entre les formules et la FAQ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-14">
        <BlurFade delay={0.05} className="h-full">
          <BookingDiscoveryCard source="discovery" />
        </BlurFade>

        <BlurFade delay={0.12}>
          <Link
            href="/services/standard#configurateur"
            className="group flex flex-col h-full p-5 sm:p-6 rounded-2xl border border-(--lavender)/35 bg-(--lavender)/5 hover:border-(--lavender)/60 hover:bg-(--lavender)/9 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-(--lavender)/15 border border-(--lavender)/35 flex items-center justify-center shrink-0">
                <Sliders size={16} className="text-(--lavender)" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-(--lavender)">
                Vous savez ce qu&apos;il vous faut&nbsp;?
              </p>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug mb-2">
              Configurez votre projet, recevez votre devis
            </h3>
            <p className="text-sm text-white/70 leading-relaxed mb-5 flex-1">
              Choisissez votre formule, cochez vos options, vous recevez une estimation détaillée par email. Aucun paiement à cette étape.
            </p>
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-(--lavender) text-black text-xs font-bold transition-all">
                Configurer la formule Standard
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </BlurFade>
      </div>

      {/* Scroll hint + séparateur */}
      <div className="flex flex-col items-center gap-2 py-8 text-white/65">
        <span className="text-[10px] tracking-[0.3em] uppercase">Questions fréquentes</span>
        <ChevronDown size={16} className="animate-bounce" />
      </div>

      {/* FAQ */}
      <div className="mb-14">
        <h2 className="text-xl font-black text-white tracking-tight mb-5">Questions fréquentes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {faq.map(({ q, r }) => (
            <div key={q} className="p-5 rounded-2xl border border-white/10 bg-white/2.5">
              <h3 className="font-semibold text-sm text-accent mb-2">{q}</h3>
              <p className="text-xs text-white/85 leading-relaxed">{r}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA final — bouton principal réserver appel (modale) + lien secondaire mail */}
      <div className="text-center">
        <p className="text-white/75 mb-5 text-sm">
          Pas sûr de quelle formule choisir&nbsp;?
        </p>
        <BookingDiscoveryButton source="discovery" />
        <p className="text-[11px] text-white/50 mt-3">
          15 min sans engagement, en visio ou par téléphone
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 mt-4 text-xs text-white/55 hover:text-white transition-colors cursor-pointer"
        >
          <Mail size={12} />
          Ou m&apos;écrire un mail
        </Link>
      </div>
    </div>
  );
}
