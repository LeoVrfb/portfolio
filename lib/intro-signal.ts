// Signal module-level pour synchroniser la fin de l'intro avec les animations de la page.
// IntroOverlay appelle signalIntroReady() quand il disparaît.
// Les composants appellent onIntroReady(fn) pour être notifiés.

const listeners = new Set<() => void>()
let resolved = false

export function onIntroReady(fn: () => void): () => void {
  if (resolved) {
    setTimeout(fn, 0)
    return () => {}
  }
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function signalIntroReady() {
  if (resolved) return
  resolved = true
  listeners.forEach(fn => fn())
  listeners.clear()
}
