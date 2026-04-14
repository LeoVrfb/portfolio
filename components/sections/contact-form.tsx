"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Send, Check, ArrowLeft, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { services } from "@/lib/services";

type FormData = {
  nom: string;
  email: string;
  activite: string;
  formule: string;
  message: string;
};

const formulesOptions = [
  { value: "", label: "Quelle formule vous intéresse ?" },
  { value: "Essentiel", label: "Essentiel — 599 €" },
  { value: "Standard", label: "Standard — 1 199 €" },
  { value: "Premium", label: "Premium — 2 199 €+" },
  { value: "autre", label: "Je ne sais pas encore" },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function ContactForm() {
  const searchParams = useSearchParams();
  const formulePrefill = searchParams.get("formule") ?? "";
  const slugPrefill = searchParams.get("slug") ?? "";
  const totalPrefill = searchParams.get("total") ?? "";
  const addonIdsPrefill = searchParams.get("addonIds") ?? "";
  const fromConfigurator = !!formulePrefill && !!slugPrefill;

  // Trouve le service correspondant pour avoir les données des addons
  const service = useMemo(() => services.find((s) => s.slug === slugPrefill), [slugPrefill]);

  // Addons sélectionnés — initialisés depuis l'URL, modifiables ici
  const [selectedAddonIds, setSelectedAddonIds] = useState<Set<string>>(
    new Set(addonIdsPrefill.split(",").filter(Boolean))
  );

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Calcul dynamique du total
  const total = useMemo(() => {
    if (!service) return null;
    const addonsTotal = Array.from(selectedAddonIds).reduce((acc, id) => {
      const addon = service.addons.find((a) => a.id === id);
      return acc + (addon?.prix ?? 0);
    }, 0);
    return service.prixBase + addonsTotal;
  }, [service, selectedAddonIds]);

  const hasDevisAddon = useMemo(() =>
    Array.from(selectedAddonIds).some(
      (id) => service?.addons.find((a) => a.id === id)?.prix === null
    ),
    [service, selectedAddonIds]
  );

  const selectedAddonObjects = useMemo(() => {
    if (!service) return [];
    return Array.from(selectedAddonIds)
      .map((id) => service.addons.find((a) => a.id === id))
      .filter((a): a is NonNullable<typeof a> => !!a);
  }, [service, selectedAddonIds]);

  // URL de retour avec l'état courant préservé
  const backUrl = useMemo(() => {
    if (!slugPrefill) return "/services";
    const ids = Array.from(selectedAddonIds).join(",");
    return ids ? `/services/${slugPrefill}?addonIds=${ids}` : `/services/${slugPrefill}`;
  }, [slugPrefill, selectedAddonIds]);

  const [data, setData] = useState<FormData>({
    nom: "",
    email: "",
    activite: "",
    formule: formulePrefill,
    message: "",
  });
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const f = searchParams.get("formule");
    if (f) setData((d) => ({ ...d, formule: f }));
  }, [searchParams]);

  const isValid = data.nom && data.email && data.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const totalEstime = hasDevisAddon
      ? `${total ?? ""}€+`
      : total
        ? `${total} €`
        : totalPrefill
          ? `${totalPrefill} €`
          : undefined;

    setIsPending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          addons: selectedAddonObjects.map((a) => a.label),
          totalEstime,
        }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Message envoyé ! Je vous réponds sous 24h.");
        setData({ nom: "", email: "", activite: "", formule: "", message: "" });
      } else {
        toast.error(result.message ?? "Une erreur est survenue.");
      }
    } catch {
      toast.error("Erreur réseau. Réessayez dans quelques instants.");
    } finally {
      setIsPending(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-white/8 bg-white/4 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-accent/50 focus:bg-white/6 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Récap interactif quand on vient du configurateur */}
      {fromConfigurator && service && (
        <div className="rounded-2xl border border-white/10 bg-white/3 p-5 space-y-4 mb-2">
          {/* Header recap */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] text-accent font-bold uppercase tracking-[0.3em] mb-0.5">
                Formule sélectionnée
              </p>
              <p
                className="text-xl font-black"
                style={{ color: service.color }}
              >
                {service.nom}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-accent">
                {hasDevisAddon ? `${total} €+` : `${total} €`}
              </p>
              <p className="text-[10px] text-white/40">Devis estimé</p>
            </div>
          </div>

          {/* Addons décochables */}
          {service.addons.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50 mb-2">
                Options — cochez / décochez pour ajuster
              </p>
              <div className="space-y-1">
                {service.addons.map((addon) => {
                  const selected = selectedAddonIds.has(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border text-left cursor-pointer transition-all ${
                        selected
                          ? "border-accent/30 bg-accent/6"
                          : "border-white/6 hover:border-white/14"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                          selected ? "bg-accent border-accent" : "border-white/25"
                        }`}
                      >
                        {selected && <Check className="w-2.5 h-2.5 text-background" />}
                      </div>
                      <span className={`text-xs flex-1 transition-colors ${selected ? "text-white" : "text-white/45"}`}>
                        {addon.label}
                      </span>
                      <span className={`text-xs font-bold shrink-0 transition-colors ${selected ? "text-accent" : "text-white/30"}`}>
                        {addon.prix !== null ? `+${addon.prix} €` : "Devis"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Note storytelling */}
          <div className="border-t border-white/6 pt-3">
            <p className="text-xs text-white/55 leading-relaxed">
              <span className="text-white/75 font-medium">Pas sûr d'une option ?</span>{" "}
              Pas besoin de tout décider maintenant. Envoyez votre message et on ajustera le devis ensemble lors de notre échange.
            </p>
          </div>

          {/* Bouton retour */}
          <Link
            href={backUrl}
            className="inline-flex items-center gap-1.5 text-xs text-accent hover:text-accent/70 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            Retour à la formule {service.nom}
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-[0.2em] mb-2 block">Nom *</label>
          <input
            type="text"
            placeholder="Votre nom"
            value={data.nom}
            onChange={(e) => setData((d) => ({ ...d, nom: e.target.value }))}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-[0.2em] mb-2 block">Email *</label>
          <input
            type="email"
            placeholder="votre@email.com"
            value={data.email}
            onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
            required
            className={inputClass}
          />
        </div>
      </div>

      {/* Formule — seulement si pas venu du configurateur */}
      {!fromConfigurator && (
        <div>
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-[0.2em] mb-2 block">Formule</label>
          <select
            value={data.formule}
            onChange={(e) => setData((d) => ({ ...d, formule: e.target.value }))}
            className={`${inputClass} cursor-pointer`}
          >
            {formulesOptions.map(({ value, label }) => (
              <option key={value} value={value} className="bg-zinc-900">
                {label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-[0.2em] mb-2 block">
          Décrivez votre {fromConfigurator ? "projet" : "demande"} *
        </label>
        <textarea
          placeholder={
            fromConfigurator
              ? "Parlez-moi de votre activité, vos contraintes, votre délai…"
              : "Parlez-moi de votre activité, ce que vous attendez, votre budget, votre délai…"
          }
          value={data.message}
          onChange={(e) => setData((d) => ({ ...d, message: e.target.value }))}
          required
          rows={6}
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={!isValid || isPending}
        className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-accent text-black text-sm font-bold rounded-xl hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
      >
        {isPending ? "Envoi en cours…" : "Envoyer le message"}
        {!isPending && <Send size={14} />}
      </button>

      <p className="text-xs text-zinc-700 text-center">
        Je réponds sous 24h, souvent moins.
      </p>
    </form>
  );
}
