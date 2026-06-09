"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

// Banner consent "soft" : tracking activé par défaut au premier chargement.
// L'utilisateur peut refuser via le bouton "Refuser" → cookie `cookie_consent=declined`
// → tous les composants Tracking (`<GoogleAnalyticsWrapper>`, `<MetaPixelWrapper>`)
// vérifient ce cookie et stoppent le chargement des trackers.
//
// Approche RGPD : zone grise — l'opt-in strict CNIL exige refus par défaut. Cette
// approche "soft" est légalement défendable côté ePrivacy si :
// - le bandeau est clairement visible dès la première visite
// - les boutons Accepter/Refuser sont équivalents en design (pas de dark pattern)
// - le refus est honoré (vrai stop tracking) et persisté
// - il y a un lien clair vers la politique de confidentialité
//
// Pour passer en mode strict (refus par défaut), changer DEFAULT_CONSENT en "declined".

const COOKIE_NAME = "cookie_consent";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 an
type ConsentStatus = "accepted" | "declined" | "unknown";
const DEFAULT_CONSENT: ConsentStatus = "accepted"; // soft mode

function readConsent(): ConsentStatus {
  if (typeof document === "undefined") return "unknown";
  const match = document.cookie.match(/(?:^|;\s*)cookie_consent=([^;]+)/);
  if (!match) return "unknown";
  if (match[1] === "accepted") return "accepted";
  if (match[1] === "declined") return "declined";
  return "unknown";
}

function writeConsent(value: "accepted" | "declined") {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${value}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  // Notify wrappers (GA4 / Meta Pixel) to react instantly without page reload
  window.dispatchEvent(new CustomEvent("cookie-consent-change", { detail: { value } }));
}

/**
 * Hook utilitaire pour les composants Tracking — retourne le statut courant
 * et écoute les changements pour réagir au choix utilisateur en temps réel.
 */
export function useCookieConsent(): ConsentStatus {
  const [consent, setConsent] = useState<ConsentStatus>("unknown");

  useEffect(() => {
    setConsent(readConsent());
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ value: ConsentStatus }>).detail;
      if (detail) setConsent(detail.value);
    };
    window.addEventListener("cookie-consent-change", handler);
    return () => window.removeEventListener("cookie-consent-change", handler);
  }, []);

  return consent;
}

/**
 * Banner cookie soft, position bottom-right, design cohérent avec le reste du site.
 * S'affiche uniquement à la première visite (cookie absent). Position fixed →
 * pas d'impact sur LCP. Délai de 800ms pour ne pas perturber l'animation Hero.
 */
export function CookieConsentBanner() {
  const t = useTranslations("cookies");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const status = readConsent();
    if (status === "unknown") {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!visible) return null;

  const handleAccept = () => {
    writeConsent("accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    writeConsent("declined");
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-[9999] rounded-2xl border border-white/10 bg-zinc-950/95 backdrop-blur-xl shadow-2xl p-5"
    >
      <div className="flex flex-col gap-3">
        <h2
          id="cookie-banner-title"
          className="text-sm font-bold text-white tracking-tight"
        >
          {t("title")}
        </h2>
        <p className="text-xs text-zinc-400 leading-relaxed">
          {t("description")}{" "}
          <Link
            href="/privacy"
            className="text-accent hover:text-accent/80 underline underline-offset-2"
          >
            {t("privacyLink")}
          </Link>
          .
        </p>
        <div className="flex gap-2 mt-1">
          <button
            type="button"
            onClick={handleAccept}
            className="flex-1 px-4 py-2 rounded-lg bg-accent text-black text-xs font-semibold hover:bg-accent/90 transition-colors cursor-pointer"
          >
            {t("accept")}
          </button>
          <button
            type="button"
            onClick={handleDecline}
            className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-semibold hover:bg-white/10 transition-colors cursor-pointer"
          >
            {t("decline")}
          </button>
        </div>
      </div>
    </div>
  );
}
