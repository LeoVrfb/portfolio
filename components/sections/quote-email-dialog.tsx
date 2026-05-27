"use client"

import { useState } from "react"
import { Dialog } from "@base-ui/react/dialog"
import { X, Check, Send, Calendar, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

type QuoteEmailDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  formuleNom: string
  formuleSlug: string
  formuleColor: string
  total: number
  hasDevis: boolean
  addonsLabels: string[]
  /** ID HTML de la section booking à scroller depuis le CTA secondaire. */
  bookingAnchor?: string
}

type FormData = {
  nom: string
  email: string
  telephone: string
  message: string
}

const initialForm: FormData = { nom: "", email: "", telephone: "", message: "" }

export function QuoteEmailDialog({
  open,
  onOpenChange,
  formuleNom,
  formuleSlug,
  formuleColor,
  total,
  hasDevis,
  addonsLabels,
  bookingAnchor = "booking",
}: QuoteEmailDialogProps) {
  const t = useTranslations("serviceQuoteDialog")
  const [data, setData] = useState<FormData>(initialForm)
  const [isPending, setIsPending] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const isValid = data.nom.trim() && data.email.trim()

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setTimeout(() => {
        setData(initialForm)
        setSubmitted(false)
        setIsPending(false)
      }, 200)
    }
    onOpenChange(next)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || isPending) return

    const totalEstime = hasDevis ? `${total}€+` : `${total} €`

    setIsPending(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: data.nom,
          email: data.email,
          telephone: data.telephone || undefined,
          formule: formuleNom,
          message: data.message || t("defaultMessage", { nom: formuleNom }),
          addons: addonsLabels,
          totalEstime,
        }),
      })
      const result = await res.json()
      if (result.success) {
        setSubmitted(true)
      } else {
        toast.error(result.message ?? t("serverError"))
      }
    } catch {
      toast.error(t("networkError"))
    } finally {
      setIsPending(false)
    }
  }

  const handleScrollToBooking = () => {
    handleOpenChange(false)
    setTimeout(() => {
      const el = document.getElementById(bookingAnchor)
      el?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 250)
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-white/10 bg-white/4 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-accent/50 focus:bg-white/6 transition-colors"

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-starting-style:opacity-0 data-ending-style:opacity-0 transition-opacity duration-200" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md sm:max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/12 bg-background p-5 sm:p-6 lg:p-7 shadow-2xl data-starting-style:opacity-0 data-ending-style:opacity-0 data-starting-style:scale-95 data-ending-style:scale-95 transition-all duration-200 max-h-[90vh] overflow-y-auto">
          <div className="flex items-start justify-between gap-3 mb-1">
            <Dialog.Title
              className="text-lg sm:text-xl font-black leading-tight"
              style={{ color: submitted ? formuleColor : "var(--accent)" }}
            >
              {submitted ? t("titleSuccess") : t("titleForm")}
            </Dialog.Title>
            <Dialog.Close
              aria-label={t("close")}
              className="shrink-0 -mt-1 -mr-1 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          {/* État 1 : formulaire */}
          {!submitted && (
            <>
              <Dialog.Description className="text-sm text-white/75 leading-relaxed mb-5">
                {t("descriptionForm")}
              </Dialog.Description>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.18em] mb-1.5 block">
                    {t("nameLabel")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("namePlaceholder")}
                    value={data.nom}
                    onChange={(e) => setData((d) => ({ ...d, nom: e.target.value }))}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.18em] mb-1.5 block">
                    {t("emailLabel")}
                  </label>
                  <input
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    value={data.email}
                    onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.18em] mb-1.5 block">
                    {t("phoneLabel")}{" "}
                    <span className="text-white/35 normal-case tracking-normal">
                      {t("phoneOptional")}
                    </span>
                  </label>
                  <input
                    type="tel"
                    placeholder={t("phonePlaceholder")}
                    value={data.telephone}
                    onChange={(e) => setData((d) => ({ ...d, telephone: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.18em] mb-1.5 block">
                    {t("projectLabel")}{" "}
                    <span className="text-white/35 normal-case tracking-normal">
                      {t("projectOptional")}
                    </span>
                  </label>
                  <textarea
                    placeholder={t("projectPlaceholder")}
                    value={data.message}
                    onChange={(e) => setData((d) => ({ ...d, message: e.target.value }))}
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!isValid || isPending}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed enabled:cursor-pointer enabled:hover:opacity-90"
                  style={{ background: "var(--accent)", color: "var(--background)" }}
                >
                  {isPending ? (
                    t("submitPending")
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t("submitLabel")}
                    </>
                  )}
                </button>

                <p className="text-[11px] text-white/45 text-center leading-relaxed pt-1">
                  {t("responseTime")}
                </p>
              </form>
            </>
          )}

          {/* État 2 : confirmation + révélation du total */}
          {submitted && (
            <div className="space-y-5">
              <div className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-white/3">
                <div
                  className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: `color-mix(in oklab, ${formuleColor} 18%, transparent)` }}
                >
                  <Check className="w-4 h-4" style={{ color: formuleColor }} />
                </div>
                <div className="text-sm text-white/85 leading-relaxed">
                  {t("emailSent", { email: data.email })}
                </div>
              </div>

              {/* Bloc total révélé */}
              <div
                className="rounded-xl p-5"
                style={{
                  background: `linear-gradient(135deg, color-mix(in oklab, ${formuleColor} 14%, transparent), color-mix(in oklab, var(--accent) 6%, transparent))`,
                  border: `1px solid color-mix(in oklab, ${formuleColor} 30%, transparent)`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5" style={{ color: formuleColor }} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: formuleColor }}>
                    {t("yourEstimation")}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-white/70">{t("totalForPlan", { nom: formuleNom })}</span>
                  <span className="font-black tracking-[-0.03em] text-3xl leading-none text-white">
                    {total}{" "}
                    <span className="text-xl" style={{ color: formuleColor }}>
                      €{hasDevis ? "+" : ""}
                    </span>
                  </span>
                </div>
                <p className="text-[11px] text-white/55 mt-2.5">
                  {t("taxes")}
                </p>
              </div>

              {/* CTA booking */}
              <div className="space-y-3">
                <p className="text-sm text-white/80 leading-relaxed text-center">
                  {t.rich("discussNow", {
                    bold: (chunks) => <span className="text-white font-semibold">{chunks}</span>,
                  })}
                  <br />
                  {t("bookCallOffer")}
                </p>

                <button
                  onClick={handleScrollToBooking}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-bold text-sm transition-all hover:opacity-90 cursor-pointer"
                  style={{ background: formuleColor, color: "var(--background)" }}
                >
                  <Calendar className="w-4 h-4" />
                  {t("bookMyCall")}
                </button>

                <Dialog.Close className="w-full text-center py-2.5 text-xs font-semibold text-white/55 hover:text-white transition-colors cursor-pointer">
                  {t("closeLater")}
                </Dialog.Close>
              </div>

              {/* Hidden — exposer le slug pour debug futur si besoin */}
              <span className="sr-only">{formuleSlug}</span>
            </div>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
