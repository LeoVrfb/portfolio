# Paiement et conditions commerciales

Les règles fermes pour se faire payer correctement, éviter les pièges, et poser un cadre pro dès la signature.

> Doublon dans `portfolio/documentation/produit/paiement.md` pour le projet web.

---

## Modalités de paiement

### Pour tous les projets : 50% / 50%

- **50% à la signature du devis** (acompte)
- **50% à la livraison** (solde)

### Pourquoi pas 3 fois (40 / 30 / 30)

- Risque d'oppositions / impayés à chaque échéance
- Complexité administrative (3 factures, 3 relances potentielles)
- Tes montants (590 à 3 000€) sont accessibles → pas besoin d'étaler
- Plus simple = moins d'objections du client à la signature

### Pourquoi pas paiement après livraison

- Risque maximal pour toi : tu travailles sans garantie
- Le client engagé à 50% s'investit dans le projet (validation maquette, envoi rapide des éléments)
- Standard de la profession : aucun freelance sérieux ne travaille sans acompte

### Méthode de paiement

- **Virement bancaire** (recommandé : pas de frais, traçable)
- Stripe Payments (option si le client préfère payer par carte, mais frais 1.5% + 0.25€ à ta charge ou refacturés)
- **Pas d'espèces** (problèmes de traçabilité, déclaration)
- **Pas de chèque** (délais d'encaissement, risque de rejet)

### Délai de paiement

- Acompte : **avant le démarrage du projet** (zéro ligne de code avant réception)
- Solde : **dans les 7 jours après livraison** (livraison = site en ligne sur le domaine du client)
- Au-delà de 7 jours : relance automatique
- Au-delà de 15 jours : pénalités de retard légales (10% selon les CGV)

---

## Devis

### Validité

- **Devis valide 30 jours** à compter de l'émission
- Au-delà : nouveau devis (les prix peuvent évoluer)

### Format

- PDF généré (à terme via le configurateur du portfolio)
- En attendant : devis manuel (Notion, Google Docs, ou template PDF)
- Doit contenir :
  - Identification client (nom, raison sociale, SIRET, adresse, email)
  - Identification freelance (nom, SIRET, adresse, statut juridique)
  - Date d'émission + date de validité
  - Détail ligne par ligne (formule + chaque option choisie + prix)
  - Total HT (et TVA si applicable selon ton statut)
  - Modalités de paiement (50/50)
  - Délai de livraison estimé
  - CGV en annexe ou liées par URL

### Signature

- Signature électronique (DocuSign, HelloSign, ou simple email d'acceptation)
- Email d'acceptation : *« Bonjour, je valide le devis du [date] pour un montant de [X]€. Je procède au virement de l'acompte. »*
- Cet email a force de contrat tant que les CGV sont liées au devis

---

## Acompte

### Pourquoi 50% (et pas 30 ou 40)

- **Couvre tes coûts en cas d'abandon client** : si le client ne paie pas le solde et part, les 50% couvrent au moins le démarrage du projet (brief, maquette, début de dev)
- **Engage le client** : un acompte significatif = un projet pris au sérieux
- **Standard du marché** sur les sites < 3 000€

### Quand l'acompte arrive

- **Tu démarres le projet** (création du repo, brief, premiers travaux)
- Tu envoies un accusé de réception du paiement par email
- Tu confirmes le délai de livraison estimé

### Si l'acompte n'arrive pas

- **Tu ne démarres pas le projet**
- Pas de relance avant 7 jours
- Relance polie au bout de 7 jours : *« Bonjour, je n'ai pas encore reçu l'acompte. Voulez-vous procéder ou préférez-vous reporter le projet ? »*
- Au bout de 14 jours : devis annulé, le client devra refaire une demande

---

## Solde

### Quand le solde est dû

- Le solde est dû à la **livraison** = site en ligne sur le domaine du client, fonctionnel
- Pas de rétention sur des « petits ajustements » non couverts par les heures de retouches incluses
- Si le client demande des modifs hors périmètre : devis complémentaire AVANT intervention

### Si le solde tarde

- J+7 : relance polie par email
- J+15 : relance ferme + rappel des pénalités légales
- J+30 : mise en demeure formelle (lettre recommandée)
- J+45 : transmission au recouvrement (si nécessaire)

**Note** : en pratique, sur des projets < 3 000€, le solde tarde rarement plus de 15 jours. Si le client est sérieux, il paie à temps.

### Site mis en ligne avant paiement du solde ?

**Oui.** La livraison = site en ligne. Tu ne peux pas exiger paiement avant livraison sans casser le rapport de confiance.

**Si tu as un mauvais pressentiment** sur le client : tu peux livrer en sous-domaine Vercel (`projet.vercel.app`) et basculer sur le domaine custom uniquement après paiement. À utiliser avec parcimonie.

---

## Ce qu'on ne vend JAMAIS

Liste ferme des red flags. Si un client demande l'un de ces points, on dit non poliment ou on adapte.

### Révisions illimitées

**Pourquoi non** : le client peut te faire 50 retouches, tu travailles à perte.

**Comment dire non** : *« Les retouches sont incluses dans la limite de [2/5/10]h selon votre formule. Au-delà, c'est 60€/h, devisé avant intervention. C'est ce qui me permet de tenir mes prix. »*

### Acompte inférieur à 50%

**Pourquoi non** : risque maximal pour toi.

**Comment dire non** : *« L'acompte est de 50%, c'est mon standard. Cela me permet de m'engager pleinement sur votre projet. »*

### Hébergement / nom de domaine au tien

**Pourquoi non** : tu deviens hébergeur malgré toi, avec les responsabilités juridiques (RGPD, signalement de contenu illicite, etc.).

**Comment dire non** : *« Je vous accompagne pour acheter votre domaine en votre nom. Cela vous appartient, vous gardez le contrôle. »*

### Rédaction illimitée de tout le contenu

**Pourquoi non** : un client qui ne sait pas quoi écrire peut te bloquer 3 mois.

**Comment dire non** : *« La rédaction est incluse à partir d'un brief en visio 1h. Si vous voulez que je rédige des contenus longs (articles de blog, descriptions produits détaillées), c'est sur devis. »*

### « Petites modifs gratuites » après livraison

**Pourquoi non** : engrenage qui transforme le client en pic-assiette permanent.

**Comment dire non** : *« Toute intervention post-livraison est facturée 60€/h, ou incluse dans la maintenance mensuelle à 50€/mois. C'est le seul moyen de garder un cadre pro. »*

### Engagement verbal sans devis signé

**Pourquoi non** : aucune protection juridique, risque de désaccord sur le périmètre.

**Comment dire non** : *« Je préfère que tout soit écrit dans un devis signé. C'est plus clair pour vous comme pour moi, et ça évite les malentendus. »*

### Délais déraisonnables

**Pourquoi non** : tu te grilles pour rien si tu acceptes un site en 48h.

**Comment dire non** : *« Mon délai standard est de [X] jours. Pour un délai plus court, je peux le faire mais il y a une majoration de 30%. Si c'est vraiment urgent, je préfère décliner que de mal travailler. »*

### Travailler sans CGV

**Pourquoi non** : tu n'as aucune protection juridique en cas de litige.

**Comment dire non** : *« Mes CGV sont annexées au devis. Elles protègent les deux parties. C'est obligatoire pour toute prestation pro. »*

---

## TVA et statut juridique

### Si auto-entrepreneur (sous le seuil de TVA)

- Pas de TVA à facturer (jusqu'à 36 800€ HT/an pour la prestation de services en 2026)
- Mention obligatoire sur la facture : *« TVA non applicable, art. 293 B du CGI »*
- Au-delà du seuil : passage automatique à la TVA (20%)

### Si entreprise (EURL, SASU, SARL...)

- TVA à facturer (20% standard)
- Le devis affiche HT et TTC
- Le client professionnel récupère la TVA, donc ça ne le freine pas
- Le client particulier paie TTC, donc afficher TTC en gros pour eux

### Recommandation

À ce stade (début freelance), **auto-entrepreneur** est le plus simple :
- Pas de TVA jusqu'à 36 800€/an
- Comptabilité allégée
- Cotisations sur CA encaissé
- Bascule en EURL/SASU quand le CA dépasse 50-60k€/an

---

## Annulation et remboursement

### Si le client annule avant démarrage

- Acompte remboursé intégralement si annulation < 48h après signature
- Au-delà : 50% de l'acompte conservé pour le travail déjà engagé (brief, premières maquettes)

### Si le client annule en cours de projet

- L'acompte (50%) est définitivement acquis
- Si le projet est avancé > 50% : facturation complémentaire selon avancement réel
- Le code livré jusqu'à ce point est remis au client (Git)

### Si tu annules le projet

- Acompte remboursé intégralement
- Pas d'autre indemnité due
- Le client repart à zéro

---

## CGV — points clés à inclure

### Objet

Description précise de la prestation : création de site web sur mesure en Next.js, livraison sur Vercel, etc.

### Prix et paiement

50/50, virement, délai 7 jours après livraison, pénalités au-delà.

### Délai de livraison

Estimé à compter de la réception de l'acompte ET des éléments client (textes, photos, logo).

### Propriété intellectuelle

- Le code source est livré au client à la fin du projet
- Le client a tous les droits d'usage, modification, hébergement
- Tu conserves le droit de mentionner le projet dans ton portfolio
- Les bibliothèques tierces (Next.js, Tailwind, shadcn) restent sous leurs licences respectives

### Confidentialité

Les informations échangées pendant le projet sont confidentielles (brief, accès admin, données clients).

### Force majeure

Liste classique : maladie grave, sinistre, panne d'infrastructure majeure (Vercel, GitHub).

### Litiges

Tribunal compétent : tribunal de commerce de [ta ville].

### Médiation

Avant tout litige judiciaire, tentative de médiation conventionnelle.

---

## Templates

### Email d'envoi de devis

```
Bonjour [client],

Suite à notre échange, voici votre devis pour [projet].

[PDF en pièce jointe]

Récap rapide :
- Formule : [Essentiel / Standard / Premium]
- Options : [liste]
- Total : [X]€ (HT/TTC)
- Délai : [X] jours ouvrés à compter du démarrage

Modalités : 50% à la signature, 50% à la livraison.
Validité du devis : 30 jours.

Pour valider, vous pouvez répondre simplement à cet email avec :
« Je valide le devis et procède au virement. »

À votre dispo pour toute question.

Léo
```

### Email de confirmation d'acompte reçu

```
Bonjour [client],

J'ai bien reçu l'acompte de [X]€. Le projet démarre dès aujourd'hui.

Prochaines étapes :
1. [Date] : envoi du brief créatif à valider
2. [Date] : maquette à valider
3. [Date] : version dev en preview
4. [Date] : livraison finale

Je reviens vers vous dans [X] jours avec [livrable].

Léo
```

### Email de livraison + facture solde

```
Bonjour [client],

Votre site est en ligne ! https://[domaine].com

Je vous joins :
- La facture de solde (à régler sous 7 jours)
- Les accès admin (Vercel, Sanity si CMS pris)
- La documentation utilisateur

Pour la suite, deux options :
- Maintenance mensuelle 50€/mois (1h de modifs incluse + suivi technique)
- Modifs à la demande : 60€/h (devis avant intervention)

Bravo pour ce projet, content du résultat.

Léo
```
