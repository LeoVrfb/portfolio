import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import {
  SiNextdotjs, SiReact, SiTypescript, SiJavascript,
  SiTailwindcss, SiRadixui, SiFramer, SiGreensock,
  SiZod, SiStripe, SiContentful, SiPrismic,
  SiMongodb, SiSupabase, SiStorybook,
  SiVitest, SiTestinglibrary, SiBetterauth,
  SiGit, SiGithub, SiVercel, SiGraphql,
} from "react-icons/si"
import { BlurFade } from "@/components/animations/blur-fade"
import { NumberTicker } from "@/components/animations/number-ticker"

export const metadata: Metadata = {
  title: "À propos — Léo Hengebaert",
  description:
    "Développeur front-end spécialisé React & Next.js, basé en Île-de-France. Découvrez mon parcours.",
}

const STATS = [
  { value: 3, suffix: "+", label: "ans d'expérience" },
  { value: 12, suffix: "+", label: "projets livrés" },
  { value: 2, suffix: "", label: "entreprises (CDI)" },
  { value: 10, suffix: "+", label: "clients" },
]

const EXPERIENCE = [
  {
    company: "Artefact",
    role: "Développeur Full-Stack",
    period: "2025 – Aujourd'hui",
    type: "CDI · Cabinet de conseil",
    description:
      "Passage côté cabinet de conseil pour explorer d'autres types de projets et intégrer le monde des consultants, data analysts et data engineers. Je couvre désormais tout le périmètre full-stack via Next.js, en collaboration avec les équipes du studio créatif.",
    tags: ["Next.js", "TypeScript", "React", "Tailwind", "Server Actions"],
    color: "border-accent/30 bg-accent/5",
    dot: "bg-accent",
  },
  {
    company: "Artefact 3000",
    role: "Développeur Front-End",
    period: "2024 – 2025",
    type: "CDI · Studio créatif (agence)",
    description:
      "Studio créatif niché dans Artefact 3000 (l'agence de pub du groupe Artefact). Liberté de création totale, projets web exigeants pour de grandes marques : TotalEnergies (Argedis), Aéroports de Paris (Extime), Robertet, BNP Paribas. Applications tablettes, jeux concours à grande échelle, modules e-learning interactifs.",
    tags: ["Next.js", "Contentful", "GraphQL", "Motion", "GSAP", "PixiJS", "MongoDB"],
    color: "border-[var(--lavender)]/20 bg-[var(--lavender)]/5",
    dot: "bg-[var(--lavender)]",
  },
  {
    company: "Qare",
    role: "Développeur Front-End",
    period: "2022 – 2023",
    type: "CDI · Startup télémédecine",
    description:
      "Mes débuts dans la tech. Acteur majeur de la télémédecine en France, en pleine croissance post-Covid. C'est là que j'ai découvert la méthodologie agile en startup, le travail avec des équipes produit (Product Owners, Product Managers), et l'exigence de livrer des features concrètes itérées en continu.",
    tags: ["React", "TypeScript", "React-i18next"],
    color: "border-[var(--mauve)]/20 bg-[var(--mauve)]/5",
    dot: "bg-[var(--mauve)]",
  },
]

const SKILLS: { category: string; items: { name: string; Icon: React.ComponentType<{ className?: string }> | null }[] }[] = [
  {
    category: "Framework",
    items: [
      { name: "Next.js (App Router)", Icon: SiNextdotjs },
      { name: "React", Icon: SiReact },
    ],
  },
  {
    category: "Langages",
    items: [
      { name: "JavaScript", Icon: SiJavascript },
      { name: "TypeScript", Icon: SiTypescript },
    ],
  },
  {
    category: "Styling & UI",
    items: [
      { name: "Tailwind CSS", Icon: SiTailwindcss },
      { name: "shadcn/ui (Radix)", Icon: SiRadixui },
    ],
  },
  {
    category: "Animation",
    items: [
      { name: "Motion (Framer Motion)", Icon: SiFramer },
      { name: "GSAP", Icon: SiGreensock },
      { name: "Lenis", Icon: null },
    ],
  },
  {
    category: "Canvas & Jeux",
    items: [
      { name: "PixiJS", Icon: null },
      { name: "Canvas API", Icon: null },
    ],
  },
  {
    category: "Formulaires",
    items: [
      { name: "React Hook Form", Icon: null },
      { name: "Zod", Icon: SiZod },
    ],
  },
  {
    category: "State management",
    items: [
      { name: "Zustand", Icon: null },
    ],
  },
  {
    category: "Data & API",
    items: [
      { name: "TanStack Query", Icon: null },
      { name: "GraphQL", Icon: SiGraphql },
    ],
  },
  {
    category: "Database",
    items: [
      { name: "Convex", Icon: null },
      { name: "Supabase", Icon: SiSupabase },
      { name: "MongoDB", Icon: SiMongodb },
    ],
  },
  {
    category: "CMS",
    items: [
      { name: "Contentful", Icon: SiContentful },
      { name: "Prismic", Icon: SiPrismic },
    ],
  },
  {
    category: "Authentification",
    items: [
      { name: "Better Auth", Icon: SiBetterauth },
      { name: "NextAuth (Auth.js)", Icon: null },
    ],
  },
  {
    category: "Internationalisation",
    items: [
      { name: "next-intl", Icon: null },
      { name: "i18next", Icon: null },
      { name: "react-i18next", Icon: null },
    ],
  },
  {
    category: "Paiement",
    items: [
      { name: "Stripe", Icon: SiStripe },
    ],
  },
  {
    category: "Tests",
    items: [
      { name: "Vitest", Icon: SiVitest },
      { name: "React Testing Library", Icon: SiTestinglibrary },
      { name: "Playwright", Icon: null },
    ],
  },
  {
    category: "Design system",
    items: [
      { name: "Storybook", Icon: SiStorybook },
    ],
  },
  {
    category: "Outils & Déploiement",
    items: [
      { name: "Git", Icon: SiGit },
      { name: "GitHub", Icon: SiGithub },
      { name: "Vercel", Icon: SiVercel },
    ],
  },
  {
    category: "Méthodologie",
    items: [
      { name: "Méthodologie agile / Scrum", Icon: null },
    ],
  },
]

export default function AProposPage() {
  return (
    <main className="bg-background">
      {/* Header */}
      <section className="pt-32 pb-24 layout-container">
        <BlurFade delay={0.1} direction="up" inView>
          <p className="text-xs uppercase tracking-[0.45em] text-zinc-600 font-semibold mb-5">
            À propos
          </p>
        </BlurFade>
        <BlurFade delay={0.2} direction="up" inView>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-[0.95] mb-10">
            Développeur front-end
            <br />
            <span className="text-accent">& créateur de sites.</span>
          </h1>
        </BlurFade>

        {/* Stats */}
        <BlurFade delay={0.3} direction="up" inView>
          <div className="flex flex-wrap gap-12 mb-14">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-black text-white tabular-nums">
                  <NumberTicker value={stat.value} className="text-white" />
                  <span className="text-accent">{stat.suffix}</span>
                </p>
                <p className="text-xs text-zinc-600 uppercase tracking-[0.2em] mt-1">
                  {stat.label}
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
                  Mon métier
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                Développeur Front-End
              </h3>
              <p className="text-sm text-foreground/70 leading-relaxed">
                La base de mon activité depuis 2022. J&apos;ai travaillé en startup chez <span className="text-foreground/90 font-medium">Qare</span> (télémédecine), puis chez <span className="text-foreground/90 font-medium">Artefact</span>, l&apos;un des plus gros cabinets de conseil européens en data et IA, d&apos;abord côté agence puis côté conseil. Une expertise concrète des environnements pro exigeants.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-white/8 bg-white/2">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-zinc-400" />
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-[0.2em]">
                  En parallèle
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                Créateur de sites web
              </h3>
              <p className="text-sm text-foreground/70 leading-relaxed">
                L&apos;autre partie de mon activité, par passion pour le développement et le design. J&apos;aide artisans, restaurants et particuliers à construire leur présence en ligne. Un business à moi, où je gère tout de A à Z et où je peux mettre ma patte.
              </p>
            </div>
          </div>
        </BlurFade>
      </section>

      {/* Mon histoire */}
      <section className="pt-4 pb-20 layout-container">
        <BlurFade delay={0.1} direction="up" inView>
          <div className="grid md:grid-cols-[1fr_2fr] gap-16 items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-zinc-600 font-semibold mb-3">
                Mon histoire
              </p>
              <h2 className="text-3xl font-black text-white leading-tight tracking-tight mb-4">
                De la startup
                <br />
                <span className="text-accent">au cabinet de conseil.</span>
              </h2>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mt-4"
              >
                Travailler ensemble
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="space-y-5 text-white text-base leading-relaxed">
              <BlurFade delay={0.15} direction="up" inView>
                <p>
                  C&apos;est chez{" "}
                  <span className="text-accent font-semibold">Qare</span>{" "}
                  que j&apos;ai fait mes débuts dans la tech. Acteur majeur de la télémédecine en France, en pleine croissance post-Covid. C&apos;est là que j&apos;ai découvert la méthodologie agile en startup, le travail aux côtés d&apos;équipes produit (Product Owners, Product Managers, designers), et l&apos;exigence de livrer des features concrètes itérées en continu sur un produit utilisé chaque jour par des milliers de patients.
                </p>
              </BlurFade>
              <BlurFade delay={0.2} direction="up" inView>
                <p>
                  J&apos;ai ensuite rejoint{" "}
                  <span className="text-accent font-semibold">Artefact</span>. L&apos;un des plus gros cabinets de conseil européens spécialisé en data et IA. Aujourd&apos;hui valorisé à plus d&apos;un milliard, c&apos;est une véritable licorne française qui travaille avec les plus grandes enseignes mondiales. J&apos;ai eu la chance d&apos;intégrer ce monde.
                  <br />
                  J&apos;ai d&apos;abord rejoint{" "}
                  <span className="text-accent font-semibold">Artefact 3000</span>, l&apos;agence de pub du groupe, dans son{" "}
                  <span className="bg-white/10 px-1.5 py-0.5 rounded-md font-medium">studio créatif</span>
                  {" "}— une liberté de création totale, où les idées fusent en permanence. Puis en 2025, je suis passé côté{" "}
                  <span className="text-(--lavender) font-medium">cabinet de conseil</span>, dans un environnement plus structuré (consultants, data analysts, data engineers), pour explorer d&apos;autres types de projets.
                </p>
              </BlurFade>
              <BlurFade delay={0.25} direction="up" inView>
                <p>
                  Grâce à Artefact, j&apos;ai eu la chance de travailler avec des marques de premier plan :{" "}
                  <Link
                    href="/projets/argedis-totalenergies"
                    className="font-medium underline decoration-accent/40 decoration-1 underline-offset-4 hover:decoration-accent transition-colors"
                  >
                    TotalEnergies
                  </Link>
                  {" "}(application déployée sur des centaines de tablettes en stations),{" "}
                  <Link
                    href="/projets/sweetime-adp-extime"
                    className="font-medium underline decoration-accent/40 decoration-1 underline-offset-4 hover:decoration-accent transition-colors"
                  >
                    Aéroports de Paris
                  </Link>
                  {" "}(jeu concours digital touchant des centaines de milliers de voyageurs),{" "}
                  <Link
                    href="/projets/bnp-paribas-elearning"
                    className="font-medium underline decoration-accent/40 decoration-1 underline-offset-4 hover:decoration-accent transition-colors"
                  >
                    BNP Paribas
                  </Link>
                  {" "}(module e-learning IA générative déployé en interne), Robertet. Et au-delà de mes propres missions, j&apos;ai pu voir d&apos;autres projets ambitieux se construire autour de moi pour de très grandes marques, en apprenant énormément de cet écosystème exigeant.
                </p>
              </BlurFade>
              <BlurFade delay={0.3} direction="up" inView>
                <p>
                  Mon ADN : le <span className="font-medium">front-end</span>. Même si aujourd&apos;hui je tends de plus en plus vers le full-stack. Ce qui m&apos;anime avant tout, c&apos;est l&apos;interface : le rendu visuel, l&apos;expérience utilisateur, la qualité perçue.
                </p>
              </BlurFade>
              <BlurFade delay={0.35} direction="up" inView>
                <p>
                  En parallèle de mon poste, j&apos;accompagne aussi <span className="font-medium">artisans, restaurants et particuliers</span> dans la création de leur site web. Une activité que j&apos;ai lancée par passion pour le code et le design, et où je peux gérer chaque projet de A à Z, sans intermédiaire. Mon premier site freelance :{" "}
                  <Link
                    href="/projets/bald-artiste"
                    className="font-semibold underline decoration-accent/60 underline-offset-4 hover:decoration-accent transition-colors"
                  >
                    Bald
                  </Link>
                  , un site e-commerce sur mesure pour un artiste peintre. D&apos;autres sont en route.
                </p>
              </BlurFade>
              <BlurFade delay={0.4} direction="up" inView>
                <p>
                  Ce qui me motive au quotidien : trouver des solutions techniques propres, imaginer des interfaces uniques, aller chercher la qualité (le clean code, les bonnes pratiques, le détail design). Que ce soit pour une grande enseigne ou un client freelance, mon objectif est le même : livrer un produit qui dépasse les attentes, et que la confiance accordée soit toujours bien placée.
                </p>
              </BlurFade>
            </div>
          </div>
        </BlurFade>
      </section>

      {/* Expérience — timeline centrée, max-w contenue, cartes stylées */}
      <section className="pb-24 layout-container">
        <div className="max-w-3xl mx-auto">
          <BlurFade delay={0.1} direction="up" inView>
            <div className="text-center mb-14">
              <p className="text-xs uppercase tracking-[0.4em] text-foreground/50 font-semibold mb-3">
                Parcours
              </p>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Expérience professionnelle
              </h2>
            </div>
          </BlurFade>

          <div className="relative">
            {/* Ligne verticale */}
            <div className="absolute left-[15px] top-3 bottom-3 w-px bg-linear-to-b from-white/15 via-white/8 to-transparent" />
            <div className="space-y-6">
              {EXPERIENCE.map((exp, i) => (
                <BlurFade key={exp.company} delay={0.15 + i * 0.1} direction="up" inView>
                  <div className="flex gap-5 sm:gap-7">
                    {/* Dot timeline */}
                    <div className="relative shrink-0 mt-5">
                      <div className={`w-3 h-3 rounded-full ring-4 ring-background ${exp.dot}`} />
                    </div>

                    {/* Card */}
                    <div className="flex-1 group rounded-2xl border border-white/8 bg-white/2 hover:border-white/15 hover:bg-white/4 transition-all p-5 sm:p-6">
                      {/* Header : entreprise + période */}
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-1">
                        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                          {exp.company}
                        </h3>
                        <span className="text-xs text-foreground/50 font-mono tabular-nums">
                          {exp.period}
                        </span>
                      </div>

                      {/* Rôle + type */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
                        <p className="text-sm font-medium text-white/85">
                          {exp.role}
                        </p>
                        <span className="text-[10px] uppercase tracking-[0.18em] text-foreground/45 border border-white/10 rounded-full px-2 py-0.5">
                          {exp.type}
                        </span>
                      </div>

                      <p className="text-sm text-foreground/75 leading-relaxed mb-4">
                        {exp.description}
                      </p>

                      {/* Tags techniques */}
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
        <BlurFade delay={0.1} direction="up" inView>
          <h2 className="text-2xl font-black text-white tracking-tight mb-8">Stack technique</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SKILLS.map((group) => (
              <div
                key={group.category}
                className="p-5 rounded-2xl border border-white/6 bg-white/2 hover:border-accent/20 transition-colors"
              >
                <p className="text-[10px] uppercase tracking-[0.35em] text-accent mb-4 font-semibold">
                  {group.category}
                </p>
                <div className="space-y-2.5">
                  {group.items.map(({ name, Icon }) => (
                    <div key={name} className="flex items-center gap-2.5">
                      {Icon ? (
                        <span className="w-4 h-4 shrink-0 flex items-center justify-center" style={{ color: "var(--accent)" }}>
                          <Icon className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)", opacity: 0.5 }} />
                        </span>
                      )}
                      <p className="text-sm text-foreground/85 font-medium">{name}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </BlurFade>
      </section>

      {/* Formation */}
      <section className="pb-24 layout-container">
        <BlurFade delay={0.1} direction="up" inView>
          <div className="p-6 rounded-2xl border border-white/6 bg-white/2 flex items-start gap-4">
            <div className="w-2 h-2 rounded-full bg-zinc-600 shrink-0 mt-2" />
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Formation</h2>
              <p className="text-sm text-foreground/75 leading-relaxed">
                Formation en{" "}
                <span className="text-foreground/90 font-medium">web design</span> au CEFII (Centre d&apos;Étude et de Formation en Informatique et Internet),{" "}
                <span className="text-foreground/90 font-medium">Diplôme RNCP niveau 5</span>
              </p>
            </div>
          </div>
        </BlurFade>
      </section>
    </main>
  )
}
