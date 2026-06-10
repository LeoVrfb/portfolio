// Données statiques du questionnaire design (page privée /brief).
// Les fonts elles-mêmes sont instanciées dans `layout.tsx` (next/font exige des
// appels littéraux). Ici on ne référence que les noms de variables CSS exposées
// par ce layout (ex: var(--font-brief-inter)).

export type Formule = "essentiel" | "standard" | "premium"

export type FontPairing = {
  id: string
  name: string
  vibe: string
  // Variables CSS exposées par app/[locale]/brief/layout.tsx
  headingVar: string
  bodyVar: string
}

// 7 pistes typographiques, toutes chargées en Google Fonts via le layout du brief.
// Choisies pour couvrir un large spectre (neutre pro → éditorial luxe → créatif bold).
export const FONT_PAIRINGS: FontPairing[] = [
  {
    id: "inter",
    name: "Inter",
    vibe: "Neutre, pro, intemporel",
    headingVar: "var(--font-brief-inter)",
    bodyVar: "var(--font-brief-inter)",
  },
  {
    id: "jakarta",
    name: "Plus Jakarta Sans",
    vibe: "Arrondie, accueillante, moderne",
    headingVar: "var(--font-brief-jakarta)",
    bodyVar: "var(--font-brief-jakarta)",
  },
  {
    id: "space",
    name: "Space Grotesk + Inter",
    vibe: "Géométrique, tech, contemporaine",
    headingVar: "var(--font-brief-space)",
    bodyVar: "var(--font-brief-inter)",
  },
  {
    id: "dmserif",
    name: "DM Serif + DM Sans",
    vibe: "Éditorial, élégant, premium",
    headingVar: "var(--font-brief-dmserif)",
    bodyVar: "var(--font-brief-dmsans)",
  },
  {
    id: "playfair",
    name: "Playfair Display + Inter",
    vibe: "Luxe, raffiné, classique chic",
    headingVar: "var(--font-brief-playfair)",
    bodyVar: "var(--font-brief-inter)",
  },
  {
    id: "bricolage",
    name: "Bricolage Grotesque",
    vibe: "Du caractère, bold, créatif",
    headingVar: "var(--font-brief-bricolage)",
    bodyVar: "var(--font-brief-inter)",
  },
  {
    id: "sora",
    name: "Sora",
    vibe: "Net, startup, digital",
    headingVar: "var(--font-brief-sora)",
    bodyVar: "var(--font-brief-sora)",
  },
]

export type Swatch = { name: string; hex: string }

// Accents de référence (alignés sur digital-agency/design/palettes/mes-palettes.md).
export const ACCENT_SWATCHES: Swatch[] = [
  { name: "Cyan", hex: "#06b6d4" },
  { name: "Bleu", hex: "#3b82f6" },
  { name: "Violet", hex: "#8b5cf6" },
  { name: "Rose", hex: "#f43f5e" },
  { name: "Orange", hex: "#f97316" },
  { name: "Ambre", hex: "#f59e0b" },
  { name: "Émeraude", hex: "#10b981" },
  { name: "Rouge", hex: "#ef4444" },
  { name: "Ardoise", hex: "#64748b" },
]

export const ADJECTIFS: string[] = [
  "Minimal",
  "Audacieux",
  "Élégant",
  "Chaleureux",
  "Tech",
  "Luxe",
  "Naturel",
  "Joueur",
  "Corporate",
  "Artisanal",
  "Moderne",
  "Classique",
]

export type FormuleMeta = {
  label: string
  intro: string
  // Court rappel du process design propre à la formule, affiché en intro.
  processNote: string
}

export const FORMULE_META: Record<Formule, FormuleMeta> = {
  essentiel: {
    label: "Essentiel",
    intro:
      "Quelques questions rapides pour cerner vos goûts. Je vous proposerai ensuite une short-list de 3 directions visuelles, vous choisirez celle qui vous parle.",
    processNote:
      "Formule Essentiel : pas besoin de tout remplir. L'essentiel : votre préférence clair/sombre, 1 ou 2 sites que vous aimez, et vos couleurs.",
  },
  standard: {
    label: "Standard",
    intro:
      "Ce questionnaire me sert à cerner votre univers avant de vous coder une page d'accueil de démonstration. On l'affinera ensemble jusqu'à ce qu'elle vous ressemble vraiment.",
    processNote:
      "Formule Standard : prenez le temps sur la typo et les couleurs, ça guide toute la direction que je vais vous montrer.",
  },
  premium: {
    label: "Premium",
    intro:
      "Plus vous êtes précis ici, plus les 3 directions que je vous proposerai taperont juste. Tout ce que vous remplissez nourrit la création sur mesure.",
    processNote:
      "Formule Premium : ce questionnaire complète notre visio. N'hésitez pas à détailler vos références et ce que vous voulez éviter.",
  },
}

// Mode générique : aucun formule ni token. Le brief reste pleinement utilisable
// (ex: l'envoyer à un proche qui n'est pas passé par une formule).
export const GENERIC_META: FormuleMeta = {
  label: "",
  intro:
    "Ce questionnaire me permet de cerner votre univers visuel avant de vous proposer une direction. Pas besoin d'être expert : répondez à ce que vous pouvez, on affinera ensemble.",
  processNote:
    "Rien n'est obligatoire à part vos coordonnées. Répondez à ce qui vous parle, laissez le reste vide si vous hésitez.",
}

export function getFormuleMeta(formule?: Formule | null): FormuleMeta {
  return formule ? FORMULE_META[formule] : GENERIC_META
}

export function isFormule(value: string | undefined | null): value is Formule {
  return value === "essentiel" || value === "standard" || value === "premium"
}
