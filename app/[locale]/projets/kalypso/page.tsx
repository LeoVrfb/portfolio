/* ──────────────────────────────────────────────────────────────────────────
   SERVER WRAPPER — Domaine de l'Opaline / Kalypso
   Thin server component: sets locale context, renders the client page.
   ────────────────────────────────────────────────────────────────────────── */

import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import KalypsoClient from "./_kalypso-client";

type Props = { params: Promise<{ locale: string }> };

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function KalypsoPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale as Locale);
  return <KalypsoClient />;
}
