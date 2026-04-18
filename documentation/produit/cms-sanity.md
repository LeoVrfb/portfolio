# CMS Headless — Sanity

Le CMS choisi par défaut pour tous les projets qui en ont besoin. Justification du choix, grille de prix dynamique, process de mise en place, formation client.

> Doublon dans `portfolio/documentation/produit/cms-sanity.md` pour le projet web.

---

## Pourquoi Sanity et pas un autre CMS

### Comparatif des options envisagées (avril 2026)

| CMS | Plan gratuit | UI client | Self-hosted | Maturité |
|---|---|---|---|---|
| **Sanity** | 3 users + 10k docs gratuits, vraiment confortable | Excellente, intuitive | Non (cloud uniquement) | Très solide depuis 2018 |
| **Tina** | Gratuit avec limites (Git-based) | Bonne, mais moins polie | Oui | Plus jeune, en montée |
| **Payload CMS** | Gratuit (self-hosted) | Très bonne | Oui (à héberger) | Très moderne, en explosion |
| **Contentful** | 5 users + 25k records, devient cher rapidement | Bonne | Non | Référence enterprise |
| **Strapi** | Gratuit (self-hosted) ou cloud payant | Correcte | Oui | Référence open-source |
| **Prismic** | 1 user + repos publics gratuits | Bonne | Non | Solide mais moins moderne |

### Pourquoi Sanity est le meilleur choix pour ta cible

1. **Plan gratuit large** : 3 users + 10k documents = couvre 95% des sites vitrine et e-commerce légers de tes clients. Sanity ne deviendra payant que pour des cas très exceptionnels (gros e-commerce > 100 produits avec beaucoup de versions).

2. **UI client ultra simple** : Sanity Studio (l'interface admin) est la plus intuitive du marché. Un client non-technique apprend en 10 min à modifier ses textes et photos.

3. **Headless natif** : zéro impact sur la performance du site Next.js. Le contenu est récupéré au build ou en revalidation, pas en runtime.

4. **Stack moderne** : intégration Next.js excellente (composants, types TypeScript générés, hooks officiels).

5. **Pas de self-hosting à gérer** : pas de DB à administrer, pas d'infra à maintenir. Tu te concentres sur le code, Sanity gère le reste.

6. **Bonne extensibilité** : si un client a besoin de personnaliser le Studio (workflow custom, validation, preview), Sanity le permet sans tout réécrire.

### Cas où on ne prendrait PAS Sanity

- **Le client veut zéro service externe** (paranoïa data) → on regarde Payload CMS self-hosted
- **Le client a un gros volume (>100 produits) et veut absolument zéro coût récurrent** → Payload self-hosted
- **Le client veut que le contenu soit versionné dans Git (workflow dev)** → on regarde Tina
- **Le client a déjà une équipe Contentful en interne** → on reste sur Contentful

Pour 95% des cas : **Sanity par défaut**.

---

## Grille de prix dynamique

Le CMS est facturé selon le **nombre d'entrées modifiables** que le client doit pouvoir gérer en autonomie. Une « entrée » = un produit, un article de blog, un membre d'équipe, une photo de galerie, un témoignage, un service, etc.

### Tarifs

| Volume | Prix | Cas typique |
|---|---|---|
| Jusqu'à 20 entrées | **+150€** | Vitrine basique : 5-10 textes modifiables + 10 photos modifiables |
| 21 à 50 entrées | **+200€** | Vitrine + blog ou petit catalogue (artisan avec 30 réalisations) |
| 51 à 100 entrées | **+300€** | E-commerce 30-50 produits + quelques pages |
| 100+ entrées | **sur devis** | Gros catalogue (artistes prolifiques, e-commerce avec 100+ produits) — audit du volume avant chiffrage |

### Pourquoi ces tranches

Le travail varie selon le volume parce que :
- Plus d'entrées = plus de **types de contenu** à modéliser dans Sanity (schémas)
- Plus d'entrées = plus de **vues à structurer** dans le Studio (filtres, tri, organisation)
- Plus d'entrées = plus d'**intégration initiale** (création des entrées de départ avec le contenu existant)
- Pour un e-commerce avec 100 produits : il faut chaque produit avec ses photos, descriptions, variantes éventuelles → c'est du vrai temps de mise en place

### Inclus systématiquement (quel que soit le volume)

- **Mise en place du schéma Sanity** : types de contenu adaptés au site (articles, produits, équipe, témoignages, FAQ, etc.)
- **Connexion Next.js ↔ Sanity** : revalidation automatique au changement (le site se met à jour sans redéployer manuellement)
- **Compte Sanity créé au nom du client** : transmis avec ses identifiants à la livraison
- **Création des entrées initiales** : le contenu existant du site est inséré dans Sanity prêt à être modifié
- **Formation 30 min en visio** (incluse, enregistrée pour rejouer à vie)
- **Documentation simple écrite** : 1-2 pages PDF expliquant ce que le client peut faire (modifier un texte, ajouter une photo, créer un produit)

### Affichage dynamique sur le configurateur portfolio

Quand le client coche « CMS Headless Sanity », une sous-option **Volume d'entrées** apparaît sous forme de pills cliquables (jusqu'à 20 / 21-50 / 51-100 / 100+). Le prix par défaut affiché est **150€** (jusqu'à 20 entrées). Tant qu'aucun volume n'est choisi, l'option est marquée en rouge et le bouton « Démarrer ce projet » est désactivé.

Quand le client clique sur l'icône info à côté du prix CMS, il voit la grille complète avec toutes les tranches.

### En Premium

CMS inclus jusqu'à **50 entrées**. Au-delà : sur devis (audit du volume avant chiffrage). Pour rappel, Sanity reste gratuit jusqu'à 10 000 documents, donc le coût récurrent côté client ne change pas.

---

## Process de mise en place

### Phase 1 — Pendant le brief

- Identifier ce que le client veut modifier en autonomie : textes, photos, produits, articles, etc.
- Estimer le volume d'entrées (compter les sections modifiables × le nombre prévu)
- Valider le périmètre dans le devis

### Phase 2 — Pendant le dev

1. **Création du projet Sanity** sur sanity.io (compte gratuit au nom du client)
2. **Définition des schémas** dans `sanity/schemas/` (types de contenu adaptés au site)
3. **Configuration du Studio** dans `sanity/sanity.config.ts`
4. **Intégration Next.js** : client Sanity, types TypeScript générés (`@sanity/types`), revalidation automatique
5. **Insertion des données initiales** : le contenu du site (textes, photos) est inséré dans Sanity (pas en dur dans le code)
6. **Test de modification** : on modifie une entrée dans Sanity Studio, on vérifie que le site se met à jour

### Phase 3 — À la livraison

1. **Transfert du compte Sanity** au client (création du compte avec son email pro)
2. **Formation 30 min en visio enregistrée** :
   - Comment se connecter au Studio (URL, identifiants)
   - Comment modifier un texte
   - Comment ajouter / modifier une photo
   - Comment créer un nouveau produit / article
   - Comment publier les changements
   - Comment voir le rendu en preview avant publication
3. **Remise de la doc PDF** (2 pages max, illustrée)
4. **Test en direct avec le client** pour vérifier qu'il sait faire les manips de base

---

## Modélisation des schémas (références techniques)

Pour rappel à toi quand tu démarres un projet avec Sanity. Pas pour le client.

### Schéma type pour un site vitrine

```ts
// sanity/schemas/page.ts
{
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', validation: Rule => Rule.required() },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'sections', type: 'array', of: [{ type: 'heroSection' }, { type: 'textSection' }, { type: 'gallerySection' }] },
    { name: 'seo', type: 'seoFields' },
  ]
}
```

### Schéma type pour un e-commerce

```ts
// sanity/schemas/product.ts
{
  name: 'product',
  title: 'Produit',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', validation: Rule => Rule.required() },
    { name: 'slug', type: 'slug', options: { source: 'name' } },
    { name: 'price', type: 'number', validation: Rule => Rule.required().min(0) },
    { name: 'images', type: 'array', of: [{ type: 'image' }], validation: Rule => Rule.min(1) },
    { name: 'description', type: 'blockContent' },
    { name: 'category', type: 'reference', to: [{ type: 'category' }] },
    { name: 'available', type: 'boolean', initialValue: true },
    { name: 'featured', type: 'boolean', initialValue: false },
  ]
}
```

### Schéma SEO réutilisable

```ts
// sanity/schemas/seoFields.ts
{
  name: 'seoFields',
  title: 'SEO',
  type: 'object',
  fields: [
    { name: 'title', type: 'string', description: 'Titre dans Google (60 caractères max)' },
    { name: 'description', type: 'text', description: 'Description Google (160 caractères max)' },
    { name: 'ogImage', type: 'image', description: 'Image partagée sur réseaux sociaux (1200x630)' },
  ]
}
```

---

## Coûts récurrents — anticipation

### Plan gratuit Sanity (limites au 04/2026)

- 3 users (le client + toi + 1 invité éventuel)
- 10 000 documents (= entrées modifiables)
- 100 000 requêtes API/mois
- 5 GB de stockage de fichiers
- 100 GB de bande passante CDN/mois

**Pour ta cible** : c'est largement suffisant pour 95% des cas. Un site vitrine consomme < 50 documents et < 10k requêtes/mois.

### Si dépassement

- Plan Growth Sanity : à partir de 99$/mois
- Si on arrive là : c'est que le projet du client a explosé (plusieurs milliers de produits, trafic massif), et il devra payer son CMS comme un service business
- **À noter dans le devis** : *« Sanity est gratuit jusqu'à 10 000 documents. Au-delà, il devient payant (~99$/mois). Cela ne devrait pas vous concerner sauf croissance majeure. »*

### Recommandation au client

Toujours informer dès le devis qu'il existe un seuil au-delà duquel Sanity devient payant. Le client n'aime pas les surprises 6 mois après livraison.

---

## Cas spécial — Convex vs Sanity

Tu as parfois envisagé Convex comme base de données. Voici quand utiliser quoi :

### Convex

- App temps réel (chat, notifications live, collaboration)
- Dashboard avec données dynamiques fortes (graphiques, KPIs)
- Application avec logique métier complexe (workflows, états multiples)
- Backend custom avec authentification utilisateurs finaux

### Sanity

- Sites vitrine
- Sites éditoriaux (blog, magazine)
- E-commerce léger (jusqu'à plusieurs centaines de produits)
- Tout ce qui est **contenu géré par le client**

### Pour ta cible (artisans, commerçants, PME)

**Sanity systématiquement.** Convex est puissant mais surdimensionné pour des sites vitrine ou e-commerce light. Tu factureras la même chose, mais Convex te demandera plus de temps à mettre en place pour aucun bénéfice client.

**Exception** : si un client demande une vraie app (espace membre avec notifications, dashboard analytics personnalisé, etc.), passer sur du sur-devis avec Convex.

---

## Formation client — script type

### Phrases clés en visio (30 min)

> *« Je vais vous montrer comment modifier votre site en autonomie. C'est très simple, vous allez voir. »*

> *« Le Studio Sanity est l'endroit où vous gérez votre contenu. Le site, c'est ce que voient vos visiteurs. Quand vous changez un texte ici, le site se met à jour automatiquement. »*

> *« Vous pouvez modifier autant de fois que vous voulez. Tant que vous n'avez pas cliqué sur "Publier", c'est en mode brouillon, le site n'est pas impacté. »*

> *« Si vous faites une erreur, l'historique des versions vous permet de revenir en arrière. »*

> *« Si jamais vous bloquez sur quelque chose, deux options : la maintenance mensuelle inclut 1h de support, sinon je suis dispo à 60€/h pour vous accompagner. »*

### Documentation client (PDF 2 pages)

À générer pour chaque projet, avec captures d'écran adaptées :

```markdown
# Guide rapide — Sanity Studio

## Se connecter
URL : https://[projet].sanity.studio
Identifiants : [reçus par email]

## Modifier un texte
1. Cliquez sur le contenu à modifier (ex : "Page d'accueil")
2. Modifiez le texte directement dans le champ
3. Cliquez sur "Publier" en bas à droite

## Ajouter une photo
1. Allez dans le contenu concerné (ex : "Galerie")
2. Cliquez sur le champ "Photo" (ou "+")
3. Glissez-déposez votre image (formats acceptés : JPG, PNG, WebP)
4. Cliquez sur "Publier"

## Créer un nouveau produit
1. Allez dans "Produits"
2. Cliquez sur "+" en haut à droite
3. Remplissez les champs (nom, prix, photos, description)
4. Cliquez sur "Publier"

## Voir le rendu avant publication
1. Cliquez sur l'œil à côté du contenu
2. Une fenêtre s'ouvre avec le rendu

## Restaurer une version précédente
1. Allez sur le contenu
2. Cliquez sur "Historique"
3. Sélectionnez une version
4. Cliquez sur "Restaurer"

## Besoin d'aide ?
Email : [ton-email]
Maintenance mensuelle : 50€/mois (1h de support inclus)
À la demande : 60€/h (devis avant intervention)
```
