import {
  Inter,
  Plus_Jakarta_Sans,
  Space_Grotesk,
  DM_Sans,
  DM_Serif_Display,
  Playfair_Display,
  Bricolage_Grotesque,
  Sora,
} from "next/font/google"

// Toutes les polices candidates du sélecteur de typo live. Chargées uniquement
// sur le segment /brief (page privée, perf moins critique qu'en home). Chaque
// font expose une variable CSS consommée par le sélecteur (cf. _data.ts).
const inter = Inter({ subsets: ["latin"], variable: "--font-brief-inter", display: "swap" })
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-brief-jakarta", display: "swap" })
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-brief-space", display: "swap" })
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-brief-dmsans", display: "swap" })
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--font-brief-dmserif", display: "swap" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-brief-playfair", display: "swap" })
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-brief-bricolage", display: "swap" })
const sora = Sora({ subsets: ["latin"], variable: "--font-brief-sora", display: "swap" })

const fontVars = [
  inter.variable,
  jakarta.variable,
  space.variable,
  dmSans.variable,
  dmSerif.variable,
  playfair.variable,
  bricolage.variable,
  sora.variable,
].join(" ")

export default function BriefLayout({ children }: { children: React.ReactNode }) {
  return <div className={fontVars}>{children}</div>
}
