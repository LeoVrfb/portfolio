"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { useCookieConsent } from "./cookie-consent";

/**
 * Wrapper Next.js GoogleAnalytics qui ne charge le script qu'après acceptation
 * (ou en mode soft : par défaut). Si l'utilisateur clique "Refuser", le composant
 * retourne null → le script gtag.js n'est pas chargé / est unmount.
 *
 * Active uniquement si la var d'env `NEXT_PUBLIC_GA_ID` est définie (G-XXXXXXXX).
 * Dans ce cas, Next.js va injecter le script gtag.js de manière optimisée
 * (afterInteractive, partytown-ready si on l'active plus tard).
 *
 * Mesure des Core Web Vitals automatique. Pour tracker des events custom :
 *   import { sendGAEvent } from "@next/third-parties/google";
 *   sendGAEvent("event", "buttonClicked", { value: "ctaSubmit" });
 */
export function GoogleAnalyticsWrapper() {
  const consent = useCookieConsent();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  if (!gaId) return null; // pas configuré → on charge rien
  if (consent === "declined") return null; // refus utilisateur honoré

  return <GoogleAnalytics gaId={gaId} />;
}
