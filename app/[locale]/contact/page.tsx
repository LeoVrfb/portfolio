import { Metadata } from "next";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm, ContactBackLink } from "@/components/sections/contact-form";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.meta" });

  return buildPageMetadata({
    title: t("title"),
    description: t("description"),
    pathname: "/contact",
    locale: locale as Locale,
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <div className="pt-28 pb-24 layout-container">
      <Suspense fallback={null}>
        <ContactBackLink />
      </Suspense>

      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <p className="text-xs font-semibold text-accent uppercase tracking-[0.4em] mb-4">
            {t("eyebrow")}
          </p>
          <h1 className="text-5xl font-black tracking-tighter text-white leading-[0.95] mb-6">
            {t("title")}
            <br />
            <span className="text-accent">{t("titleAccent")}</span>
          </h1>
          <p className="text-base text-white/70 leading-relaxed max-w-lg">
            {t("description")}
          </p>
        </div>

        <Suspense fallback={null}>
          <ContactForm />
        </Suspense>

        {/* Maillage interne contextuel : 2 ancres descriptives vers /services
            et /projets pour les visiteurs arrivés directement sur /contact
            depuis Google. Améliore le crawl + le parcours utilisateur. */}
        <div className="mt-14 pt-10 border-t border-white/8 grid sm:grid-cols-2 gap-4">
          <Link
            href="/services"
            className="group flex items-start gap-4 p-5 rounded-xl border border-accent/15 bg-accent/[0.04] hover:border-accent/30 hover:bg-accent/[0.06] transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-accent uppercase tracking-[0.3em] mb-2">
                {t("links.services.eyebrow")}
              </p>
              <p className="text-sm font-bold text-white leading-snug mb-1">
                {t("links.services.title")}
              </p>
              <p className="text-xs text-white/55 leading-relaxed">
                {t("links.services.description")}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-accent/60 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
          </Link>
          <Link
            href="/projets"
            className="group flex items-start gap-4 p-5 rounded-xl border border-(--lavender)/15 bg-(--lavender)/[0.04] hover:border-(--lavender)/30 hover:bg-(--lavender)/[0.06] transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-(--lavender) uppercase tracking-[0.3em] mb-2">
                {t("links.projets.eyebrow")}
              </p>
              <p className="text-sm font-bold text-white leading-snug mb-1">
                {t("links.projets.title")}
              </p>
              <p className="text-xs text-white/55 leading-relaxed">
                {t("links.projets.description")}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-(--lavender)/60 group-hover:text-(--lavender) group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
