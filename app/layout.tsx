import type { Metadata } from "next";
import { Space_Grotesk, DM_Mono, Bebas_Neue } from "next/font/google";
import { Toaster } from "sonner";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { IntroOverlay } from "@/components/sections/intro-overlay";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://leohengebaert.fr"),
  title: {
    default: "Léo Hengebaert — Développeur Front-End",
    template: "%s — Léo Hengebaert",
  },
  description:
    "Développeur front-end chez Artefact, spécialisé React & Next.js. Je crée aussi des sites web sur mesure pour entreprises et particuliers.",
  applicationName: "Léo Hengebaert",
  authors: [{ name: "Léo Hengebaert", url: "https://leohengebaert.fr" }],
  creator: "Léo Hengebaert",
  keywords: [
    "développeur front-end",
    "freelance",
    "Next.js",
    "React",
    "création de site web",
    "site vitrine",
    "site sur mesure",
  ],
  openGraph: {
    title: "Léo Hengebaert — Développeur Front-End",
    description:
      "Développeur front-end chez Artefact. Sites web sur mesure pour entreprises et particuliers, au-delà de ce qu'un outil no-code peut offrir.",
    url: "https://leohengebaert.fr",
    siteName: "Léo Hengebaert",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Léo Hengebaert — Développeur Front-End",
    description:
      "Développeur front-end chez Artefact. Sites web sur mesure pour entreprises et particuliers.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${spaceGrotesk.variable} ${dmMono.variable} ${bebasNeue.variable} dark`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <IntroOverlay />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
