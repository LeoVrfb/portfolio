import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  // Le français reste à la racine (/, /projets), l'anglais est préfixé (/en, /en/projets)
  localePrefix: "as-needed",
  // Détection désactivée ici : on la fait nous-même dans `proxy.ts` avec une
  // règle "tout sauf FR → EN" (plus stricte que le matching par défaut de
  // next-intl, qui retombe sur defaultLocale=fr quand aucune locale ne matche).
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
