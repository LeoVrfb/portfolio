import type { Metadata } from "next";
import { Space_Grotesk, DM_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Léo Hengebaert — Développeur Front-End",
  description:
    "Développeur front-end chez Artefact, spécialisé React & Next.js. Je crée aussi des sites web sur mesure pour entreprises et particuliers.",
  openGraph: {
    title: "Léo Hengebaert — Développeur Front-End",
    description:
      "Développeur front-end chez Artefact. Sites web sur mesure pour entreprises et particuliers.",
    locale: "fr_FR",
    type: "website",
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
      className={`${spaceGrotesk.variable} ${dmMono.variable} dark`}
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
