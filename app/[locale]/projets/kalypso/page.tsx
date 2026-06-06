/* ──────────────────────────────────────────────────────────────────────────
   SERVER WRAPPER — Domaine de l'Opaline / Kalypso
   Thin server component: sets locale context, renders the client page.
   ────────────────────────────────────────────────────────────────────────── */

import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo/metadata";
import KalypsoClient from "./_kalypso-client";

type Props = { params: Promise<{ locale: string }> };

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Page Kalypso : non finalisée pour le SEO (orpheline, pas dans `lib/projets.ts`,
// pas traduite EN). On la garde accessible mais non indexable pour l'instant —
// décision à rouvrir en Phase 4 du chantier SEO Pro (REX dans digital-agency).
const KALYPSO_META: Record<Locale, { title: string; description: string }> = {
  fr: {
    title: "Kalypso — Domaine de l'Opaline",
    description:
      "Site éditorial pour le Domaine de l'Opaline — exploration viticole en Rhône méridional.",
  },
  en: {
    title: "Kalypso — Domaine de l'Opaline",
    description:
      "Editorial site for Domaine de l'Opaline — winemaking exploration in southern Rhône.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = KALYPSO_META[locale as Locale] ?? KALYPSO_META.fr;
  return buildPageMetadata({
    title: meta.title,
    description: meta.description,
    pathname: "/projets/kalypso",
    locale: locale as Locale,
    ogType: "article",
    noindex: true,
  });
}

export default async function KalypsoPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale as Locale);
  return <KalypsoClient />;
}
