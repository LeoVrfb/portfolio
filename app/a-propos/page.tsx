import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BlurFade } from "@/components/animations/blur-fade"
import { NumberTicker } from "@/components/animations/number-ticker"

export const metadata: Metadata = {
  title: "À propos — Léo Hengebaert",
  description:
    "Développeur front-end chez Artefact, spécialisé React & Next.js. Découvrez mon parcours.",
}

const STATS = [
  { value: 3, suffix: "+", label: "ans d'expérience" },
  { value: 10, suffix: "+", label: "projets livrés" },
  { value: 3, suffix: "", label: "entreprises tech" },
]

const EXPERIENCE = [
  {
    company: "Artefact",
    role: "Développeur Front-End",
    period: "2025 – Aujourd'hui",
    type: "CDI",
    description:
      "Leader européen du conseil en Data et Intelligence Artificielle. Je travaille sur des interfaces et outils data-driven pour des clients comme LVMH, L'Oréal, Samsung, BNP Paribas, Chanel ou Danone. Un niveau d'exigence technique et de rigueur que je retrouve dans chaque projet.",
    tags: ["React", "Next.js", "TypeScript", "Data", "IA"],
    color: "border-accent/30 bg-accent/5",
    dot: "bg-accent",
  },
  {
    company: "Artefact 3000",
    role: "Développeur Front-End",
    period: "2022 – 2025",
    type: "CDI · Studio créatif",
    description:
      "Studio créatif d'Artefact, spécialisé dans les expériences digitales innovantes et sur mesure. J'ai conçu et développé des projets pour TotalEnergies (Argedis), les Aéroports de Paris (Extime), et Robertet — applications déployées sur tablettes, jeux concours à grande échelle, expériences immersives.",
    tags: ["Next.js", "Contentful", "GraphQL", "Framer Motion", "MongoDB"],
    color: "border-[var(--lavender)]/20 bg-[var(--lavender)]/5",
    dot: "bg-[var(--lavender)]",
  },
  {
    company: "Qare",
    role: "Développeur Front-End",
    period: "Avant 2022",
    type: "CDI · Télémédecine",
    description:
      "Acteur majeur de la santé en ligne. J'ai contribué au développement de solutions facilitant l'accès aux soins pour tous, dans un contexte de forte croissance post-COVID.",
    tags: ["React", "TypeScript", "React-i18next"],
    color: "border-[var(--mauve)]/20 bg-[var(--mauve)]/5",
    dot: "bg-[var(--mauve)]",
  },
]

const SKILLS = [
  { category: "Frameworks", items: ["Next.js", "React"] },
  { category: "Langages", items: ["TypeScript", "JavaScript"] },
  { category: "Styling", items: ["Tailwind CSS", "Framer Motion"] },
  { category: "Back-end", items: ["Node.js", "Prisma", "PostgreSQL", "MongoDB"] },
  { category: "Outils", items: ["Git", "Vercel", "Figma", "Contentful"] },
  { category: "Méthodes", items: ["Agile/Scrum", "Jira", "Tests RTL"] },
]

export default function AProposPage() {
  return (
    <main className="bg-background">
      {/* Header section */}
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

        {/* Dual identity */}
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
                Dev front-end @ Artefact
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Interfaces data-driven pour LVMH, L'Oréal, Samsung et les plus grandes marques mondiales. Au quotidien : code propre, accessibilité, performance.
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
              <p className="text-sm text-zinc-400 leading-relaxed">
                Sites vitrine sur mesure pour artisans, restaurants et PME. Design soigné, SEO local, livraison rapide — sans WordPress ni template générique.
              </p>
            </div>
          </div>
        </BlurFade>
      </section>

      {/* Statement */}
      <BlurFade delay={0.1} direction="up" inView>
        <div className="border-y border-border py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <blockquote className="text-2xl md:text-3xl font-light text-foreground/50 leading-snug tracking-tight">
              <span className="text-accent font-bold">"</span>
              Je travaille chez{" "}
              <span className="text-foreground font-semibold">Artefact</span>,
              un des leaders européens du conseil en Data et en IA.
              Clients : LVMH, L'Oréal, Samsung, BNP Paribas, Chanel, Danone.
              <span className="text-accent font-bold">"</span>
            </blockquote>
          </div>
        </div>
      </BlurFade>

      {/* Bio section */}
      <section className="py-24 layout-container">
        <BlurFade delay={0.1} direction="up" inView>
          <div className="grid md:grid-cols-[1fr_2fr] gap-16 items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-zinc-600 font-semibold mb-3">
                Mon histoire
              </p>
              <h2 className="text-3xl font-black text-white leading-tight tracking-tight mb-4">
                De la créa au<br />
                <span className="text-accent">data & IA.</span>
              </h2>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mt-4"
              >
                Travailler ensemble
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="space-y-5 text-zinc-400 text-base leading-relaxed">
              <BlurFade delay={0.15} direction="up" inView>
                <p>
                  Je suis Léo Hengebaert, développeur front-end basé à Paris. Je travaille actuellement chez{" "}
                  <span className="text-white font-medium">Artefact</span>, un des leaders européens du conseil en Data et Intelligence Artificielle — une entreprise réputée pour l'exigence de ses projets et la qualité de ses équipes.
                </p>
              </BlurFade>
              <BlurFade delay={0.2} direction="up" inView>
                <p>
                  Avant de rejoindre la practice Data & Conseil, j'ai passé plus d'un an au Studio{" "}
                  <span className="text-white font-medium">Artefact 3000</span>, l'agence créative du groupe. J'y ai travaillé sur des projets exigeants et visibles : une application interactive déployée sur tablettes dans les stations-service TotalEnergies (Argedis), un jeu à gratter virtuel pour les voyageurs d'Aéroports de Paris (Extime), ou encore des expériences digitales pour Robertet, leader mondial de la parfumerie.
                </p>
              </BlurFade>
              <BlurFade delay={0.25} direction="up" inView>
                <p>
                  Avant Artefact, j'ai travaillé chez{" "}
                  <span className="text-white font-medium">Qare</span>, acteur majeur de la télémédecine en France. J'y ai contribué au développement de solutions facilitant l'accès aux soins pour tous — une mission qui résonnait avec mes convictions personnelles sur le rôle de la tech.
                </p>
              </BlurFade>
              <BlurFade delay={0.3} direction="up" inView>
                <p>
                  En parallèle de mon activité principale, j'aide artisans, restaurants et PME à construire leur présence en ligne. Pas des sites génériques faits en 2 heures — des projets pensés, des sites rapides et bien référencés qui travaillent pour leur propriétaire même quand il dort.
                </p>
              </BlurFade>
              <BlurFade delay={0.35} direction="up" inView>
                <p>
                  Je suis animé par une exigence constante : du code propre, une UI soignée, des délais tenus. Peu importe la taille du projet.
                </p>
              </BlurFade>
            </div>
          </div>
        </BlurFade>
      </section>

      {/* Experience — vertical timeline */}
      <section className="pb-24 layout-container">
        <BlurFade delay={0.1} direction="up" inView>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground font-semibold mb-3">
            Parcours
          </p>
          <h2 className="text-3xl font-bold text-foreground tracking-tight mb-12">
            Expérience professionnelle
          </h2>
        </BlurFade>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

          <div className="space-y-10">
            {EXPERIENCE.map((exp, i) => (
              <BlurFade key={exp.company} delay={0.15 + i * 0.12} direction="up" inView>
                <div className="flex gap-8">
                  {/* Dot */}
                  <div className="relative shrink-0 mt-1.5">
                    <div className={`w-3.5 h-3.5 rounded-full border-2 border-background ${exp.dot}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                      <h3 className="text-lg font-bold text-foreground">{exp.company}</h3>
                      <span className="text-xs text-muted-foreground">{exp.period}</span>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 border border-border rounded-full px-2 py-0.5">{exp.type}</span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mb-3">{exp.role}</p>
                    <p className="text-sm text-muted-foreground/80 leading-relaxed mb-4">{exp.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-full border border-border text-xs text-muted-foreground"
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

      {/* Skills grid */}
      <section className="pb-24 layout-container">
        <BlurFade delay={0.1} direction="up" inView>
          <h2 className="text-2xl font-black text-white tracking-tight mb-8">Stack technique</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SKILLS.map((group) => (
              <div key={group.category} className="p-5 rounded-2xl border border-white/6 bg-white/2 hover:border-white/10 transition-colors">
                <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-700 mb-3 font-semibold">
                  {group.category}
                </p>
                <div className="space-y-1">
                  {group.items.map((item, i) => (
                    <p key={item} className="text-sm text-zinc-300 font-medium">
                      {item}
                    </p>
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
              <p className="text-sm text-zinc-400 leading-relaxed">
                Formation en <span className="text-zinc-300 font-medium">web design</span> au CEFII (Centre d'Étude et de Formation en Informatique et Internet) — Diplôme de niveau{" "}
                <span className="text-zinc-300 font-medium">RNCP 5</span>
              </p>
            </div>
          </div>
        </BlurFade>
      </section>
    </main>
  )
}
