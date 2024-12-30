---
title: TotalEnergies - Argedis
publishDate: 2024-12-23 00:00:00
mediaType: "none"
img: "/assets/videoArgedis/argedis-img-bg.webp"
# description: Découvrez le projet ici
# url: "https://argedis-app.com" # Ajoutez cette ligne si un lien est disponible
tags:
  - Projet Artefact 3000
  - Next.js
  - Contentful
  - GraphQL
  - Tailwind CSS
---

> Création d'une application interactive pour promouvoir les producteurs locaux dans les stations Total

<div class="video-container">

  <video class="video-project" src="/assets/videoArgedis/argedis-record.mov" autoplay  muted loop playsinline webkit-playsinline x5-playsinline />
   
</div>

**Description :**

En tant que développeur front-end chez Artefact 3000, j'ai participé à la conception et au développement d'une application interactive pour Argedis, filiale de TotalEnergies. Cette application était déployée sur des tablettes disponibles dans les stations-service pour promouvoir les producteurs locaux.

Les utilisateurs peuvent consulter une carte interactive montrant la station où ils se trouvent, entourée des producteurs locaux partenaires, avec leur distance par rapport à la station.

<div class="imgs-argedis" >
<img src="/assets/videoArgedis/argedis-img1.png" >
<img src="/assets/videoArgedis/argedis-img2.png"/>
</div>

**Technologies et Outils Utilisés :**

- **Next.js (v 13 : App Router)** pour la gestion asynchrone dans les composants serveurs et des performances optimales.
- **Contentful (Headless CMS)** pour la gestion des contenus : photos, textes, et coordonnées des producteurs.
- **GraphQL** pour des appels API structurés et efficaces.
- **Tailwind CSS** pour un design moderne et responsive.
- **PWA et APK** : initialement une PWA, convertie en APK pour compatibilité de l'OS des tablettes.

**Caractéristiques Clés :**

- **Carte interactive** : Positionnement précis des producteurs locaux sur une map régionale avec des coordonnées `x` et `y`, stockées dans Contentful.
- **Compatibilité offline** : Mise en place d'une application statique et accessible hors ligne.
- **Déploiement optimisé** : Conversion en APK pour installation directe sur les tablettes Android des stations.
- **Expérience utilisateur fluide** : Navigation intuitive entre les fiches fournisseurs et les cartes régionales.

**Challenges et Solutions :**

- **Gestion des positions** : Positionnement pixel-perfect des producteurs sur la carte régionale
- **Maintenance et mise à jour** : L'ajout et la modification fréquente des producteurs dans Contentful étaient répétitifs et fastidieux, représentant un axe d'amélioration.
- **Compatibilité Android** : Passage de la PWA à l'APK pour contourner les limitations d'installation sur les tablettes.

**Résultats :**

L'application a permis de renforcer la visibilité des producteurs locaux et d'améliorer l'expérience des clients dans les stations Total. Ce projet, déployé à l'échelle nationale, a touché des centaines de producteurs et mis en avant les spécialités régionales dans une interface claire et engageante.
