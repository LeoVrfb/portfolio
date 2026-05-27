import type { Metadata } from "next";
import { Space_Grotesk, DM_Mono, Bebas_Neue, DM_Serif_Display } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { IntroOverlay } from "@/components/sections/intro-overlay";
import { routing, type Locale } from "@/i18n/routing";

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

  const url =
    locale === routing.defaultLocale
      ? "https://leohengebaert.fr"
      : `https://leohengebaert.fr/${locale}`;

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
      url,
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
    alternates: {
      canonical: url,
      languages: {
        fr: "https://leohengebaert.fr",
        en: "https://leohengebaert.fr/en",
        "x-default": "https://leohengebaert.fr",
      },
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

  return (
    <html
      lang={locale}
      className={`${spaceGrotesk.variable} ${dmMono.variable} ${bebasNeue.variable} ${dmSerifDisplay.variable} dark`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <IntroOverlay />
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster richColors position="bottom-right" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
