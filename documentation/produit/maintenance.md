# Maintenance

L'offre de maintenance mensuelle. Volontairement simple : un seul prix, un seul périmètre clair, optionnel à la livraison.

> Doublon dans `portfolio/documentation/produit/maintenance.md` pour le projet web.

---

## Offre standard — 50€/mois

**Une seule offre, toutes formules confondues.**

### Ce qui est inclus

- **1 heure de modifs incluse par mois** (textes, photos, ajustements simples)
- **Mises à jour techniques** : Next.js, Tailwind, dépendances (sans casser la compatibilité)
- **Monitoring uptime** : alerte automatique si le site est inaccessible
- **Backup mensuel** du code et de la configuration Vercel
- **Réponse sous 48h** par email (jours ouvrés)

### Au-delà d'1h de modifs

- Tarif horaire : **60€/h**
- Devis envoyé avant chaque intervention
- Validation client requise avant de démarrer
- Facture mensuelle reprenant les heures consommées

### Engagement

- **Sans engagement** : résiliable d'un mois à l'autre par email
- **Pas de période minimum** : le client peut souscrire / arrêter / re-souscrire selon ses besoins
- **Première facture** : émise au début du mois suivant la mise en ligne

### Quand le proposer

- **Systématiquement à la livraison** : c'est le moment où le client est le plus réceptif
- Présenter comme une assurance tranquillité, pas comme un coût supplémentaire
- Argument : *« Vous avez l'esprit tranquille toute l'année et 12 heures de petites modifs réparties sur 12 mois, pour le prix d'1h de mes services »*

### Quand ne pas le proposer

- Si le client a pris le **CMS Sanity** (option) → il peut faire ses modifs en autonomie
  - Mais on peut quand même lui proposer pour le côté technique (mises à jour, monitoring)
  - C'est SON choix : on laisse l'option sur la table sans insister

---

## Bonus e-commerce monitoring — +30€/mois (optionnel)

Pour les sites e-commerce uniquement. Total avec maintenance standard = **80€/mois**.

### Ce qui est inclus en plus

- **Vérification hebdomadaire des paiements Stripe** (que tout passe correctement, pas de webhook qui foire)
- **Alerte automatique** si un webhook Stripe échoue
- **Gestion des litiges Stripe** en première ligne (réception des emails, transmission au client avec recommandation de réponse)
- **Mise à jour des produits** si besoin (jusqu'à 3 mises à jour produit par mois)
- **Surveillance des emails Resend** (livraison correcte, pas de bounce)

### Quand le proposer

- Tout client qui a pris l'option e-commerce
- Particulièrement utile pour les e-commerce avec >20 produits ou >5 ventes/mois
- Pour les artistes / créateurs qui ne veulent pas s'occuper de la technique

### À ne pas confondre avec

- La gestion du compte Stripe lui-même (c'est le client qui possède son compte)
- La déclaration de TVA / comptabilité (hors périmètre)
- Le SAV client (c'est le vendeur qui répond à ses propres clients)

---

## Pourquoi 50€/mois flat (et pas plusieurs paliers)

### Le marché dit

- Maintenance site vitrine WordPress : 30-150€/mois (sources : Akolads, Siagneo, Orbitis 2026)
- Maintenance e-commerce WordPress : 250-800€/mois
- Mais ces prix concernent **WordPress**, qui demande une maintenance lourde (plugins à patcher, sécurité, updates constants)

### Ma stack n'est pas WordPress

Un site Next.js sur Vercel n'a quasiment **pas besoin** de maintenance technique :
- Pas de plugins à patcher
- Pas de CMS PHP avec failles de sécurité
- Pas de base de données à administrer (sauf si CMS pris)
- Vercel met à jour l'infrastructure automatiquement

**Conséquence** : facturer 100-150€/mois pour un site vitrine Next.js c'est **abusif** et le client le sentira.

### Donc 50€/mois flat, c'est :

- **Honnête** : le périmètre réel = 1h de modifs + un peu de monitoring + tranquillité d'esprit
- **Accessible** : artisan ou commerçant peut souscrire sans hésiter (moins cher que sa facture d'eau)
- **Récurrent** : 10 clients fidèles = 500€/mois de trésorerie stable
- **Évolutif** : si le client demande plus, on facture les heures en plus

### Pourquoi pas un paliers vitrine / e-commerce / Premium

- **Risque de perdre l'adoption** : si maintenance Premium = 180€/mois, le client va dire « non merci, je vous appellerai au besoin »
- **Complique le pitch** : 4 lignes sur le devis vs 1 ligne claire
- **Le bonus e-commerce est suffisant** comme variation : +30€ pour le monitoring spécifique boutique

---

## Ce que la maintenance ne couvre PAS

- Refonte de design (= nouveau projet)
- Ajout de nouvelles fonctionnalités majeures (= devis spécifique)
- Création de nouvelles pages (= nouveau projet ou option « page supplémentaire » à 60€)
- Migration vers une nouvelle techno (= nouveau projet)
- Formation au CMS (= incluse à l'achat du CMS, refacturable si demande répétée)
- Renouvellement du nom de domaine (= à la charge du client, ~10-15€/an)
- Coût d'un éventuel CMS payant (Sanity, Contentful) si le quota gratuit est dépassé

---

## Communication client

### Phrase de présentation à la livraison

> *« Pour 50€ par mois, vous avez l'esprit tranquille toute l'année, 1h de petites modifs incluse chaque mois, et un suivi technique de votre site. C'est optionnel, sans engagement. Vous pouvez souscrire maintenant ou y revenir plus tard. »*

### Email-type post-livraison

```
Bonjour [client],

Votre site est livré et en ligne. Bravo, c'est un beau projet.

Pour la suite, deux options :

1. Vous souhaitez modifier votre site régulièrement (textes, photos) ?
   → Maintenance mensuelle 50€/mois : 1h de modifs incluse + suivi technique
   → Sans engagement, résiliable à tout moment

2. Vous préférez payer à la demande ?
   → Tarif horaire : 60€/h
   → Devis envoyé avant chaque intervention

Si vous avez pris le CMS, vous pouvez modifier vos textes et photos
en autonomie via [lien Sanity Studio]. La maintenance reste utile
pour le côté technique mais c'est votre choix.

À votre dispo si vous avez la moindre question.

Léo
```

### Quand un client appelle pour une « petite modif » sans maintenance

- Toujours répondre cordialement
- Estimer le temps nécessaire (ex : *« Je peux faire ça en 30 min »*)
- Envoyer un devis : 60€/h, donc 30 min = 30€
- Ne JAMAIS dire *« c'est rapide, je vous le fais offert »* (engrenage)
- Proposer la maintenance si le besoin se répète : *« Si vous avez régulièrement des petites modifs, la maintenance à 50€/mois est plus rentable »*
