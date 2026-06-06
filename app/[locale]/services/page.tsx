import type { Metadata } from "next";
import { Check, X, ArrowRight, Clock, ChevronDown, Sliders, Mail } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  type FaqItem,
  cleanRichText,
  faqPageSchema,
  serviceOfferSchema,
} from "@/lib/seo/json-ld";
import { services } from "@/lib/services";
import { JsonLd } from "@/components/seo/json-ld";
import { BlurFade } from "@/components/animations/blur-fade";
import {
  BookingDiscoveryCard,
  BookingDiscoveryButton,
} from "@/components/sections/booking-discovery-cta";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "services.meta" });
  return buildPageMetadata({
    title: t("title"),
    description: t("description"),
    pathname: "/services",
    locale: locale as Locale,
    keywords:
      locale === "fr"
        ? [
            "tarif site web",
            "création site web sur mesure",
            "freelance Next.js Paris",
            "site web professionnel",
            "devis site internet",
          ]
        : [
            "website pricing",
            "custom website development",
            "freelance Next.js Paris",
            "professional website",
            "website quote",
          ],
  });
}

const FORMULES_META = [
  {
    slug: "essentiel" as const,
    key: "essentiel" as const,
    highlighted: false,
    colorClass: "text-accent",
    borderClass: "border-accent/25 bg-accent/[0.03]",
    hoverBorder: "hover:border-accent/50",
    ctaClass: "bg-accent/12 border-accent/30 text-accent group-hover:bg-accent/22",
    priceColor: undefined as string | undefined,
  },
  {
    slug: "standard" as const,
    key: "standard" as const,
    highlighted: true,
    colorClass: "text-(--lavender)",
    borderClass: "border-(--lavender)/45 bg-(--lavender)/5",
    hoverBorder: "hover:border-(--lavender)/65",
    ctaClass: "bg-(--lavender)/18 border-(--lavender)/40 text-(--lavender) group-hover:bg-(--lavender)/28",
    priceColor: "var(--lavender)",
  },
  {
    slug: "premium" as const,
    key: "premium" as const,
    highlighted: false,
    colorClass: "text-(--gold)",
    borderClass: "border-(--gold)/25 bg-(--gold)/3",
    hoverBorder: "hover:border-(--gold)/50",
    ctaClass: "bg-(--gold)/12 border-(--gold)/30 text-(--gold) group-hover:bg-(--gold)/22",
    priceColor: "var(--gold)",
  },
];

// Nombre de paragraphes par question — alignement strict avec les JSON.
// Si on ajoute/retire un paragraphe dans messages, mettre à jour ici.
const FAQ_ITEMS = [
  { key: "q1", paragraphs: 2 },
  { key: "q2", paragraphs: 1 },
  { key: "q3", paragraphs: 3 },
  { key: "q4", paragraphs: 2 },
  { key: "q5", paragraphs: 2 },
  { key: "q6", paragraphs: 1 },
  { key: "q7", paragraphs: 2 },
  { key: "q8", paragraphs: 1 },
] as const;

export default async function ServicesPage({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) notFound();
  const locale = localeParam as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const tServicesData = await getTranslations({ locale, namespace: "servicesData" });

  // Construit les schemas JSON-LD page-spécifiques :
  // - FAQPage : 8 Q/R pour aider Google AI Overviews et ChatGPT/Perplexity
  // - 3× Service : un schema par formule (Essentiel, Standard, Premium) avec
  //   prix, currency, provider référençant la Person globale.
  const faqItems: FaqItem[] = FAQ_ITEMS.map((item) => {
    const question = t(`faq.${item.key}.question`);
    const paragraphs = Array.from({ length: item.paragraphs }, (_, i) =>
      t(`faq.${item.key}.p${i + 1}`),
    );
    return {
      question: cleanRichText(question),
      answer: cleanRichText(paragraphs.join(" ")),
    };
  });
  const pageSchemas = [
    faqPageSchema(faqItems),
    ...services.map((service) => {
      // Surcharge nom/description par les versions traduites quand dispo
      // (lib/services.ts contient les versions FR par défaut).
      const nom = tServicesData.has(`${service.slug}.nom`)
        ? tServicesData(`${service.slug}.nom`)
        : service.nom;
      const description = tServicesData.has(`${service.slug}.description`)
        ? tServicesData(`${service.slug}.description`)
        : service.description;
      return serviceOfferSchema({ ...service, nom, description }, locale);
    }),
  ];

  return (
    <div className="pt-28 pb-20 layout-container">
      <JsonLd data={pageSchemas} />
      {/* Header */}
      <div className="mb-10">
        <BlurFade delay={0}>
          <p className="text-xs font-semibold text-accent uppercase tracking-[0.45em] mb-3">
            {t("eyebrow")}
          </p>
        </BlurFade>
        <BlurFade delay={0.08}>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white leading-tight mb-4">
            {t("title")}
            <br />
            <span className="text-foreground/60">{t("titleAccent")}</span>
          </h1>
        </BlurFade>
        <BlurFade delay={0.14}>
          <p className="text-sm text-white/65 max-w-xl leading-relaxed">
            {t("description")}
          </p>
        </BlurFade>
      </div>

      {/* Formules — Standard légèrement scalée + glow lavande pour ressortir */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5 mb-16 items-stretch">
        {FORMULES_META.map((formule, i) => {
          const inclus = t.raw(`formules.${formule.key}.inclus`) as string[];
          const nonInclus = t.raw(`formules.${formule.key}.nonInclus`) as string[];
          return (
            <BlurFade key={formule.slug} delay={0.2 + i * 0.08} className="h-full">
              <Link
                href={`/services/${formule.slug}`}
                className={`relative rounded-2xl border flex flex-col cursor-pointer group transition-all duration-300 h-full ${formule.borderClass} ${formule.hoverBorder} ${
                  formule.highlighted
                    ? "lg:scale-[1.04] hover:scale-[1.055] lg:shadow-[0_0_0_1px_color-mix(in_oklab,var(--lavender)_25%,transparent),0_20px_60px_-20px_color-mix(in_oklab,var(--lavender)_40%,transparent)]"
                    : "lg:scale-[0.97] hover:scale-[0.985]"
                }`}
              >
                {formule.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 lg:left-5 lg:translate-x-0 z-10">
                    <span
                      className="text-[10px] font-bold px-3 py-1.5 bg-(--lavender) text-black rounded-full tracking-[0.12em] uppercase shadow-[0_4px_16px_-4px_color-mix(in_oklab,var(--lavender)_60%,transparent)]"
                    >
                      {t("formules.popularBadge")}
                    </span>
                  </div>
                )}

                {/* Card header */}
                <div className="p-5 pb-4 border-b border-white/5">
                  <div className="flex items-start justify-between mb-2">
                    <p className={`text-[10px] font-bold uppercase tracking-[0.4em] ${formule.colorClass}`}>
                      {t(`formules.${formule.key}.nom`)}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-white/55">
                      <Clock size={9} />
                      {t(`formules.${formule.key}.delai`)}
                    </div>
                  </div>
                  <div
                    className="text-3xl font-black tracking-tight leading-none mb-2"
                    style={formule.priceColor ? { color: formule.priceColor } : undefined}
                  >
                    {t(`formules.${formule.key}.prix`)}
                  </div>
                  <p
                    className="text-sm leading-snug opacity-90"
                    style={formule.priceColor ? { color: formule.priceColor } : undefined}
                  >
                    {t(`formules.${formule.key}.accroche`)}
                  </p>
                </div>

                {/* Features */}
                <div className="p-5 pt-4 flex-1 flex flex-col">
                  <div className="space-y-1.5 mb-4 flex-1">
                    {inclus.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-xs">
                        <Check size={11} className={`mt-0.5 shrink-0 ${formule.colorClass}`} />
                        <span className="text-white/90">{item}</span>
                      </div>
                    ))}
                    {nonInclus.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-xs">
                        <X size={11} className="mt-0.5 shrink-0 text-rose-400/65" />
                        <span className="text-white/60">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div
                    className={`block text-center py-2.5 rounded-xl text-xs font-bold transition-all border ${formule.ctaClass}`}
                  >
                    {t("formules.configureCta")}
                    <ArrowRight size={12} className="inline ml-1.5 -mt-0.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            </BlurFade>
          );
        })}
      </div>

      {/* Bloc 2 cartes : Discuter / Configurer — entre les formules et la FAQ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-14">
        <BlurFade delay={0.05} className="h-full">
          <BookingDiscoveryCard source="discovery" />
        </BlurFade>

        <BlurFade delay={0.12}>
          <Link
            href={{ pathname: "/services/standard", hash: "configurateur" }}
            className="group flex flex-col h-full p-5 sm:p-6 rounded-2xl border border-(--lavender)/35 bg-(--lavender)/5 hover:border-(--lavender)/60 hover:bg-(--lavender)/9 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-(--lavender)/15 border border-(--lavender)/35 flex items-center justify-center shrink-0">
                <Sliders size={16} className="text-(--lavender)" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-(--lavender)">
                {t("configureCard.eyebrow")}
              </p>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug mb-2">
              {t("configureCard.title")}
            </h3>
            <p className="text-sm text-white/70 leading-relaxed mb-5 flex-1">
              {t("configureCard.description")}
            </p>
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-(--lavender) text-black text-xs font-bold transition-all">
                {t("configureCard.cta")}
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </BlurFade>
      </div>

      {/* Scroll hint + séparateur */}
      <div className="flex flex-col items-center gap-2 py-8 text-white/65">
        <span className="text-[10px] tracking-[0.3em] uppercase">{t("faqHint")}</span>
        <ChevronDown size={16} className="animate-bounce" />
      </div>

      {/* FAQ — accordion shadcn, dense, texte blanc, mots-clés en gras */}
      <div className="mb-14 max-w-3xl mx-auto">
        <h2 className="text-xl font-black text-white tracking-tight mb-5">{t("faq.title")}</h2>
        <Accordion
          className="rounded-2xl border border-white/10 bg-white/2 overflow-hidden divide-y divide-white/8"
        >
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem
              key={item.key}
              value={`item-${i}`}
              className="border-b-0 last:border-b-0"
            >
              <AccordionTrigger className="px-5 py-4 text-left text-sm sm:text-base font-semibold text-accent hover:text-accent/80 hover:no-underline cursor-pointer">
                {t(`faq.${item.key}.question`)}
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5 pt-0">
                <FaqAnswer qKey={item.key} paragraphs={item.paragraphs} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* CTA final — bouton principal réserver appel (modale) + lien secondaire mail */}
      <div className="text-center">
        <p className="text-white/75 mb-5 text-sm">
          {t("finalCta.question")}
        </p>
        <BookingDiscoveryButton source="discovery" dialogVariant="advice" />
        <p className="text-[11px] text-white/50 mt-3">
          {t("finalCta.subText")}
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 mt-4 text-xs text-white/55 hover:text-white transition-colors cursor-pointer"
        >
          <Mail size={12} />
          {t("finalCta.emailFallback")}
        </Link>
      </div>
    </div>
  );
}

// FAQ answer renderer : centralise les balises rich utilisées dans toutes les réponses.
async function FaqAnswer({
  qKey,
  paragraphs,
}: {
  qKey: string;
  paragraphs: number;
}) {
  const t = await getTranslations("services.faq");
  const pKeys = Array.from({ length: paragraphs }, (_, i) => `p${i + 1}` as const);

  return (
    <div className="space-y-3 text-sm text-white leading-relaxed">
      {pKeys.map((p) => {
        const content = t.rich(`${qKey}.${p}`, {
          accent: (chunks) => <strong className="text-accent">{chunks}</strong>,
          projets: (chunks) => (
            <Link
              href="/projets"
              className="text-accent underline underline-offset-4 decoration-accent/40 hover:decoration-accent"
            >
              {chunks}
            </Link>
          ),
        });
        // q3.p3 = note discrète en italique (mêmes paragraphes en FR + EN).
        if (qKey === "q3" && p === "p3") {
          return (
            <p key={p} className="text-white/55 text-xs italic">
              {content}
            </p>
          );
        }
        return <p key={p}>{content}</p>;
      })}
    </div>
  );
}
