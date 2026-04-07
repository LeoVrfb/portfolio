import Link from "next/link"
import { Instagram, Linkedin, Github } from "lucide-react"

const links = [
  { href: "/projets", label: "Projets" },
  { href: "/services", label: "Services" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5 py-12 bg-background">
      <div className="layout-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-sm font-black text-white mb-1 tracking-tight">Léo Hengebaert</p>
            <p className="text-xs text-zinc-600">Développeur front-end · Paris</p>
          </div>

          <div className="flex items-center gap-6">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors"
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
              className="text-zinc-600 hover:text-white transition-colors cursor-pointer"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com/leohengebaert"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 hover:text-white transition-colors cursor-pointer"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/LeoVrfb"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 hover:text-white transition-colors cursor-pointer"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/4 flex items-center justify-between">
          <p className="text-xs text-zinc-700">© {year} Léo Hengebaert</p>
          <p className="text-xs text-zinc-800">Next.js · Vercel</p>
        </div>
      </div>
    </footer>
  )
}
