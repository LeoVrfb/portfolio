import { Instagram, Linkedin, Github } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"

export async function Footer() {
  const year = new Date().getFullYear()
  const t = await getTranslations("footer")
  const nav = await getTranslations("nav")

  const links = [
    { href: "/projets" as const, label: nav("projects") },
    { href: "/services" as const, label: nav("services") },
    { href: "/a-propos" as const, label: nav("about") },
    { href: "/contact" as const, label: nav("contact") },
  ]

  return (
    <footer className="border-t border-white/5 py-12 bg-background">
      <div className="layout-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-sm font-black text-white mb-1 tracking-tight">Léo Hengebaert</p>
            <p className="text-xs text-zinc-400">{t("tagline")}</p>
          </div>

          <div className="flex items-center gap-6">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://linkedin.com/in/leo-hengebaert"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label={t("socials.linkedin")}
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com/leohengebaert"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label={t("socials.instagram")}
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/LeoVrfb"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label={t("socials.github")}
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <p className="text-xs text-zinc-400">{t("copyright", { year })}</p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              {t("legal.privacy")}
            </Link>
            <Link
              href="/terms"
              className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              {t("legal.terms")}
            </Link>
          </div>
          <p className="text-xs text-zinc-400">{t("stack")}</p>
        </div>
      </div>
    </footer>
  )
}
