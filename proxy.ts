import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { isBotUserAgent } from "./lib/seo/is-bot";

// Note Next.js 16 : `proxy.ts` remplace `middleware.ts` (même API, mais tourne
// sur Node.js au lieu d'Edge). On garde le nom export `proxy`.

const intlMiddleware = createIntlMiddleware(routing);

// Règle de détection custom pour les **humains** : tout visiteur dont la langue
// préférée n'est PAS le français est redirigé sur /en au premier passage.
// Plus strict que le matching par défaut de next-intl (qui retombe sur
// defaultLocale=fr quand aucune locale ne matche).
//
// /!\ Cette règle est explicitement DÉSACTIVÉE pour les bots (Googlebot,
// Bingbot, etc.). Sinon, comme aucun bot n'envoie d'`Accept-Language`, ils
// étaient TOUS redirigés sur /en/* — y compris quand ils crawlent l'URL FR
// canonique du sitemap. Résultat : Google indexait la version EN du contenu
// sous l'URL FR, créant des conflits massifs hreflang/canonical et des
// snippets en anglais dans les SERP françaises.
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

// Routes système Next.js (file-based metadata, pas des pages à localiser).
// Sans cette exception, /icon et /apple-icon étaient redirigés vers /en/icon
// et Google n'arrivait plus à récupérer le favicon → globe Vercel par défaut.
const SYSTEM_ROUTES = new Set([
  "/icon",
  "/apple-icon",
  "/opengraph-image",
  "/twitter-image",
  "/manifest.webmanifest",
]);

function isSystemRoute(pathname: string): boolean {
  if (SYSTEM_ROUTES.has(pathname)) return true;
  // Variantes Next.js avec query (ex. /icon?b3d6ef3ac328ea99) sont gérées par
  // le matcher (.*\\..* exclut les fichiers, mais ces routes sont sans .ext).
  return false;
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Routes système (favicon, OG image…) : laisser Next.js servir.
  if (isSystemRoute(pathname)) {
    return NextResponse.next();
  }

  // 2. Garde l'ancienne redirection /demo/* → / (FR et EN). La page demo legacy
  // jQuery ne reflète plus l'offre actuelle ; on évite qu'elle soit indexée
  // ou linkée. Couvre aussi les chemins `/fr/demo` historiques.
  if (
    pathname === "/demo" ||
    pathname.startsWith("/demo/") ||
    pathname === "/en/demo" ||
    pathname.startsWith("/en/demo/") ||
    pathname === "/fr/demo" ||
    pathname.startsWith("/fr/demo/")
  ) {
    const targetUrl = new URL("/", request.url);
    if (pathname.startsWith("/en")) {
      targetUrl.pathname = "/en";
    }
    return NextResponse.redirect(targetUrl);
  }

  // 3. Bots (crawlers) : on ne redirige JAMAIS via la détection custom.
  //    Les URLs sans préfixe = FR (default locale, contrat `localePrefix:as-needed`),
  //    les URLs /en/* = EN. Les bots crawlent ce que le sitemap déclare.
  const userAgent = request.headers.get("user-agent");
  const isBot = isBotUserAgent(userAgent);

  // 4. Détection locale custom (humains uniquement) : seulement à la première
  // visite (pas de cookie NEXT_LOCALE) et sur les URLs sans préfixe de locale
  // explicite.
  const localeCookie = request.cookies.get("NEXT_LOCALE")?.value;
  const cookieIsValid =
    localeCookie && (routing.locales as readonly string[]).includes(localeCookie);

  if (!isBot && !cookieIsValid && !hasLocalePrefix(pathname)) {
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
