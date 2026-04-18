export type AddonSubOptionChoice = {
  id: string
  label: string
  detail?: string
  // Delta appliqué au prix de base de l'addon. null = bascule l'addon sur devis.
  prixDelta: number | null
}

export type AddonSubOption = {
  id: string                    // ex: "type", "volume"
  label: string                 // ex: "Type de boutique"
  helper?: string               // texte d'aide sous le label
  type: "radio" | "pills"       // rendu visuel
  required: boolean             // si l'addon est sélectionné, doit être renseigné
  choices: AddonSubOptionChoice[]
}

export type Addon = {
  id: string
  label: string
  description: string
  detail?: string  // explication longue affichée au clic sur l'icône info
  prix: number | null // prix de base (avant subOptions). null = sur devis
  subOptions?: AddonSubOption[]
}

export type ServiceDetail = {
  slug: string
  nom: string
  prixBase: number
  accroche: string
  delai: string
  description: string
  pourquoi: string[]
  inclus: { titre: string; detail?: string }[]
  addons: Addon[]
  highlighted?: boolean
  color: string
}

// Addons partagés (mêmes prix toutes formules) — réutilisés tels quels
const ADDON_GMB_CREATION: Addon = {
  id: "gmb-creation",
  label: "Google Business Profile (création)",
  description: "Création ou optimisation de votre fiche Google Maps",
  detail:
    "Création ou optimisation complète de la fiche Google Business Profile (Google Maps) : photos, horaires, description, catégories. Indispensable pour les commerces locaux : votre fiche apparaît dans les résultats Google Maps quand quelqu'un cherche votre activité près de chez lui.",
  prix: 80,
}

const ADDON_GMB_SUIVI: Addon = {
  id: "gmb-suivi",
  label: "Google Business Profile — suivi 3 mois",
  description: "Mise à jour photos, réponses aux avis, posts mensuels",
  detail:
    "Suivi mensuel pendant 3 mois après la création/optimisation de la fiche Google Business Profile : mise à jour des photos, réponses aux avis, ajout de posts. Une fiche bien gérée peut doubler la visibilité locale.",
  prix: 150,
}

const ADDON_RESERVATION: Addon = {
  id: "reservation",
  label: "Intégration de réservation",
  description: "TheFork, Zenchef, Planity, Calendly selon votre outil",
  detail:
    "Intégration d'un bouton de réservation directement sur le site, connecté à votre outil existant (TheFork, Zenchef, Planity, Calendly). Vos visiteurs réservent sans jamais quitter votre site.",
  prix: 80,
}

const ADDON_MIGRATION: Addon = {
  id: "migration",
  label: "Migration ancien site",
  description: "Récupération du contenu et redirections SEO",
  detail:
    "Récupération du contenu de l'ancien site (textes, images, URLs, balises SEO) et réintégration dans le nouveau. Configuration des redirections 301 pour préserver le ranking Google actuel.",
  prix: 200,
}

const ADDON_PAGE_SUPP: Addon = {
  id: "page-supp",
  label: "Page supplémentaire",
  description: "Chaque page additionnelle au-delà de la formule",
  detail:
    "Page additionnelle au-delà de ce qui est inclus dans la formule. Conçue dans la même charte graphique, optimisée SEO. Cas particulier : page galerie/portfolio avec beaucoup de contenu (>20 items) → sur devis.",
  prix: 60,
}

const ADDON_PHOTOS: Addon = {
  id: "pack-photos",
  label: "Pack 10 photos (intégration)",
  description: "Sélection éditoriale, recadrage, compression WebP",
  detail:
    "Intégration de 10 photos fournies par le client : sélection éditoriale, recadrage, compression WebP, intégration au bon endroit du site. Ce n'est PAS du shooting photo (pour ça, le client passe par un photographe). Pour des photos générées par IA : sur devis.",
  prix: 50,
}

// Volume produits e-commerce : 10 inclus, paliers 20/30/50, au-delà sur devis.
const ECOMMERCE_VOLUME_CHOICES: AddonSubOptionChoice[] = [
  { id: "10", label: "10", detail: "Inclus", prixDelta: 0 },
  { id: "20", label: "20", prixDelta: 30 },
  { id: "30", label: "30", prixDelta: 60 },
  { id: "50", label: "50", prixDelta: 120 },
  { id: "50plus", label: "50+", detail: "Sur devis", prixDelta: null },
]

const ADDON_ECOMMERCE: Addon = {
  id: "ecommerce",
  label: "E-commerce",
  description: "Boutique en ligne avec Stripe : carte, Apple Pay, Google Pay",
  detail:
    "Boutique en ligne complète. Sans panier (190€) : achat unitaire via Stripe Checkout direct, idéal pour pièces uniques, prestations, œuvres, produits luxe. Avec panier (+90€) : vraie boutique multi-produits, panier, filtres, pagination. Inclus dans tous les cas : configuration compte Stripe (avec accompagnement visio 30 min), page produit avec slider d'images, checkout Stripe (carte, Apple Pay, Google Pay, Link), page de confirmation, emails (client + vendeur), pages légales obligatoires (CGV, retour, RGPD), tests en mode test puis passage en live, indexation Google Search Console. Volume : 10 produits inclus, paliers 20 (+30€), 30 (+60€), 50 (+120€). Au-delà de 50 produits : sur devis (vraie maintenance catalogue).",
  prix: 190,
  subOptions: [
    {
      id: "type",
      label: "Type de boutique",
      type: "radio",
      required: true,
      choices: [
        {
          id: "sans-panier",
          label: "Sans panier",
          detail: "Stripe Checkout direct — pièces uniques, prestations",
          prixDelta: 0,
        },
        {
          id: "avec-panier",
          label: "Avec panier",
          detail: "Boutique multi-produits, filtres, pagination",
          prixDelta: 90,
        },
      ],
    },
    {
      id: "volume",
      label: "Combien de produits ?",
      helper: "10 inclus · au-delà de 50 sur devis",
      type: "pills",
      required: true,
      choices: ECOMMERCE_VOLUME_CHOICES,
    },
  ],
}

const ADDON_CMS_SANITY: Addon = {
  id: "cms-sanity",
  label: "CMS Headless Sanity",
  description: "Modifiez vos textes, photos, produits en autonomie",
  detail:
    "CMS pour gérer vos contenus sans toucher au code. Grille selon le volume d'entrées modifiables (un produit, un article, un membre d'équipe, une photo, un témoignage = une entrée) : 150€ jusqu'à 20 entrées (vitrine basique), 200€ de 21 à 50 entrées (vitrine + blog ou petit catalogue), 300€ de 51 à 100 entrées (e-commerce 30-50 produits). Au-delà de 100 entrées : sur devis. Inclus systématiquement : mise en place du schéma Sanity adapté au site, connexion Next.js ↔ Sanity (revalidation auto), compte Sanity au nom du client, formation 30 min en visio enregistrée, documentation simple écrite. Sanity est gratuit jusqu'à 10 000 documents.",
  prix: 150,
  subOptions: [
    {
      id: "volume",
      label: "Volume d'entrées modifiables",
      helper: "Un produit, un article, un témoignage = une entrée",
      type: "pills",
      required: true,
      choices: [
        { id: "20", label: "≤ 20", detail: "Inclus", prixDelta: 0 },
        { id: "50", label: "21–50", prixDelta: 50 },
        { id: "100", label: "51–100", prixDelta: 150 },
        { id: "100plus", label: "100+", detail: "Sur devis", prixDelta: null },
      ],
    },
  ],
}

const ADDON_MULTILINGUE_LONG: Addon = {
  id: "multilingue-long",
  label: "Multilingue — articles / textes longs",
  description: "Pour blog volumineux ou descriptions produits détaillées",
  detail:
    "Si le site a beaucoup d'articles de blog, des descriptions produit longues, des FAQs détaillées : devis spécifique selon le volume (compter ~30€/tranche de 1000 mots traduits + relus). Pour des langues asiatiques (JP, ZH) ou arabe (RTL) : sur devis également.",
  prix: null,
}

export const services: ServiceDetail[] = [
  {
    slug: "essentiel",
    nom: "Essentiel",
    prixBase: 590,
    accroche: "Une présence pro sans abonnement à vie",
    delai: "5 jours ouvrés",
    description:
      "Site vitrine professionnel sur une seule page avec plusieurs sections. Pour qui veut une présence en ligne sérieuse, performante et durable — au-delà de ce qu'un outil no-code ou un template peut vraiment offrir. Code à vous, hébergement inclus, sans abonnement à vie.",
    pourquoi: [
      "Vous voulez exister sur Google rapidement, sans vous ruiner",
      "Vous êtes artisan, freelance, micro-entrepreneur ou vous lancez un produit",
      "Vous ne voulez aucun abonnement mensuel à vie",
      "Vous préférez payer une fois et garder votre code",
    ],
    inclus: [
      { titre: "Une page, plusieurs sections", detail: "Accueil, services, à propos, contact" },
      { titre: "Design moderne, simple et responsive", detail: "Choix dans une short-list de 3 directions visuelles, adapté à votre charte. Parfait sur mobile, tablette et desktop." },
      { titre: "Formulaire de contact", detail: "Envoi par email via Resend, sans frais mensuels" },
      { titre: "SEO de base", detail: "Sitemap, robots.txt, balises title/meta, alt text sur les images" },
      { titre: "Galerie 10 images", detail: "Optimisées pour un chargement rapide" },
      { titre: "Déploiement Vercel + DNS", detail: "Hébergement inclus + configuration du domaine" },
      { titre: "2h de retouches incluses", detail: "Ajustements post-livraison sans surcoût" },
    ],
    addons: [
      ADDON_ECOMMERCE,
      {
        id: "redaction",
        label: "Rédaction des textes",
        description: "Tous les textes du site rédigés à partir d'un brief",
        detail:
          "Rédaction de tous les textes du site à partir d'un brief client en visio 1h. Textes pensés pour convaincre vos visiteurs et bien compris par Google. Inclus en Standard et Premium.",
        prix: 100,
      },
      {
        id: "seo-avance",
        label: "SEO avancé",
        description: "Schema.org étendu, OG, Search Console, audit contenu",
        detail:
          "Tout ce qui aide Google à mieux comprendre et indexer le site. Inclus : Schema.org étendu (LocalBusiness, Product, Article, BreadcrumbList, FAQ selon les pages), OpenGraph + Twitter Cards optimisés, meta dynamiques par page, sitemap dynamique, robots.txt fin, inscription Google Search Console + soumission sitemap, audit du contenu (densité de mots-clés, structure h1/h2/h3, liens internes), plan de redirection si remplace un ancien site.",
        prix: 150,
      },
      {
        id: "performance",
        label: "Performance (Lighthouse 95+)",
        description: "Audit complet + objectif 95+ sur toutes les métriques",
        detail:
          "Audit Lighthouse complet avec objectif 95+ sur les 4 métriques (Performance, Accessibilité, SEO, Best Practices). Inclus : toutes les images en WebP avec lazy loading natif, animations CSS prioritaires sur GSAP/JS quand possible, SVG transformés en composants React (svgr), optimisation des fonts (subset, preload, font-display swap), audit du bundle JS + code splitting agressif, optimisation Core Web Vitals (LCP, INP, CLS), compression gzip/brotli via Vercel.",
        prix: 120,
      },
      {
        id: "analytics",
        label: "Google Analytics 4",
        description: "Compte client + dashboard configuré",
        detail:
          "Création du compte au nom du client, configuration du tracking, dashboard de base. Vous saurez combien de personnes visitent votre site, d'où elles viennent, quelles pages elles consultent. Inclus en Standard et Premium.",
        prix: 50,
      },
      ADDON_GMB_CREATION,
      ADDON_GMB_SUIVI,
      ADDON_RESERVATION,
      ADDON_CMS_SANITY,
      {
        id: "multilingue",
        label: "Multilingue FR + EN (textes courts)",
        description: "next-intl, toggle langue, URLs localisées, SEO traduit",
        detail:
          "Pour les sites avec contenus relativement courts (sections, descriptions, formulaires). Inclus : configuration next-intl, fichiers de traduction fr/en, toggle de langue dans le header, URLs localisées (/fr/... et /en/...), traduction des balises SEO pour le ranking international. Pour textes longs / articles : option séparée sur devis. Autres langues (ES, IT, DE) : même tarif par langue ajoutée.",
        prix: 150,
      },
      ADDON_MIGRATION,
      ADDON_PAGE_SUPP,
      ADDON_PHOTOS,
      {
        id: "formation",
        label: "Formation 30 min",
        description: "Visio enregistrée pour gérer son site en autonomie",
        detail:
          "Visio enregistrée pour apprendre à gérer son site (mises à jour de contenu simple via Vercel ou via le CMS si pris). Accessible à vie, sans prérequis technique. Inclus en Standard et automatiquement avec tout CMS.",
        prix: 50,
      },
    ],
    highlighted: false,
    color: "var(--accent)",
  },
  {
    slug: "standard",
    nom: "Standard",
    prixBase: 990,
    accroche: "Un site qui travaille pour vous",
    delai: "10 jours ouvrés",
    description:
      "Site vitrine complet avec pages séparées, design personnalisé, contenu rédigé, SEO local optimisé, Google Analytics. Conçu pour générer des prospects via Google pendant que vous bossez sur votre métier.",
    pourquoi: [
      "Vous êtes commerçant local, PME, ou cabinet (avocat, comptable, médecin)",
      "Vous voulez être trouvé sur Google dans les recherches de votre secteur",
      "Vous voulez voir d'où viennent vos visiteurs et adapter votre offre",
      "Vous avez déjà un site vieillissant à refaire",
    ],
    inclus: [
      { titre: "Tout ce qui est dans Essentiel", detail: "Design responsive, formulaire de contact, SEO de base, galerie, hébergement" },
      { titre: "5 à 7 pages séparées", detail: "Accueil, à propos, services, contact + 1 à 3 pages métier" },
      { titre: "Design personnalisé", detail: "Palette de couleurs, typographie et ambiance choisies en visio brief" },
      { titre: "Rédaction des textes", detail: "À partir d'un brief client en visio 1h" },
      { titre: "SEO complet", detail: "Schema.org Local Business, OpenGraph, descriptions optimisées, structure H1/H2/H3" },
      { titre: "Google Analytics 4", detail: "Compte client + dashboard configuré" },
      { titre: "Formulaire de devis personnalisé", detail: "Champs adaptés à votre activité" },
      { titre: "Formation 30 min en visio", detail: "Utilisation, mise à jour des infos simples" },
      { titre: "5h de retouches incluses", detail: "Ajustements post-livraison sans surcoût" },
    ],
    addons: [
      ADDON_ECOMMERCE,
      {
        id: "seo-avance",
        label: "SEO avancé",
        description: "Schema.org étendu, OG, Search Console, audit contenu",
        detail:
          "Tout ce qui aide Google à mieux comprendre et indexer le site, en complément du SEO complet déjà inclus en Standard. Inclus : Schema.org étendu (Product, Article, BreadcrumbList, FAQ selon les pages), OpenGraph optimisé par page, meta dynamiques, sitemap dynamique, robots.txt fin, inscription Google Search Console + soumission sitemap, audit du contenu, plan de redirection si remplace un ancien site.",
        prix: 100,
      },
      {
        id: "performance",
        label: "Performance (Lighthouse 95+)",
        description: "Audit complet + objectif 95+ sur toutes les métriques",
        detail:
          "Audit Lighthouse complet avec objectif 95+ sur les 4 métriques (Performance, Accessibilité, SEO, Best Practices). Inclus : toutes les images en WebP avec lazy loading natif, animations CSS prioritaires sur GSAP/JS quand possible, SVG transformés en composants React (svgr), optimisation des fonts (subset, preload, font-display swap), audit du bundle JS + code splitting agressif, optimisation Core Web Vitals (LCP, INP, CLS), compression gzip/brotli via Vercel.",
        prix: 100,
      },
      ADDON_GMB_CREATION,
      ADDON_GMB_SUIVI,
      ADDON_RESERVATION,
      ADDON_CMS_SANITY,
      {
        id: "multilingue",
        label: "Multilingue FR + EN (textes courts)",
        description: "next-intl, toggle langue, URLs localisées, SEO traduit",
        detail:
          "Pour les sites avec contenus relativement courts (sections, descriptions, formulaires). Inclus : configuration next-intl, fichiers de traduction fr/en, toggle de langue dans le header, URLs localisées (/fr/... et /en/...), traduction des balises SEO pour le ranking international. Pour textes longs / articles : option séparée sur devis. Autres langues (ES, IT, DE) : même tarif par langue ajoutée.",
        prix: 150,
      },
      ADDON_MIGRATION,
      {
        id: "animations-premium",
        label: "Animations premium (GSAP, 3D)",
        description: "Transitions, micro-interactions, effets 3D légers",
        detail:
          "Animations sur mesure : transitions entre pages, apparitions au scroll, micro-interactions sur boutons et cartes, effets 3D légers si pertinents. Le genre d'effets qu'on ne fait pas avec un template WordPress. Non disponible en Essentiel (incluses en Premium).",
        prix: 250,
      },
      ADDON_PAGE_SUPP,
      ADDON_PHOTOS,
    ],
    highlighted: true,
    color: "var(--lavender)",
  },
  {
    slug: "premium",
    nom: "Premium",
    prixBase: 1890,
    accroche: "Un site qui vous distingue",
    delai: "3 semaines",
    description:
      "Site sur mesure niveau agence. Design 100% custom, animations premium, CMS inclus pour autonomie complète, performance optimisée Lighthouse 95+, SEO avancé, multilingue FR+EN. Vous gérez votre contenu en autonomie via Sanity, vos visiteurs voient un site qui n'existe nulle part ailleurs.",
    pourquoi: [
      "Vous êtes une marque établie qui veut un site signature",
      "Vous avez un vrai branding (galerie d'art, restaurant gastronomique, cabinet d'architecte)",
      "Vous avez compris la valeur d'un site qui ne ressemble à aucun autre",
      "Vous voulez gérer votre contenu en autonomie via un CMS",
    ],
    inclus: [
      { titre: "Tout ce qui est dans Standard", detail: "Pages séparées, design personnalisé, rédaction, SEO complet, Google Analytics, formation, retouches" },
      { titre: "Jusqu'à 10 pages", detail: "Au-delà : +60€ par page" },
      { titre: "Design 100% sur mesure", detail: "3 directions visuelles proposées en maquette, 1 retenue, itération" },
      { titre: "Animations premium incluses", detail: "GSAP, transitions entre pages, micro-interactions sur mesure" },
      { titre: "SEO avancé", detail: "Schema.org étendu, OpenGraph optimisé, soumission Google Search Console, audit du contenu" },
      { titre: "Performance optimisée (Lighthouse 95+)", detail: "WebP, lazy loading, animations CSS prioritaires, audit bundle" },
      { titre: "CMS Headless Sanity inclus", detail: "Jusqu'à 50 entrées modifiables (au-delà : +50€ par tranche de 50)" },
      { titre: "Formation 30 min CMS incluse", detail: "Visio enregistrée, accessible à vie" },
      { titre: "Multilingue FR + EN inclus", detail: "Pour les textes courts. Articles longs sur devis" },
      { titre: "10h de retouches incluses", detail: "Ajustements post-livraison sans surcoût" },
      { titre: "1 mois de support post-livraison", detail: "Corrections, ajustements inclus" },
    ],
    addons: [
      ADDON_ECOMMERCE,
      ADDON_GMB_CREATION,
      ADDON_GMB_SUIVI,
      ADDON_RESERVATION,
      ADDON_MULTILINGUE_LONG,
      ADDON_MIGRATION,
      ADDON_PAGE_SUPP,
    ],
    highlighted: false,
    color: "var(--gold)",
  },
]

export function getService(slug: string): ServiceDetail | undefined {
  return services.find((s) => s.slug === slug)
}
