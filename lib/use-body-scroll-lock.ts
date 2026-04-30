"use client"

import { useEffect } from "react"

// Lock du scroll du body quand une modale est ouverte.
// Compatible iOS Safari (qui ignore overflow:hidden sur body) via la technique
// position:fixed + top:-scrollY puis restauration du scrollY à la fermeture.
// Compteur global pour gérer plusieurs modales empilées (ex: BookingForm puis Confirmation).
let lockCount = 0
let savedScrollY = 0
let savedBodyStyle: {
  position: string
  top: string
  left: string
  right: string
  width: string
  overflow: string
} | null = null

function applyLock() {
  if (typeof document === "undefined") return
  if (lockCount > 0) {
    lockCount += 1
    return
  }
  savedScrollY = window.scrollY
  savedBodyStyle = {
    position: document.body.style.position,
    top: document.body.style.top,
    left: document.body.style.left,
    right: document.body.style.right,
    width: document.body.style.width,
    overflow: document.body.style.overflow,
  }
  document.body.style.position = "fixed"
  document.body.style.top = `-${savedScrollY}px`
  document.body.style.left = "0"
  document.body.style.right = "0"
  document.body.style.width = "100%"
  document.body.style.overflow = "hidden"
  lockCount += 1
}

function releaseLock() {
  if (typeof document === "undefined") return
  lockCount = Math.max(0, lockCount - 1)
  if (lockCount > 0) return
  if (savedBodyStyle) {
    document.body.style.position = savedBodyStyle.position
    document.body.style.top = savedBodyStyle.top
    document.body.style.left = savedBodyStyle.left
    document.body.style.right = savedBodyStyle.right
    document.body.style.width = savedBodyStyle.width
    document.body.style.overflow = savedBodyStyle.overflow
    savedBodyStyle = null
  }
  // Restaure la position de scroll exactement où elle était avant le lock.
  window.scrollTo(0, savedScrollY)
}

export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    applyLock()
    return () => {
      releaseLock()
    }
  }, [active])
}
