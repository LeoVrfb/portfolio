import { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm, ContactBackLink } from "@/components/sections/contact-form";
import { buildPageMetadata } from "@/lib/seo/metadata";
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
      </div>
    </div>
  );
}
