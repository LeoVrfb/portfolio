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
import { getAlternates } from "@/lib/seo/alternates";
import { localizedUrl } from "@/lib/seo/site";
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

const OG_LOCALE_MAP: Record<Locale, string> = {
  fr: "fr_FR",
  en: "en_US",
};

const KEYWORDS_MAP: Record<Locale, string[]> = {
  fr: [
    "développeur front-end",
    "freelance",
    "Next.js",
    "React",
    "création de site web",
    "site vitrine",
    "site sur mesure",
  ],
  en: [
    "front-end developer",
    "freelance",
    "Next.js",
    "React",
    "website creation",
    "custom website",
    "web design",
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

  // Alternates de la home (page racine `[locale]/page.tsx`). Les pages enfants
  // doivent définir leur propre `generateMetadata` qui appelle `getAlternates`
  // avec le pathname courant — sans ça, Next.js fait un override complet du
  // champ `alternates` (pas de deep merge), donc on doit toujours le redéfinir
  // par page pour avoir un canonical/hreflang correct.
  const homeUrl = localizedUrl("/", locale);

  return {
    title: {
      default: t("title"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    applicationName: "Léo Hengebaert",
    authors: [{ name: "Léo Hengebaert", url: "https://leohengebaert.fr" }],
    creator: "Léo Hengebaert",
    keywords: KEYWORDS_MAP[locale],
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: homeUrl,
      siteName: "Léo Hengebaert",
      locale: OG_LOCALE_MAP[locale],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
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
    alternates: getAlternates("/", locale),
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
