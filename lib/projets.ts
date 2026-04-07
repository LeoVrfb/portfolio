export type Projet = {
  slug: string;
  titre: string;
  client: string;
  contexte: "pro" | "perso";
  description: string;
  intro: string;
  img: string;
  images?: string[];
  video?: string;
  tags: string[];
  technologies?: { nom: string; detail: string }[];
  caracteristiques?: string[];
  challenges?: { titre: string; solution: string }[];
  resultats?: string;
  date: string;
  url?: string;
};

export const projets: Projet[] = [
  {
    slug: "argedis-totalenergies",
    titre: "Application interactive — producteurs locaux",
    client: "TotalEnergies · Argedis",
    contexte: "pro",
    description:
      "Application déployée sur tablettes en stations-service pour mettre en avant les producteurs locaux partenaires sur une carte interactive.",
    intro: `En tant que développeur front-end chez Artefact 3000, j'ai participé à la conception et au développement d'une application interactive pour Argedis, filiale de TotalEnergies. Déployée sur des tablettes dans les stations-service à l'échelle nationale, l'app permet aux clients de découvrir les producteurs locaux partenaires proches de chaque station — avec leur distance, leurs spécialités régionales et leurs coordonnées.`,
    img: "/assets/videoArgedis/argedis-img-bg.webp",
    images: [
      "/assets/videoArgedis/argedis-img.png",
      "/assets/videoArgedis/argedis-img1.png",
      "/assets/videoArgedis/argedis-img2.png",
      "/assets/videoArgedis/argedis-img3.png",
    ],
    video: "/assets/videoArgedis/argedis-record.mov",
    tags: ["Next.js", "Contentful", "GraphQL", "Tailwind CSS", "PWA"],
    technologies: [
      {
        nom: "Next.js 13 (App Router)",
        detail:
          "Gestion asynchrone dans les composants serveur et performances optimales pour les tablettes.",
      },
      {
        nom: "Contentful (Headless CMS)",
        detail:
          "Gestion des contenus : photos, textes, et coordonnées des producteurs, modifiables sans redeploiement.",
      },
      {
        nom: "GraphQL",
        detail: "Appels API structurés et efficaces pour ne charger que les données nécessaires.",
      },
      {
        nom: "PWA → APK",
        detail:
          "Initialement une PWA, convertie en APK pour compatibilité avec l'OS Android des tablettes en station.",
      },
    ],
    caracteristiques: [
      "Carte interactive avec positionnement précis des producteurs locaux par région",
      "Compatibilité offline : application statique accessible hors connexion",
      "Déploiement national sur les tablettes Android des stations",
      "Navigation fluide entre fiches fournisseurs et cartes régionales",
    ],
    challenges: [
      {
        titre: "Positionnement pixel-perfect",
        solution:
          "Positionnement des producteurs sur des cartes régionales via des coordonnées x/y stockées dans Contentful, rendues fidèlement sur toutes résolutions de tablettes.",
      },
      {
        titre: "Compatibilité Android",
        solution:
          "Passage de la PWA à un APK pour contourner les limitations d'installation sur les tablettes propriétaires des stations.",
      },
    ],
    resultats:
      "L'application a renforcé la visibilité des producteurs locaux et amélioré l'expérience client dans les stations Total. Déployée à l'échelle nationale, elle a touché des centaines de producteurs et mis en avant les spécialités régionales dans une interface claire.",
    date: "2024-12",
  },
  {
    slug: "sweetime-adp-extime",
    titre: "Jeu à gratter virtuel",
    client: "Aéroports de Paris · Extime",
    contexte: "pro",
    description:
      "Jeu concours digital pour les voyageurs d'ADP : un ticket à gratter virtuel pour gagner des réductions dans les boutiques Extime.",
    intro: `Pour Extime, la marque retail des Aéroports de Paris, j'ai développé un jeu concours digital permettant aux voyageurs de tenter leur chance via un mécanisme de grattage virtuel. En cas de gain, ils recevaient un code de réduction valable dans les boutiques de l'aéroport. L'application était déployée sur l'ensemble des terminaux de Roissy.`,
    img: "/assets/sweetime/sweetime-factory-img.webp",
    video: "/assets/sweetime/sweetime-record.mov",
    tags: ["Next.js 13", "MongoDB", "Mongoose", "Docker", "i18n", "Tailwind CSS"],
    technologies: [
      {
        nom: "Next.js 13",
        detail: "Server Components et App Router pour des performances optimales et un rendu hybride.",
      },
      {
        nom: "MongoDB + Mongoose",
        detail: "Gestion des participations, stockage des gagnants et prévention des tentatives multiples.",
      },
      {
        nom: "Docker",
        detail: "Containerisation du projet pour un déploiement cohérent sur l'infrastructure ADP.",
      },
      {
        nom: "i18n",
        detail:
          "Application disponible en français et en anglais pour les voyageurs internationaux.",
      },
    ],
    caracteristiques: [
      "Mécanique de grattage virtuel animée, responsive et accessible",
      "Système anti-fraude : une participation par appareil / session",
      "Génération et envoi automatique de codes de réduction aux gagnants",
      "Disponible en français et en anglais",
    ],
    challenges: [
      {
        titre: "Gestion des participations en temps réel",
        solution:
          "Architecture MongoDB optimisée pour gérer les pics de trafic aux heures de départ, avec déduplication côté serveur.",
      },
      {
        titre: "Expérience tactile dans un environnement aéroport",
        solution:
          "Interface conçue pour être utilisée debout, sans compte, en quelques secondes — optimisée pour les terminaux tactiles.",
      },
    ],
    resultats:
      "L'opération a attiré plusieurs centaines de milliers de participants avec un taux d'engagement supérieur aux attentes. Le jeu a contribué à augmenter le trafic en boutique pendant la période concernée.",
    date: "2024-12",
  },
  {
    slug: "hurepoix-nettoyage",
    titre: "Site vitrine entreprise de nettoyage",
    client: "Hurepoix Nettoyage",
    contexte: "perso",
    description:
      "Site vitrine moderne pour une entreprise de nettoyage professionnelle en Essonne. Design soigné, SEO optimisé, formulaire de devis.",
    intro: `Création du site vitrine de Hurepoix Nettoyage, entreprise de nettoyage professionnel basée en Essonne. Le site présente les prestations, les zones d'intervention, des photos des réalisations et dispose d'un formulaire de demande de devis en ligne. Design entièrement personnalisé, optimisé pour le référencement local et responsive sur tous les appareils.`,
    img: "/assets/nettoyage-hurepoix/img1.jpg",
    images: [
      "/assets/nettoyage-hurepoix/img2.jpg",
      "/assets/nettoyage-hurepoix/img3.jpg",
      "/assets/nettoyage-hurepoix/img4.jpg",
    ],
    tags: ["Next.js", "Tailwind CSS", "Resend", "Vercel"],
    technologies: [
      {
        nom: "Next.js",
        detail: "Rendu côté serveur pour une indexation optimale par Google, pages statiques ultra-rapides.",
      },
      {
        nom: "Resend",
        detail: "Envoi des demandes de devis directement dans la boîte mail du gérant, sans serveur tiers.",
      },
      {
        nom: "Tailwind CSS",
        detail: "Design sur mesure sans template, adapté à l'identité visuelle de l'entreprise.",
      },
      {
        nom: "Vercel",
        detail: "Déploiement continu, certificat SSL automatique, domaine personnalisé configuré.",
      },
    ],
    caracteristiques: [
      "Design sur mesure, sans template WordPress ni Divi",
      "SEO local optimisé : balises title/description, sitemap, Schema.org",
      "Formulaire de devis en ligne envoyé directement par email",
      "Galerie des réalisations avec photos clients",
    ],
    resultats:
      "Site livré en moins de 10 jours, référencé sur Google dès la première semaine. Le client a reçu ses premières demandes de devis en ligne dans les jours suivant la mise en ligne.",
    date: "2024-11",
    url: "https://hurepoix-nettoyage.fr",
  },
];

export function getProjet(slug: string) {
  return projets.find((p) => p.slug === slug);
}
