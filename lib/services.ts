export type Addon = {
  id: string
  label: string
  description: string
  prix: number | null // null = sur devis
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
}

export const services: ServiceDetail[] = [
  {
    slug: "essentiel",
    nom: "Essentiel",
    prixBase: 600,
    accroche: "Être visible sur Google",
    delai: "5 à 7 jours ouvrés",
    description:
      "Un site professionnel, rapide et bien référencé. Vous fournissez les textes et photos — je m'occupe du reste.",
    pourquoi: [
      "Vous souhaitez une présence en ligne sérieuse et professionnelle",
      "Vous avez plusieurs services ou produits à présenter",
      "Vous voulez être trouvé sur Google par vos futurs clients",
      "Vous avez besoin d'un formulaire de contact fonctionnel",
    ],
    inclus: [
      { titre: "4 pages", detail: "Accueil, À propos, Services, Contact" },
      { titre: "Design professionnel", detail: "Adapté à votre activité et votre charte" },
      { titre: "Responsive mobile", detail: "Parfait sur téléphone, tablette, ordinateur" },
      { titre: "Formulaire de contact", detail: "Envoi par email, sans frais mensuels" },
      { titre: "SEO de base", detail: "Balises, sitemap, structure H1/H2 optimisés" },
      { titre: "Mise en ligne sur Vercel", detail: "Hébergement inclus la 1ère année" },
      { titre: "Nom de domaine", detail: "Guidance pour l'achat et la configuration" },
      { titre: "Galerie photos", detail: "Jusqu'à 10 images optimisées" },
    ],
    addons: [
      {
        id: "redaction",
        label: "Rédaction des textes",
        description: "Je rédige l'ensemble des contenus à partir d'un brief",
        prix: 150,
      },
      {
        id: "analytics",
        label: "Google Analytics 4",
        description: "Tableau de bord de visites et comportement des visiteurs",
        prix: 80,
      },
      {
        id: "gmb",
        label: "Google Business Profile",
        description: "Création ou optimisation de votre fiche Google Maps",
        prix: 80,
      },
      {
        id: "formation",
        label: "Formation vidéo 30 min",
        description: "Apprenez à gérer votre site en autonomie",
        prix: 50,
      },
      {
        id: "page-supp",
        label: "Page supplémentaire",
        description: "Chaque page additionnelle au-delà des 4 incluses",
        prix: 80,
      },
      {
        id: "images-supp",
        label: "Pack 10 images supplémentaires",
        description: "Intégration et optimisation de 10 photos en plus",
        prix: 30,
      },
    ],
    highlighted: false,
  },
  {
    slug: "standard",
    nom: "Standard",
    prixBase: 1200,
    accroche: "Un vrai outil de communication",
    delai: "10 à 15 jours ouvrés",
    description:
      "Contenu rédigé par mes soins, SEO local, Analytics. Un site qui travaille pour vous même quand vous dormez.",
    pourquoi: [
      "Vous voulez un site complet avec contenu rédigé et optimisé",
      "Le SEO local est important pour vous (Google Maps, recherches locales)",
      "Vous voulez suivre vos visiteurs et mesurer l'impact du site",
      "Vous avez besoin d'un formulaire de devis personnalisé",
    ],
    inclus: [
      { titre: "Jusqu'à 7 pages", detail: "Galerie, FAQ, page par service, blog statique…" },
      { titre: "Rédaction des textes", detail: "À partir d'un brief client (1h de travail)" },
      { titre: "Design avancé", detail: "Animations légères, typographie soignée, cohérence poussée" },
      { titre: "SEO on-page complet", detail: "Title/description, H1/H2, sitemap, robots.txt" },
      { titre: "Google Analytics 4", detail: "Tableau de bord de statistiques inclus" },
      { titre: "1 round de modifications", detail: "Après livraison, une passe de retouches incluse" },
      { titre: "Formulaire de devis", detail: "Avec champs personnalisés selon votre activité" },
      { titre: "Responsive & performance", detail: "Score Lighthouse 90+ garanti" },
    ],
    addons: [
      {
        id: "seo-avance",
        label: "SEO avancé",
        description: "Schema.org, Core Web Vitals, rapport mensuel sur 3 mois",
        prix: 200,
      },
      {
        id: "reservation",
        label: "Intégration de réservation",
        description: "TheFork, Zenchef, Planity ou lien Google selon votre activité",
        prix: 100,
      },
      {
        id: "gmb-suivi",
        label: "Google Business Profile + suivi 3 mois",
        description: "Création, optimisation et 3 mois de suivi de la fiche",
        prix: 150,
      },
      {
        id: "blog",
        label: "Blog ou actualités",
        description: "Section blog avec interface simple pour publier vous-même",
        prix: 300,
      },
      {
        id: "formation-avancee",
        label: "Formation approfondie 1h",
        description: "Session vidéo pour maîtriser les fonctionnalités avancées",
        prix: 80,
      },
      {
        id: "page-supp",
        label: "Page supplémentaire",
        description: "Chaque page au-delà des 7 incluses",
        prix: 80,
      },
      {
        id: "photos-pro",
        label: "Pack 10 photos pro",
        description: "Sélection et optimisation de 10 photos professionnelles",
        prix: 150,
      },
    ],
    highlighted: true,
  },
  {
    slug: "premium",
    nom: "Premium",
    prixBase: 2200,
    accroche: "Votre site travaille à votre place",
    delai: "3 à 4 semaines",
    description:
      "Maquette Figma, interface admin, SEO avancé. Le site zéro compromis pensé pour durer.",
    pourquoi: [
      "Vous voulez un design entièrement sur mesure (pas de template, pas de compromis)",
      "Vous avez besoin de gérer vous-même votre contenu (photos, textes, menu…)",
      "Le SEO et la visibilité en ligne sont au cœur de votre stratégie",
      "Vous cherchez un partenaire technique qui vous accompagne sur le long terme",
    ],
    inclus: [
      { titre: "Design 100% sur mesure", detail: "Pas de template : chaque décision est discutée ensemble" },
      { titre: "Pages illimitées", detail: "Structure définie ensemble selon vos besoins" },
      { titre: "Interface admin", detail: "Gérez vos photos, textes et contenus sans coder" },
      { titre: "SEO avancé", detail: "Schema.org, Core Web Vitals, rapport mensuel" },
      { titre: "Galerie dynamique", detail: "Ajout de photos en autonomie via l'interface admin" },
      { titre: "Blog / actualités", detail: "Publication de contenu en toute autonomie" },
      { titre: "2 rounds de modifications", detail: "Deux passes de retouches incluses" },
      { titre: "Support 1 mois post-livraison", detail: "Corrections et ajustements inclus" },
    ],
    addons: [
      {
        id: "ecommerce",
        label: "E-commerce (jusqu'à 50 produits)",
        description: "Boutique en ligne avec paiement Stripe intégré",
        prix: 800,
      },
      {
        id: "seo-suivi",
        label: "SEO mensuel — 3 mois",
        description: "Rapport et optimisation continue sur 3 mois",
        prix: 200,
      },
      {
        id: "migration",
        label: "Migration depuis un ancien site",
        description: "Récupération du contenu existant (textes, images, SEO)",
        prix: 200,
      },
      {
        id: "animations",
        label: "Animations avancées",
        description: "Transitions et micro-interactions sur mesure",
        prix: 300,
      },
      {
        id: "photos-pro-20",
        label: "Pack 20 photos pro",
        description: "Sélection et optimisation de 20 photos",
        prix: 250,
      },
      {
        id: "multilingue",
        label: "Version multilingue (FR + EN)",
        description: "Traduction et structure i18n complète",
        prix: 400,
      },
      {
        id: "video",
        label: "Intégration vidéo",
        description: "Background vidéo ou section vidéo optimisée",
        prix: null,
      },
    ],
    highlighted: false,
  },
]

export function getService(slug: string): ServiceDetail | undefined {
  return services.find((s) => s.slug === slug)
}
