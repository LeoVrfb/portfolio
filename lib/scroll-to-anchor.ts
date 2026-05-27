// Helper de scroll robuste vers une ancre interne (ex: la section #booking).
//
// Pourquoi un retry plutôt qu'un simple scrollIntoView ?
// La page /services/[slug] contient beaucoup de sections avec des animations
// whileInView (FadeUp, StaggerList, motion.div). Pendant le scroll smooth,
// ces animations s'expandent en cascade et poussent la cible vers le bas.
// Résultat : `scrollIntoView` ou un `href="#booking"` natif scroll vers la
// position calculée AVANT que les animations se déclenchent, ce qui fait
// atterrir le user à mi-chemin (souvent sur la section "Votre devis estimé").
//
// Le retry recalcule la position cible 600ms et 1300ms après le scroll initial,
// ce qui couvre la durée typique des animations FadeUp (~450ms) + le délai de
// scroll smooth du browser.

const HEADER_OFFSET_PX = 80

export function scrollToAnchor(id: string, offsetPx = HEADER_OFFSET_PX): void {
  if (typeof window === "undefined") return

  const scroll = () => {
    const el = document.getElementById(id)
    if (!el) return
    const targetY = el.getBoundingClientRect().top + window.scrollY - offsetPx
    // Évite de re-scroller si on est déjà très proche de la cible (< 4px).
    if (Math.abs(window.scrollY - targetY) < 4) return
    window.scrollTo({ top: targetY, behavior: "smooth" })
  }

  scroll()
  // Re-scroll pour compenser le layout shift dû aux animations whileInView
  // qui se déclenchent pendant le scroll smooth.
  window.setTimeout(scroll, 600)
  window.setTimeout(scroll, 1300)
}
