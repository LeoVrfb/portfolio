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
  heroImg?: string;
  images?: string[];
  sliderSets?: { title: string; description: string; images: string[] }[];
  video?: string;
  videoTitle?: string;
  videoLoopStart?: number; // secondes — la vidéo démarre (et repart) à ce point
  videoLoopEnd?: number;   // secondes — le loop repart avant ce point
  wideMedia?: boolean;
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
  customSlider?: string;
};

export const projets: Projet[] = [
  {
    slug: "bnp-paribas-elearning",
    titre: "Module e-learning IA générative",
    client: "BNP Paribas",
    clientShort: "BNP Paribas",
    logo: "/assets/bnp/logo-bnp.webp",
    contexte: "agence",
    description:
      "Module e-learning gamifié déployé en interne chez BNP Paribas — 6 chapitres, 5 types de mini-jeux, 6 vidéos générées par IA, un personnage guide, conforme SCORM 1.2.",
    descriptionPublic:
      "L'**écran d'introduction** : __AI-nstein__ — personnage IA inspiré d'Einstein — guide l'utilisateur via une __interface de chat__, envoyant des messages et posant des questions auxquels on répond en cliquant. En parallèle, le __module de cours principal__ affiche le contenu interactif du chapitre en cours. En bas, une __barre de progression__ suit l'avancement sur l'ensemble des six chapitres. Les jeux interactifs arrivent dans les chapitres suivants.",
    intro: `Un des projets qui m'a le plus stimulé. Développé chez Artefact 3000 pour **BNP Paribas**, ce module e-learning gamifié forme des milliers de collaborateurs aux fondamentaux de l'IA générative. **6 chapitres, 5 types de mini-jeux, 6 vidéos générées par IA**, un personnage guide. Et surtout, un pari que peu d'agences tentent : **remplacer Articulate Storyline par une app React complète**, packagée en SCORM 1.2 pour s'intégrer dans n'importe quel LMS d'entreprise.`,
    img: "/assets/bnp/bnp-miniature.webp",
    video: "/assets/bnp/bnp-demo.mp4",
    videoTitle: "L'écran d'introduction",
    videoLoopStart: 2,
    videoLoopEnd: 63.9,
    wideMedia: true,
    sliderSets: [
      {
        title: "Les mini-jeux interactifs",
        description: "Cinq types de mini-jeux distincts, développés from scratch avec PixiJS. DataShield : intercepter des données sensibles en chute libre. Un catégoriseur de prompts en glisser-déposer. Une chasse aux hallucinations. Et pour le chapitre 5, le convoi de presse : un objet physique invisible représente la malle sur le tapis roulant, synchronisé image par image avec la vidéo, pour déclencher l'entrée dans les pressoirs au bon moment.",
        images: [
          "/assets/bnp/chap2-game-datashield-play.webp",
          "/assets/bnp/chap3-game-dnd-prompt-build.webp",
          "/assets/bnp/chap3-game-trustworthy-prompt.webp",
          "/assets/bnp/chap4-game-hallucination-play.webp",
          "/assets/bnp/chap4-game-hallucination-wrong.webp",
          "/assets/bnp/chap5-game-conveyor-marketing.webp",
          "/assets/bnp/chap5-game-conveyor-planning.webp",
        ],
      },
      {
        title: "Apprentissage, récaps & résultats",
        description: "Chaque chapitre suit le même rythme : une vidéo d'introduction générée par IA, des explications, un jeu interactif, puis un écran de récap ou de résultats qui distingue clairement le juste du faux. En bout de parcours, un passeport de compétences valide l'ensemble des chapitres.",
        images: [
          "/assets/bnp/chap1-video-ia-presenter.webp",
          "/assets/bnp/chap2-recap-allowed-vs-forbidden.webp",
          "/assets/bnp/chap3-rispo-method.webp",
          "/assets/bnp/chap3-game-dnd-prompt-result.webp",
          "/assets/bnp/chap4-game-hallucination-result.webp",
          "/assets/bnp/chap6-quiz-dnd-do-or-dont.webp",
          "/assets/bnp/chap6-quiz-mcq-carbon.webp",
          "/assets/bnp/chap6-end-passport.webp",
        ],
      },
    ],
    tags: ["React", "Vite", "TypeScript", "PixiJS", "GSAP", "Framer Motion", "react-beautiful-dnd", "SCORM 1.2", "Accessibilité", "i18n", "Storybook"],
    technologies: [
      {
        nom: "React + Vite (SPA statique)",
        detail:
          "Le LMS de BNP n'accepte que des applications statiques packagées en SCORM — pas de serveur, pas d'API externe. React + Vite permet de produire un build autonome que n'importe quel LMS peut lire, là où Next.js nécessite un serveur Node.js.",
      },
      {
        nom: "SCORM 1.2 (imsmanifest + pipwerks)",
        detail:
          "Standard e-learning des années 2000, utilisé par les LMS d'entreprise. Un package SCORM, c'est une archive ZIP avec un manifest XML qui décrit le module, et une API JavaScript que le LMS expose à la page. `pipwerks-scorm-api-wrapper` abstrait les appels LMS (`LMSSetValue`, `LMSCommit`, etc.) pour remonter score, progression et complétion depuis React vers le LMS de BNP.",
      },
      {
        nom: "PixiJS",
        detail:
          "Les mini-jeux (jeu de briques, bouclier de données, détection d'hallucinations) nécessitaient un rendu canvas hautes performances. PixiJS offre un moteur WebGL avec fallback Canvas 2D, parfaitement adapté aux animations complexes d'objets en mouvement.",
      },
      {
        nom: "react-beautiful-dnd",
        detail:
          "Utilisé pour les jeux de glisser-déposer : classement de sources, association de concepts. La bibliothèque gère les accessoires d'accessibilité (ARIA, navigation clavier) nativement, ce qui a facilité l'implémentation du mode accessibilité complet.",
      },
      {
        nom: "GSAP + Framer Motion",
        detail:
          "GSAP pilote les transitions orchestrées (entrées de chapitres, timelines synchronisées texte/image/son). Framer Motion gère les animations des composants React (apparition de bulles de chat, transitions de cartes de quiz).",
      },
      {
        nom: "Storybook",
        detail:
          "L'UI comptait des dizaines de composants spécifiques : bulles de chat, cartes de quiz, barres de progression circulaire, écrans de résultats. Storybook a permis de les valider visuellement et fonctionnellement en isolation, avant de les câbler dans la machine à états.",
      },
    ],
    challenges: [
      {
        titre: "Remplacer Articulate Storyline par React au sein de l'agence",
        solution:
          "Les modules SCORM d'Artefact étaient produits avec Articulate Storyline — outil no-code, rapide, mais design contraint, animations impossibles, aucune interactivité custom. Des freelances étaient payés pour produire des slides. L'idée : prouver qu'on pouvait livrer la même compatibilité SCORM 1.2 avec une vraie app React — et changer le workflow de l'agence pour tous les futurs clients e-learning. La technique existe, mais elle est rarement mise en œuvre dans un contexte agence où Articulate est la norme.",
      },
      {
        titre: "Comprendre et implémenter le protocole SCORM 1.2",
        solution:
          "SCORM 1.2 est un standard des années 2000. Un package SCORM, c'est une archive ZIP avec un manifest XML (`imsmanifest.xml`) qui décrit le module, et une API JavaScript (`LMSInitialize`, `LMSSetValue`, `LMSCommit`, etc.) que le LMS expose à la page. J'ai étudié la spec, compris le protocole de communication, puis intégré `pipwerks-scorm-api-wrapper` pour abstraire les appels LMS — ce qui a permis de remonter score, progression et statut de complétion vers le LMS de BNP depuis l'app React.",
      },
      {
        titre: "Machine à états pour un flow pédagogique complexe",
        solution:
          "6 chapitres, une intro, une séquence finale, des dizaines d'étapes conditionnelles selon les réponses de l'utilisateur — sans routing serveur possible. L'ensemble du flow est modélisé via des stores Zustand en machine à états. Chaque étape expose ses conditions d'entrée et de sortie, sa contribution à la progression, et son rendu conditionnel.",
      },
      {
        titre: "Mini-jeux canvas dans une SPA statique",
        solution:
          "Chaque chapitre a son propre mini-jeu — jeu de briques avec raquette et balle (PixiJS), bouclier qui intercepte des données en chute, chasse aux hallucinations IA, catégoriseur de packages. Intégrer PixiJS dans React a demandé de gérer manuellement le cycle de vie des scènes canvas pour éviter les fuites mémoire entre transitions de chapitres.",
      },
      {
        titre: "Accessibilité complète — navigation clavier, audio description, zoom",
        solution:
          "BNP imposait une conformité accessibilité stricte. À l'ouverture du module, l'utilisateur choisit sa langue, active ou désactive l'audio description, règle le niveau de zoom, et choisit entre navigation classique et navigation au clavier (Tab). En mode clavier, chaque élément focusable est annoncé à la voix avant interaction — l'utilisateur entend ce sur quoi il est positionné avant de valider avec Entrée. On a même poussé jusqu'à implémenter le drag & drop au clavier, avant de le désactiver en production pour ne pas surcharger l'expérience. C'est probablement la partie la plus longue et la plus fastidieuse du projet — chaque composant, chaque jeu, chaque transition devait être testé avec tabindex, attributs aria et annonces vocales.",
      },
    ],
    credits: [
      { nom: "Mathieu Crochet", role: "Manager & architecture · Artefact 3000" },
      { nom: "Vincent Blacher", role: "Head of Design · Artefact 3000" },
      { nom: "Pauline Ravel", role: "UX Designer · Artefact 3000" },
    ],
    date: "2025-04",
  },
  {
    slug: "russian-with-julia",
    titre: "Plateforme de cours de russe en ligne",
    client: "Russian with Julia",
    clientShort: "Russian with Julia",
    contexte: "freelance",
    description:
      "Plateforme complète développée en freelance pour Yulia, prof de russe : site marketing, paywall vidéo, dashboard élève, dashboard admin, booking d'un appel d'introduction synchronisé Google Calendar, paiement Stripe.",
    descriptionPublic:
      "**Un site, deux mondes.**\nCôté visiteur : un site vitrine soigné — hero plein écran, témoignages, carte des élèves répartis dans plus de 25 pays, services, vidéos d'introduction. Côté apprenant connecté : un dashboard avec ses packs achetés et ses leçons vidéo en streaming sécurisé.\n\n**Un appel d'introduction réservable en 30 secondes.**\nLe visiteur choisit un créneau dans le calendrier, paie 15 $ via Stripe, et reçoit automatiquement une invitation Google Calendar avec un lien Google Meet. L'évènement est créé dans le vrai agenda de la prof, dans son fuseau horaire à elle.\n\n**Un admin qui appartient à la prof.**\nElle se connecte avec un magic link envoyé sur son email pro. Elle gère ses packs, uploade ses leçons vidéo, voit ses élèves et leurs achats, et connecte son Google Calendar. Le dev n'intervient plus une fois en place.",
    intro: `Site complet développé en **freelance** pour __Yulia__, professeure de russe avec __plus de 500 élèves__ dans 25+ pays. Plateforme de bout en bout : **site vitrine**, **paywall vidéo** sur les leçons hébergées sur Cloudflare R2, **dashboard élève** post-achat, **dashboard admin** pour la prof (upload, gestion des élèves, calendrier), **booking d'un appel d'intro** en 30 secondes avec création automatique d'un évènement Google Calendar + lien Meet, **paiement Stripe** en mode live, **auth magic link** sans mot de passe, et tout le passage en prod (domaine, DNS, email pro).`,
    img: "/assets/rwj/rwj-miniature.webp",
    heroImg: "/assets/rwj/rwj-hero-accueil.webp",
    url: "https://russianwithjulia.com",
    wideMedia: true,
    enCours: true,
    sliderSets: [
      {
        title: "Le site vitrine",
        description: "Un parcours visiteur soigné : hero plein écran avec un photoshooting réalisé sur mesure, témoignages réels d'élèves, carte du monde des apprenants, présentation des packs. Tout y est pensé pour traduire la chaleur d'une prof particulière sans tomber dans le côté froid d'une plateforme massive.",
        images: [
          "/assets/rwj/rwj-hero-accueil.webp",
          "/assets/rwj/rwj-testimonials.webp",
          "/assets/rwj/rwj-videos-and-world-map.webp",
          "/assets/rwj/rwj-services-packs.webp",
        ],
      },
      {
        title: "Réserver un appel et débloquer ses cours",
        description: "Le booking widget enchaîne calendrier, paiement Stripe et création automatique d'un évènement Google Calendar avec lien Meet — le tout en 30 secondes. Côté vidéos, chaque pack est verrouillé tant que le paiement n'est pas validé, puis débloqué en temps réel sans rechargement.",
        images: [
          "/assets/rwj/rwj-booking-trial.webp",
          "/assets/rwj/rwj-video-courses.webp",
          "/assets/rwj/rwj-student-dashboard.webp",
        ],
      },
      {
        title: "Le dashboard admin",
        description: "L'espace de la prof. Elle crée ses packs, uploade ses leçons vidéo directement sur Cloudflare R2 via une URL pré-signée (sans transit serveur), publie quand elle est prête, voit ses élèves et leurs achats, connecte son Google Calendar pour l'appel d'intro. Le dev ne reprend plus la main.",
        images: [
          "/assets/rwj/rwj-admin-packs-list.webp",
          "/assets/rwj/rwj-admin-add-lesson.webp",
        ],
      },
    ],
    tags: [
      "Next.js",
      "Convex",
      "Stripe",
      "Cloudflare R2",
      "Google Calendar API",
      "Resend",
      "Convex Auth",
      "shadcn/ui",
      "Tailwind",
      "TypeScript",
    ],
    technologies: [
      {
        nom: "Next.js (App Router)",
        detail:
          "Site et application réunis sous le même toit. Les Server Actions servent de points d'entrée RPC pour les actions sensibles (lien d'achat Stripe, génération d'URL signée R2, création d'évènement Google Calendar) sans exposer d'API publique. Les pages publiques restent statiques pour la performance et le SEO.",
      },
      {
        nom: "Convex",
        detail:
          "Backend temps réel et base de données. Schéma typé partagé client/serveur, mutations transactionnelles pour les achats, queries réactives pour le dashboard élève (les nouveaux packs apparaissent sans refresh). Convex héberge aussi les actions qui appellent Google Calendar et stocke les tokens OAuth de la prof.",
      },
      {
        nom: "Convex Auth (magic link via Resend)",
        detail:
          "Authentification sans mot de passe : la prof comme les élèves reçoivent un lien à usage unique sur leur email. Le provider Resend a été override pour logger systématiquement le magic link en console côté Convex — utile en dev quand le free tier de Resend bloque les destinataires non vérifiés.",
      },
      {
        nom: "Cloudflare R2",
        detail:
          "Hébergement des leçons vidéo. Pas de S3 : R2 ne facture pas la bande passante sortante, ce qui est crucial pour des vidéos consultées depuis 25+ pays. L'admin uploade directement depuis son navigateur via une URL pré-signée — la vidéo ne transite jamais par le serveur Next.js.",
      },
      {
        nom: "Stripe (Checkout + Webhooks)",
        detail:
          "Paiement de l'appel d'intro à 15 $ et des packs vidéo via Stripe Checkout. Le webhook `checkout.session.completed` déclenche en chaîne la création de la purchase côté Convex, puis l'évènement Google Calendar avec lien Meet pour le call d'intro.",
      },
      {
        nom: "Google Calendar API (OAuth 2.0)",
        detail:
          "La prof connecte son Google Calendar via OAuth depuis son dashboard. Les tokens sont stockés chiffrés dans Convex. Quand un élève paye un appel d'intro, l'évènement est créé dans son agenda à elle, dans son fuseau horaire (Europe/Warsaw), avec un lien Google Meet auto-généré et l'élève en invité.",
      },
      {
        nom: "Resend (domaine vérifié)",
        detail:
          "Tous les emails transactionnels (magic links, confirmations) partent depuis `noreply@russianwithjulia.com` via Resend, avec SPF + DKIM configurés sur la zone DNS OVH. Compte Resend au nom de la cliente — le dev n'a aucun email à envoyer en son nom.",
      },
      {
        nom: "shadcn/ui + Tailwind",
        detail:
          "Design system composé sur shadcn pour les briques fonctionnelles (Calendar, Dialog, Toast, Tabs), Tailwind pour la mise en forme. Thème noir et or assumé, typographie sérieuse pour souligner l'aspect personnel de la prof.",
      },
    ],
    pointsCles: [
      {
        label: "Enjeux",
        items: [
          "Donner à une prof indépendante un site qui matche la qualité de ses cours, sans dépendance à un dev en continu",
          "Permettre aux élèves d'acheter et de consommer des cours vidéo sans friction, partout dans le monde",
          "Automatiser tout l'opérationnel — paiement, calendrier, comptes — pour que la prof puisse se concentrer uniquement sur l'enseignement",
        ],
      },
      {
        label: "Défis",
        items: [
          "Hébergement vidéo économiquement viable sur 25+ pays — Cloudflare R2 (pas de frais de bande passante) plutôt que S3",
          "Auth sans mot de passe robuste en prod, avec un domaine email vérifié pour la délivrabilité",
          "Synchronisation bidirectionnelle Stripe → Convex → Google Calendar en moins de 5 secondes après un paiement",
          "Souveraineté de la cliente : domaine, Stripe, Resend, Google Cloud — tout au nom de Yulia, transférable à tout moment",
        ],
      },
      {
        label: "Intérêt",
        items: [
          "Stack moderne (Next.js 15 + Convex + Stripe + R2 + Resend) intégrée de bout en bout sans glue code superflu",
          "Documentation complète des décisions techniques sous forme d'ADR — réutilisable comme template pour les prochains projets clients",
          "Carte du monde des élèves construite from scratch avec un système de drag & drop manuel persisté en local pour positionner les labels",
        ],
      },
    ],
    challenges: [
      {
        titre: "Paywall vidéo — accès débloqué en temps réel sans refresh",
        solution:
          "Tant qu'un élève n'a pas acheté un pack, ses leçons sont affichées floutées avec un cadenas. Au paiement, le webhook Stripe insère une purchase dans Convex — et grâce à la réactivité native de Convex, le dashboard de l'élève bascule sur l'état déverrouillé en moins d'une seconde, sans qu'il ait besoin de recharger la page. Le streaming des vidéos passe par une URL signée R2 régénérée à chaque lecture.",
      },
      {
        titre: "Booking + paiement + Google Calendar enchaînés",
        solution:
          "L'élève choisit un créneau, paie via Stripe Checkout. Le webhook `checkout.session.completed` est reçu côté Next.js, qui appelle une action Convex. Cette action récupère le refresh token Google de la prof, échange contre un access token, crée l'évènement avec un lien Meet auto-généré, et invite l'élève. Tout ça en moins de 5 secondes. Si l'évènement échoue, la purchase est marquée pour retry manuel.",
      },
      {
        titre: "Auth magic link en prod avec domaine vérifié",
        solution:
          "Convex Auth + Resend pour des magic links sans mot de passe. Le piège majeur en prod : il faut absolument que le compte Resend qui possède la clé API soit aussi celui qui a vérifié le domaine, sinon l'envoi est bloqué au free tier. Tout passe par le compte de la cliente — j'ai juste configuré les records SPF/DKIM dans sa zone DNS OVH lors d'une visio screen-share de 20 min.",
      },
      {
        titre: "Synchronisation des deux Convex deployments + Vercel",
        solution:
          "Convex génère deux déploiements distincts (dev et prod), chacun avec ses propres variables d'env (SITE_URL, AUTH_RESEND_KEY, etc.). Au passage en prod, il faut absolument synchroniser les `NEXT_PUBLIC_CONVEX_URL` côté Vercel pour qu'ils pointent sur le bon déploiement, sinon le site live continue d'appeler le backend dev — bug le plus difficile à diagnostiquer du projet, intégralement documenté pour les futures mises en prod.",
      },
      {
        titre: "Carte du monde des élèves — drag & drop manuel",
        solution:
          "Première tentative : un algorithme automatique pour placer les labels des pays sans chevauchement, avec des traits pointillés vers chaque marqueur. Trop fragile, rendu robotique. Pivot vers un système manuel : en mode dev, un overlay drag & drop permet de placer chaque label à la souris, les positions sont stockées en localStorage, et un bouton exporte le JSON à coller dans le code pour la prod. Résultat : un placement humain, ajustable en 2 min quand un nouvel élève est ajouté.",
      },
      {
        titre: "Souveraineté complète de la cliente",
        solution:
          "Domaine OVH au nom de Yulia, comptes Stripe / Resend / Google Cloud à son nom, mots de passe maîtrisés par elle. Le dev n'a que des accès temporaires (zone DNS OVH partagée en visio, clés API transmises en MP). Si demain elle change de dev, tout est transférable sans avoir à migrer un seul service. Modèle documenté dans une ADR « propriété des comptes services externes » réutilisable sur tous les projets clients.",
      },
    ],
    resultats:
      "Site live sur russianwithjulia.com avec stack complète déployée. Les élèves peuvent réserver, payer et accéder à leurs vidéos. La prof gère son admin de bout en bout sans intervention dev. Le projet sert maintenant de modèle technique et de documentation de référence pour les prochains projets freelance — chaque décision est justifiée dans une ADR.",
    date: "2026-04",
  },
  {
    slug: "argedis-totalenergies",
    titre: "Carte interactive des producteurs locaux",
    client: "TotalEnergies · Argedis",
    clientShort: "TotalEnergies",
    logo: "/logo-total.webp",
    logos: ["/logo-total.webp", "/logo-argedis.webp"],
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
      "/assets/videoArgedis/argedis-img1.webp",
      "/assets/videoArgedis/argedis-img2.webp",
      "/assets/videoArgedis/argedis-img3.webp",
      "/assets/videoArgedis/argedis-view-prod.webp",
      "/assets/videoArgedis/argedis-view-prod-en.webp",
    ],
    video: "/assets/videoArgedis/argedis-record.mp4",
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
    logo: "/logo-adp.webp",
    logos: ["/logo-adp.webp", "/logo-extime.webp"],
    contexte: "agence",
    description:
      "Jeu concours digital pour les voyageurs d'ADP : un ticket à gratter virtuel pour gagner des réductions dans les boutiques Extime.",
    descriptionPublic:
      "**Un ticket, une chance.** Le voyageur arrive sur l'écran d'accueil, invité à tenter sa chance. Il saisit son email — la carte se retourne alors pour révéler sa zone de grattage. Tout est pensé pour être joué en quelques secondes, debout, avant d'embarquer.\n\n**Gratter pour révéler.** La récompense est cachée sous une surface tactile dessinée sur canvas. Le joueur gratte avec le doigt — et le gain apparaît automatiquement : **sucette**, **réduction -5%** ou **réduction -20%**.\n\n**Une expérience en six étapes.** Accueil → saisie email → flip de carte → grattage → résultat gagnant ou écran dommage. Chaque transition est animée, chaque étape se succède sans rechargement — une expérience fluide du début à la fin.",
    intro: `Pour Extime, la marque de luxe travel retail des Aéroports de Paris, j'ai développé un jeu concours digital qui a touché **des centaines de milliers d'utilisateurs** en quelques semaines seulement. Les voyageurs recevaient un **bon physique avec QR code** à l'achat en boutique — en le scannant, ils accédaient au jeu et pouvaient gratter un ticket virtuel pour remporter une **récompense** : **sucette** ou **code de réduction** valable dans les boutiques de l'aéroport.`,
    img: "/assets/sweetime/sweetime-nano.webp",
    video: "/assets/sweetime/sweetime-record.mp4",
    sliderSets: [
      {
        title: "Le parcours complet",
        description: "En quelques secondes, le voyageur saisit son email, retourne la carte et gratte pour révéler son lot. Chaque étape s'enchaîne sans rechargement — de l'inscription au bon de réduction, tout est fluide et pensé pour être joué debout, avant l'embarquement.",
        images: [
          "/assets/sweetime/sweetime-registration-form.webp",
          "/assets/sweetime/sweetime-scratch-card-full.webp",
          "/assets/sweetime/sweetime-scratch-card-revealing.webp",
          "/assets/sweetime/sweetime-prize-result.webp",
        ],
      },
    ],
    tags: ["Next.js", "MongoDB", "Canvas", "Storybook", "Lottie", "i18next"],
    technologies: [
      {
        nom: "Next.js (App Router)",
        detail:
          "Interface côté client, mais les appels à MongoDB ne peuvent pas transiter directement par le navigateur — faille de sécurité critique sur une opération de cette envergure. Les API routes Next.js servent de proxy serveur sécurisé, sans avoir à déployer un backend séparé.",
      },
      {
        nom: "MongoDB",
        detail:
          "Opération courte, charge d'écriture intense, structure de données flexible par boutique. MongoDB absorbe des milliers d'appels simultanés sans dégradation, là où une base relationnelle aurait nécessité une gestion de concurrence plus complexe.",
      },
      {
        nom: "Canvas API",
        detail:
          "Le grattage tactile est impossible à reproduire avec du HTML/CSS standard. Canvas permet un contrôle précis du dessin et de l'effacement progressif pour révéler la récompense sous le doigt.",
      },
      {
        nom: "Storybook",
        detail:
          "Beaucoup d'éléments graphiques à construire avant le funnel (états de carte, animations, cadre décoratif). Storybook a permis de valider chaque composant en isolation sans naviguer dans tout le flow.",
      },
      {
        nom: "Lottie + Framer Motion",
        detail:
          "Deux types d'animations coexistent : les séquences design pré-rendues (pluie de bonbons) via Lottie, et les transitions programmatiques (décorations, apparitions) via Framer Motion.",
      },
      {
        nom: "i18next",
        detail:
          "Basculement FR/EN instantané côté client sans changement d'URL — le terminal est identifié via les paramètres UTM de l'URL, pas via le routing.",
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
        titre: "Carte à gratter sur canvas et cadre responsive",
        solution:
          "Le grattage tactile repose entièrement sur Canvas — le seul moyen d'effacer progressivement une surface dessinée sous le doigt. Le tracé doit rester fluide même à grande vitesse, et la révélation se déclenche automatiquement dès qu'un seuil de surface grattée est atteint. Le cadre décoratif (style bonbon) est lui aussi dessiné sur canvas : ses dimensions s'adaptent dynamiquement au container pour rester proportionnel sur tous les formats d'écran, du téléphone à la tablette.",
      },
      {
        titre: "Funnel en état machine et flip de carte",
        solution:
          "L'expérience suit 6 étapes séquentielles (accueil, saisie email, flip, grattage, gain, dommage). La récompense est attribuée côté serveur avant que la carte ne se retourne — le joueur ne peut pas savoir à l'avance ce qu'il va gagner. Chaque transition est animée pour rendre le funnel fluide sans rechargement.",
      },
      {
        titre: "Anti-fraude : QR code physique et double vérification",
        solution:
          "L'accès passe par un QR code remis physiquement en boutique — sans ce bon, impossible de jouer. Une première vérification côté client bloque les tentatives répétées depuis le même appareil. Si cette barrière est contournée, une vérification serveur via l'email prend le relais. La personne ne peut pas rejouer, qu'elle ait gagné ou non.",
      },
      {
        titre: "Distribution probabiliste avec stocks limités",
        solution:
          "Trois récompenses avec des probabilités différentes. Si une tranche est tirée mais son stock est épuisé, le joueur atterrit sur 'Dommage' — pas de rebond vers une autre récompense. Cela garantit une distribution strictement contrôlée sur toute la durée de l'opération.",
      },
      {
        titre: "Animations : fond rotatif, Lottie et Framer Motion",
        solution:
          "Le fond tourne en continu à deux vitesses selon l'étape. La pluie de bonbons au gain est une séquence Lottie fournie par le design, jouée en une seule passe. Les décorations candy apparaissent progressivement dès que l'utilisateur quitte l'écran principal.",
      },
    ],
    credits: [
      { nom: "Mathieu Crochet", role: "Manager & architecture backend · Artefact 3000" },
      { nom: "Vincent Blacher", role: "Head of Design · Artefact 3000" },
      { nom: "Pauline Chapelle", role: "Designer · Artefact 3000" },
    ],
    resultats:
      "L'opération a attiré plusieurs centaines de milliers de participants sur une à deux semaines, avec un taux d'engagement supérieur aux attentes. Le jeu a contribué à augmenter le trafic dans les boutiques Extime pendant la période.",
    date: "2024-11",
  },
  {
    slug: "make-a-scene",
    titre: "Outil de formation au prompting IA",
    client: "Artefact",
    contexte: "agence",
    description:
      "Funnel interactif déployé chez Artefact pour apprendre à construire un prompt structuré et générer des images par IA, étape par étape.",
    descriptionPublic:
      "**Un outil pour apprendre à parler à une IA.**\nPlutôt que lire des guidelines, les participants construisent un prompt mot à mot : type d'image, sujet, action, lieu, style, lumière, ratio. Chaque choix s'ajoute en temps réel à la barre de prompt visible en bas de l'écran.\n\n**Un résultat visible à chaque étape.**\nAu survol de chaque option, une image d'exemple s'affiche pour aider à choisir. On avance seulement quand tous les champs sont remplis, ce qui force la précision du prompt.\n\n**Quatre images générées en quelques secondes.**\nUne fois le funnel terminé, l'outil génère quatre variantes visuelles à partir du prompt construit. Le prompt complet est affiché et copiable. On peut revenir sur n'importe quelle étape et recommencer.\n\n**Disponible en français et en anglais.**\nInterface bilingue, pensée pour des équipes internationales.",
    intro: `Développé en interne chez **Artefact**, Make a Scene est un outil de formation au **prompt engineering** appliqué à la génération d'images. Plutôt que de lire des guidelines, les participants construisent un prompt mot à mot à travers un funnel guidé : **3 étapes, 14 sous-étapes**. Chaque option dispose d'une image de prévisualisation au survol. Au bout du funnel, 4 variantes sont générées en une seule requête. Disponible en anglais et en français.`,
    img: "/assets/makeAScene/make-a-scene-miniature.webp",
    logo: "/assets/makeAScene/artefact-logo.webp",
    video: "/assets/makeAScene/make-a-scene-demo.mp4",
    videoTitle: "La démo complète",
    wideMedia: true,
    sliderSets: [
      {
        title: "Le funnel pas à pas",
        description: "Chaque écran guide l'utilisateur vers un mot clé à sélectionner — type d'image, lieu, rendu, ratio. Le prompt s'assemble en bas de l'écran au fil des choix. La flèche pour avancer n'apparaît que lorsque tous les champs sont remplis.",
        images: [
          "/assets/makeAScene/make-a-scene-login.webp",
          "/assets/makeAScene/make-a-scene-artwork-type.webp",
          "/assets/makeAScene/make-a-scene-artwork-hover.webp",
          "/assets/makeAScene/make-a-scene-location.webp",
          "/assets/makeAScene/make-a-scene-rendering.webp",
          "/assets/makeAScene/make-a-scene-image-ratio.webp",
          "/assets/makeAScene/make-a-scene-ratio-hover.webp",
          "/assets/makeAScene/make-a-scene-other-params.webp",
        ],
      },
      {
        title: "Du prompt à l'image",
        description: "Une fois le funnel terminé, 4 variantes sont générées. Une barre de progression s'affiche pendant la génération, puis les 4 images apparaissent côte à côte, avec le prompt complet en dessous, copiable en un clic.",
        images: [
          "/assets/makeAScene/make-a-scene-intro.webp",
          "/assets/makeAScene/make-a-scene-summary.webp",
          "/assets/makeAScene/make-a-scene-generation.webp",
          "/assets/makeAScene/make-a-scene-results.webp",
        ],
      },
    ],
    tags: ["Next.js", "Génération d'images IA", "Zustand", "Storybook", "next-intl", "Embla Carousel"],
    technologies: [
      {
        nom: "Next.js App Router",
        detail:
          "App structurée en routes distinctes, chacune avec son layout dédié. Les images générées sont stockées en mémoire côté client et affichées sans passer par un backend.",
      },
      {
        nom: "API de génération d'images",
        detail:
          "Une seule requête suffit à générer les 4 variantes finales côté serveur. Pas de Promise.all, pas de polling : la Server Action attend la réponse complète et la retourne au client d'un bloc. Les images de prévisualisation du funnel sont générées une fois en script offline et servies en statique, sans aucun appel API au runtime.",
      },
      {
        nom: "Zustand",
        detail:
          "Un store unique gère tout l'état du funnel : étape courante, valeurs sélectionnées à chaque sous-étape, flag de navigation vers la galerie, URLs des images générées. Aucun prop drilling sur les 3 étapes × 14 sous-étapes.",
      },
      {
        nom: "Storybook",
        detail:
          "Tous les composants du design system sont développés et validés en isolation avant d'être intégrés. Cela garantit la cohérence visuelle et facilite les retours du client sur chaque brique de l'interface.",
      },
      {
        nom: "next-intl",
        detail:
          "Interface disponible en anglais et en français. Toutes les questions, options et labels du funnel sont externalisés en fichiers de traduction, avec sélecteur de langue visible.",
      },
      {
        nom: "Embla Carousel + Radix UI Slider",
        detail:
          "Embla pour les carousels d'options et la galerie de résultats. Radix UI Slider pour les 3 paramètres avancés de l'étape finale, avec rendu accessible natif.",
      },
    ],
    challenges: [
      {
        titre: "Funnel 3 étapes × 14 sous-étapes avec navigation arrière",
        solution:
          "Le funnel est découpé en 3 grandes étapes thématiques, elles-mêmes divisées en 14 sous-étapes. Chaque bloc du prompt assemblé est cliquable : l'utilisateur peut revenir directement sur n'importe quelle sous-étape sans perdre ses choix. Tout l'état du funnel est centralisé dans un store Zustand, ce qui évite le prop drilling et rend la navigation arrière triviale à implémenter.",
      },
      {
        titre: "Génération des 4 images en une seule requête",
        solution:
          "Plutôt que d'enchaîner plusieurs appels, une seule requête avec le paramètre n: 4 génère les 4 variantes côté serveur en une fois. Pas de Promise.all, pas de polling : la Server Action attend la réponse complète et la retourne au client. Résultat : code simple, délai minimal, pas de gestion d'état intermédiaire.",
      },
      {
        titre: "Images de prévisualisation au survol sans appel API",
        solution:
          "Chaque option du funnel dispose d'une image d'exemple visible au survol. Plutôt que de générer ces images à la volée, elles ont été produites une seule fois en script offline et sont servies en statique. Aucun appel API au runtime, aucune latence côté utilisateur.",
      },
    ],
    date: "2026-01",
  },
  {
    slug: "bald-artiste",
    titre: "Site e-commerce artiste peintre",
    client: "Bald",
    logo: "/assets/bald/bald-logo-splash.webp",
    contexte: "freelance",
    description:
      "Site e-commerce pour Bald, artiste peintre abstrait — galerie filtrable par collection, taille et prix, fiches œuvres avec slider, achat en ligne via Stripe, internationalisation FR/EN.",
    descriptionPublic:
      "**Une identité visuelle sur mesure.**\nChaque élément graphique a été conçu pour Bald : le logo découpé en deux typographies (BA en encre, LD en feuille d'or), un badge circulaire animé, des coups de pinceau qui s'animent au défilement de la page. Ce genre d'effets visuels ne s'improvise pas avec un template.\n\n**Une galerie pensée pour naviguer facilement.**\nLes visiteurs filtrent les toiles par collection, par dimensions et par prix. L'accès à ce qu'ils cherchent est immédiat, sans rechargement de page.\n\n**Acheter une toile en quelques clics.**\nLe paiement est intégré directement dans le site. Quand une toile est vendue, elle disparaît instantanément. Bald peut ajouter ou retirer des œuvres depuis son espace d'administration, sans toucher au code.\n\n**Le site en français et en anglais.**\nChaque page, chaque fiche et chaque mention légale est disponible dans les deux langues. Un visiteur anglophone arrive automatiquement sur la bonne version.",
    intro: `Site e-commerce développé en **freelance** pour **Bald**, artiste peintre abstrait. Identité visuelle noir et or construite __from scratch__ : intro animée, badge circulaire rotatif, coups de pinceau au scroll, typographie Bebas Neue. Galerie avec filtres multi-critères, tunnel ~~Stripe~~ complet, backend ~~Convex~~ pour la synchronisation du stock en temps réel, internationalisation FR/EN native. Le genre de site qu'on ne fait pas avec un template.`,
    img: "/assets/bald/bald-miniature.webp",
    heroImg: "/assets/bald/bald-hero-accueil.webp",
    url: "https://bald-art.com",
    wideMedia: true,
    customSlider: "bald-identity",
    sliderSets: [
      {
        title: "L'identité visuelle",
        description: "Chaque élément graphique — le logo, le badge circulaire rotatif, les coups de pinceau au scroll — a été conçu sur mesure et intégré. Noir et or, typographie Bebas Neue, animations GSAP : tout l'univers de BALD est construit from scratch.",
        images: [],
      },
      {
        title: "La galerie filtrée",
        description: "La galerie permet de filtrer les œuvres par collection, par dimensions et de les trier par prix croissant ou décroissant. Avec plusieurs dizaines de toiles, le filtrage est instantané côté client — sans rechargement, sans appel réseau.",
        images: ["/assets/bald/bald-galerie-filtres.webp"],
      },
    ],
    tags: ["Next.js", "Convex", "Stripe", "GSAP", "Lenis", "next-intl", "TypeScript"],
    technologies: [
      {
        nom: "Convex",
        detail:
          "La disponibilité des œuvres doit être mise à jour en temps réel après un achat — deux acheteurs simultanés ne peuvent pas commander la même toile. Convex gère les mutations transactionnelles et synchronise l'état entre tous les clients connectés instantanément.",
      },
      {
        nom: "Stripe",
        detail:
          "Tunnel d'achat complet avec gestion des sessions de paiement. Stripe Checkout simplifie l'intégration et garantit une expérience de paiement sécurisée sans avoir à gérer les données bancaires côté serveur.",
      },
      {
        nom: "GSAP + Lenis",
        detail:
          "Le site valorise des œuvres d'art : le scroll devait être fluide et les animations soignées. Lenis assure un défilement doux, GSAP gère les animations au scroll et les transitions entre pages.",
      },
      {
        nom: "next-intl",
        detail:
          "Le site est disponible en français et en anglais. Le routing i18n est géré par next-intl avec des fichiers de traduction séparés — chaque page, chaque label, chaque message d'erreur est externalisé.",
      },
      {
        nom: "Next.js",
        detail:
          "Les pages de galerie et de fiches œuvres sont générées statiquement pour des performances maximales et un bon référencement. Les mutations (achat, stock) passent par des Server Actions.",
      },
    ],
    challenges: [
      {
        titre: "Mise à jour de stock en temps réel",
        solution:
          "Quand une toile est vendue, elle doit immédiatement apparaître comme indisponible sur tous les navigateurs connectés — sans refresh. Convex résout ce problème nativement : les mutations sont réactives, les clients abonnés reçoivent la mise à jour en quelques millisecondes.",
      },
      {
        titre: "Galerie filtrable avec tri multi-critères",
        solution:
          "Les œuvres peuvent être filtrées par collection, par dimensions et triées par prix. Avec plusieurs dizaines de toiles, le filtrage devait rester instantané côté client. La logique de filtrage est encapsulée dans un useMemo pour éviter les recalculs à chaque render.",
      },
      {
        titre: "Internationalisation FR/EN complète",
        solution:
          "Tout le contenu du site — galerie, fiches œuvres, pages légales, formulaire de contact — est disponible en français et en anglais via next-intl. Le choix de la langue est persisté, et chaque page a son URL localisée pour le SEO.",
      },
      {
        titre: "Pages légales e-commerce",
        solution:
          "Une boutique en ligne implique des obligations légales : CGV, politique de confidentialité, politique de retour. Ces pages ont été rédigées et intégrées, avec les spécificités du commerce d'art international (livraison internationale, règles douanières, délai de rétractation).",
      },
    ],
    date: "2026-02",
  },
];

export function getProjet(slug: string) {
  return projets.find((p) => p.slug === slug);
}
