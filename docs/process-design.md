# Process design et workflow client

Doc interne (pas publiée). Référence pour cadrer chaque projet client : process par formule, outils, contrat, paiement, brief, app perso.

À itérer au fur et à mesure des projets.

---

## 1. Vue d'ensemble

Trois formules, trois niveaux de cadrage design. Plus la formule monte, plus le client a de contrôle sur la direction visuelle.

| Formule | Process design | Validation client | Risque pour moi |
|---|---|---|---|
| Essentiel (590€) | Express, confiance | 1 appel + palette + typo | Faible (2h retouches) |
| Standard (990€) | 4 étapes formelles | Brief + moodboard + premier jet | Moyen (5h retouches) |
| Premium (1 890€+) | 4 étapes + options | Brief poussé + mini-maquettes possibles | Maîtrisé (10h + designer partenaire si besoin) |

Philosophie : moins le client paie, plus il me fait confiance. Si le client veut plus de contrôle visuel, il passe à la formule supérieure. C'est l'argument commercial central.

---

## 2. Process Essentiel (590€, 5 jours)

### Étapes

1. **Appel découverte 15 min** (gratuit, déjà en place via le calendrier du site)
2. **Brief express** (30 min, dans la foulée de l'appel ou par mail)
3. **Choix palette + typo** (15 min, ensemble en visio ou par mail)
4. **Code direct** (3 à 4 jours)
5. **Livraison + 2h retouches incluses**

### Brief express (5 questions)

- Activité, cible, ce que vous vendez
- Ambiance en 3 mots (chaleureux, premium, fun, sobre, technique...)
- 2 sites web que vous aimez (concurrents ou inspirations) + pourquoi
- 1 site web que vous détestez + pourquoi
- Couleur dominante préférée si vous avez une idée, sinon on choisit ensemble

### Palette

Outil : [coolors.co](https://coolors.co). Le meilleur générateur de palette en 5 min, gratuit.

- On part d'une couleur dominante choisie par le client (ou tirée de son logo)
- On cadenasse, on génère, on ajuste, on exporte en codes hex
- 5 minutes max ensemble en visio ou en async par capture d'écran
- Pas de moodboard, pas de premier jet à valider

Alternatives si besoin de varier :
- [Realtime Colors](https://www.realtimecolors.com) (visualise une palette en contexte UI réel)
- [Khroma](http://khroma.co) (IA, propose des palettes selon goûts)
- [Tints.dev](https://tints.dev) (génère les nuances Tailwind à partir d'une couleur)

### Typographie

4 typos pré-sélectionnées au choix (les miennes, déjà testées en prod) :

- **Inter** (sans-serif moderne, lisible, polyvalente, Google Fonts gratuit)
- **Nexa** (sans-serif géométrique, plus marquée, idéale pour titres impact)
- **PP-Formula** (Pangram Pangram, sobre et tendance, gratuite version basique)
- **Suisse-Intl** (Swiss International, premium, parfaite pour image haut de gamme)

Repo perso : [github.com/LeoVrfb/fontes-artefacts](https://github.com/LeoVrfb/fontes-artefacts)

Le client choisit une typo dans cette liste. Pas de typo sur mesure en Essentiel. Argument vente Standard : "vous voulez une autre typo ? Standard, choix libre dans Google Fonts ou Fontshare".

### Bonus (optionnel, gratuit)

Visuel d'ambiance généré en 5 min via [V0 by Vercel](https://v0.app) ou ChatGPT (image). Juste pour donner un aperçu, pas un livrable contractuel. Sert à rassurer le client visuel pour qui c'est dur d'imaginer sans rien voir.

### Livraison

- Site déployé sur Vercel
- 2h de retouches incluses (ajustements textes, petits trucs visuels)
- Au-delà : 60€/h sur devis

---

## 3. Process Standard (990€, 10 jours ouvrés)

### Étapes (les 4 étapes Claude)

1. **Brief visuel** (1h en visio + remplissage app brief perso, ou async)
2. **Moodboard** (1h de mon temps, validée par le client en 48h max)
3. **Premier jet de la home** (codé, déployé en Vercel preview, validé en 48h max)
4. **Code des autres pages + livraison + 5h retouches**

### Brief Standard (12 questions)

Tout le brief Essentiel + en plus :

- Univers (sobre, luxueux, fun, minimaliste, bold, corporate, brutaliste...)
- 3 sites web que vous aimez (concurrents, inspirations) + pourquoi
- 3 sites web que vous détestez + pourquoi (souvent plus parlant que les goûts positifs)
- Palette de couleurs : dominante + secondaire + accent (ou je propose 2-3 palettes générées)
- Typographie : libre choix dans Google Fonts ou Fontshare (avec ma recommandation)
- Éléments visuels : photos pro / illustrations / 3D / minimaliste
- Cible précise (B2B, B2C, âge, niveau social...)

### Moodboard

Outil : Figma (1h max de mon temps).

Contenu type :
- 3 à 5 références visuelles tirées du brief
- La palette définitive avec codes hex
- Ta typo choisie + secondaire si tu as
- 1 ou 2 exemples de composants UI (bouton, hero, carte)

Lien Figma envoyé au client + screenshot dans le mail.

Validation : "Voici la direction visuelle que je vais suivre. Validez par retour de mail dans les 48h, ou ce sera réputé acquis. Une fois validé, on ne revient plus sur ces choix (couleurs, typo, ambiance)."

### Premier jet home

- Code la home, déploie en Vercel preview URL
- Envoie au client : "voici le premier jet, c'est notre round de design global"
- 1 round de retours sur le design global
- Validation par mail dans les 48h
- Le design est scellé. Les autres pages reprennent la même DA.

### Outils Standard

- **Wireframe rapide** : V0 by Vercel ou ChatGPT image (pour discuter une idée en 5 min)
- **Refs visuelles** : [Awwwards](https://www.awwwards.com), [Land-book](https://land-book.com), [Httpster](https://httpster.net), [SaaSPages](https://saaspages.xyz), [Mobbin](https://mobbin.com)
- **Photos** : [Unsplash](https://unsplash.com), [Pexels](https://www.pexels.com)
- **Icônes** : [Lucide](https://lucide.dev) (déjà dans la stack), [Heroicons](https://heroicons.com), [Phosphor](https://phosphoricons.com)
- **Preview live** : Vercel preview URL (natif, gratuit, déjà branché)

---

## 4. Process Premium (1 890€+, 3 semaines)

### Étapes

Identique à Standard + options :

1. **Brief poussé** (1h30 visio, brief de 20 questions)
2. **Moodboard détaillée** (2h de mon temps, +1 itération possible)
3. **Mini-maquettes Figma optionnelles** sur sections clés (hero, structure d'une page complexe)
4. **Premier jet home** (Vercel preview, validé)
5. **Code complet + 10h retouches**

### Option binôme designer

Pour les projets les plus ambitieux, je sous-traite la DA à une designer freelance partenaire :
- Coût pour moi : 300 à 500€ (intégré dans la marge Premium)
- Bénéfice : design pro + code pro + argument commercial fort
- À activer dès qu'un Premium se présente avec un budget design qui le justifie

Profil cherché :
- Designer freelance UI / direction artistique
- Capable de rendre une DA Figma en 3 à 5 jours
- Tarif 300 à 500€ par projet (négocier au volume si récurrent)
- À identifier : ai déjà des contacts en tête, à concrétiser

### Brief Premium (20 questions)

Tout le brief Standard + en plus :

- Histoire de l'entreprise / du projet (storytelling)
- Concurrents directs et différenciation
- Émotions à provoquer chez le visiteur (3 émotions + 3 actions souhaitées)
- Animations : statique / discret / immersif / interactif
- Densité d'information souhaitée (épuré vs riche)
- Cohérence avec une charte existante ? (logo, print, réseaux sociaux)
- Évolutions prévues du site dans les 12 mois ?

---

## 5. Délai de validation client (règle des 48h)

**La règle d'or qui sauve les projets.**

Sur 5 jours d'Essentiel ou 10 jours de Standard, je ne peux pas attendre 1 semaine que le client valide une moodboard. Donc clause systématique dans le devis :

> Sans retour de votre part sous 48h ouvrées après envoi d'un livrable à valider (moodboard, premier jet, retouches), la validation est réputée acquise et le projet passe à l'étape suivante. Tout retard côté client décale d'autant la date de livraison finale.

### Cas particulier Essentiel

Tout doit être validé **dans la journée ou sous 24h**. C'est rapide par nature : 1h de visio brief + palette + typo, on lance le code dans la foulée. Si le client a besoin de réfléchir 3 jours sur sa palette, il prend Standard.

### Cas particulier Premium

48h reste la règle, mais sur la moodboard détaillée, on peut accorder 5 jours ouvrés (la prestation est plus engageante, les enjeux plus forts).

---

## 6. Paiement (50/50)

Modalités :

- **50% à la signature du devis** (acompte non remboursable)
- **50% à la livraison** (avant la mise en ligne définitive)

Wording type dans le devis :

> Le paiement s'effectue en 2 fois : 50% d'acompte non remboursable à la signature du présent devis (déclenche le démarrage du projet), 50% à la livraison du site, à régler avant la mise en ligne officielle sur votre nom de domaine.

Argument client : "vous payez le solde quand vous êtes 100% satisfait, juste avant que je rende le site live".

### Moyens de paiement

- Virement bancaire (RIB sur le devis)
- Plus tard quand volume : Stripe Payment Link (commission ~1.5%, pratique pour CB)

---

## 7. Retouches incluses vs refonte

**Le piège classique : confondre les deux.**

### Inclus dans les heures de retouches

- Modification de textes (titre, paragraphe, CTA)
- Remplacement d'une image
- Ajustement d'une couleur sur **un bloc spécifique** (ex: ce bouton en bleu au lieu de vert)
- Retouches de spacing (ce hero plus tassé, ce padding plus large)
- Ajout d'une variante mineure (un onglet de plus dans une section existante)
- Petits ajustements responsive (ce texte trop petit en mobile)
- Fix de coquilles, typos, fautes

### Hors périmètre (refonte sur devis)

- Changer la palette de couleurs globale (validée en moodboard)
- Changer la typographie principale (validée en moodboard)
- Refondre la structure d'une page entière
- Refaire le hero parce que le client a changé d'avis
- Ajouter une nouvelle page complète
- Changer la mise en page du site
- Toute modification post-livraison après plus de 30 jours

### Wording type dans le devis

> Les heures de retouches couvrent les ajustements de contenu, les modifications mineures de style, le fix de coquilles et les retouches responsive. Elles ne couvrent pas la refonte d'éléments validés en amont (palette, typographie, structure de page). Toute demande hors périmètre fait l'objet d'un devis additionnel au tarif de 60€/h.

---

## 8. Wording contrat / devis (clauses prêtes à copier-coller)

### Clause périmètre

> Le présent devis couvre exclusivement les prestations listées ci-dessus dans la formule [Essentiel/Standard/Premium]. Toute prestation hors périmètre fait l'objet d'un avenant ou d'un nouveau devis.

### Clause délais

> Le délai de livraison est de [5 jours ouvrés / 10 jours ouvrés / 3 semaines] à compter de la réception complète des éléments fournis par le client (textes, photos, logo, accès domaine si applicable). Tout retard dans la fourniture des éléments ou dans les validations décale d'autant la date de livraison.

### Clause validation 48h

> Les livrables intermédiaires (moodboard, premier jet, retouches) doivent être validés par retour de mail dans un délai de 48h ouvrées suivant leur envoi. Sans retour passé ce délai, la validation est réputée acquise et le projet passe à l'étape suivante.

### Clause paiement 50/50

> Le règlement s'effectue en deux fois : 50% à la signature du présent devis (acompte non remboursable, déclenche le démarrage du projet), 50% à la livraison du site avant mise en ligne définitive. Paiement par virement bancaire sous 7 jours.

### Clause retouches

> [2h / 5h / 10h] de retouches sont incluses pendant 30 jours suivant la livraison. Au-delà de ces heures ou de ce délai, toute intervention est facturée 60€/h sur devis préalable.

### Clause propriété intellectuelle

> À réception du règlement intégral, le client devient propriétaire à 100% du code source, des contenus, du design et des fichiers livrés. Aucune dépendance à un service externe payant n'est imposée (hors hébergement et nom de domaine, à la charge du client).

### Mention micro-entreprise (franchise en base TVA)

> TVA non applicable, art. 293 B du CGI.

À retirer dès que le seuil de franchise (36 800€ HT en prestation de services en 2024-2025) est dépassé sur 2 ans consécutifs.

### Clause hébergement / domaine

> L'hébergement (Vercel, gratuit en plan Hobby pour les sites présentés) et le nom de domaine (10 à 15€/an chez OVH, Namecheap ou autre) sont à la charge exclusive du client. Je peux accompagner le client dans l'achat de son nom de domaine en son nom propre.

---

## 9. App brief perso (specs V1)

### Concept

Une mini-app sur le site portfolio (sur une branche Vercel non indexée) qui sert à :
- Faire remplir le brief client (en visio en partage d'écran, ou async par lien)
- Générer un récap envoyé par mail (devis, palette, typo, refs, ambiance)
- Servir de preuve écrite du brief

Avantages vs Tally.so :
- Tout dans mon écosystème, cohérent avec ma marque
- Pas de freemium, pas d'export à gérer
- Style identique au site
- Champs adaptés exactement à mes formules

### Architecture proposée

- Branche Git dédiée : `brief-app` (ou un dossier `(brief)/` non indexé)
- Déployée sur une URL Vercel (slug obscur ou auth basic) sans nom de domaine
- Routes :
  - `/brief` : page d'entrée, sélection formule
  - `/brief/[formule]` : formulaire multi-step adapté à la formule
- Stack : RHF + Zod (déjà dans le projet), Resend pour l'envoi mail
- Bonus V2 : sauvegarde Convex pour historique des briefs et suivi par projet

### Contenu du formulaire (multi-step)

**Étape 1 : Infos client**
- Nom, prénom, email, téléphone
- Nom de l'entreprise / activité
- Site existant ? (URL si oui)

**Étape 2 : Projet**
- Formule choisie (Essentiel / Standard / Premium)
- Options du configurateur (déjà branché sur le site, à intégrer ici)
- Délai souhaité

**Étape 3 : Brief visuel**
- Ambiance en 3 mots (champ libre)
- Sites aimés (URLs + pourquoi, 2 ou 3 selon formule)
- Sites détestés (URLs + pourquoi, 1 ou 3 selon formule)
- Couleur dominante préférée
- Typographie souhaitée (sélecteur dans la liste pré-sélectionnée pour Essentiel, libre pour Standard/Premium)

**Étape 4 : Cible et objectifs**
- À qui s'adresse le site ?
- Quel est l'objectif principal ? (vendre, présenter, capter des leads, prendre rdv...)
- 3 émotions à provoquer (Premium uniquement)

**Étape 5 : Récap + envoi**
- Récap visuel de toutes les réponses
- Devis estimé (calculé depuis le configurateur)
- Bouton "envoyer" : génère un mail à moi + au client
- Mail contient : récap brief, devis, lien moodboard quand prête

### Roadmap

- **V1** (à coder quand premier projet Standard/Premium se présente) : formulaire + envoi mail
- **V2** : sauvegarde Convex, espace client par projet, suivi des étapes en checkbox
- **V3** : génération PDF récap signable directement (intégration Yousign)

---

## 10. Outils par catégorie

### Couleurs
- [coolors.co](https://coolors.co) : générateur principal
- [Realtime Colors](https://www.realtimecolors.com) : preview palette en contexte UI
- [Khroma](http://khroma.co) : IA, propose selon goûts
- [Tints.dev](https://tints.dev) : génère les nuances Tailwind d'une couleur

### Typographies
- 4 typos pré-sélectionnées (Inter, Nexa, PP-Formula, Suisse-Intl)
- [Google Fonts](https://fonts.google.com) (Standard / Premium)
- [Fontshare](https://www.fontshare.com) (Standard / Premium, gratuit qualité agence)
- [Use & Modify](https://usemodify.com) (Premium, polices open-source plus pointues)
- [Pangram Pangram](https://pangrampangram.com) (Premium, polices premium gratuites pour usage personnel)

### Refs visuelles
- [Awwwards](https://www.awwwards.com) : sites primés, niveau ambitieux
- [Land-book](https://land-book.com) : landing pages classées par catégorie
- [Httpster](https://httpster.net) : sites bien designés, très varié
- [SaaSPages](https://saaspages.xyz) : refs SaaS / produit
- [Mobbin](https://mobbin.com) : refs mobile (apps)

### Wireframe rapide / preview ambiance
- [V0 by Vercel](https://v0.app) : génère une page UI en quelques minutes (gratuit avec limites)
- ChatGPT (image) : génère un visuel d'ambiance type maquette
- [Galileo AI](https://www.usegalileo.ai) : génère des UI complètes (payant)

### Photos / assets
- [Unsplash](https://unsplash.com), [Pexels](https://www.pexels.com) : photos gratuites haute qualité
- [Lucide](https://lucide.dev) : icônes (déjà dans la stack)
- [Heroicons](https://heroicons.com), [Phosphor](https://phosphoricons.com) : alternatives icônes

### Preview / déploiement
- Vercel preview URL : natif, gratuit, déjà branché
- V0 : pour preview ambiance avant de coder pour de vrai

### Signature contrat
- [Yousign](https://yousign.com) : gratuit jusqu'à 5 docs/mois, suffit pour démarrer
- DocuSign free : alternative

### Paiement
- Virement bancaire : pour démarrer
- Stripe Payment Link plus tard quand volume

---

## 11. Checklist par projet

À dupliquer pour chaque nouveau client. Plus tard, à intégrer dans l'app brief perso (V2 avec Convex).

### Pré-projet

- [ ] Appel découverte 15 min effectué
- [ ] Devis envoyé (avec clauses délais, paiement, retouches)
- [ ] Devis signé via Yousign (ou retour mail "je valide ce devis")
- [ ] Acompte 50% reçu

### Brief

- [ ] Brief rempli dans l'app perso (ou fichier de notes si app pas encore là)
- [ ] Palette définie via coolors.co (codes hex archivés)
- [ ] Typo choisie

### Direction visuelle (Standard / Premium)

- [ ] Moodboard envoyée
- [ ] Validation client reçue par mail (ou 48h écoulées = tacite)

### Premier jet (Standard / Premium)

- [ ] Home codée et déployée en Vercel preview
- [ ] Lien envoyé au client avec délai 48h
- [ ] Retours intégrés (1 round)
- [ ] Validation finale du design

### Code

- [ ] Toutes les pages codées
- [ ] Site responsive testé
- [ ] SEO de base en place (meta, OG, sitemap, robots)
- [ ] Performances Lighthouse > 90

### Livraison

- [ ] Site livré en preview
- [ ] Solde 50% reçu
- [ ] Site mis en ligne sur le domaine du client
- [ ] DNS configuré
- [ ] Compte d'analytics transmis si demandé

### Post-livraison

- [ ] Heures de retouches consommées tracées
- [ ] À J+30 : fin de la période de retouches incluses, info client si besoin

---

## 12. À faire / à creuser

- Identifier 1 ou 2 designers freelance partenaires concrets (avec contact)
- Choisir un outil de signature de devis (Yousign très probablement)
- Créer un template de devis PDF maison (ou tableur Excel) avec toutes les clauses
- V1 de l'app brief perso à coder dès qu'un projet Standard/Premium se présente
- Tester ce process sur 2-3 projets, ajuster cette doc en fonction des retours terrain
- Intégrer une section "Mon process" sur les pages /services/standard et /services/premium quand ce doc est stabilisé (ça devient un argument commercial fort)
