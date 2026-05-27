import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

// Note Next.js 16 : `proxy.ts` remplace `middleware.ts` (même API, mais tourne
// sur Node.js au lieu d'Edge). On garde le nom export `proxy`.

const intlMiddleware = createIntlMiddleware(routing);

// Règle de détection custom : tout visiteur dont la langue préférée n'est PAS
// le français est redirigé sur /en. Plus strict que le matching par défaut de
// next-intl (qui retombe sur defaultLocale=fr quand aucune locale ne matche).
function prefersFrench(acceptLanguage: string | null): boolean {
  if (!acceptLanguage) return false;
  // "fr-FR,fr;q=0.9,en;q=0.8" → on extrait la première langue (la plus prioritaire)
  const primary = acceptLanguage.split(",")[0]?.trim().split(";")[0]?.toLowerCase();
  return primary?.startsWith("fr") ?? false;
}

function hasLocalePrefix(pathname: string): boolean {
  // /fr, /fr/..., /en, /en/...
  return routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
}

export function proxy(request: NextRequest) {
  // Garde l'ancienne redirection /demo/* → /
  if (request.nextUrl.pathname.startsWith("/demo")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Détection locale custom : seulement à la première visite (pas de cookie
  // NEXT_LOCALE) et sur les URLs sans préfixe de locale explicite.
  const pathname = request.nextUrl.pathname;
  const localeCookie = request.cookies.get("NEXT_LOCALE")?.value;
  const cookieIsValid =
    localeCookie && (routing.locales as readonly string[]).includes(localeCookie);

  if (!cookieIsValid && !hasLocalePrefix(pathname)) {
    const acceptLanguage = request.headers.get("accept-language");
    if (!prefersFrench(acceptLanguage)) {
      // Redirige vers /en + même path + même querystring
      const url = request.nextUrl.clone();
      url.pathname = `/en${pathname === "/" ? "" : pathname}`;
      const response = NextResponse.redirect(url);
      response.cookies.set("NEXT_LOCALE", "en", {
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
      });
      return response;
    }
  }

  // next-intl gère ensuite :
  //  - le cookie NEXT_LOCALE existant (priorité au choix utilisateur)
  //  - les headers hreflang pour le SEO
  //  - le rewrite interne quand on est en locale par défaut (FR sans préfixe)
  return intlMiddleware(request);
}

export const config = {
  // Match toutes les pages sauf API, assets Next, fichiers avec extension
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
