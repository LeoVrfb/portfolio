"use client"

import { motion } from "motion/react"
import { ArrowUpRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

const FLASH_GREEN = "var(--accent)"

export function AboutIntro() {
  const t = useTranslations("home.aboutIntro")

  const roles = [
    {
      num: "01",
      role: t("role1Title"),
      roleBold: t("role1Bold"),
      description: t("role1Description"),
      cta: t("role1Cta"),
      href: "/a-propos" as const,
    },
    {
      num: "02",
      role: t("role2Title"),
      roleBold: t("role2Bold"),
      description: t("role2Description"),
      cta: t("role2Cta"),
      href: "/projets" as const,
    },
  ]

  return (
    <section className="pt-16 pb-10 bg-background border-b border-border/40">
      <div className="layout-container">
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/40">
          {roles.map((item, i) => (
            <motion.div
              key={item.num}
              className={`flex flex-col justify-between py-6 ${i === 0 ? "md:pr-12" : "md:pl-12"}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: "easeOut" }}
            >
              <span className="font-mono text-xs text-foreground/90 mb-6 select-none">
                {item.num}
              </span>

              <div className="mb-6">
                <p className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.9]" style={{ color: FLASH_GREEN }}>
                  {item.role}
                  <br />
                  {item.roleBold}
                </p>
              </div>

              <p className="text-sm text-foreground/65 leading-relaxed mb-8 max-w-xs">
                {item.description}
              </p>

              <Link
                href={item.href}
                className="inline-flex items-center gap-2 text-sm font-semibold transition-colors cursor-pointer group w-fit"
                style={{ color: FLASH_GREEN }}
              >
                {item.cta}
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
