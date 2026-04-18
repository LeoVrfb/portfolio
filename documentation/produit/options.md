# Options

Toutes les options activables sur une formule. Chaque option a un périmètre exact, un prix par formule, et le détail de ce qui est livré. Ce fichier alimente le configurateur du portfolio (chaque option = un addon avec un prix selon la formule sélectionnée).

> Doublon dans `portfolio/documentation/produit/options.md` pour le projet web.

---

## Vue d'ensemble — grille consolidée

| Option | Essentiel | Standard | Premium |
|---|---|---|---|
| Page supplémentaire | +60€ | +60€ | +60€ |
| Rédaction des textes | +100€ | inclus | inclus |
| Design custom (charte perso) | non dispo | inclus | inclus |
| Design 100% sur mesure | non dispo | non dispo | inclus |
| **SEO avancé** | +150€ | +100€ | inclus |
| **Performance (Lighthouse 95+)** | +120€ | +100€ | inclus |
| Google Analytics 4 | +50€ | inclus | inclus |
| Google Business Profile (création) | +80€ | +80€ | +80€ |
| Google Business Profile suivi 3 mois | +150€ | +150€ | +150€ |
| Réservation (Calendly/Planity) | +80€ | +80€ | +80€ |
| **CMS Headless Sanity** | dynamique (150€ → 300€) | dynamique | inclus jusqu'à 50 entrées |
| Multilingue FR+EN (textes courts) | +150€ | +150€ | inclus |
| Multilingue (textes longs / articles) | sur devis | sur devis | sur devis |
| Migration ancien site | +200€ | +200€ | +200€ |
| Pack 10 photos (intégration) | +50€ | +50€ | inclus |
| Animations premium (GSAP, 3D) | non dispo | +250€ | inclus |
| Formation 30 min | +50€ | inclus | inclus avec CMS |
| **E-commerce** | dynamique (190€ → 310€) | dynamique | dynamique |
| Retouches au-delà du forfait | 60€/h | 60€/h | 60€/h |

Les options en **gras** ont un détail complet plus bas dans ce fichier.

---

## E-commerce

L'e-commerce est une **option dynamique** : le client choisit le **type** (sans panier / avec panier) et le **volume de produits**. Le prix se calcule en direct dans le configurateur. Le périmètre est le même quelle que soit la formule du site (un Premium avec e-commerce avec panier au même volume coûte la même chose qu'un Essentiel).

### Type de boutique

| Type | Prix de base | Cas typique |
|---|---|---|
| **Sans panier** | **190€** | Pièces uniques, prestations individuelles, vente d'œuvres, produits luxe |
| **Avec panier** | **+90€ → 280€** | Boutique multi-produits, catalogue créateur, e-commerce alimentaire |

Le panier ne représente qu'un delta modéré parce que le travail de Stripe Checkout, des emails, des pages légales et de la gestion produits est déjà fait dans la version sans panier.

### Volume de produits

| Volume | Supplément | Prix sans panier | Prix avec panier |
|---|---|---|---|
| 10 produits | inclus | 190€ | 280€ |
| 20 produits | +30€ | 220€ | 310€ |
| 30 produits | +60€ | 250€ | 340€ |
| 50 produits | +120€ | 310€ | 400€ |
| 50+ | sur devis | sur devis | sur devis |

Paliers volontairement larges (10 / 20 / 30 / 50) pour rester lisibles dans le configurateur. **10 produits inclus**, puis paliers à +30€, +60€, +120€. Au-delà de 50 produits : sur devis (ça devient une vraie maintenance catalogue, audit du flux + rythme de mise en ligne avant chiffrage).

### Sans panier — détail

Achat unitaire via Stripe Checkout direct.

**Inclus** :
- Configuration compte Stripe (avec accompagnement client : visio 30 min ou déplacement local)
- Page produit avec slider d'images, infos, bouton « Acheter »
- Checkout Stripe (carte, Apple Pay, Google Pay, Link)
- Page de confirmation post-paiement
- Email de confirmation au client (récap commande, droit de rétractation)
- Email de notification au vendeur (vente effectuée)
- Pages légales obligatoires : CGV, politique de retour, confidentialité RGPD
- Gestion des produits vendus (affichage archive, grayscale)
- Tests en mode test puis passage en live
- Indexation Google Search Console des produits

**Cas typiques** :
- Artiste qui vend ses tableaux
- Artisan qui vend des pièces uniques
- Coach qui vend des séances individuelles

### Avec panier — détail

Vraie boutique multi-produits avec panier, checkout Stripe avec plusieurs line items.

**Inclus** :
- Tout ce qui est dans « sans panier » +
- Panier client (ajouter, retirer, modifier les quantités)
- Récap avant checkout
- Checkout Stripe avec plusieurs articles
- Page galerie avec filtres (par catégorie, prix, recherche)
- Pagination si nombreux produits

**Cas typiques** :
- Boutique en ligne classique (vêtements, accessoires, déco)
- Petit catalogue produits (créateurs, artisans)
- E-commerce alimentaire (épicerie fine, vins)

### Affichage dynamique sur le configurateur

Quand le client coche « E-commerce », deux sous-options apparaissent :
- **Type** (boutons radio) : sans panier / avec panier
- **Volume produits** (pills cliquables) : 10 / 20 / 30 / … / 100 / 100+

Tant que les deux ne sont pas sélectionnées, l'option est marquée en rouge avec un message *« Sélectionnez le type et le volume »* et le bouton « Démarrer ce projet » est désactivé. Le prix total se met à jour à chaque clic.

---

## SEO avancé

Tout ce qui aide Google à mieux comprendre et indexer le site. Pas la performance technique (voir option « Performance »).

### Inclus

- **Schema.org étendu** : LocalBusiness, Product, Article, BreadcrumbList, FAQ selon les pages
- **OpenGraph + Twitter Cards** : optimisation des aperçus de partage par page
- **Meta dynamiques par page** : titles et descriptions optimisées avec mots-clés
- **Sitemap dynamique** : généré automatiquement, soumis à Google
- **Robots.txt fin** : autorisations précises selon les pages
- **Inscription Google Search Console** : verification du domaine + soumission sitemap
- **Audit du contenu** : densité de mots-clés, structure h1/h2/h3, liens internes
- **Plan de redirection** si le site remplace un ancien (avec option « Migration ancien site »)

### Prix par formule

| Essentiel | Standard | Premium |
|---|---|---|
| +150€ | +100€ | inclus |

Le prix descend en Standard parce qu'une partie du SEO complet est déjà incluse de base (Schema.org Local Business, OG, structure H1/H2/H3).

### Quand le proposer

- Tout client qui veut être trouvé sur Google (commerçant local, artisan, restaurant)
- Tout site qui remplace un ancien (préserver le ranking)
- Tout e-commerce (les fiches produit doivent être indexées correctement)

---

## Performance (Lighthouse 95+)

Tout ce qui rend le site rapide à charger. Distinct du SEO mais influence indirectement le ranking via Core Web Vitals.

### Inclus

- **Audit Lighthouse complet** + objectif 95+ sur les 4 métriques (Performance, Accessibilité, SEO, Best Practices)
- **Toutes les images en WebP** avec lazy loading natif (`loading="lazy"`)
- **Animations CSS prioritaires** sur GSAP/JS quand possible (moins lourd, mieux pour le CPU mobile)
- **SVG transformés en composants React** (svgr) pour les icônes (pas de requêtes HTTP supplémentaires)
- **Optimisation des fonts** : subset, preload, font-display swap, fallback
- **Audit du bundle JS** + code splitting agressif (chargement à la demande)
- **Optimisation Core Web Vitals** : LCP, INP, CLS surveillés et corrigés
- **Compression des assets** (gzip/brotli activés via Vercel)

### Prix par formule

| Essentiel | Standard | Premium |
|---|---|---|
| +120€ | +100€ | inclus |

### Quand le proposer

- Tout site avec beaucoup d'images (e-commerce, galerie, portfolio visuel)
- Tout site qui doit ranker face à de la concurrence forte
- Tout client qui se positionne sur la qualité / le luxe (la perf fait partie de l'expérience)

### Combo SEO + Performance

Souvent demandés ensemble. En Essentiel, le combo coûte 270€. C'est un argument à utiliser : *« Pour 270€ supplémentaires, votre site est techniquement irréprochable, optimisé Google, et chargé en 1 seconde sur mobile. »*

---

## CMS Headless Sanity

Un CMS pour que le client puisse modifier ses textes, photos, produits sans toucher au code. Voir `cms-sanity.md` pour le détail technique et la justification du choix de Sanity.

### Grille dynamique par volume d'entrées

Une « entrée modifiable » = un produit, un article de blog, un membre d'équipe, une photo de galerie, un témoignage, un service, etc.

| Volume | Prix | Cas typique |
|---|---|---|
| Jusqu'à 20 entrées | **+150€** | Vitrine basique (textes + 10 photos modifiables) |
| 21 à 50 entrées | **+200€** | Vitrine + blog ou petit catalogue |
| 51 à 100 entrées | **+300€** | E-commerce 30-50 produits |
| 100+ entrées | **sur devis** | Gros catalogue (audit du volume avant chiffrage) |

### Inclus systématiquement

- Mise en place du schéma Sanity (types de contenu adaptés au site)
- Connexion Next.js ↔ Sanity (revalidation automatique au changement)
- Compte Sanity créé au nom du client (transmis avec ses identifiants)
- **Formation 30 min incluse** (visio enregistrée, le client peut la rejouer à vie)
- Documentation simple écrite pour le client (ce qu'il peut faire, comment)

### Affichage dynamique sur le configurateur

Quand le client coche « CMS Headless Sanity », une sous-option **Volume d'entrées** apparaît (pills cliquables : 20 / 50 / 100 / 100+). Tant qu'aucun volume n'est choisi, l'option est marquée en rouge et le bouton « Démarrer ce projet » est désactivé.

Le prix par défaut affiché est **150€** (jusqu'à 20 entrées). Le prix s'ajuste automatiquement selon le volume choisi.

### En Premium

CMS inclus jusqu'à 50 entrées. Au-delà : sur devis (audit du volume avant chiffrage).

### Maintenance et CMS

Si le client prend le CMS, il devient autonome pour les modifs simples (textes, photos). La maintenance mensuelle (50€/mois) reste pertinente pour les mises à jour techniques et le monitoring, mais c'est un choix optionnel — voir `maintenance.md`.

---

## Multilingue

### FR + EN (textes courts) — +150€

Pour les sites avec des contenus relativement courts (sections, descriptions, formulaires). L'IA fait l'essentiel de la traduction, je relis et adapte.

**Inclus** :
- Configuration next-intl
- Fichiers de traduction `messages/fr.ts` et `messages/en.ts`
- Toggle de langue dans le header
- URLs localisées (`/fr/...` et `/en/...`)
- Traduction des balises SEO (titles, descriptions) pour le ranking international

### Textes longs / articles — sur devis

Si le site a beaucoup d'articles de blog, des descriptions produit longues, des FAQs détaillées : devis spécifique selon le volume. Compter environ 30€ par tranche de 1000 mots traduits + relus.

### En Premium

Multilingue FR+EN inclus pour les textes courts. Articles longs : sur devis.

### Autres langues

EN par défaut. Pour ES, IT, DE, etc. : même tarif que FR+EN par langue ajoutée. Pour les langues asiatiques (JP, ZH) ou arabe : sur devis (changements de layout RTL, fonts spécifiques).

---

## Détail des autres options

### Page supplémentaire — +60€/page

Page additionnelle au-delà de ce qui est inclus dans la formule. Conçue dans la même charte graphique, optimisée SEO.

**Cas particulier** : page galerie/portfolio avec beaucoup de contenu (>20 items) → sur devis (peut atteindre 200-300€).

### Rédaction des textes — +100€ (Essentiel uniquement)

Rédaction de tous les textes du site à partir d'un brief client (visio 1h). Inclus en Standard et Premium.

### Google Analytics 4 — +50€ (Essentiel uniquement)

Création du compte au nom du client, configuration du tracking, dashboard de base. Inclus en Standard et Premium.

### Google Business Profile (création) — +80€ (toutes formules)

Création ou optimisation de la fiche Google Business Profile (Google Maps). Photos, horaires, description, catégories. Indispensable pour les commerces locaux.

### Google Business Profile suivi 3 mois — +150€ (toutes formules)

Suivi mensuel pendant 3 mois : mise à jour photos, réponses aux avis, ajout de posts. Une fiche bien gérée peut doubler la visibilité locale.

### Réservation (Calendly/Planity/etc.) — +80€ (toutes formules)

Intégration d'un bouton de réservation directement sur le site, connecté à l'outil existant du client (TheFork, Zenchef, Planity, Calendly).

### Migration ancien site — +200€ (toutes formules)

Récupération du contenu de l'ancien site (textes, images, URLs, balises SEO) et réintégration dans le nouveau. Configuration des redirections 301 pour préserver le ranking Google.

### Pack 10 photos (intégration) — +50€

**Important** : ce n'est PAS du shooting photo (je ne suis pas photographe). C'est l'intégration de photos fournies par le client : sélection éditoriale, recadrage, compression WebP, intégration au bon endroit du site.

Pour des photos shootées par un pro : le client passe par un photographe (recommandation possible). Pour des photos générées par IA : sur devis (50-150€ selon volume).

### Animations premium (GSAP, 3D) — +250€ (Standard uniquement)

Animations sur mesure : transitions entre pages, apparitions au scroll, micro-interactions sur boutons et cartes, effets 3D légers si pertinents.

**Non disponible en Essentiel** : pour pousser à monter en formule. Un site Essentiel reste avec des animations CSS sobres incluses.

**Inclus en Premium** : pas besoin de cocher.

### Formation 30 min — +50€ (Essentiel uniquement)

Visio enregistrée pour apprendre à gérer son site (mises à jour de contenu simple via Vercel ou via le CMS si pris). Inclus en Standard et automatiquement avec tout CMS.

### Retouches au-delà du forfait — 60€/h (toutes formules)

Quand les heures incluses sont consommées, un devis est envoyé avant chaque intervention. Le client valide, l'intervention est faite, la facture suit.

**Important** : aucune intervention non validée. Pas de surprise sur la facture.

---

## Options à terme (non disponibles aujourd'hui)

À ajouter quand pertinent / quand l'expérience sera là :

- Refonte logo / identité visuelle (avec un graphiste partenaire)
- Espace membre / authentification (NextAuth, Clerk)
- Tableau de bord client (dashboard analytics personnalisé)
- Newsletter (intégration ConvertKit, Mailchimp)
- Intégration CRM (HubSpot, Pipedrive)
- A/B testing (Vercel Edge Config)
- Application mobile compagnon (React Native)

Ces options sortent de la cible « artisan / commerçant local / PME » et basculent sur du « sur devis ».
