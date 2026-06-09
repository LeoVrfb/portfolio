"use client";

import Script from "next/script";
import { useCookieConsent } from "./cookie-consent";

/**
 * Wrapper Meta Pixel (Facebook Pixel) — chargé uniquement si :
 *  - La var d'env NEXT_PUBLIC_META_PIXEL_ID est définie (Pixel ID numérique 15-16 chars).
 *  - L'utilisateur n'a pas refusé via le banner cookie.
 *
 * Le snippet officiel Meta est inline dans un <Script strategy="afterInteractive">,
 * comme recommandé par Next.js pour les scripts non bloquants. Le PageView initial
 * est track automatiquement. Pour des events custom (lead, conversion) :
 *
 *   if (window.fbq) window.fbq('track', 'Lead');
 *
 * Documentation : https://developers.facebook.com/docs/meta-pixel/get-started
 */
export function MetaPixelWrapper() {
  const consent = useCookieConsent();
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  if (!pixelId) return null;
  if (consent === "declined") return null;

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
      {/* Fallback pour navigateurs sans JS (rare aujourd'hui mais Meta le recommande). */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

declare global {
  interface Window {
    fbq?: (
      action: "track" | "trackCustom",
      eventName: string,
      params?: Record<string, unknown>,
    ) => void;
  }
}
