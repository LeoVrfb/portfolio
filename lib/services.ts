// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

// Format structuré pour le contenu des modales d'information.
// Au lieu d'un gros bloc de texte, on a : intro + sections (titre + bullets) + note.
// Les bullets supportent une syntaxe minimaliste **mot** pour mettre en avant
// des mots-clés (rendus en accent/vert dans la modale).

export type DetailBullet = {
  text: string
  // Si défini, ajoute un badge à droite (ex: "+150€", "Inclus")
  badge?: string
}

export type DetailSection = {
  title?: string
  intro?: string
  bullets?: DetailBullet[]
  // Badge affiché à droite du titre de section (ex: "+150€" pour une sous-option payante)
  badge?: string
  // Variante visuelle : "default" (carte sombre) ou "accent" (légère teinte accent)
  variant?: "default" | "accent"
}

export type DetailContent = {
  intro?: string
  sections?: DetailSection[]
  // Note finale, en gris discret (ex: "Inclus en Standard et Premium")
  note?: string
}

export type AddonSubOptionChoice = {
  id: string
  label: string
  detail?: string
  prixDelta: number | null // null = bascule l'addon sur devis
}

export type AddonSubOption = {
  id: string
  label: string
  helper?: string
  type: "radio" | "pills"
  required: boolean
  choices: AddonSubOptionChoice[]
}

export type Addon = {
  id: string
  label: string
  description: string
  detail?: DetailContent
  prix: number | null
  subOptions?: AddonSubOption[]
}

export type ServiceBenefice = {
  text: string // syntaxe **mot** pour emphasis vert
}

export type ServiceAntiAlternative = {
  titre: string // carte de gauche (rouge) — ex: "Pas d'outils no-code"
  // Mode "single" (legacy) : un seul bloc avec une description en texte riche
  description?: string
  // Mode "split" : 2 cartes côte à côte. Si `consPoints` est présent → mode split.
  consPoints?: string[] // points de la carte gauche (rouge)
  pros?: {
    titre: string // carte de droite — ex: "Codé à la main pour vous"
    // Storytelling court en haut de la carte (avant les points). Syntaxe :
    // **mot** = gras menthe, *mot* = serif italique couleur formule, \n = saut de ligne.
    intro?: string
    points: string[] // points de la carte droite (couleur formule)
  }
}

// Hook éditorial sous la tagline : "Pas un X. / Un Y, Z, W — / comme une métaphore."
export type ServiceHook = {
  pasDe: string      // "Pas un template réchauffé."
  description: string // "Un site pensé, maquetté et codé pour vous —"
  metaphor: string    // "comme un plat fait maison par quelqu'un qui connaît votre goût."
}

export type ServiceInclus = {
  titre: string
  detail?: DetailContent
}

export type ServiceDetail = {
  slug: string
  nom: string
  prixBase: number
  delai: string
  // Description SEO (meta tag uniquement)
  description: string
  // Bloc pitch impactant (header configurateur)
  tagline: string // micro-positionnement psychologique sous le H1. Syntaxe *mot* = serif italique dans la couleur formule
  hook?: ServiceHook // hook éditorial sous la tagline (barre verticale + métaphore en serif italique)
  audiences: string[] // ex: ["Artisan", "Commerçant", "Freelance"]
  promesse: string // grosse phrase. Syntaxe *mot* = serif italique dans la couleur formule
  benefices: ServiceBenefice[]
  antiAlternative?: ServiceAntiAlternative
  // Bloc "Cette formule est faite pour vous si"
  pourquoi: string[]
  inclus: ServiceInclus[]
  addons: Addon[]
  highlighted?: boolean
  color: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Addons partagés (mêmes prix toutes formules)
// ─────────────────────────────────────────────────────────────────────────────

const ADDON_GMB: Addon = {
  id: "gmb",
  label: "Google Business Profile",
  description: "Création ou optimisation de votre fiche Google Maps",
  prix: 80,
  detail: {
    intro:
      "Création ou optimisation complète de votre fiche Google Business Profile. **Indispensable** pour tous les commerces et services locaux : c'est ce qui fait apparaître votre fiche en haut des résultats Google Maps.",
    sections: [
      {
        title: "Création de la fiche",
        badge: "+80€",
        variant: "default",
        bullets: [
          { text: "Photos optimisées et bien cadrées" },
          { text: "Horaires, téléphone, adresse vérifiés" },
          { text: "Description **rédigée pour convertir**" },
          { text: "Catégories choisies pour le **maximum de visibilité**" },
        ],
      },
      {
        title: "Suivi 3 mois (optionnel)",
        badge: "+150€",
        variant: "accent",
        intro: "Je gère votre fiche pendant 3 mois après la création :",
        bullets: [
          { text: "**Mise à jour mensuelle** des photos" },
          { text: "**Réponses aux avis** clients" },
          { text: "**Posts Google** pour rester actif (offres, news, événements)" },
          { text: "Une fiche bien gérée peut **doubler** la visibilité locale" },
        ],
      },
    ],
  },
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
  prix: 80,
  detail: {
    intro:
      "Vos visiteurs réservent **directement** depuis votre site, sans jamais le quitter.",
    sections: [
      {
        title: "Outils compatibles",
        bullets: [
          { text: "**Restaurants** : TheFork, Zenchef, GuestOnline" },
          { text: "**Beauté & bien-être** : Planity, Treatwell" },
          { text: "**Coachs & consultants** : Calendly, Cal.com" },
          { text: "Autres outils : intégration sur demande" },
        ],
      },
    ],
    note: "Vous gardez l'outil que vous utilisez déjà : pas de double saisie, pas de migration.",
  },
}

const ADDON_REFONTE: Addon = {
  id: "refonte",
  label: "Refonte d'un site existant",
  description: "Reprise des textes, images et redirections SEO de votre ancien site",
  prix: 200,
  detail: {
    intro:
      "À cocher **uniquement si** la formule sert à refaire un site qui existe déjà.",
    sections: [
      {
        title: "Ce qui est inclus",
        bullets: [
          { text: "Récupération du **contenu** (textes, images, balises SEO)" },
          { text: "Intégration propre dans le nouveau site" },
          { text: "Mise en place des **redirections 301**" },
          { text: "**Préserve** votre référencement Google et évite les 404" },
        ],
      },
    ],
    note: "À ne pas confondre avec une migration pure (changement d'hébergeur sans refaire le site) : pour ce besoin, devis sur mesure.",
  },
}

const ADDON_PAGE_SUPP: Addon = {
  id: "page-supp",
  label: "Page supplémentaire",
  description: "Chaque page additionnelle au-delà de la formule",
  prix: 60,
  detail: {
    intro: "Page additionnelle au-delà de ce qui est inclus dans la formule.",
    sections: [
      {
        title: "Inclus pour chaque page",
        bullets: [
          { text: "Conçue dans la **même charte graphique**" },
          { text: "**Optimisée SEO** (meta, structure, alt)" },
          { text: "Responsive mobile, tablette et desktop" },
        ],
      },
    ],
    note: "Page galerie/portfolio avec >20 items : sur devis (peut atteindre 200-300€).",
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Photos / images supplémentaires (volume dynamique)
// ─────────────────────────────────────────────────────────────────────────────

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
  prix: 30,
  detail: {
    intro:
      "Pour ajouter des photos ou images au site (visuels d'ambiance, illustrations, photos d'équipe, décor).",
    sections: [
      {
        title: "Ce qui est inclus à chaque palier",
        bullets: [
          { text: "**Sélection éditoriale** des meilleures images" },
          { text: "**Recadrage** au bon format" },
          { text: "**Compression WebP** (chargement rapide)" },
          { text: "Intégration au bon endroit du site" },
        ],
      },
      {
        title: "Ce qui n'est PAS inclus",
        bullets: [
          { text: "**Shooting photo** : passez par un photographe" },
          { text: "**Génération IA** : sur devis (50-150€ selon volume)" },
          { text: "**Photos produits** d'une boutique : déjà couvertes par l'option e-commerce (compter ~2 photos par produit)" },
        ],
      },
    ],
    note: "10 photos incluses dans le prix de base, paliers progressifs ensuite.",
  },
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

// ─────────────────────────────────────────────────────────────────────────────
// E-commerce (volume dynamique + type de boutique)
// ─────────────────────────────────────────────────────────────────────────────

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
  prix: 190,
  detail: {
    intro:
      "Boutique en ligne complète avec Stripe. Deux variantes selon votre besoin : **sans panier** (achat unitaire direct) ou **avec panier** (vraie boutique multi-produits).",
    sections: [
      {
        title: "Sans panier",
        badge: "190€",
        variant: "default",
        intro: "Achat unitaire via Stripe Checkout direct.",
        bullets: [
          { text: "Idéal pour **pièces uniques**, prestations, œuvres, produits luxe" },
          { text: "Le client clique → checkout Stripe direct → paiement" },
        ],
      },
      {
        title: "Avec panier",
        badge: "+90€",
        variant: "accent",
        intro: "Vraie boutique multi-produits.",
        bullets: [
          { text: "**Panier**, filtres, pagination" },
          { text: "Idéal pour catalogues créateur, e-commerce alimentaire, multi-produits" },
        ],
      },
      {
        title: "Inclus dans tous les cas",
        bullets: [
          { text: "Configuration **compte Stripe** (accompagnement visio 30 min)" },
          { text: "Page produit avec slider d'images" },
          { text: "Checkout Stripe : **carte, Apple Pay, Google Pay, Link**" },
          { text: "Page de confirmation + emails (client + vendeur)" },
          { text: "Pages légales obligatoires : **CGV, retour, RGPD**" },
          { text: "Tests en mode test puis passage en live" },
          { text: "Indexation Google Search Console" },
        ],
      },
    ],
    note: "Volume : 10 produits inclus, paliers 20 (+30€), 30 (+60€), 50 (+120€). Au-delà de 50 produits : sur devis (vraie maintenance catalogue).",
  },
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

// ─────────────────────────────────────────────────────────────────────────────
// CMS Sanity
// ─────────────────────────────────────────────────────────────────────────────

const ADDON_CMS_SANITY: Addon = {
  id: "cms-sanity",
  label: "CMS Headless Sanity",
  description: "Modifiez vos textes, photos, produits en autonomie",
  prix: 150,
  detail: {
    intro:
      "Un CMS pour modifier vos contenus **sans toucher au code**. Une « entrée » = un produit, un article, un membre d'équipe, une photo, un témoignage.",
    sections: [
      {
        title: "Grille de prix selon le volume",
        bullets: [
          { text: "**Jusqu'à 20 entrées** (vitrine basique)", badge: "150€" },
          { text: "**21 à 50 entrées** (vitrine + blog ou petit catalogue)", badge: "200€" },
          { text: "**51 à 100 entrées** (e-commerce 30-50 produits)", badge: "300€" },
          { text: "100+ entrées (gros catalogue)", badge: "Devis" },
        ],
      },
      {
        title: "Inclus systématiquement",
        bullets: [
          { text: "Schéma Sanity adapté à votre site" },
          { text: "Connexion Next.js ↔ Sanity (**revalidation auto**)" },
          { text: "Compte Sanity à votre nom" },
          { text: "**Formation 30 min** en visio en direct" },
          { text: "Documentation simple écrite pour vous" },
        ],
      },
    ],
    note: "Sanity reste gratuit jusqu'à 10 000 documents : aucun coût récurrent côté client.",
  },
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

// ─────────────────────────────────────────────────────────────────────────────
// Multilingue
// ─────────────────────────────────────────────────────────────────────────────

const ADDON_MULTILINGUE: Addon = {
  id: "multilingue",
  label: "Multilingue FR + EN",
  description: "Site disponible en français et anglais avec bouton de changement de langue",
  prix: 150,
  detail: {
    intro: "Votre site disponible en **français et en anglais**.",
    sections: [
      {
        title: "Inclus",
        bullets: [
          { text: "**Tous les textes** du site traduits" },
          { text: "**Formulaires** traduits" },
          { text: "**Balises SEO** traduites (titles, descriptions)" },
          { text: "Bouton de changement de langue dans le header" },
        ],
      },
    ],
    note: "Pour des contenus longs (blog volumineux, descriptions produits détaillées) : voir l'option dédiée. Autres langues (ES, IT, DE…) : même tarif par langue ajoutée.",
  },
}

const ADDON_MULTILINGUE_LONG: Addon = {
  id: "multilingue-long",
  label: "Multilingue : articles ou textes longs",
  description: "Pour blog volumineux ou descriptions produits détaillées",
  prix: null,
  detail: {
    intro:
      "Pour les sites avec **beaucoup de contenu textuel** : blog volumineux, descriptions produits longues, FAQs détaillées.",
    sections: [
      {
        title: "Tarification",
        bullets: [
          { text: "Devis selon le **volume réel** de mots à traduire" },
          { text: "Compter environ **30€ par tranche de 1000 mots** traduits puis relus" },
        ],
      },
      {
        title: "Cas spéciaux",
        bullets: [
          { text: "**Langues asiatiques** (japonais, chinois) : sur devis" },
          { text: "**Langues RTL** (arabe, hébreu) : sur devis (changement de layout)" },
        ],
      },
    ],
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// SEO — 3 niveaux
// ─────────────────────────────────────────────────────────────────────────────

const ADDON_SEO_PLUS: Addon = {
  id: "seo-plus",
  label: "SEO+",
  description: "Le cran enrichi : Google et les IA comprennent votre activité",
  prix: 80,
  detail: {
    intro:
      "Passe votre site au **niveau enrichi** en SEO. C'est exactement ce qui est déjà inclus dans la formule Standard. Tout est ajouté pendant qu'on code, **sans intervention externe**.",
    sections: [
      {
        title: "Ce qui est ajouté",
        bullets: [
          { text: "**Schema.org** adapté à votre métier (Organization ou LocalBusiness)" },
          { text: "**OpenGraph + Twitter Cards** avec image personnalisée (aperçu propre quand on partage votre site)" },
          { text: "Title et meta description **optimisés keyword** (1 keyword par page)" },
          { text: "Hiérarchie **h1/h2/h3 pensée pour le SEO** (h2 sous forme de questions = pattern AI-friendly)" },
          { text: "Alt texts **descriptifs et keyword-friendly**" },
          { text: "**Section FAQ AI-friendly** (5+ questions) — clé pour ressortir dans ChatGPT et Perplexity" },
          { text: "**Internal linking propre** entre les sections" },
        ],
      },
    ],
    note: "Si vous voulez le top niveau (SEO Pro avec inscription Google + Bing, audit complet, suivi), prenez plutôt la formule Standard ou Premium directement.",
  },
}

const ADDON_SEO_PRO: Addon = {
  id: "seo-pro",
  label: "SEO Pro",
  description: "Le palier actif : on engage Google et Bing, on audite, on transmet",
  prix: 150,
  detail: {
    intro:
      "Le **top niveau SEO**, en complément du SEO+ déjà inclus en Standard. C'est ce qui est inclus de base dans la formule Premium. **On engage activement** les outils de Google et Bing, on audite votre contenu, et on vous transmet une feuille de route.",
    sections: [
      {
        title: "Schema.org étendu",
        bullets: [
          { text: "Product, Article, BreadcrumbList, FAQ, Review selon les pages" },
          { text: "**Aide Google** à comprendre la nature de chaque page" },
        ],
      },
      {
        title: "Métadonnées avancées",
        bullets: [
          { text: "**OpenGraph optimisé page par page** (chaque page a sa propre image OG)" },
          { text: "Balises meta dynamiques (titres et descriptions par page, pas un template générique)" },
          { text: "Robots.txt fin avec règles par bot" },
        ],
      },
      {
        title: "Indexation Google + Bing",
        bullets: [
          { text: "**Setup complet Google Search Console** (au-delà du setup de base de l'Essentielle : full audit + monitoring)" },
          { text: "Soumission active de la sitemap + demande d'indexation manuelle de la home" },
          { text: "**Setup complet Bing Webmaster Tools** — critique pour ChatGPT Search qui passe par Bing" },
          { text: "Plan de **redirections 301** si remplace un ancien site (combiner avec l'option Refonte)" },
        ],
      },
      {
        title: "Audit & livrables",
        bullets: [
          { text: "**Audit complet du contenu** (densité keywords, structure, opportunités)" },
          { text: "**Internal linking optimisé** (cluster autour des money pages, jus redirigé)" },
          { text: "**Screenshot Lighthouse** final livré comme preuve" },
          { text: "**Document de suivi 1 page** : ce qu'on a fait, ce qu'il faut surveiller dans les 1-3 mois, où regarder dans GSC" },
        ],
      },
    ],
    note: "SEO Pro = one-shot setup + audit + transmission. Le suivi mensuel des positions, la production continue de contenu, le link building : c'est de la maintenance récurrente, à terme proposée en option dédiée.",
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Pack performance — perf pure (les optimisations SEO et accessibilité du score
// Lighthouse sont dans les options SEO+ / SEO Pro, pas ici).
// ─────────────────────────────────────────────────────────────────────────────

const PACK_PERFORMANCE_DETAIL: DetailContent = {
  intro:
    "Optimisation poussée des **performances réelles** côté visiteur : un site qui charge vite, scrolle de manière fluide, reste réactif sur mobile.",
  sections: [
    {
      title: "Images & médias",
      bullets: [
        { text: "Toutes les images en **WebP** avec lazy loading" },
        { text: "**SVG en composants React** (svgr) : pas de requêtes HTTP" },
      ],
    },
    {
      title: "JavaScript & rendu",
      bullets: [
        { text: "**Audit du bundle JS** + code splitting agressif" },
        { text: "Animations **CSS prioritaires** sur GSAP/JS quand possible" },
        { text: "Optimisation des **fonts** (subset, preload, font-display swap)" },
      ],
    },
    {
      title: "Core Web Vitals",
      bullets: [
        { text: "**LCP, INP, CLS** surveillés et corrigés" },
        { text: "Compression **gzip + brotli** via Vercel" },
      ],
    },
  ],
  note: "Pour booster le score Lighthouse SEO ou Accessibilité, regardez plutôt l'option SEO+ ou SEO Pro.",
}

const ADDON_PACK_PERFORMANCE_ESSENTIEL: Addon = {
  id: "pack-performance",
  label: "Pack performance",
  description: "Optimisation des temps de chargement et des Core Web Vitals",
  prix: 120,
  detail: PACK_PERFORMANCE_DETAIL,
}

const ADDON_PACK_PERFORMANCE_STANDARD: Addon = {
  ...ADDON_PACK_PERFORMANCE_ESSENTIEL,
  prix: 100,
}

const ADDON_PACK_ANIMATIONS: Addon = {
  id: "pack-animations",
  label: "Pack animations",
  description: "Transitions, micro-interactions, effets au scroll",
  prix: 250,
  detail: {
    intro:
      "Animations **sur mesure** qui donnent du caractère à votre site. Le genre d'effets qu'on **ne fait pas** avec un template no-code.",
    sections: [
      {
        title: "Inclus",
        bullets: [
          { text: "**Transitions** entre pages" },
          { text: "**Apparitions au scroll** soignées" },
          { text: "**Micro-interactions** sur boutons et cartes" },
          { text: "Effets 3D légers si pertinents" },
        ],
      },
    ],
    note: "Non disponible en Essentiel : pour pousser à monter en formule. Inclus en Premium : pas besoin de cocher.",
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Services
// ─────────────────────────────────────────────────────────────────────────────

export const services: ServiceDetail[] = [
  {
    slug: "essentiel",
    nom: "Essentiel",
    prixBase: 590,
    delai: "5 jours ouvrés",
    description:
      "Site vitrine professionnel sur une seule page avec plusieurs sections. Pour qui lance son activité ou son projet personnel et veut une présence en ligne sérieuse et durable.",
    tagline: "Simple à lancer, *fort en look*.",
    hook: {
      pasDe: "Pas une simple page web.",
      description: "Une vitrine soignée, faite à la main par un pro,",
      metaphor: "comme une devanture devant laquelle on s'arrête.",
    },
    audiences: [
      "Artisan",
      "Commerçant",
      "Freelance",
      "Indépendant",
      "Profession libérale",
      "Lancement d'activité",
    ],
    promesse:
      "Vous voulez une *vraie présence en ligne*\n**propre et durable**\nlivrée en *quelques jours* ?\n\nCette formule est faite pour vous.",
    benefices: [
      { text: "Une **présence crédible** dès la mise en ligne" },
      { text: "**Trouvable sur Google** dès le premier jour" },
      { text: "**Aucun abonnement** mensuel à payer" },
      { text: "**2h de retouches** offertes pour ajuster les détails" },
    ],
    antiAlternative: {
      titre: "Pas de no-code",
      consPoints: [
        "Wix, Squarespace, Webflow…",
        "Modèles de base qui ne font pas pro",
        "Abonnement mensuel à vie",
      ],
      pros: {
        titre: "Codé à la main pour vous",
        intro:
          "Ce n'est pas parce qu'un projet est simple qu'on ne peut pas avoir une vitrine **propre et soignée**, *qui vous appartient vraiment*. Pas de surcoût, juste de la qualité — *de la qualité à petit prix*.",
        points: [
          "Aucun abonnement, aucun coût mensuel",
          "Une vitrine soignée qui vous démarque",
          "Un site qui vous suit dans le temps",
        ],
      },
    },
    pourquoi: [
      "Vous lancez votre activité ou votre projet personnel",
      "Vous voulez juste être présent en ligne, sans complication",
      "Une seule page bien faite vous suffit",
      "Vous voulez aller vite",
    ],
    inclus: [
      {
        titre: "Une page, plusieurs sections",
        detail: {
          intro: "Tout votre site sur une seule page longue scrollable, structurée en sections claires.",
          sections: [
            {
              title: "Sections incluses",
              bullets: [
                { text: "**Accueil** (présentation, accroche)" },
                { text: "**Services** (ce que vous proposez)" },
                { text: "**À propos** (votre histoire, votre équipe)" },
                { text: "**Contact** (formulaire + coordonnées)" },
              ],
            },
          ],
          note: "Chaque section est conçue comme une page : claire, hiérarchisée, optimisée SEO.",
        },
      },
      {
        titre: "Design moderne, simple et responsive",
        detail: {
          intro:
            "Un design **propre** qui reflète votre activité, parfait sur mobile, tablette et desktop.",
          sections: [
            {
              title: "Comment ça se passe",
              bullets: [
                { text: "**3 directions visuelles** proposées en short-list" },
                { text: "Vous **choisissez** celle qui vous parle le plus" },
                { text: "Adaptation à votre charte (couleurs, typographies)" },
              ],
            },
          ],
        },
      },
      {
        titre: "Formulaire de contact",
        detail: {
          intro: "Vos visiteurs vous contactent **directement depuis le site**.",
          sections: [
            {
              title: "Inclus",
              bullets: [
                { text: "Envoi par email via **Resend**" },
                { text: "**Sans frais mensuels**" },
                { text: "Anti-spam intégré" },
              ],
            },
          ],
        },
      },
      {
        titre: "SEO de base",
        detail: {
          intro:
            "Le **minimum vital carré** pour que votre site soit techniquement parfait pour Google, Bing et les IA (ChatGPT, Perplexity, Claude).",
          sections: [
            {
              title: "Inclus",
              bullets: [
                { text: "**Sitemap.xml** + robots.txt" },
                { text: "Robots.txt qui **autorise explicitement les bots IA** (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)" },
                { text: "Fichier **llms.txt** à la racine (généré auto à partir du sitemap)" },
                { text: "Balises **title** et **meta description** sur la page" },
                { text: "**Alt text descriptifs** sur toutes les images" },
                { text: "Site **lisible sans JavaScript** (garantie technique)" },
                { text: "Site **compatible Google + Bing** (livré et indexable)" },
              ],
            },
          ],
          note: "Pour aller plus loin (Schema.org, OpenGraph optimisé, FAQ AI-friendly) : option SEO+. Pour le top niveau (inscription GSC + Bing, audit complet, plan de suivi) : option SEO Pro.",
        },
      },
      {
        titre: "Galerie 10 images",
        detail: {
          intro: "10 images intégrées au site, **optimisées pour un chargement rapide**.",
          sections: [
            {
              title: "Inclus",
              bullets: [
                { text: "Compression **WebP** (format moderne)" },
                { text: "**Lazy loading** (charge à mesure du scroll)" },
                { text: "Recadrage au bon format" },
              ],
            },
          ],
          note: "Au-delà de 10 images : option Photos supplémentaires.",
        },
      },
      {
        titre: "Hébergement + nom de domaine",
        detail: {
          intro: "Votre site **mis en ligne** et accessible depuis votre nom de domaine.",
          sections: [
            {
              title: "Inclus",
              bullets: [
                { text: "**Hébergement Vercel** (rapide, sécurisé, sans frais)" },
                { text: "Configuration du **DNS** sur votre nom de domaine" },
                { text: "Certificat **HTTPS** automatique" },
              ],
            },
          ],
        },
      },
      {
        titre: "2h de retouches incluses",
        detail: {
          intro: "**Après la livraison**, vous avez 2h pour ajuster le site sans surcoût.",
          sections: [
            {
              title: "Cas typiques",
              bullets: [
                { text: "Modification de textes" },
                { text: "Changement d'une photo" },
                { text: "Ajustement de couleur ou de mise en page" },
              ],
            },
          ],
          note: "Au-delà : 60€/h, devis envoyé avant chaque intervention.",
        },
      },
    ],
    addons: [
      ADDON_ECOMMERCE,
      {
        id: "redaction",
        label: "Rédaction des textes",
        description: "Tous les textes du site rédigés à partir d'un brief",
        prix: 100,
        detail: {
          intro:
            "Rédaction de **tous les textes** de votre site à partir d'un brief en visio (1h).",
          sections: [
            {
              title: "Inclus",
              bullets: [
                { text: "Brief client en visio (1h)" },
                { text: "Rédaction **pensée pour convaincre** vos visiteurs" },
                { text: "Textes **optimisés SEO** (compris par Google)" },
              ],
            },
          ],
          note: "Inclus en Standard et Premium.",
        },
      },
      ADDON_SEO_PLUS,
      ADDON_PACK_PERFORMANCE_ESSENTIEL,
      {
        id: "analytics",
        label: "Google Analytics 4",
        description: "Compte client + dashboard configuré",
        prix: 50,
        detail: {
          intro:
            "Sachez **qui visite votre site**, d'où viennent les visiteurs, quelles pages les intéressent.",
          sections: [
            {
              title: "Inclus",
              bullets: [
                { text: "Création du compte **à votre nom**" },
                { text: "Configuration du **tracking**" },
                { text: "**Dashboard** prêt à consulter" },
              ],
            },
          ],
          note: "Inclus en Standard et Premium.",
        },
      },
      ADDON_GMB,
      ADDON_RESERVATION,
      ADDON_CMS_SANITY,
      ADDON_MULTILINGUE,
      ADDON_REFONTE,
      ADDON_PHOTOS_SUPP,
      {
        id: "formation",
        label: "Formation 30 min",
        description: "Visio en direct pour gérer son site en autonomie",
        prix: 50,
        detail: {
          intro:
            "Une visio **en direct** pour apprendre à gérer votre site, **sans prérequis technique**.",
          sections: [
            {
              title: "Au programme",
              bullets: [
                { text: "Mise à jour de **contenus simples** via Vercel" },
                { text: "Si vous avez un **CMS** : prise en main complète" },
                { text: "**Réponses à vos questions**" },
              ],
            },
          ],
          note: "Inclus en Standard et automatiquement avec tout CMS.",
        },
      },
    ],
    highlighted: false,
    color: "var(--accent)",
  },

  {
    slug: "standard",
    nom: "Standard",
    prixBase: 990,
    delai: "10 jours ouvrés",
    description:
      "Site vitrine multi-pages avec design personnalisé, contenu rédigé, SEO+ inclus et Google Analytics. Pour les activités établies qui veulent un site qui les représente vraiment.",
    tagline: "Le site qui *transforme* vos visiteurs en clients.",
    hook: {
      pasDe: "Pas un site vu mille fois.",
      description: "Un site dessiné et codé rien que pour vous,",
      metaphor: "comme un plat fait maison par quelqu'un qui connaît votre goût.",
    },
    audiences: [
      "Commerçant local",
      "PME",
      "Profession libérale",
      "Restaurant",
      "Cabinet",
      "Activité établie",
    ],
    promesse:
      "Vous cherchez un vrai site complet *pour convaincre vos visiteurs*\net **les transformer en clients** ?\n\nCette formule est faite pour vous.",
    benefices: [
      { text: "Un design **soigné et unique** qui vous démarque de la concurrence" },
      { text: "Trouvé en premier par vos clients, **partout dans votre zone**" },
      { text: "Suivez **en direct** le trafic de votre site et voyez **ce qui marche** vraiment" },
      { text: "Des textes **rédigés sur mesure** qui parlent à votre clientèle" },
    ],
    antiAlternative: {
      titre: "Pas d'outils no-code",
      consPoints: [
        "Wix, Squarespace, Webflow, WordPress…",
        "Très peu de personnalisation (limité au thème)",
        "Sites souvent lents et lourds",
        "Complexe à entretenir et à utiliser au quotidien",
      ],
      pros: {
        titre: "Codé à la main pour vous",
        intro:
          "Un visiteur reste **7 secondes** en moyenne avant de décider de rester ou partir. Si la page traîne à charger, il est *déjà reparti*.\n\nLes sites que je crée sont **ultra rapides**, **fluides** et *vraiment simples* à utiliser au quotidien.",
        points: [
          "Sans abonnement à vie",
          "Chargement ultra rapide",
          "Interface très simple pour gérer vos contenus",
          "Modernité technique : code propre, dernières technos",
        ],
      },
    },
    pourquoi: [
      "Vous voulez faire décoller votre activité avec un site qui vous représente vraiment",
      "Vous avez besoin de plusieurs pages claires pour guider vos clients",
      "Vous voulez un site loin des designs ennuyeux et génériques",
      "Vous voulez être accompagné et rassuré tout au long du projet",
    ],
    inclus: [
      {
        titre: "Les fondamentaux de l'Essentiel",
        detail: {
          intro: "Tout ce qui est inclus dans la formule Essentiel, en base.",
          sections: [
            {
              title: "Reportés ici",
              bullets: [
                { text: "Design responsive mobile/tablette/desktop" },
                { text: "Formulaire de contact (Resend)" },
                { text: "SEO de base (sitemap, robots avec bots IA, llms.txt, meta, alt)" },
                { text: "Galerie 10 images optimisées" },
                { text: "Hébergement Vercel + DNS + HTTPS" },
              ],
            },
          ],
        },
      },
      {
        titre: "5 à 7 pages séparées",
        detail: {
          intro: "Un site multi-pages structuré pour **mieux ranker sur Google** et **mieux guider vos visiteurs**.",
          sections: [
            {
              title: "Pages typiques",
              bullets: [
                { text: "Accueil" },
                { text: "À propos" },
                { text: "Services" },
                { text: "Contact" },
                { text: "**1 à 3 pages métier** spécifiques (FAQ, équipe, réalisations…)" },
              ],
            },
          ],
          note: "Au-delà de 7 pages : option Page supplémentaire (+60€/page).",
        },
      },
      {
        titre: "Design personnalisé",
        detail: {
          intro: "Votre charte, votre univers, **rien à voir avec un template Wix**.",
          sections: [
            {
              title: "Comment ça se passe",
              bullets: [
                { text: "**Visio brief** pour définir l'ambiance" },
                { text: "Choix de la **palette de couleurs**" },
                { text: "Choix des **typographies**" },
                { text: "Adaptation à votre logo et votre univers" },
              ],
            },
          ],
        },
      },
      {
        titre: "Rédaction des textes",
        detail: {
          intro: "Tous les textes **rédigés pour vous**, à partir d'un brief en visio (1h).",
          sections: [
            {
              title: "Bénéfices",
              bullets: [
                { text: "Textes **pensés pour convaincre**" },
                { text: "**Optimisés SEO** (compris par Google)" },
                { text: "Vous n'avez **rien à écrire**" },
              ],
            },
          ],
        },
      },
      {
        titre: "SEO+",
        detail: {
          intro: "Le **cran enrichi** : on ajoute pendant qu'on code tout ce qui aide Google et les IA à comprendre votre activité.",
          sections: [
            {
              title: "Inclus",
              bullets: [
                { text: "**Schema.org** adapté à votre métier (Organization ou LocalBusiness)" },
                { text: "**OpenGraph + Twitter Cards** avec image personnalisée" },
                { text: "Title + meta **optimisés keyword** (1 keyword par page)" },
                { text: "Hiérarchie **h1/h2/h3 pensée pour le SEO** (h2 sous forme de questions = AI-friendly)" },
                { text: "Alt texts descriptifs et keyword-friendly" },
                { text: "**Section FAQ AI-friendly** (5+ questions) — clé pour ChatGPT/Perplexity" },
                { text: "**Internal linking propre** entre les sections" },
              ],
            },
          ],
          note: "Pour le palier actif (inscription GSC + Bing, audit, doc de suivi) : option SEO Pro (+150€).",
        },
      },
      {
        titre: "Google Analytics 4",
        detail: {
          intro: "Sachez **qui visite votre site** et **comment**.",
          sections: [
            {
              title: "Inclus",
              bullets: [
                { text: "Compte créé **à votre nom**" },
                { text: "Configuration du tracking" },
                { text: "**Dashboard** prêt à consulter" },
              ],
            },
          ],
        },
      },
      {
        titre: "Formulaire de devis personnalisé",
        detail: {
          intro: "Un formulaire **adapté à votre activité** (pas un formulaire générique).",
          sections: [
            {
              title: "Exemples",
              bullets: [
                { text: "**Restaurant** : nombre de personnes, date, créneaux" },
                { text: "**Artisan** : type de prestation, surface, délai" },
                { text: "**Coach** : objectif, fréquence, format souhaité" },
              ],
            },
          ],
        },
      },
      {
        titre: "Formation 30 min en visio",
        detail: {
          intro: "Une visio **en direct** pour prendre votre site en main.",
          sections: [
            {
              title: "Au programme",
              bullets: [
                { text: "Mise à jour des **infos simples**" },
                { text: "Modification de **contenus**" },
                { text: "**Réponses à vos questions**" },
              ],
            },
          ],
        },
      },
      {
        titre: "5h de retouches incluses",
        detail: {
          intro: "**5h après la livraison** pour ajuster le site sans surcoût.",
          sections: [
            {
              title: "Cas typiques",
              bullets: [
                { text: "Modifications de textes" },
                { text: "Changements de photos" },
                { text: "Ajustements de mise en page" },
              ],
            },
          ],
          note: "Au-delà : 60€/h, devis envoyé avant chaque intervention.",
        },
      },
    ],
    addons: [
      ADDON_ECOMMERCE,
      ADDON_SEO_PRO,
      ADDON_PACK_PERFORMANCE_STANDARD,
      ADDON_GMB,
      ADDON_RESERVATION,
      ADDON_CMS_SANITY,
      ADDON_MULTILINGUE,
      ADDON_REFONTE,
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
    delai: "3 semaines",
    description:
      "Site sur mesure niveau agence : design 100% custom, pack animations, CMS inclus, pack performance, SEO Pro, multilingue FR + EN. Pour les marques établies qui voient leur site comme un investissement sur 3 à 5 ans.",
    tagline: "Pour une marque qui ne ressemble *à personne*.",
    hook: {
      pasDe: "Pas une agence de plus.",
      description: "Un site unique, conçu et codé de A à Z pour vous,",
      metaphor: "comme une pièce sur mesure sortie d'un atelier d'orfèvre.",
    },
    audiences: [
      "Marque établie",
      "Entreprise",
      "Restaurant haut de gamme",
      "Cabinet",
      "Projet ambitieux",
    ],
    promesse:
      "Vous voulez un *site qui marque les esprits*\n**un design qui frappe fort**\nqui vous suivra *tout au long de votre aventure* ?\n\nCette formule est faite pour vous.",
    benefices: [
      { text: "Un design **unique** dont tout le monde se souviendra" },
      { text: "Des animations **haut de gamme** qui frappent fort" },
      { text: "Vous gérez **tous vos contenus** sans dépendre de personne" },
      { text: "**Top n°1** sur Google et chargé en **moins d'une seconde**" },
    ],
    antiAlternative: {
      titre: "Pas une agence à 8 000€",
      consPoints: [
        "Surcouche commerciale qui gonfle la facture",
        "Délais à 3 mois, parfois plus",
        "Vous parlez à un commercial, jamais au développeur",
        "Process lourd, devis interminables",
      ],
      pros: {
        titre: "Direct avec celui qui code",
        intro:
          "Le même résultat qu'une agence parisienne, **sans la surcouche commerciale** ni les délais à 3 mois.\n\nUn site qui vous *distingue dans votre secteur* et **dure dans le temps**, livré en 3 semaines au lieu de 3 mois.",
        points: [
          "Qualité agence haut de gamme, sans le surcoût",
          "Livré en 3 semaines, pas 3 mois",
          "Échanges directs avec le développeur, sans intermédiaire",
        ],
      },
    },
    pourquoi: [
      "Votre activité a déjà du business à porter et mérite un site signature",
      "Vous voulez vous distinguer dans le haut du panier de votre secteur",
      "Vous voulez gérer vos contenus en autonomie (CMS inclus)",
      "Vous voulez une performance technique irréprochable, ressentie par vos visiteurs",
      "Vous voyez ce site comme un investissement sur 3 à 5 ans",
    ],
    inclus: [
      {
        titre: "Tout ce qui est dans Standard",
        detail: {
          intro: "Tout ce qui est inclus dans la formule Standard, en base.",
          sections: [
            {
              title: "Reportés ici",
              bullets: [
                { text: "Pages séparées (5-7)" },
                { text: "Design personnalisé" },
                { text: "Rédaction des textes" },
                { text: "SEO+ + Google Analytics" },
                { text: "Formulaire de devis personnalisé" },
                { text: "Formation 30 min" },
              ],
            },
          ],
        },
      },
      {
        titre: "Jusqu'à 10 pages",
        detail: {
          intro: "Une **vraie architecture** multi-pages pour les sites ambitieux.",
          note: "Au-delà de 10 pages : +60€ par page supplémentaire.",
        },
      },
      {
        titre: "Design 100% sur mesure",
        detail: {
          intro: "**Aucun gabarit**, aucun template. Conception totalement libre.",
          sections: [
            {
              title: "Comment ça se passe",
              bullets: [
                { text: "**3 directions visuelles** proposées en maquette" },
                { text: "Vous en retenez **une**" },
                { text: "**Itération** jusqu'à validation" },
              ],
            },
          ],
        },
      },
      {
        titre: "Pack animations inclus",
        detail: {
          intro: "Animations **sur mesure** qui donnent du caractère.",
          sections: [
            {
              title: "Inclus",
              bullets: [
                { text: "**Transitions** entre pages" },
                { text: "**Micro-interactions** sur boutons et cartes" },
                { text: "**Effets au scroll** soignés" },
              ],
            },
          ],
        },
      },
      {
        titre: "SEO Pro",
        detail: {
          intro: "Le **palier actif** en complément du SEO+ déjà inclus en Standard. On engage Google et Bing, on audite, on transmet une feuille de route.",
          sections: [
            {
              title: "Schema.org étendu",
              bullets: [
                { text: "Product, Article, BreadcrumbList, FAQ, Review selon les pages" },
              ],
            },
            {
              title: "Métadonnées avancées",
              bullets: [
                { text: "OpenGraph optimisé **page par page** (image OG dédiée)" },
                { text: "Balises meta **dynamiques** (titres + descriptions par page)" },
                { text: "Robots.txt fin avec règles par bot" },
              ],
            },
            {
              title: "Indexation Google + Bing",
              bullets: [
                { text: "**Setup complet Google Search Console** + soumission active" },
                { text: "**Setup complet Bing Webmaster Tools** (clé pour ChatGPT Search)" },
                { text: "Plan de **redirections 301** si refonte" },
              ],
            },
            {
              title: "Audit & livrables",
              bullets: [
                { text: "**Audit complet** du contenu (densité keywords, structure)" },
                { text: "**Internal linking optimisé** (cluster autour des money pages)" },
                { text: "**Screenshot Lighthouse** final livré" },
                { text: "**Document de suivi 1 page** : ce qui est fait, ce qu'il faut surveiller" },
              ],
            },
          ],
        },
      },
      {
        titre: "Pack performance inclus",
        detail: {
          intro: "Optimisation des **performances réelles** côté visiteur.",
          sections: [
            {
              title: "Inclus",
              bullets: [
                { text: "Optimisation des **Core Web Vitals**" },
                { text: "Images **WebP** + lazy loading" },
                { text: "Animations **CSS prioritaires**" },
                { text: "Audit du **bundle JS**" },
                { text: "Optimisation des **fonts**" },
              ],
            },
          ],
        },
      },
      {
        titre: "CMS Headless Sanity inclus",
        detail: {
          intro:
            "Modifiez vos contenus **en autonomie**, sans rappeler de développeur.",
          sections: [
            {
              title: "Inclus",
              bullets: [
                { text: "Jusqu'à **50 entrées** modifiables" },
                { text: "Schéma Sanity adapté à votre site" },
                { text: "Connexion Next.js ↔ Sanity (revalidation auto)" },
                { text: "**Formation incluse**" },
              ],
            },
          ],
          note: "Au-delà de 50 entrées : +50€ par tranche de 50.",
        },
      },
      {
        titre: "Multilingue FR + EN inclus",
        detail: {
          intro: "Votre site disponible en **français et en anglais**.",
          sections: [
            {
              title: "Inclus",
              bullets: [
                { text: "Tous les **textes** traduits" },
                { text: "**Formulaires** traduits" },
                { text: "**Balises SEO** traduites" },
                { text: "Bouton de changement de langue dans le header" },
              ],
            },
          ],
          note: "Articles longs ou autres langues : sur devis.",
        },
      },
      {
        titre: "10h de retouches incluses",
        detail: {
          intro: "**10h après la livraison** pour ajuster le site sans surcoût.",
          note: "Au-delà : 60€/h, devis envoyé avant chaque intervention.",
        },
      },
      {
        titre: "1 mois de support post-livraison",
        detail: {
          intro:
            "**1 mois après la livraison**, je reste disponible pour les corrections et ajustements.",
          sections: [
            {
              title: "Inclus",
              bullets: [
                { text: "**Corrections** de bugs si présents" },
                { text: "**Ajustements** mineurs" },
                { text: "Conseils sur l'utilisation" },
              ],
            },
          ],
        },
      },
    ],
    addons: [
      ADDON_ECOMMERCE,
      ADDON_GMB,
      ADDON_RESERVATION,
      ADDON_MULTILINGUE_LONG,
      ADDON_REFONTE,
      ADDON_PAGE_SUPP,
    ],
    highlighted: false,
    color: "var(--gold)",
  },
]

export function getService(slug: string): ServiceDetail | undefined {
  return services.find((s) => s.slug === slug)
}
