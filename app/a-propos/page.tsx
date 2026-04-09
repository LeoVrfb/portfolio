import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import {
  SiNextdotjs, SiReact, SiTypescript, SiJavascript,
  SiTailwindcss, SiFramer, SiNodedotjs, SiPostgresql,
  SiMongodb, SiPrisma, SiGit, SiVercel, SiFigma, SiContentful,
} from "react-icons/si"
import { BlurFade } from "@/components/animations/blur-fade"
import { NumberTicker } from "@/components/animations/number-ticker"
import { projets } from "@/lib/projets"

export const metadata: Metadata = {
  title: "À propos — Léo Hengebaert",
  description:
    "Développeur front-end basé à Paris, spécialisé React & Next.js. Découvrez mon parcours.",
}

const STATS = [
  { value: 3, suffix: "+", label: "ans d'expérience" },
  { value: projets.length, suffix: "", label: "projets livrés" },
  { value: 3, suffix: "", label: "entreprises" },
]

const EXPERIENCE = [
  {
    company: "Artefact",
    role: "Développeur Front-End",
    period: "2025 – Aujourd'hui",
    type: "CDI · Conseil",
    description:
      "Cabinet de conseil en Data et Intelligence Artificielle. Développement d'interfaces pour de grands comptes, en collaboration avec les équipes du studio créatif — notamment pour BNP Paribas.",
    tags: ["React", "Next.js", "TypeScript"],
    color: "border-accent/30 bg-accent/5",
    dot: "bg-accent",
  },
  {
    company: "Artefact 3000",
    role: "Développeur Front-End",
    period: "2022 – 2025",
    type: "CDI · Studio créatif",
    description:
      "Studio créatif d'Artefact, spécialisé dans les expériences digitales sur mesure. Projets pour TotalEnergies (Argedis), les Aéroports de Paris (Extime) et Robertet — applications tablettes, jeux concours à grande échelle, expériences immersives.",
    tags: ["Next.js", "Contentful", "GraphQL", "Framer Motion", "MongoDB"],
    color: "border-[var(--lavender)]/20 bg-[var(--lavender)]/5",
    dot: "bg-[var(--lavender)]",
  },
  {
    company: "Qare",
    role: "Développeur Front-End",
    period: "2020 – 2022",
    type: "CDI · Télémédecine",
    description:
      "Acteur majeur de la télémédecine en France. J'y ai contribué au développement d'un produit fort, itéré en méthode agile, dans une équipe tech structurée — dans un contexte de forte croissance post-COVID.",
    tags: ["React", "TypeScript", "React-i18next"],
    color: "border-[var(--mauve)]/20 bg-[var(--mauve)]/5",
    dot: "bg-[var(--mauve)]",
  },
]

const SKILLS: { category: string; items: { name: string; Icon: React.ComponentType<{ className?: string }> | null }[] }[] = [
  {
    category: "Frameworks",
    items: [
      { name: "Next.js", Icon: SiNextdotjs },
      { name: "React", Icon: SiReact },
    ],
  },
  {
    category: "Langages",
    items: [
      { name: "TypeScript", Icon: SiTypescript },
      { name: "JavaScript", Icon: SiJavascript },
    ],
  },
  {
    category: "Styling & Animations",
    items: [
      { name: "Tailwind CSS", Icon: SiTailwindcss },
      { name: "Framer Motion", Icon: SiFramer },
    ],
  },
  {
    category: "Back-end",
    items: [
      { name: "Node.js", Icon: SiNodedotjs },
      { name: "PostgreSQL", Icon: SiPostgresql },
      { name: "MongoDB", Icon: SiMongodb },
      { name: "Prisma", Icon: SiPrisma },
    ],
  },
  {
    category: "Outils",
    items: [
      { name: "Git", Icon: SiGit },
      { name: "Vercel", Icon: SiVercel },
      { name: "Figma", Icon: SiFigma },
      { name: "Contentful", Icon: SiContentful },
    ],
  },
  {
    category: "Méthodes",
    items: [
      { name: "Agile / Scrum", Icon: null },
      { name: "Tests RTL", Icon: null },
      { name: "Jira", Icon: null },
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
            <span className="text-zinc-600">basé à Paris.</span>
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
          <div className="grid md:grid-cols-2 gap-4 mb-14">
            <div className="p-6 rounded-2xl border border-accent/20 bg-accent/5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-semibold text-accent uppercase tracking-[0.2em]">
                  Mon métier principal
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                Développeur Front-End
              </h3>
              <p className="text-sm text-foreground/70 leading-relaxed">
                Interfaces pour <span className="text-foreground/90 font-medium">TotalEnergies</span>, <span className="text-foreground/90 font-medium">Aéroports de Paris</span> et <span className="text-foreground/90 font-medium">BNP Paribas</span>. Du code propre, une UI soignée, une exigence constante.
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
                Sites vitrine sur mesure pour artisans, restaurants et PME. Design soigné, SEO local, livraison rapide — sans WordPress ni template générique.
              </p>
            </div>
          </div>
        </BlurFade>
      </section>

      {/* Mon histoire */}
      <section className="py-24 layout-container">
        <BlurFade delay={0.1} direction="up" inView>
          <div className="grid md:grid-cols-[1fr_2fr] gap-16 items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-zinc-600 font-semibold mb-3">
                Mon histoire
              </p>
              <h2 className="text-3xl font-black text-white leading-tight tracking-tight mb-4">
                De la télémédecine
                <br />
                <span className="text-accent">au conseil.</span>
              </h2>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mt-4"
              >
                Travailler ensemble
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="space-y-5 text-foreground/75 text-base leading-relaxed">
              <BlurFade delay={0.15} direction="up" inView>
                <p>
                  J'ai commencé ma carrière chez{" "}
                  <span className="text-accent font-semibold">Qare</span>, acteur majeur de la télémédecine en France. Un produit fort, itéré en méthode agile, dans une équipe tech structurée. C'est là que j'ai appris à travailler sérieusement sur un même produit au long cours — dans un contexte de forte croissance post-COVID.
                </p>
              </BlurFade>
              <BlurFade delay={0.2} direction="up" inView>
                <p>
                  J'ai ensuite rejoint{" "}
                  <span className="text-accent font-semibold">Artefact 3000</span>, le studio créatif du groupe Artefact. J'y ai travaillé sur des projets exigeants et visibles : une application interactive déployée sur des centaines de tablettes dans les stations-service{" "}
                  <span className="text-foreground/90 font-medium">TotalEnergies</span> (Argedis), un jeu à gratter virtuel pour les voyageurs des{" "}
                  <span className="text-foreground/90 font-medium">Aéroports de Paris</span> (Extime) ayant touché des centaines de milliers d'utilisateurs, ainsi que des expériences digitales pour Robertet, leader mondial de la parfumerie.
                </p>
              </BlurFade>
              <BlurFade delay={0.25} direction="up" inView>
                <p>
                  Intégré depuis 2025 à la practice Conseil d'{" "}
                  <span className="text-accent font-semibold">Artefact</span>, j'y continue de développer des interfaces front-end — notamment pour{" "}
                  <span className="text-foreground/90 font-medium">BNP Paribas</span>, en collaboration avec les équipes du studio créatif.
                </p>
              </BlurFade>
              <BlurFade delay={0.3} direction="up" inView>
                <p>
                  En parallèle, j'aide artisans, restaurants et PME à construire leur présence en ligne. Des sites pensés, rapides et bien référencés — qui travaillent pour leur propriétaire même quand il dort.
                </p>
              </BlurFade>
              <BlurFade delay={0.35} direction="up" inView>
                <p>
                  Peu importe le contexte : du code propre, une UI soignée, des délais tenus.
                </p>
              </BlurFade>
            </div>
          </div>
        </BlurFade>
      </section>

      {/* Expérience */}
      <section className="pb-24 layout-container">
        <BlurFade delay={0.1} direction="up" inView>
          <p className="text-xs uppercase tracking-[0.4em] text-foreground/50 font-semibold mb-3">
            Parcours
          </p>
          <h2 className="text-3xl font-bold text-white tracking-tight mb-12">
            Expérience professionnelle
          </h2>
        </BlurFade>

        <div className="relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
          <div className="space-y-10">
            {EXPERIENCE.map((exp, i) => (
              <BlurFade key={exp.company} delay={0.15 + i * 0.12} direction="up" inView>
                <div className="flex gap-8">
                  <div className="relative shrink-0 mt-1.5">
                    <div className={`w-3.5 h-3.5 rounded-full border-2 border-background ${exp.dot}`} />
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                      <h3 className="text-lg font-bold text-white">{exp.company}</h3>
                      <span className="text-xs text-foreground/50">{exp.period}</span>
                      <span className="text-[10px] uppercase tracking-widest text-foreground/40 border border-border rounded-full px-2 py-0.5">{exp.type}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground/60 mb-3">{exp.role}</p>
                    <p className="text-sm text-foreground/75 leading-relaxed mb-4">{exp.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-full border border-border text-xs text-foreground/60"
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
      </section>

      {/* Stack technique */}
      <section className="pb-24 layout-container">
        <BlurFade delay={0.1} direction="up" inView>
          <h2 className="text-2xl font-black text-white tracking-tight mb-8">Stack technique</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SKILLS.map((group) => (
              <div
                key={group.category}
                className="p-5 rounded-2xl border border-white/6 bg-white/2 hover:border-white/10 transition-colors"
              >
                <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-600 mb-4 font-semibold">
                  {group.category}
                </p>
                <div className="space-y-2.5">
                  {group.items.map(({ name, Icon }) => (
                    <div key={name} className="flex items-center gap-2.5">
                      {Icon ? (
                        <Icon className="w-4 h-4 text-foreground/50 shrink-0" />
                      ) : (
                        <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                          <span className="w-1 h-1 rounded-full bg-foreground/30" />
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
                <span className="text-foreground/90 font-medium">web design</span> au CEFII (Centre d'Étude et de Formation en Informatique et Internet) —{" "}
                <span className="text-foreground/90 font-medium">Diplôme RNCP niveau 5</span>
              </p>
            </div>
          </div>
        </BlurFade>
      </section>
    </main>
  )
}
