# Setup emails — Resend

Le formulaire de contact (`/contact`) envoie un email via [Resend](https://resend.com) à chaque soumission. Si Resend n'est pas configuré, le serveur log la soumission dans la console et retourne `success: true` (mode dev sans plantage).

## Variables d'environnement

À déclarer dans `.env.local` (dev) **et** dans Vercel → Project → Settings → Environment Variables (prod + preview) :

| Variable | Valeur |
|---|---|
| `RESEND_API_KEY` | Clé API Resend (https://resend.com/api-keys) |
| `CONTACT_TO_EMAIL` | Mail qui reçoit les demandes — `leohengebaert75@gmail.com` |
| `CONTACT_FROM_EMAIL` | Mail expéditeur — voir ci-dessous |

## Mode test (avant vérification du domaine)

`CONTACT_FROM_EMAIL=onboarding@resend.dev`

Limitations :
- L'email part depuis `onboarding@resend.dev`
- Resend n'autorise l'envoi qu'à l'email du compte Resend (pas vers n'importe qui)
- Donc `CONTACT_TO_EMAIL` doit être l'email avec lequel le compte Resend a été créé

C'est suffisant pour tester en local et vérifier que tout marche.

## Mode production (après vérification du domaine)

`CONTACT_FROM_EMAIL=contact@leohengebaert.fr`

Une fois le domaine `leohengebaert.fr` vérifié dans Resend, les mails partent depuis `contact@leohengebaert.fr` et arrivent dans `leohengebaert75@gmail.com` sans passer par les spams (SPF + DKIM signés).

### Étapes pour vérifier le domaine

1. Dashboard Resend → **Domains** → **Add Domain** → `leohengebaert.fr`
2. Resend génère 2 à 3 records DNS (1 SPF en `TXT`, 2 DKIM en `TXT` ou `CNAME`)
3. Aller chez le registrar du domaine (probablement OVH, Gandi, IONOS, Namecheap, Cloudflare…) → zone DNS → ajouter les records exactement comme indiqués par Resend
4. Retour sur Resend → bouton **Verify** (la propagation DNS peut prendre de 5 min à plusieurs heures)
5. Une fois vérifié, mettre `CONTACT_FROM_EMAIL=contact@leohengebaert.fr` dans `.env.local` et dans Vercel

Notes :
- Pas besoin de créer une vraie boîte mail `contact@` — Resend signe les emails au nom du domaine sans qu'une boîte existe réellement
- Les réponses à l'email reçu (`Reply` dans Gmail) iront directement à l'email du client grâce au header `Reply-To`

## Comment ça marche dans le code

- **API route** : `app/api/contact/route.ts` — appelée par le formulaire en POST
- **Template** : `lib/emails/contact-email.ts` — génère le sujet + HTML + version texte
- **Champs envoyés** : nom, email, téléphone (optionnel), formule, activité (optionnel), message, options sélectionnées, total estimé

Le template inclut un bouton **Répondre à [Prénom]** qui ouvre Gmail avec le bon destinataire pré-rempli.

## Tester en local

1. Récupérer la clé Resend, la coller dans `.env.local`
2. Si compte Resend = `leohengebaert75@gmail.com` → laisser `CONTACT_FROM_EMAIL=onboarding@resend.dev` et `CONTACT_TO_EMAIL=leohengebaert75@gmail.com`
3. Relancer `pnpm dev` (les env vars ne se rechargent pas à chaud)
4. Aller sur `/contact`, remplir, envoyer
5. Vérifier la réception sur Gmail (regarder aussi les spams au cas où)

Si erreur : checker les logs du terminal `pnpm dev`. Les erreurs Resend sont préfixées `[contact] Resend error:`.
