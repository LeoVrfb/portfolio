export type Addon = {
  id: string
  label: string
  description: string
  detail?: string  // explication longue affichée au clic sur l'icône info
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
  color: string
}

export const services: ServiceDetail[] = [
  {
    slug: "essentiel",
    nom: "Essentiel",
    prixBase: 599,
    accroche: "Votre vitrine professionnelle en ligne",
    delai: "5 à 7 jours ouvrés",
    description:
      "Un site professionnel, rapide et bien référencé. Vous fournissez les textes et photos : je m'occupe du reste.",
    pourquoi: [
      "Vous souhaitez une présence en ligne sérieuse sans vous ruiner",
      "Vous avez des services ou produits à présenter clairement",
      "Vous voulez être trouvé sur Google par vos futurs clients",
      "Vous avez besoin d'un formulaire de contact fonctionnel",
    ],
    inclus: [
      { titre: "4 pages", detail: "Accueil, À propos, Services, Contact" },
      { titre: "Design professionnel", detail: "Adapté à votre activité et votre charte" },
      { titre: "Responsive mobile", detail: "Parfait sur téléphone, tablette, ordinateur" },
      { titre: "Formulaire de contact", detail: "Envoi par email, sans frais mensuels" },
      { titre: "SEO de base", detail: "Balises title/meta, sitemap, structure H1/H2" },
      { titre: "Mise en ligne sur Vercel", detail: "Hébergement inclus + configuration DNS/domaine" },
      { titre: "Galerie photos", detail: "Jusqu'à 10 images optimisées WebP" },
    ],
    addons: [
      {
        id: "ecommerce-essentiel",
        label: "Boutique en ligne",
        description: "Vendez vos produits directement depuis votre site",
        detail: "Intégration complète d'une boutique avec paiement sécurisé. Jusqu'à 20 produits, panier, tunnel d'achat. Idéal pour artisans, créateurs ou petits catalogues. La disponibilité des produits peut être gérée manuellement.",
        prix: 400,
      },
      {
        id: "redaction",
        label: "Rédaction des textes",
        description: "Je rédige l'ensemble des contenus à partir d'un brief",
        detail: "À partir d'un échange d'une heure, je rédige tous les textes de votre site : présentation, services, page de contact. Textes optimisés pour le référencement et pensés pour convaincre vos visiteurs.",
        prix: 150,
      },
      {
        id: "analytics",
        label: "Google Analytics 4",
        description: "Tableau de bord de visites et comportement des visiteurs",
        detail: "Vous saurez combien de personnes visitent votre site, d'où elles viennent (Google, réseaux sociaux, bouche à oreille), quelles pages elles consultent et combien de temps elles restent. Un outil gratuit, mais qui demande une configuration correcte pour être utile.",
        prix: 80,
      },
      {
        id: "gmb",
        label: "Google Business Profile",
        description: "Création ou optimisation de votre fiche Google Maps",
        detail: "Votre fiche apparaît dans les résultats Google Maps quand quelqu'un cherche votre activité près de chez lui. Je crée ou optimise la fiche : photos, horaires, description, catégories. Indispensable pour les commerces locaux.",
        prix: 80,
      },
      {
        id: "formation",
        label: "Formation vidéo 30 min",
        description: "Apprenez à gérer votre site en autonomie",
        detail: "Une session enregistrée en visio où je vous montre comment mettre à jour les éléments simples de votre site (textes, photos, informations de contact). Accessible à vie, sans prérequis technique.",
        prix: 50,
      },
      {
        id: "page-supp",
        label: "Page supplémentaire",
        description: "Chaque page additionnelle au-delà des 4 incluses",
        detail: "Vous avez besoin d'une page galerie, d'une page équipe ou d'une page tarifs ? Chaque page supplémentaire est conçue dans la même charte graphique et optimisée SEO.",
        prix: 80,
      },
      {
        id: "images-supp",
        label: "Pack 10 images supplémentaires",
        description: "Intégration et optimisation de 10 photos en plus",
        detail: "Je redimensionne, compresse et optimise vos photos au format WebP pour qu'elles soient rapides à charger sans perte de qualité visible. 10 images supplémentaires intégrées au bon endroit sur votre site.",
        prix: 30,
      },
    ],
    highlighted: false,
    color: "var(--accent)",
  },
  {
    slug: "standard",
    nom: "Standard",
    prixBase: 1199,
    accroche: "Un site qui travaille pour vous",
    delai: "10 à 15 jours ouvrés",
    description:
      "Acquérir de nouveaux clients ne se fait pas tout seul. Ce site est conçu pour travailler à votre place : contenu rédigé, SEO local optimisé, statistiques de visite. Vous vous concentrez sur votre métier, le site s'occupe du reste.",
    pourquoi: [
      "Vous voulez un site complet avec contenu rédigé et optimisé",
      "Le SEO local est important pour vous (Google Maps, recherches locales)",
      "Vous voulez suivre vos visiteurs et mesurer l'impact du site",
      "Vous avez besoin d'un formulaire de devis personnalisé",
    ],
    inclus: [
      { titre: "Jusqu'à 7 pages", detail: "Galerie, FAQ, page par service, blog statique…" },
      { titre: "Rédaction des textes", detail: "À partir d'un brief client (1h de travail en commun)" },
      { titre: "Design avancé", detail: "Animations légères, typographie soignée, cohérence poussée" },
      { titre: "SEO on-page complet", detail: "Title/description, H1/H2, sitemap, robots.txt" },
      { titre: "Google Analytics 4", detail: "Tableau de bord de statistiques inclus" },
      { titre: "1 round de modifications", detail: "Après livraison, une passe de retouches incluse" },
      { titre: "Formulaire de devis", detail: "Avec champs personnalisés selon votre activité" },
      { titre: "Responsive & performance", detail: "Score Lighthouse 90+ garanti" },
    ],
    addons: [
      {
        id: "ecommerce-standard",
        label: "Boutique en ligne",
        description: "Vendez vos produits directement depuis votre site",
        detail: "Intégration d'une boutique complète avec paiement sécurisé via Stripe. Jusqu'à 30 produits avec photos, descriptions et prix. Panier, tunnel d'achat, confirmation par email. Parfait pour artisans, créateurs ou petits e-commerces.",
        prix: 400,
      },
      {
        id: "seo-avance",
        label: "SEO avancé",
        description: "Schema.org, Core Web Vitals, rapport mensuel sur 3 mois",
        detail: "Au-delà du SEO de base, cette option ajoute des données structurées (Schema.org) qui permettent à Google de mieux comprendre votre site, l'optimisation des performances (Core Web Vitals) et un rapport mensuel sur 3 mois pour suivre votre positionnement. Un investissement qui paie sur la durée.",
        prix: 200,
      },
      {
        id: "reservation",
        label: "Intégration de réservation",
        description: "TheFork, Zenchef, Planity ou lien Google selon votre activité",
        detail: "Un bouton de réservation directement intégré à votre site, connecté à votre outil existant (TheFork pour les restaurants, Zenchef, Planity pour les coiffeurs/coachs, ou Calendly). Vos visiteurs réservent sans jamais quitter votre site.",
        prix: 100,
      },
      {
        id: "gmb-suivi",
        label: "Google Business Profile + suivi 3 mois",
        description: "Création, optimisation et 3 mois de suivi de la fiche",
        detail: "Création et optimisation complète de votre fiche Google, puis suivi mensuel pendant 3 mois : mise à jour des photos, réponses aux avis, ajout de posts. Une fiche Google bien gérée peut doubler votre visibilité locale.",
        prix: 150,
      },
      {
        id: "blog",
        label: "Blog ou actualités",
        description: "Section blog avec interface simple pour publier vous-même",
        detail: "Une section blog intégrée à votre site, avec une interface simple pour écrire et publier vos articles. Chaque article est optimisé SEO automatiquement. Publier régulièrement du contenu est l'un des leviers SEO les plus efficaces.",
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
        detail: "Je sélectionne, recadre, compresse et optimise 10 photos pour qu'elles soient parfaites sur votre site : rapides à charger, bien cadrées, au format WebP. Vous fournissez les photos brutes, je m'occupe du reste.",
        prix: 150,
      },
    ],
    highlighted: true,
    color: "var(--lavender)",
  },
  {
    slug: "premium",
    nom: "Premium",
    prixBase: 2199,
    accroche: "Un site professionnel qui vous distingue",
    delai: "3 à 4 semaines",
    description:
      "Design 100% sur mesure, interface admin, SEO avancé. Un site clé en main pensé pour durer.",
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
        label: "Boutique en ligne (jusqu'à 50 produits)",
        description: "Boutique complète avec paiement Stripe intégré",
        detail: "Une boutique en ligne complète avec catalogue de produits, panier, paiement sécurisé, gestion des stocks, emails de confirmation et interface admin pour ajouter ou modifier vos produits en autonomie. Jusqu'à 50 produits inclus.",
        prix: 800,
      },
      {
        id: "seo-suivi",
        label: "SEO mensuel — 3 mois",
        description: "Rapport et optimisation continue sur 3 mois",
        detail: "Chaque mois pendant 3 mois : analyse du positionnement Google, identification des opportunités de mots-clés, ajustements techniques et rapport de performance. Un suivi actif pour maintenir et améliorer votre visibilité.",
        prix: 200,
      },
      {
        id: "migration",
        label: "Migration depuis un ancien site",
        description: "Récupération du contenu existant (textes, images, SEO)",
        detail: "Je récupère le contenu de votre ancien site (textes, images, URLs, balises SEO) et le réintègre dans le nouveau. Les redirections sont configurées pour ne pas perdre votre positionnement Google actuel.",
        prix: 200,
      },
      {
        id: "animations",
        label: "Animations avancées",
        description: "Transitions et micro-interactions sur mesure",
        detail: "Des animations pensées pour renforcer l'identité visuelle de votre site : transitions entre pages, apparitions au scroll, micro-interactions sur les boutons et cartes. Le genre d'effets qu'on ne fait pas avec un template WordPress.",
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
        detail: "Le site est disponible en français et en anglais, avec détection automatique de la langue du visiteur. Toutes les pages, tous les textes, toutes les balises SEO sont traduits. Les URLs sont localisées pour le référencement international.",
        prix: 400,
      },
      {
        id: "video",
        label: "Intégration vidéo",
        description: "Background vidéo ou section vidéo optimisée",
        detail: "Intégration d'une vidéo en background sur votre page d'accueil, ou d'une section vidéo dans une page spécifique. La vidéo est optimisée pour ne pas impacter les performances du site.",
        prix: null,
      },
    ],
    highlighted: false,
    color: "var(--gold)",
  },
]

export function getService(slug: string): ServiceDetail | undefined {
  return services.find((s) => s.slug === slug)
}
