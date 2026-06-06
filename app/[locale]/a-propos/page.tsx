import type { Metadata } from "next"
import { ArrowRight } from "lucide-react"
import {
  SiNextdotjs, SiReact, SiTypescript, SiJavascript,
  SiTailwindcss, SiRadixui, SiFramer, SiGreensock,
  SiZod, SiStripe, SiContentful, SiPrismic,
  SiMongodb, SiSupabase, SiStorybook,
  SiVitest, SiTestinglibrary, SiBetterauth,
  SiGit, SiGithub, SiVercel, SiGraphql,
} from "react-icons/si"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { hasLocale } from "next-intl"
import { notFound } from "next/navigation"
import { Link } from "@/i18n/navigation"
import { routing, type Locale } from "@/i18n/routing"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { BlurFade } from "@/components/animations/blur-fade"
import { NumberTicker } from "@/components/animations/number-ticker"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: "aPropos.meta" })
  return buildPageMetadata({
    title: t("title"),
    description: t("description"),
    pathname: "/a-propos",
    locale: locale as Locale,
  })
}

const STATS_VALUES = [
  { value: 3, suffix: "+", labelKey: "experience" as const },
  { value: 12, suffix: "+", labelKey: "projects" as const },
  { value: 2, suffix: "", labelKey: "companies" as const },
  { value: 10, suffix: "+", labelKey: "clients" as const },
]

const EXPERIENCE_ITEMS = [
  {
    company: "Artefact",
    key: "artefact" as const,
    tags: ["React", "Next.js"],
    dot: "bg-accent",
  },
  {
    company: "Artefact 3000",
    key: "artefact3000" as const,
    tags: ["React", "Next.js"],
    dot: "bg-[var(--lavender)]",
  },
  {
    company: "Qare",
    key: "qare" as const,
    tags: ["React"],
    dot: "bg-[var(--mauve)]",
  },
]

const SKILLS: { categoryKey: string; items: { name: string; Icon: React.ComponentType<{ className?: string }> | null }[] }[] = [
  {
    categoryKey: "framework",
    items: [
      { name: "Next.js (App Router)", Icon: SiNextdotjs },
      { name: "React", Icon: SiReact },
    ],
  },
  {
    categoryKey: "languages",
    items: [
      { name: "JavaScript", Icon: SiJavascript },
      { name: "TypeScript", Icon: SiTypescript },
    ],
  },
  {
    categoryKey: "styling",
    items: [
      { name: "Tailwind CSS", Icon: SiTailwindcss },
      { name: "shadcn/ui (Radix)", Icon: SiRadixui },
      { name: "Storybook", Icon: SiStorybook },
    ],
  },
  {
    categoryKey: "animations",
    items: [
      { name: "Motion (Framer Motion)", Icon: SiFramer },
      { name: "GSAP", Icon: SiGreensock },
      { name: "PixiJS", Icon: null },
      { name: "Canvas API", Icon: null },
      { name: "Aceternity UI", Icon: null },
      { name: "Magic UI", Icon: null },
    ],
  },
  {
    categoryKey: "forms",
    items: [
      { name: "React Hook Form", Icon: null },
      { name: "Zod", Icon: SiZod },
    ],
  },
  {
    categoryKey: "state",
    items: [
      { name: "Zustand", Icon: null },
    ],
  },
  {
    categoryKey: "database",
    items: [
      { name: "Convex", Icon: null },
      { name: "Supabase", Icon: SiSupabase },
      { name: "MongoDB", Icon: SiMongodb },
      { name: "Contentful", Icon: SiContentful },
      { name: "Prismic", Icon: SiPrismic },
      { name: "TanStack Query", Icon: null },
      { name: "GraphQL", Icon: SiGraphql },
    ],
  },
  {
    categoryKey: "auth",
    items: [
      { name: "Better Auth", Icon: SiBetterauth },
      { name: "NextAuth (Auth.js)", Icon: null },
    ],
  },
  {
    categoryKey: "i18n",
    items: [
      { name: "next-intl", Icon: null },
      { name: "react-i18next", Icon: null },
    ],
  },
  {
    categoryKey: "payment",
    items: [
      { name: "Stripe", Icon: SiStripe },
    ],
  },
  {
    categoryKey: "tests",
    items: [
      { name: "Vitest", Icon: SiVitest },
      { name: "React Testing Library", Icon: SiTestinglibrary },
      { name: "Playwright", Icon: null },
    ],
  },
  {
    categoryKey: "tooling",
    items: [
      { name: "Git", Icon: SiGit },
      { name: "GitHub", Icon: SiGithub },
      { name: "Vercel", Icon: SiVercel },
    ],
  },
  {
    categoryKey: "methodology",
    items: [
      { name: "Agile / Scrum", Icon: null },
    ],
  },
]

export default async function AProposPage({ params }: Props) {
  const { locale: localeParam } = await params
  if (!hasLocale(routing.locales, localeParam)) notFound()
  const locale = localeParam as Locale
  setRequestLocale(locale)
  const t = await getTranslations("aPropos")

  return (
    <div className="bg-background">
      {/* Header */}
      <section className="pt-32 pb-24 layout-container">
        <BlurFade delay={0.1} direction="up" inView>
          <p className="text-xs uppercase tracking-[0.45em] text-zinc-600 font-semibold mb-5">
            {t("eyebrow")}
          </p>
        </BlurFade>
        <BlurFade delay={0.2} direction="up" inView>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-[0.95] mb-10">
            {t("title")}
            <br />
            <span className="text-accent">{t("titleAccent")}</span>
          </h1>
        </BlurFade>

        {/* Stats */}
        <BlurFade delay={0.3} direction="up" inView>
          <div className="flex flex-wrap gap-12 mb-14">
            {STATS_VALUES.map((stat) => (
              <div key={stat.labelKey}>
                <p className="text-4xl font-black text-white tabular-nums">
                  <NumberTicker value={stat.value} className="text-white" />
                  <span className="text-accent">{stat.suffix}</span>
                </p>
                <p className="text-xs text-zinc-600 uppercase tracking-[0.2em] mt-1">
                  {t(`stats.${stat.labelKey}`)}
                </p>
              </div>
            ))}
          </div>
        </BlurFade>

        {/* Two cards */}
        <BlurFade delay={0.4} direction="up" inView>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl border border-accent/20 bg-accent/5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-semibold text-accent uppercase tracking-[0.2em]">
                  {t("cards.job.eyebrow")}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                {t("cards.job.title")}
              </h3>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {t.rich("cards.job.description", {
                  qare: (chunks) => <span className="text-foreground/90 font-medium">{chunks}</span>,
                  artefact: (chunks) => <span className="text-foreground/90 font-medium">{chunks}</span>,
                })}
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-(--lavender)/20 bg-(--lavender)/5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-(--lavender) animate-pulse" />
                <span className="text-xs font-semibold text-(--lavender) uppercase tracking-[0.2em]">
                  {t("cards.parallel.eyebrow")}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                {t("cards.parallel.title")}
              </h3>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {t("cards.parallel.description")}
              </p>
            </div>
          </div>
        </BlurFade>
      </section>

      {/* Mon histoire */}
      <section className="pt-4 pb-20 layout-container">
        <BlurFade delay={0.1} direction="up" inView>
          <div className="grid md:grid-cols-[1fr_2fr] gap-10 md:gap-16 items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-zinc-600 font-semibold mb-3">
                {t("story.eyebrow")}
              </p>
              <h2 className="text-3xl font-black text-white leading-tight tracking-tight mb-4">
                {t("story.title")}
                <br />
                <span className="text-accent">{t("story.titleAccent")}</span>
              </h2>
              {/* Lien visible uniquement en desktop (en mobile il est répété en fin de texte) */}
              <Link
                href="/contact"
                className="group hidden md:inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mt-4"
              >
                {t("story.workTogether")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="space-y-5 text-white text-base leading-relaxed">
              <BlurFade delay={0.15} direction="up" inView>
                <p>
                  {t.rich("story.p1", {
                    accent: (chunks) => <span className="text-accent font-semibold">{chunks}</span>,
                  })}
                </p>
              </BlurFade>
              <BlurFade delay={0.2} direction="up" inView>
                <p>
                  {t.rich("story.p2", {
                    accent: (chunks) => <span className="text-accent font-semibold">{chunks}</span>,
                    lavender: (chunks) => <span className="text-(--lavender) font-medium">{chunks}</span>,
                    br: () => <br />,
                  })}
                </p>
              </BlurFade>
              <BlurFade delay={0.25} direction="up" inView>
                <p>
                  {t.rich("story.p3", {
                    argedis: (chunks) => (
                      <Link
                        href="/projets/argedis-totalenergies"
                        className="font-medium underline decoration-accent/40 decoration-1 underline-offset-4 hover:decoration-accent transition-colors"
                      >
                        {chunks}
                      </Link>
                    ),
                    sweetime: (chunks) => (
                      <Link
                        href="/projets/sweetime-adp-extime"
                        className="font-medium underline decoration-accent/40 decoration-1 underline-offset-4 hover:decoration-accent transition-colors"
                      >
                        {chunks}
                      </Link>
                    ),
                    bnp: (chunks) => (
                      <Link
                        href="/projets/bnp-paribas-elearning"
                        className="font-medium underline decoration-accent/40 decoration-1 underline-offset-4 hover:decoration-accent transition-colors"
                      >
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
              </BlurFade>
              <BlurFade delay={0.3} direction="up" inView>
                <p>
                  {t.rich("story.p4", {
                    bold: (chunks) => <span className="font-medium">{chunks}</span>,
                  })}
                </p>
              </BlurFade>
              <BlurFade delay={0.35} direction="up" inView>
                <p>
                  {t.rich("story.p5", {
                    bold: (chunks) => <span className="font-medium">{chunks}</span>,
                    bald: (chunks) => (
                      <Link
                        href="/projets/bald-artiste"
                        className="font-semibold underline decoration-accent/60 underline-offset-4 hover:decoration-accent transition-colors"
                      >
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
              </BlurFade>
              <BlurFade delay={0.4} direction="up" inView>
                <p>{t("story.p6")}</p>
              </BlurFade>
              {/* Lien visible uniquement en mobile (en desktop il est dans la colonne de gauche) */}
              <BlurFade delay={0.45} direction="up" inView>
                <Link
                  href="/contact"
                  className="group md:hidden inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors pt-2"
                >
                  {t("story.workTogether")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </BlurFade>
            </div>
          </div>
        </BlurFade>
      </section>

      {/* Expérience — timeline */}
      <section className="pb-24 layout-container">
        <div className="max-w-3xl mx-auto">
          <BlurFade delay={0.1} direction="up" inView>
            <div className="text-center mb-14">
              <p className="text-xs uppercase tracking-[0.4em] text-foreground/50 font-semibold mb-3">
                {t("experience.eyebrow")}
              </p>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                {t("experience.title")}
              </h2>
            </div>
          </BlurFade>

          <div className="relative">
            <div className="absolute left-[15px] top-3 bottom-3 w-px bg-linear-to-b from-white/15 via-white/8 to-transparent" />
            <div className="space-y-6">
              {EXPERIENCE_ITEMS.map((exp, i) => (
                <BlurFade key={exp.company} delay={0.15 + i * 0.1} direction="up" inView>
                  <div className="flex gap-5 sm:gap-7">
                    <div className="relative shrink-0 mt-5">
                      <div className={`w-3 h-3 rounded-full ring-4 ring-background ${exp.dot}`} />
                    </div>

                    <div className="flex-1 group rounded-2xl border border-white/8 bg-white/2 hover:border-white/15 hover:bg-white/4 transition-all p-5 sm:p-6">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-1">
                        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                          {exp.company}
                        </h3>
                        <span className="text-xs text-foreground/50 font-mono tabular-nums">
                          {t(`experience.${exp.key}.period`)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
                        <p className="text-sm font-medium text-white/85">
                          {t(`experience.${exp.key}.role`)}
                        </p>
                        <span className="text-[10px] uppercase tracking-[0.18em] text-foreground/45 border border-white/10 rounded-full px-2 py-0.5">
                          {t(`experience.${exp.key}.type`)}
                        </span>
                      </div>

                      <p className="text-sm text-foreground/75 leading-relaxed mb-4">
                        {t(`experience.${exp.key}.description`)}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {exp.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-[11px] text-foreground/65"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stack technique */}
      <section className="pb-24 layout-container">
        <div className="max-w-4xl mx-auto">
          <BlurFade delay={0.1} direction="up" inView>
            <h2 className="text-2xl font-black text-white tracking-tight mb-2">
              {t("skills.title")}
            </h2>
            <p className="text-sm text-foreground/55 mb-8">
              {t("skills.description")}
            </p>
          </BlurFade>

          <div className="rounded-2xl border border-white/8 bg-white/2 overflow-hidden">
            {SKILLS.map((group, i) => (
              <BlurFade key={group.categoryKey} delay={0.12 + i * 0.04} direction="up" inView>
                <div
                  className={`grid md:grid-cols-[200px_1fr] gap-x-8 gap-y-2 px-5 sm:px-6 py-4 sm:py-5 ${
                    i !== SKILLS.length - 1 ? "border-b border-white/6" : ""
                  }`}
                >
                  <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-semibold mt-1">
                    {t(`skills.categories.${group.categoryKey}`)}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {group.items.map(({ name, Icon }) => (
                      <span
                        key={name}
                        className="inline-flex items-center gap-1.5 text-sm text-foreground/85"
                      >
                        {Icon ? (
                          <Icon className="w-3.5 h-3.5 shrink-0 text-accent" />
                        ) : (
                          <span
                            className="w-1 h-1 rounded-full shrink-0"
                            style={{ background: "var(--accent)", opacity: 0.5 }}
                          />
                        )}
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* Formation */}
      <section className="pb-24 layout-container">
        <div className="max-w-3xl mx-auto">
          <BlurFade delay={0.1} direction="up" inView>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-semibold mb-4">
                {t("education.eyebrow")}
              </p>
              <p className="text-base text-white leading-relaxed mb-2">
                {t.rich("education.degree", {
                  bold: (chunks) => <span className="font-semibold">{chunks}</span>,
                })}
              </p>
              <p className="text-sm text-foreground/55 leading-relaxed">
                {t.rich("education.school", {
                  strong: (chunks) => <span className="text-foreground/75">{chunks}</span>,
                })}
              </p>
            </div>
          </BlurFade>
        </div>
      </section>
    </div>
  )
}
