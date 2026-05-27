import type { Metadata } from "next";
import "./globals.css";

// Root layout minimal : la vraie configuration (fonts, html lang, providers,
// nav, footer) est dans `app/[locale]/layout.tsx`. Next.js exige tout de même
// un layout racine qui retourne <html> et <body>, donc on en met un neutre
// qui passera la main au layout localisé.

export const metadata: Metadata = {
  metadataBase: new URL("https://leohengebaert.fr"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
