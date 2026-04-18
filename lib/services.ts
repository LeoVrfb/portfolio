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
const ADDON_GMB: Addon = {
  id: "gmb",
  label: "Google Business Profile",
  description: "Création ou optimisation de votre fiche Google Maps",
  detail:
    "Création ou optimisation complète de la fiche Google Business Profile (Google Maps) : photos, horaires, description, catégories. Indispensable pour les commerces locaux : votre fiche apparaît dans les résultats Google Maps quand quelqu'un cherche votre activité près de chez lui. Option suivi 3 mois (+150€) : mise à jour mensuelle des photos, réponses aux avis, ajout de posts. Une fiche bien gérée peut doubler la visibilité locale.",
  prix: 80,
  subOptions: [
    {
      id: "suivi",
      label: "Suivi 3 mois",
      helper: "Optionnel : je gère votre fiche pendant 3 mois après la création",
      type: "radio",
      required: true,
      choices: [
        {
          id: "sans-suivi",
          label: "Sans suivi",
          detail: "Création seule, vous gérez la fiche ensuite",
          prixDelta: 0,
        },
        {
          id: "avec-suivi",
          label: "Avec suivi 3 mois",
          detail: "Photos, avis, posts mensuels pendant 3 mois",
          prixDelta: 150,
        },
      ],
    },
  ],
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
  id: "refonte",
  label: "Refonte d'un site existant",
  description: "Reprise des textes, images et redirections SEO de votre ancien site",
  detail:
    "À cocher uniquement si vous prenez une formule pour refaire un site qui existe déjà. Inclus : récupération du contenu de votre ancien site (textes, images, balises SEO), intégration dans le nouveau site, mise en place des redirections 301 pour préserver votre référencement Google et éviter les 404 sur les anciens liens. À ne pas confondre avec une migration pure (changement d'hébergeur sans refaire le site) : pour ce besoin, contactez-moi pour un devis sur mesure.",
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

// Volume photos additionnelles : 10 inclus dans le prix de base, paliers par tranche de 10.
const PHOTOS_VOLUME_CHOICES: AddonSubOptionChoice[] = [
  { id: "10", label: "10", detail: "Inclus", prixDelta: 0 },
  { id: "20", label: "20", prixDelta: 30 },
  { id: "30", label: "30", prixDelta: 60 },
  { id: "50", label: "50", prixDelta: 120 },
  { id: "100", label: "100", prixDelta: 270 },
  { id: "100plus", label: "100+", detail: "Sur devis", prixDelta: null },
]

const ADDON_PHOTOS_SUPP: Addon = {
  id: "photos-supp",
  label: "Photos ou images supplémentaires",
  description: "Visuels d'ambiance, illustrations, photos d'équipe (hors photos produits)",
  detail:
    "Pour ajouter des photos ou images au site (visuels d'ambiance, illustrations, photos d'équipe, décor). Inclus à chaque palier : sélection éditoriale, recadrage, compression WebP, intégration au bon endroit. Ce n'est pas du shooting (pour ça, passez par un photographe). Pour des images générées par IA : sur devis. Important : les photos produits dans une boutique e-commerce sont déjà couvertes par l'option e-commerce, comptez en moyenne 2 photos par produit dans votre estimation.",
  prix: 30,
  subOptions: [
    {
      id: "volume",
      label: "Combien de photos ou images ?",
      helper: "10 incluses dans le prix de base · au-delà de 100 sur devis",
      type: "pills",
      required: true,
      choices: PHOTOS_VOLUME_CHOICES,
    },
  ],
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
          detail: "Stripe Checkout direct (pièces uniques, prestations)",
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
    "CMS pour gérer vos contenus sans toucher au code. Grille selon le volume d'entrées modifiables (un produit, un article, un membre d'équipe, une photo, un témoignage = une entrée) : 150€ jusqu'à 20 entrées (vitrine basique), 200€ de 21 à 50 entrées (vitrine + blog ou petit catalogue), 300€ de 51 à 100 entrées (e-commerce 30-50 produits). Au-delà de 100 entrées : sur devis. Inclus systématiquement : mise en place du schéma Sanity adapté au site, connexion Next.js ↔ Sanity (revalidation auto), compte Sanity au nom du client, formation 30 min en visio en direct, documentation simple écrite. Sanity est gratuit jusqu'à 10 000 documents.",
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

const ADDON_MULTILINGUE: Addon = {
  id: "multilingue",
  label: "Multilingue FR + EN",
  description: "Site disponible en français et anglais avec bouton de changement de langue",
  detail:
    "Configuration du site en français et en anglais : tous les textes du site, les formulaires et les balises SEO sont traduits, avec un bouton de changement de langue dans le header. Pour des contenus longs (blog volumineux, descriptions produits détaillées, FAQs riches), voyez l'option dédiée sur devis. Autres langues (espagnol, italien, allemand, etc.) : même tarif par langue ajoutée.",
  prix: 150,
}

const ADDON_MULTILINGUE_LONG: Addon = {
  id: "multilingue-long",
  label: "Multilingue : articles ou textes longs",
  description: "Pour blog volumineux ou descriptions produits détaillées",
  detail:
    "Si le site a beaucoup d'articles de blog, des descriptions produit longues, des FAQs détaillées : devis spécifique selon le volume (compter environ 30€ par tranche de 1000 mots traduits puis relus). Pour des langues asiatiques (japonais, chinois) ou écrites de droite à gauche (arabe, hébreu) : sur devis également.",
  prix: null,
}

// Niveaux SEO — gradation claire base / + / Pro
// SEO de base : inclus dans Essentiel (sitemap, robots, meta, alt basiques)
// SEO+        : inclus dans Standard, en option payante en Essentiel
// SEO Pro     : inclus dans Premium, en option payante en Standard
const ADDON_SEO_PLUS: Addon = {
  id: "seo-plus",
  label: "SEO+",
  description: "Le cran intermédiaire entre SEO de base et SEO Pro",
  detail:
    "Passe votre site au niveau intermédiaire en SEO. Inclus : Schema.org Local Business (pour apparaître dans le pack local Google Maps), OpenGraph et Twitter Cards (aperçu propre du lien lors d'un partage sur les réseaux), descriptions meta optimisées par section, structure h1/h2/h3 logique, alt texts soignés et descriptifs sur toutes les images. Note : c'est exactement ce qui est déjà inclus dans la formule Standard. Si vous voulez le top niveau (SEO Pro), prenez plutôt la formule Standard ou Premium.",
  prix: 80,
}

const ADDON_SEO_PRO: Addon = {
  id: "seo-pro",
  label: "SEO Pro",
  description: "Le top niveau SEO en complément du SEO+ déjà inclus",
  detail:
    "Tout ce qui aide Google à comprendre et indexer le site en profondeur, en complément du SEO+ déjà inclus en Standard. Inclus : Schema.org étendu (Product, Article, BreadcrumbList, FAQ selon les pages), OpenGraph optimisé page par page, balises meta dynamiques, sitemap dynamique, robots.txt fin, inscription Google Search Console et soumission de la sitemap, audit complet du contenu (densité de mots-clés, structure, liens internes), plan de redirections 301 si remplace un ancien site. C'est ce qui est inclus dans la formule Premium.",
  prix: 150,
}

// Pack performance — perf pure uniquement (les optimisations SEO et accessibilité
// du score Lighthouse sont dans les options SEO+ / SEO Pro, pas ici).
const ADDON_PACK_PERFORMANCE_ESSENTIEL: Addon = {
  id: "pack-performance",
  label: "Pack performance",
  description: "Optimisation des temps de chargement et des Core Web Vitals",
  detail:
    "Optimisation poussée des performances réelles côté visiteur : toutes les images en WebP avec lazy loading, animations CSS prioritaires quand possible, SVG transformés en composants React pour éviter les requêtes, optimisation des fonts (subset, preload, font-display swap), audit du bundle JavaScript et code splitting agressif, optimisation des Core Web Vitals (LCP, INP, CLS), compression gzip et brotli via Vercel. Résultat : un site qui charge vite, scrolle de manière fluide et reste réactif. Note : si votre objectif est de monter le score Lighthouse SEO ou Accessibilité, regardez plutôt l'option SEO+ ou SEO Pro.",
  prix: 120,
}

const ADDON_PACK_PERFORMANCE_STANDARD: Addon = {
  ...ADDON_PACK_PERFORMANCE_ESSENTIEL,
  prix: 100,
}

const ADDON_PACK_ANIMATIONS: Addon = {
  id: "pack-animations",
  label: "Pack animations",
  description: "Transitions, micro-interactions, effets au scroll",
  detail:
    "Animations sur mesure : transitions entre pages, apparitions au scroll, micro-interactions sur boutons et cartes. Le genre d'effets qu'on ne fait pas avec un template no-code. Non disponible en Essentiel (incluses en Premium).",
  prix: 250,
}

export const services: ServiceDetail[] = [
  {
    slug: "essentiel",
    nom: "Essentiel",
    prixBase: 590,
    accroche: "Un site simple et propre, fait par un pro, en quelques jours.",
    delai: "5 jours ouvrés",
    description:
      "Site vitrine professionnel d'une seule page avec plusieurs sections. Pour qui lance son activité ou son projet personnel et veut une présence en ligne sérieuse et durable, au-delà de ce qu'un outil no-code peut vraiment offrir. Hébergement Vercel inclus, code à vous.",
    pourquoi: [
      "Vous lancez votre activité ou votre projet personnel",
      "Vous voulez juste être présent en ligne, sans complication",
      "Une seule page longue et bien faite vous suffit",
      "Vous voulez aller vite",
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
      ADDON_SEO_PLUS,
      ADDON_PACK_PERFORMANCE_ESSENTIEL,
      {
        id: "analytics",
        label: "Google Analytics 4",
        description: "Compte client + dashboard configuré",
        detail:
          "Création du compte au nom du client, configuration du tracking, dashboard de base. Vous saurez combien de personnes visitent votre site, d'où elles viennent, quelles pages elles consultent. Inclus en Standard et Premium.",
        prix: 50,
      },
      ADDON_GMB,
      ADDON_RESERVATION,
      ADDON_CMS_SANITY,
      ADDON_MULTILINGUE,
      ADDON_MIGRATION,
      ADDON_PHOTOS_SUPP,
      {
        id: "formation",
        label: "Formation 30 min",
        description: "Visio en direct pour gérer son site en autonomie",
        detail:
          "Visio en direct pour apprendre à gérer son site (mises à jour de contenu simple via Vercel ou via le CMS si pris). Sans prérequis technique. Inclus en Standard et automatiquement avec tout CMS.",
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
    accroche: "Un vrai site complet, à votre image, pensé pour convaincre vos visiteurs.",
    delai: "10 jours ouvrés",
    description:
      "Site vitrine complet avec pages séparées, design personnalisé, contenu rédigé, SEO+ inclus et Google Analytics. Pour les activités établies (artisans, commerçants, freelances, indépendants, PME, professions libérales) qui veulent un site qui les représente vraiment et leur amène des prospects via Google.",
    pourquoi: [
      "Vous avez une activité établie et vous voulez un site qui la représente vraiment",
      "Vous voulez plusieurs pages structurées (services, à propos, contact, etc.)",
      "Vous voulez un design qui ne ressemble à aucun autre, loin des templates Wix",
      "Vous voulez comprendre qui visite votre site grâce à Google Analytics",
      "Vous voulez être visible dans les recherches Google de votre zone (SEO+ inclus)",
    ],
    inclus: [
      { titre: "Tout ce qui est dans Essentiel", detail: "Design responsive, formulaire de contact, SEO de base, galerie, hébergement" },
      { titre: "5 à 7 pages séparées", detail: "Accueil, à propos, services, contact + 1 à 3 pages métier" },
      { titre: "Design personnalisé", detail: "Palette de couleurs, typographie et ambiance choisies en visio brief" },
      { titre: "Rédaction des textes", detail: "À partir d'un brief client en visio 1h" },
      { titre: "SEO+", detail: "Schema.org Local Business (pour apparaître dans le pack local Google Maps), OpenGraph et Twitter Cards, descriptions meta optimisées, structure h1/h2/h3 logique, alt texts soignés. Le cran intermédiaire entre SEO de base et SEO Pro." },
      { titre: "Google Analytics 4", detail: "Compte client + dashboard configuré" },
      { titre: "Formulaire de devis personnalisé", detail: "Champs adaptés à votre activité" },
      { titre: "Formation 30 min en visio", detail: "Utilisation, mise à jour des infos simples" },
      { titre: "5h de retouches incluses", detail: "Ajustements post-livraison sans surcoût" },
    ],
    addons: [
      ADDON_ECOMMERCE,
      ADDON_SEO_PRO,
      ADDON_PACK_PERFORMANCE_STANDARD,
      ADDON_GMB,
      ADDON_RESERVATION,
      ADDON_CMS_SANITY,
      ADDON_MULTILINGUE,
      ADDON_MIGRATION,
      ADDON_PACK_ANIMATIONS,
      ADDON_PAGE_SUPP,
      ADDON_PHOTOS_SUPP,
    ],
    highlighted: true,
    color: "var(--lavender)",
  },
  {
    slug: "premium",
    nom: "Premium",
    prixBase: 1890,
    accroche: "Un site sur mesure, design 100% unique, autonomie totale sur vos contenus.",
    delai: "3 semaines",
    description:
      "Site sur mesure niveau agence. Design 100% custom, pack animations, CMS inclus pour autonomie complète, pack performance, SEO Pro, multilingue FR + EN. Pour les marques établies qui voient leur site comme un investissement sur 3 à 5 ans.",
    pourquoi: [
      "Votre marque a déjà du business à porter et mérite un site signature",
      "Vous voulez un design unique (3 directions proposées en maquette, vous choisissez)",
      "Vous voulez gérer vos contenus en autonomie sans rappeler de développeur (CMS inclus)",
      "Vous voulez des animations soignées et une performance technique irréprochable",
      "Vous voyez ce site comme un investissement sur 3 à 5 ans",
    ],
    inclus: [
      { titre: "Tout ce qui est dans Standard", detail: "Pages séparées, design personnalisé, rédaction, SEO+, Google Analytics, formation, retouches" },
      { titre: "Jusqu'à 10 pages", detail: "Au-delà : +60€ par page" },
      { titre: "Design 100% sur mesure", detail: "3 directions visuelles proposées en maquette, 1 retenue, itération" },
      { titre: "Pack animations inclus", detail: "Transitions entre pages, micro-interactions sur mesure, effets au scroll soignés" },
      { titre: "SEO Pro", detail: "Tout le SEO+ déjà inclus en Standard, en plus : Schema.org étendu (Product, Article, FAQ, BreadcrumbList), OpenGraph optimisé page par page, sitemap dynamique, robots.txt fin, inscription Google Search Console et soumission de la sitemap, audit complet du contenu, plan de redirections 301." },
      { titre: "Pack performance inclus", detail: "Optimisation des Core Web Vitals, WebP, lazy loading, animations CSS prioritaires, audit du bundle JS, optimisation des fonts." },
      { titre: "CMS Headless Sanity inclus", detail: "Jusqu'à 50 entrées modifiables (au-delà : +50€ par tranche de 50)" },
      { titre: "Formation 30 min CMS incluse", detail: "Visio en direct, sans prérequis technique" },
      { titre: "Multilingue FR + EN inclus", detail: "Tous les textes du site, formulaires et balises SEO traduits, avec bouton de changement de langue. Articles longs sur devis." },
      { titre: "10h de retouches incluses", detail: "Ajustements post-livraison sans surcoût" },
      { titre: "1 mois de support post-livraison", detail: "Corrections, ajustements inclus" },
    ],
    addons: [
      ADDON_ECOMMERCE,
      ADDON_GMB,
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
