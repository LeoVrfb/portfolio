import type { Metadata } from "next";
import { headers } from "next/headers";
import { Space_Grotesk, DM_Mono, Bebas_Neue, DM_Serif_Display } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { IntroOverlay } from "@/components/sections/intro-overlay";
import { routing, type Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { isBotUserAgent } from "@/lib/seo/is-bot";
import {
  personSchema,
  professionalServiceSchema,
  websiteSchema,
} from "@/lib/seo/json-ld";
import { JsonLd } from "@/components/seo/json-ld";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-serif-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
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

  // Détection bot côté serveur : on évite de rendre l'intro overlay (animation
  // ~4s qui bloque le LCP perçu) pour les crawlers Google/Bing/ChatGPT/Claude.
  // Le check `prefers-reduced-motion` est fait côté client dans IntroOverlay.
  const requestHeaders = await headers();
  const userAgent = requestHeaders.get("user-agent");
  const skipIntro = isBotUserAgent(userAgent);

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
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <JsonLd data={globalSchemas} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          {skipIntro ? null : <IntroOverlay />}
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster richColors position="bottom-right" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
