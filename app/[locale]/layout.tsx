import type { Metadata } from "next";
import { Space_Grotesk, DM_Mono, Bebas_Neue, DM_Serif_Display } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { CookieConsentBanner } from "@/components/analytics/cookie-consent";
import { GoogleAnalyticsWrapper } from "@/components/analytics/google-analytics";
import { MetaPixelWrapper } from "@/components/analytics/meta-pixel";
import { routing, type Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  personSchema,
  professionalServiceSchema,
  websiteSchema,
} from "@/lib/seo/json-ld";
import { JsonLd } from "@/components/seo/json-ld";

// Configuration fonts : on précharge UNIQUEMENT Space Grotesk (utilisée par le
// H1 du Hero via H1Typewriter → critique pour le LCP de la home). Les 3 autres
// fonts sont chargées sans preload (display:swap) car utilisées below-the-fold.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const dmMono = DM_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  preload: false,
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-serif-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

// Keywords prioritaires sélectionnés en Phase 0 (cf. REX) :
// - FR : "Développeur Next.js freelance Paris" (k5)
// - EN : "Next.js freelance developer Paris" (k4)
// + queue de keywords longue traîne pour couvrir les requêtes commerciales.
const KEYWORDS_MAP: Record<Locale, string[]> = {
  fr: [
    "développeur Next.js freelance",
    "développeur React Paris",
    "création site web sur mesure",
    "freelance Next.js Paris",
    "site Next.js professionnel",
    "site vitrine sur mesure",
    "agence digitale freelance",
  ],
  en: [
    "Next.js freelance developer",
    "React developer Paris",
    "custom website development",
    "freelance Next.js Paris",
    "professional Next.js website",
    "custom web design",
    "freelance digital agency",
  ],
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) return {};
  const locale = localeParam as Locale;

  const t = await getTranslations({ locale, namespace: "metadata.default" });

  // Métadonnées de la home + valeurs par défaut héritées (titleTemplate,
  // applicationName, robots) qui s'appliquent à toutes les pages enfants.
  // Note : les pages enfants doivent quand même appeler `buildPageMetadata`
  // pour leur propre `alternates`, `openGraph` et `twitter` — Next.js
  // n'effectue pas de deep merge sur ces champs.
  return {
    ...buildPageMetadata({
      title: t("title"),
      description: t("description"),
      pathname: "/",
      locale,
      keywords: KEYWORDS_MAP[locale],
    }),
    title: {
      default: t("title"),
      template: t("titleTemplate"),
    },
    applicationName: "Léo Hengebaert",
    authors: [{ name: "Léo Hengebaert", url: "https://leohengebaert.fr" }],
    creator: "Léo Hengebaert",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    // Vérifications de propriété pour Google Search Console et Bing Webmaster
    // Tools. Les valeurs sont injectées en var d'env Vercel pour ne pas exposer
    // les codes dans le repo. Si une env var est absente, le champ est omis
    // (Next.js gère les undefined). Une fois la propriété GSC vérifiée via
    // DNS TXT, ce meta tag devient redondant — on peut le laisser ou le retirer.
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
        ? { "msvalidate.01": [process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION] }
        : undefined,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: localeParam } = await params;

  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }
  const locale = localeParam as Locale;

  setRequestLocale(locale);
  const messages = await getMessages();

  // L'IntroOverlay est désormais géré exclusivement dans `app/[locale]/page.tsx`
  // (la home). Il joue à CHAQUE chargement de `/` (pas de cookie de skip),
  // et n'apparaît jamais sur les autres pages (services, projets, etc.).
  // Le check User-Agent bot reste fait côté server dans la home pour servir le
  // SSR complet aux crawlers.

  // Schemas JSON-LD globaux — Person + WebSite + ProfessionalService.
  // Inclus sur toutes les pages (héritage layout). Les schemas page-spécifiques
  // (FAQPage, BreadcrumbList, CreativeWork, Service…) sont ajoutés dans chaque
  // `page.tsx` qui en a besoin. Tous référencent les entités globales via @id.
  const globalSchemas = [
    personSchema(locale),
    websiteSchema(locale),
    professionalServiceSchema(locale),
  ];

  return (
    <html
      lang={locale}
      className={`${spaceGrotesk.variable} ${dmMono.variable} ${bebasNeue.variable} ${dmSerifDisplay.variable} dark`}
    >
      <head>
        {/* Vieille balise pré-HTML5 que Bing inspecte explicitement (warning
            "Meta Language tag missing" sans elle). L'attribut html lang=...
            au-dessus suffit pour Google + crawlers modernes, mais Bing
            audite cette balise spécifique côté URL Inspection. */}
        <meta httpEquiv="content-language" content={locale} />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <JsonLd data={globalSchemas} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster richColors position="bottom-right" />
          {/* Trackers + banner consent. Les wrappers vérifient la var d'env
              correspondante : si NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_META_PIXEL_ID
              est absente, ils retournent null et le script n'est pas injecté.
              Donc safe à déployer même avant que les comptes GA4 / Meta Pixel
              soient créés. Ils respectent aussi le cookie `cookie_consent`. */}
          <CookieConsentBanner />
          <GoogleAnalyticsWrapper />
          <MetaPixelWrapper />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
