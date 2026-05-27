import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { ProjetsGrid } from "@/components/sections/projets-grid";
import { BlurFade } from "@/components/animations/blur-fade";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "projets.meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ProjetsPage({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) notFound();
  const locale = localeParam as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("projets");

  return (
    <div className="pt-32 pb-24 layout-container">
      {/* Header */}
      <div className="mb-12">
        <BlurFade delay={0}>
          <p className="text-xs font-semibold text-accent mb-3 tracking-[0.3em] uppercase">
            {t("eyebrow")}
          </p>
        </BlurFade>
        <BlurFade delay={0.08}>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter leading-[0.92] mb-4">
            {t("title")}
            <br />
            <span className="text-foreground/20">{t("titleAccent")}</span>
          </h1>
        </BlurFade>
        <BlurFade delay={0.14}>
          <p className="text-foreground/70 text-base max-w-lg leading-relaxed">
            {t("description")}
          </p>
        </BlurFade>
      </div>

      {/* Grid + filters */}
      <ProjetsGrid />
    </div>
  );
}
