---
title: Chronomètre Design
publishDate: 2019-10-02 00:00:00
img: /assets/imgChrono/img1.png
img_alt: Chronomètre design crée avec React de couleur violet et blanc.
description: |
  Chronomètre en React - Gestion du Temps et des Sessions
tags:
  - Time Control
  - Hooks
  - dev
---

> Chronomètre en React - Gestion du Temps et des Sessions

**Description :**
Le projet du chronomètre en React est une réalisation impressionnante qui démontre l'utilisation efficace de React pour créer une application de gestion du temps. Ce chronomètre permet aux utilisateurs de configurer des durées de travail et de pause, puis de suivre le temps écoulé avec une interface interactive.

**Fonctionnalités Clés :**

- **Configuration de la Session :** Les utilisateurs peuvent régler la durée de leur session de travail ainsi que la durée de leur pause (break) à l'aide de boutons intuitifs. Lagestion des pauses est notamment mise en œuvre grâce à des calculs mathématiques intelligents et l'utilisation de `Math.trunc` pour afficher le temps restant.
- **Visualisation du Temps :** Une grande horloge numérique affiche le temps restant pour la session de travail ou la pause en cours.
- **Démarrage/Pause/Réinitialisation :** Le chronomètre peut être démarré, mis en pause et réinitialisé à tout moment, permettant ainsi un contrôle total sur la gestion du temps.
- **Effet de Lumière et d'Ombre :** Lorsque le chronomètre est en cours, il bénéficie d'un effet de lumière et d'ombre, créant une expérience visuelle attrayante.Cet effet est réalisé en utilisant des classes CSS et des animations (animation: glow 1s infinite alternate) et via les @keyframes, qui donnent l'impression de rythmé le comptage des secondes au fur et à mesure que le temps s'écoule ! (pas besoin de lib pour ça...)

**Utilisation de `useReducer` :** L'un des aspects les plus intéressants de ce projet est l'utilisation de `useReducer`. Le reducer gère la logique de comptage du temps pour la session de travail et les pauses. Il prend en charge les actions, telles que "TICK", pour mettre à jour les durées.

**Découvrez ici :** [le Chronomètre](https://leovrfb.github.io/chrono-react/)

Le lien ci-dessus vous donne accès à une version interactive du chronomètre où vous pouvez expérimenter la configuration de la session, démarrer, mettre en pause et réinitialiser le chronomètre. Le projet complet est disponible en accès public sur Github, ce qui vous permet d'examiner le code source pour mieux comprendre son fonctionnement.

---
