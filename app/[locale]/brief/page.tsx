import type { Metadata } from "next"
import { isFormule, type Formule } from "./_data"
import { BriefQuestionnaire } from "./_components/brief-questionnaire"

// Page privée, envoyée par lien après signature du devis. Jamais indexée
// (robots noindex ici + exclusion dans app/robots.ts), jamais liée depuis le site.
export const metadata: Metadata = {
  title: "Brief design",
  robots: { index: false, follow: false },
}

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ f?: string; c?: string }>
}

export default async function BriefPage({ searchParams }: Props) {
  const { f, c } = await searchParams
  // formule et token sont optionnels : sans eux, le brief tourne en mode générique.
  const formule: Formule | undefined = isFormule(f) ? f : undefined

  return (
    <div className="layout-container py-14 sm:py-20">
      <BriefQuestionnaire formule={formule} clientToken={c} />
    </div>
  )
}
