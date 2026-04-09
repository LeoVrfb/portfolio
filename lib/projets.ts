export type Projet = {
  slug: string;
  titre: string;
  client: string;
  clientShort?: string;
  logo?: string;
  logos?: string[];
  contexte: "agence" | "freelance" | "perso";
  description: string;
  descriptionPublic?: string;
  descriptionTech?: string;
  intro: string;
  img: string;
  images?: string[];
  video?: string;
  tags: string[];
  technologies?: { nom: string; detail: string }[];
  caracteristiques?: string[];
  pointsCles?: { label: string; items: string[] }[];
  imageCaptions?: string[];
  challenges?: { titre: string; solution: string }[];
  resultats?: string;
  credits?: { nom: string; role: string }[];
  date: string;
  url?: string;
  enCours?: boolean;
};

export const projets: Projet[] = [
  {
    slug: "argedis-totalenergies",
    titre: "Carte interactive des producteurs locaux",
    client: "TotalEnergies · Argedis",
    clientShort: "TotalEnergies",
    logo: "/logo-total.webp",
    logos: ["/logo-total.webp", "/logo-argedis.png"],
    contexte: "agence",
    description:
      "Application tactile déployée sur des centaines de tablettes en stations TotalEnergies pour mettre en avant les producteurs locaux partenaires — administrée et mise à jour en continu.",
    descriptionPublic:
      "**Une interface pensée pour tous.** Simple, fluide, immédiate. Les visiteurs d'une station comprennent en un instant qui sont les producteurs locaux à proximité, où ils se trouvent, et ce qu'ils fabriquent.\n\n**Chaque région a son univers.** La carte change selon le territoire. Les couleurs changent. Les icônes changent. Chaque territoire a sa propre identité visuelle — un travail de design poussé pour ancrer l'utilisateur dans son terroir.\n\n**De producteur en producteur.** L'expérience est pensée pour la flânerie : un bouton, et on passe au suivant. Simple, accessible, sans friction — même pour les utilisateurs les moins à l'aise avec le digital.",
    descriptionTech:
      "Architecture Next.js 14 App Router entièrement statique. Toutes les routes [region]/[locale]/[station]/[producer] sont pré-générées au build via generateStaticParams — l'application fonctionne hors ligne une fois l'APK installé sur la tablette. Les contenus sont gérés via Contentful et mis à jour automatiquement toutes les 24h via un rebuild déclenché côté serveur. Application packagée en APK Android via @ducanh2912/next-pwa pour contourner les limitations d'installation sur les tablettes propriétaires des stations. Disponible en français et en anglais via le routing i18n natif Next.js.",
    intro: `Si vous passez dans une station TotalEnergies, vous apercevrez certainement des écrans dans le rayon produits locaux — j'étais en charge de développer cette application. Développé chez Artefact 3000 pour Argedis, filiale de TotalEnergies, c'est une application **d'envergure nationale** qui met en valeur les producteurs locaux partenaires, déployée sur des centaines de tablettes à travers toute la France.`,
    img: "/assets/videoArgedis/argedis-img-bg.webp",
    images: [
      "/assets/videoArgedis/argedis-img-bg.webp",
      "/assets/videoArgedis/argedis-img1.png",
      "/assets/videoArgedis/argedis-img2.png",
      "/assets/videoArgedis/argedis-img3.png",
      "/assets/videoArgedis/argedis-view-prod.png",
      "/assets/videoArgedis/argedis-view-prod-en.png",
    ],
    video: "/assets/videoArgedis/argedis-record.mov",
    tags: ["Next.js", "Contentful", "GraphQL", "Framer Motion", "APK Android"],
    technologies: [
      {
        nom: "Next.js (App Router)",
        detail:
          "Une route dynamique par région (/[region]), toutes les pages pré-générées au build via generateStaticParams. La sélection de la station, du producteur et de la langue est entièrement gérée par état client — aucun changement d'URL.",
      },
      {
        nom: "Contentful (Headless CMS)",
        detail:
          "Gestion de l'ensemble des contenus : textes, photos, Lottie et coordonnées de chaque producteur. Modifiable par les équipes Argedis sans intervention développeur. Les données FR et EN sont chargées simultanément à l'ouverture.",
      },
      {
        nom: "Framer Motion",
        detail:
          "Utilisé pour les transitions entre producteurs (crossfade photo + hauteur animée du conteneur de texte via useRef), la transition carte principale → carte producteur, et les animations d'apparition/disparition via AnimatePresence.",
      },
      {
        nom: "PWA → APK Android",
        detail:
          "L'application est packagée en APK pour l'installation sur les tablettes Android des stations. Grâce à la génération statique complète, elle fonctionne entièrement hors ligne. Le contenu se met à jour régulièrement via un rebuild automatique.",
      },
    ],
    pointsCles: [
      {
        label: "Enjeux",
        items: [
          "Des centaines de tablettes déployées dans des stations TotalEnergies à travers toute la France",
          "Des centaines de stations, et encore plus de producteurs référencés",
        ],
      },
      {
        label: "Défis",
        items: [
          "Fonctionnement hors ligne — l'application est packagée en APK Android, aucune connexion requise",
          "Contenu mis à jour régulièrement, sans intervention technique",
        ],
      },
      {
        label: "Intérêt",
        items: [
          "Interface 100% tactile, disponible en français et en anglais",
          "Chaque région dispose de son univers visuel propre",
        ],
      },
    ],
    imageCaptions: [
      "Chaque région a son univers. L'image de la carte principale est un Lottie intégré — fond animé aux références culturelles locales — qui change entièrement d'une région à l'autre : **Provence-Alpes-Côte d'Azur** dans ses teintes dorées, **Bourgogne-Franche-Comté** dans ses violets profonds, **Bretagne** dans ses bleus océaniques.\n\nUn radial gradient adapte dynamiquement le fond à la couleur dominante du Lottie. Sur la carte, chaque producteur est positionné à sa place exacte sur le territoire, relié au logo TotalEnergies par des traits en pointillé. Une main animée invite l'utilisateur à parcourir les producteurs dans le sens des aiguilles d'une montre.",
      "Au clic sur un portrait, la carte s'efface et laisse place à la fiche complète : photo, story, produits, distance depuis la station. **Précédent** et **suivant** à portée de doigt.\n\nLa navigation entre producteurs s'accompagne d'un crossfade sur la photo (Framer Motion) et d'une animation fluide sur la hauteur du conteneur, qui s'ajuste selon la longueur du texte de chaque producteur.\n\nLe basculement **FR / EN** ne recharge pas la page — les deux versions sont chargées à l'ouverture de l'application.",
    ],
    challenges: [
      {
        titre: "Transition carte principale → carte producteur",
        solution:
          "Au clic sur un producteur, la grande carte Lottie se réduit et se déplace pour rejoindre exactement la position de la carte producteur, puis disparaît en fondu. La carte producteur apparaît au même instant avec un léger scale et un délai coordonné via Framer Motion — pour que les deux cartes ne soient jamais visibles simultanément et que la transition paraisse continue.",
      },
      {
        titre: "Animations de navigation entre producteurs",
        solution:
          "Deux effets simultanés : un crossfade sur la photo (la photo suivante monte en opacité via Framer Motion pendant que l'actuelle disparaît) et une animation de hauteur sur le conteneur de texte. Comme height: auto ne s'anime pas nativement, un useRef mesure la hauteur réelle du contenu à chaque changement et met à jour un state en pixels — la transition CSS prend ensuite le relais.",
      },
      {
        titre: "Positionnement pixel-perfect sur des centaines de cartes",
        solution:
          "Chaque producteur est positionné via des coordonnées x/y stockées dans Contentful. Le système s'adapte à toutes les résolutions de tablette pour un rendu fidèle sur chaque carte régionale.",
      },
      {
        titre: "PWA → APK Android",
        solution:
          "Les PWA ne sont plus acceptées sur Android — et ne le seront bientôt plus non plus sur iOS. Impossible d'installer l'application comme une simple web app. Il a fallu convertir l'application en APK natif via un wrapper, en veillant à ce que le comportement reste identique — notamment le mode hors ligne.",
      },
      {
        titre: "Génération statique complète (generateStaticParams)",
        solution:
          "Toutes les pages régions sont pré-générées au build via generateStaticParams — l'équivalent App Router des anciens getStaticProps / getStaticPaths. C'est aussi ce qui rend l'APK viable offline : toutes les données, images et contenus sont embarqués au build. Changement de producteur, navigation FR/EN — tout est instantané, sans aucun appel réseau.",
      },
      {
        titre: "Langue sans routing",
        solution:
          "Le basculement FR/EN ne passe pas par l'URL. Les deux versions des données Contentful sont chargées simultanément à l'initialisation. Un simple état client permute entre les deux — invisible pour l'utilisateur, immédiat à l'écran.",
      },
      {
        titre: "Maintenance à l'échelle de centaines de producteurs",
        solution:
          "L'architecture Contentful permet à des équipes non-développeurs de gérer l'ensemble du contenu — ajout de producteurs, mise à jour des textes, photos, Lottie — sans aucune intervention technique.",
      },
    ],
    resultats:
      "Des centaines de stations TotalEnergies équipées à travers toute la France. Les producteurs locaux disposent d'une vitrine digitale permanente, visible par des millions de voyageurs. Un produit vivant, maintenu et enrichi en continu depuis 2024.",
    credits: [
      { nom: "Mathieu Crochet", role: "Manager & aide au développement · Artefact 3000" },
      { nom: "Dwizil Sèche", role: "Designer associé · Artefact 3000" },
      { nom: "Pauline Ravel", role: "Designer associé · Artefact 3000" },
    ],
    date: "2024-02",
  },
  {
    slug: "sweetime-adp-extime",
    titre: "Jeu à gratter virtuel — Sweetime Factory",
    client: "Aéroports de Paris (Groupe ADP) · Extime",
    clientShort: "Aéroports de Paris (Groupe ADP)",
    logo: "/logo-adp.png",
    logos: ["/logo-adp.png", "/logo-extime.png"],
    contexte: "agence",
    description:
      "Jeu concours digital pour les voyageurs d'ADP : un ticket à gratter virtuel pour gagner des réductions dans les boutiques Extime.",
    descriptionPublic:
      "**Un ticket, une chance.** Le voyageur arrive sur l'écran d'accueil, invité à tenter sa chance. Il saisit son email — la carte se retourne alors pour révéler sa zone de grattage. Tout est pensé pour être joué en quelques secondes, debout, avant d'embarquer.\n\n**Gratter pour révéler.** La récompense est cachée sous une surface tactile dessinée sur canvas. Le joueur gratte avec le doigt — et le gain apparaît automatiquement : **sucette**, **réduction -5%** ou **réduction -20%**.\n\n**Une expérience en six étapes.** Accueil → saisie email → flip de carte → grattage → résultat gagnant ou écran dommage. Chaque transition est animée, chaque étape se succède sans rechargement — une expérience fluide du début à la fin.",
    intro: `Pour Extime, la marque de luxe travel retail des Aéroports de Paris, j'ai développé un jeu concours digital qui a touché **des centaines de milliers d'utilisateurs** en quelques semaines seulement. Les voyageurs recevaient un **bon physique avec QR code** à l'achat en boutique — en le scannant, ils accédaient au jeu et pouvaient gratter un ticket virtuel pour remporter une **récompense** : **sucette** ou **code de réduction** valable dans les boutiques de l'aéroport.`,
    img: "/assets/sweetime/sweetime-nano.png",
    video: "/assets/sweetime/sweetime-record.mov",
    tags: ["Next.js", "MongoDB", "Canvas", "Storybook", "Lottie", "i18next"],
    technologies: [
      {
        nom: "Next.js (App Router)",
        detail:
          "L'interface est côté client, mais exposer MongoDB directement au navigateur serait une faille critique — sur une opération de cette envergure, le moindre bug d'attribution pourrait distribuer des centaines de récompenses en masse et pénaliser la marque. Les API routes Next.js tournent côté serveur et servent de proxy sécurisé : elles valident chaque requête avant tout accès à la base. Contrairement à un projet React seul, Next.js permet de coexister interface et logique serveur dans un même repo, sans avoir à déployer un backend séparé.",
      },
      {
        nom: "MongoDB + Mongoose",
        detail:
          "La base devait absorber des milliers d'appels simultanés en pic sur une opération courte. MongoDB est parfaitement adapté à cette charge en écriture, avec des requêtes atomiques (findOneAndUpdate) pour éviter les doublons sous forte concurrence. La structure de document flexible correspond bien aux configs de probabilité variables par boutique.",
      },
      {
        nom: "Canvas API",
        detail:
          "Le grattage est impossible à reproduire fidèlement avec du HTML/CSS standard. Canvas permet un contrôle pixel par pixel : dessiner la couche opaque puis l'effacer en mode destination-out pour révéler progressivement la récompense sous le doigt.",
      },
      {
        nom: "Storybook",
        detail:
          "Avant de construire le funnel, les composants graphiques étaient nombreux (états de la carte, animations candy, cadre décoratif). Storybook a permis de valider chaque composant visuellement en isolation, sans avoir à naviguer dans tout le flow à chaque modification.",
      },
      {
        nom: "react-lottie + Framer Motion",
        detail:
          "Deux besoins d'animation distincts : la pluie de bonbons est une séquence Lottie fournie par le design (jouée une seule fois au gain), les transitions et décorations candy utilisent Framer Motion pour le contrôle programmatique. Utiliser Lottie pour les animations pré-rendues évite de les recréer à la main.",
      },
      {
        nom: "i18next",
        detail:
          "Pas de navigation, pas de rechargement — le terminal identifie l'utilisateur via les paramètres UTM dans l'URL. i18next permet de basculer entre français et anglais instantanément côté client, sans changement de route.",
      },
    ],
    pointsCles: [
      {
        label: "Enjeux",
        items: [
          "Opération d'1 à 2 semaines sur l'ensemble des terminaux de Roissy — des centaines de milliers d'utilisateurs en très peu de temps",
          "Disponibilité critique : aucune interruption tolérée pendant le jeu concours",
        ],
      },
      {
        label: "Défis",
        items: [
          "Anti-fraude double couche : cookie client par terminal + vérification MongoDB par email",
          "Distribution probabiliste avec stocks limités — si une tranche est épuisée, le tirage atterrit sur 'Dommage', sans rebond vers un autre gain",
        ],
      },
      {
        label: "Intérêt",
        items: [
          "Expérience gamifiée complète : flip de carte, grattage tactile, pluie de bonbons Lottie et QR code à capturer",
          "Disponible en français et en anglais, sans création de compte",
        ],
      },
    ],
    challenges: [
      {
        titre: "Canvas scratch card et cadre responsive",
        solution:
          "L'image de couverture est dessinée sur un canvas avec drawImage. Pour effacer les pixels sous le doigt, globalCompositeOperation est passé en destination-out — ce mode rend les pixels transparents au lieu d'ajouter de la couleur. Le long du trajet, des cercles de rayon 25px sont dessinés à chaque pixel de distance via Math.sin/cos(angle), ce qui crée un tracé lisse même à vitesse élevée. Le pourcentage gratté est calculé en échantillonnant 1 pixel sur 32 et en comptant ceux dont l'alpha vaut 0. Quand le seuil est atteint, le canvas disparaît avec une transition CSS opacity et est retiré du DOM. Le cadre décoratif rouge et blanc (style bonbon) est lui aussi dessiné sur canvas avec drawImage : les dimensions réelles du container sont mesurées par un useRef et le cadre est redessiné à chaque changement de taille, ce qui évite tout écrasement sur les petits écrans.",
      },
      {
        titre: "Card flip + funnel en state machine",
        solution:
          "ReactCardFlip enveloppe le formulaire email (face avant) et la carte à gratter (face arrière). Le flip se déclenche uniquement après validation de l'email et attribution du gain — la récompense est donc connue avant que la carte ne se retourne. L'ensemble du funnel est modélisé en state machine à 6 états : main, form, flip, scratch, congrats, dommage.",
      },
      {
        titre: "Anti-fraude : QR code physique + double vérification",
        solution:
          "L'accès au jeu passe par un QR code remis physiquement en boutique (Relay, Extime Duty Free...) — impossible d'y accéder sans ce bon. L'URL embarque les paramètres utm_source et utm_term qui identifient la borne exacte. Deux vérifications s'enchaînent ensuite : un cookie nommé utm_source-utm_term côté client bloque immédiatement toute tentative répétée depuis le même appareil, sans solliciter le serveur. Si le cookie est effacé, la vérification serveur prend le relais — l'email est comparé à la liste des joueurs enregistrés pour cette boutique dans MongoDB. La personne ne peut pas rejouer, qu'elle ait gagné ou perdu. En revanche, si quelqu'un utilise une adresse email différente après avoir vidé son cache, la première couche est contournable — le système repose donc sur la bonne foi et sur la contrainte du QR code physique à usage unique.",
      },
      {
        titre: "Distribution probabiliste et gestion des stocks épuisés",
        solution:
          "Trois types de récompenses, chacun avec sa tranche de probabilité sur 100 : réduction -20% (5%), sucette (15%), réduction -5% (80%). Le flux complet tient en 4 appels API séquentiels : vérification si l'email a déjà joué pour ce magasin, tirage aléatoire et sélection du premier code disponible (isFind: false) dont la plage min/max correspond au nombre tiré, marquage du code comme utilisé, puis ajout de l'email dans la liste du store. Si le tirage tombe hors de toutes les plages ou que le stock est épuisé, l'API retourne 404 et le front bascule sur l'écran 'Dommage' — pas de rebond. Le stock par récompense est contrôlé via nb_gift_max (null = illimité) et nb_gift_find. Chaque code porte un champ award au format type_magasin (ex: sucette_edfp, 5%_relay) que le front parse pour afficher le bon message de gain.",
      },
      {
        titre: "Animations : fond SVG rotatif, Lottie et Framer Motion",
        solution:
          "Le fond est un SVG de 4096×4096px positionné en absolu et animé par une rotation CSS permanente — deux vitesses selon l'écran (rapide sur l'accueil, lente ensuite). La pluie de bonbons au gain est une animation Lottie qui joue en une seule passe puis se masque via un callback onComplete. Les décorations candy (cannes, bonbons) glissent depuis les bords de l'écran via Framer Motion AnimatePresence dès que l'utilisateur quitte l'écran principal.",
      },
    ],
    credits: [
      { nom: "Mathieu Crochet", role: "Manager & architecture backend · Artefact 3000" },
      { nom: "Vincent Blecher", role: "Head of Design · Artefact 3000" },
      { nom: "Pauline Chapelle", role: "Designer · Artefact 3000" },
    ],
    resultats:
      "L'opération a attiré plusieurs centaines de milliers de participants sur une à deux semaines, avec un taux d'engagement supérieur aux attentes. Le jeu a contribué à augmenter le trafic dans les boutiques Extime pendant la période.",
    date: "2024-11",
  },
  {
    slug: "hurepoix-nettoyage",
    titre: "Site vitrine entreprise de nettoyage",
    client: "Hurepoix Nettoyage",
    contexte: "freelance",
    description:
      "Site vitrine moderne pour une entreprise de nettoyage professionnelle en Essonne. Design soigné, SEO optimisé, formulaire de devis.",
    descriptionPublic:
      "Hurepoix Nettoyage avait besoin d'un site qui inspire confiance au premier coup d'œil. Design sur mesure, sans template, avec un formulaire de devis en ligne et une galerie de réalisations. Résultat : leurs premières demandes en ligne ont suivi dans les jours après la mise en ligne.",
    descriptionTech:
      "Site statique Next.js optimisé pour le SEO local : balises title/description sur mesure, sitemap XML, Schema.org LocalBusiness. Formulaire de devis avec Resend pour l'envoi d'emails directs. Déploiement Vercel avec certificat SSL et domaine personnalisé configuré. Score Lighthouse > 95 sur tous les axes.",
    intro: `Création du site vitrine de Hurepoix Nettoyage, entreprise de nettoyage professionnel basée en Essonne. Le site présente les prestations, les zones d'intervention, des photos des réalisations et dispose d'un formulaire de demande de devis en ligne. Design entièrement personnalisé, optimisé pour le référencement local et responsive sur tous les appareils.`,
    img: "/assets/nettoyage-hurepoix/net-hur.png",
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
  {
    slug: "bnp-paribas-elearning",
    titre: "Plateforme e-learning IA",
    client: "BNP Paribas",
    clientShort: "BNP Paribas",
    contexte: "agence",
    description:
      "Plateforme e-learning interne pour initier des milliers de collaborateurs de BNP Paribas aux fondamentaux et aux usages de l'IA.",
    descriptionPublic:
      "Un parcours e-learning interactif conçu pour des milliers d'employés de BNP Paribas, pour les former aux enjeux et aux usages pratiques de l'intelligence artificielle. Interface claire, contenu progressif, expérience engageante qui rend l'IA accessible à tous les profils.",
    descriptionTech:
      "Architecture Next.js App Router avec système de modules et de chapitres à progression persistante. Animations Framer Motion pour rendre l'apprentissage dynamique. Intégration d'un back-office pour la gestion du contenu pédagogique. Déployé sur l'infrastructure interne BNP avec contraintes SSO.",
    intro: `Dans le cadre d'un projet stratégique chez Artefact pour BNP Paribas, j'ai développé une plateforme e-learning interne pour former les collaborateurs aux fondamentaux de l'IA. Le parcours couvre les concepts clés, les cas d'usage métier et les bonnes pratiques d'utilisation des outils IA — le tout dans une interface conçue pour être engageante et accessible à des profils non-techniques.`,
    img: "",
    tags: ["Next.js", "TypeScript", "Framer Motion", "Tailwind CSS"],
    technologies: [
      {
        nom: "Next.js App Router",
        detail: "Architecture modulaire avec gestion de la progression côté serveur.",
      },
      {
        nom: "Framer Motion",
        detail: "Transitions et animations pour rendre l'apprentissage dynamique et engageant.",
      },
      {
        nom: "TypeScript",
        detail: "Typage strict pour une base de code maintenable sur le long terme.",
      },
    ],
    caracteristiques: [
      "Parcours de formation en modules et chapitres progressifs",
      "Suivi de progression persistant par utilisateur",
      "Interface adaptée aux profils non-techniques",
      "Déployé sur l'environnement interne BNP Paribas",
    ],
    date: "2025-04",
  },
  {
    slug: "make-a-scene",
    titre: "App de prompting pour la génération d'images IA",
    client: "Artefact (interne)",
    contexte: "agence",
    description:
      "Application interne Artefact pour apprendre à prompter efficacement les modèles de génération d'images IA.",
    descriptionPublic:
      "Make a Scene est une application pédagogique conçue pour Artefact : elle guide les utilisateurs pas à pas pour apprendre à rédiger des prompts efficaces et générer des images avec l'IA. Ludique, visuel, immédiatement engageant — l'apprentissage par la pratique.",
    descriptionTech:
      "Intégration d'une API de génération d'images. Frontend React/Next.js avec système de niveaux et de progression. État global géré avec Zustand. Feedback visuel en temps réel sur la qualité des prompts.",
    intro: `Make a Scene est un projet interne développé pour Artefact afin de former les équipes à la génération d'images par IA. L'application propose un parcours interactif pour apprendre à structurer et optimiser ses prompts — avec génération en direct pour voir l'impact immédiat de chaque modification.`,
    img: "",
    tags: ["Next.js", "TypeScript", "OpenAI API", "Tailwind CSS", "Zustand"],
    technologies: [
      {
        nom: "OpenAI / Génération d'images",
        detail: "Intégration d'une API de génération d'images pour le feedback en temps réel.",
      },
      {
        nom: "Zustand",
        detail: "Gestion de l'état de progression et des sessions utilisateur.",
      },
      {
        nom: "Next.js",
        detail: "Server Actions pour sécuriser les appels API sans exposer les clés.",
      },
    ],
    caracteristiques: [
      "Parcours d'apprentissage par niveaux progressifs",
      "Génération d'images en temps réel pour voir l'impact des prompts",
      "Système de score et de progression",
      "Interface conçue pour être utilisée en équipe en ateliers",
    ],
    date: "2025-10",
  },
  {
    slug: "bald-artiste",
    titre: "Site vitrine artiste peintre",
    client: "Bald",
    contexte: "freelance",
    description:
      "Site portfolio pour Bald, peintre abstrait — galerie d'œuvres en plein écran, bio et contact.",
    descriptionPublic:
      "Création du site portfolio de Bald, peintre abstrait. Une expérience visuelle qui met en valeur les œuvres : galerie en plein écran, transitions fluides, design épuré qui laisse toute la place à la peinture. Le site, c'est le musée.",
    descriptionTech:
      "Site Next.js statique avec optimisation d'images Next/Image pour des chargements rapides. Galerie avec lightbox custom et transitions Framer Motion. Entièrement statique pour des performances maximales. Déployé sur Vercel avec domaine personnalisé.",
    intro: `Portfolio digital pour Bald, peintre abstrait. L'enjeu était simple : que le site disparaisse au profit de l'œuvre. Design minimaliste, galerie en plein écran, navigation fluide entre les séries. Un site qui respire.`,
    img: "",
    tags: ["Next.js", "Tailwind CSS", "Framer Motion", "Vercel"],
    technologies: [
      {
        nom: "Next.js (statique)",
        detail: "Site entièrement statique pour des performances maximales et un hébergement simple.",
      },
      {
        nom: "Framer Motion",
        detail: "Transitions entre les œuvres et animations d'entrée pour une navigation fluide.",
      },
      {
        nom: "Next/Image",
        detail: "Optimisation automatique des images haute résolution des œuvres.",
      },
    ],
    caracteristiques: [
      "Galerie en plein écran avec navigation au clavier",
      "Lightbox custom pour explorer les détails des œuvres",
      "Design minimaliste centré sur les visuels",
      "Optimisation des images haute résolution",
    ],
    date: "2026-02",
  },
  {
    slug: "memorized",
    titre: "Assistant de mémoire personnel",
    client: "Projet personnel",
    contexte: "perso",
    description:
      "App de mémorisation basée sur la répétition espacée — à commercialiser prochainement.",
    descriptionPublic:
      "Memorized est un assistant qui vous aide à retenir ce qui compte vraiment : concepts, idées, apprentissages. Basé sur la répétition espacée et des revues intelligentes. En cours de développement, bientôt disponible.",
    descriptionTech:
      "Stack Next.js + Convex pour la base de données temps réel. Algorithme de répétition espacée (SM-2) implémenté côté serveur. Authentification avec Clerk. UI responsive avec shadcn/ui. Architecture pensée pour une commercialisation SaaS.",
    intro: `Memorized est un projet personnel que je développe pour mieux retenir mes apprentissages. L'application utilise l'algorithme de répétition espacée SM-2 pour planifier automatiquement les révisions au bon moment. Je prévois de le commercialiser prochainement en SaaS.`,
    img: "",
    tags: ["Next.js", "Convex", "Clerk", "TypeScript", "shadcn/ui"],
    technologies: [
      {
        nom: "Convex",
        detail: "Base de données temps réel avec synchronisation instantanée entre sessions.",
      },
      {
        nom: "Algorithme SM-2",
        detail: "Répétition espacée : chaque révision est planifiée au moment optimal pour maximiser la rétention.",
      },
      {
        nom: "Clerk",
        detail: "Authentification complète avec gestion des sessions multi-appareils.",
      },
    ],
    caracteristiques: [
      "Révisions planifiées par l'algorithme SM-2",
      "Synchronisation temps réel entre appareils",
      "Interface épurée pour une session de révision sans friction",
      "Architecture prête pour une commercialisation SaaS",
    ],
    date: "2025-03",
    enCours: true,
  },
  {
    slug: "prof-de-langue",
    titre: "Plateforme SaaS pour profs de langue",
    client: "Projet personnel",
    contexte: "perso",
    description:
      "Plateforme SaaS en cours de création pour les professeurs de langues indépendants : gestion élèves, planning, facturation.",
    descriptionPublic:
      "Un outil conçu pour les professeurs de langues indépendants : gestion des élèves, planning de cours, suivi de progression et facturation intégrée. Tout ce dont un prof freelance a besoin, au même endroit. Projet en cours de développement.",
    descriptionTech:
      "Architecture SaaS multi-tenant avec Next.js App Router. Paiements Stripe Connect pour la facturation entre profs et élèves. Base de données PostgreSQL via Supabase. Auth.js pour l'authentification. Panel d'administration dédié par enseignant.",
    intro: `Une plateforme SaaS que je développe pour les professeurs de langues indépendants. L'objectif : leur donner un outil professionnel complet pour gérer leur activité — sans avoir à jongler entre 3 outils différents. En cours de développement.`,
    img: "",
    tags: ["Next.js", "Supabase", "Stripe", "TypeScript", "PostgreSQL"],
    technologies: [
      {
        nom: "Supabase (PostgreSQL)",
        detail: "Base de données relationnelle avec Row Level Security pour l'isolation multi-tenant.",
      },
      {
        nom: "Stripe Connect",
        detail: "Facturation et paiements entre enseignants et élèves via la marketplace Stripe.",
      },
      {
        nom: "Next.js App Router",
        detail: "Architecture full-stack avec Server Actions pour les mutations et les formulaires.",
      },
    ],
    caracteristiques: [
      "Gestion des élèves et des cours par enseignant",
      "Planning de cours avec vue calendrier",
      "Facturation intégrée via Stripe",
      "Multi-tenant : chaque prof a son espace isolé",
    ],
    date: "2025-03",
    enCours: true,
  },
];

export function getProjet(slug: string) {
  return projets.find((p) => p.slug === slug);
}
