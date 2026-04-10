"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Send, Check } from "lucide-react";

type FormData = {
  nom: string;
  email: string;
  activite: string;
  formule: string;
  message: string;
};

const formulesOptions = [
  { value: "", label: "Quelle formule vous intéresse ?" },
  { value: "Essentiel", label: "Essentiel — 600 €" },
  { value: "Standard", label: "Standard — 1 200 €" },
  { value: "Premium", label: "Premium — 2 200 €+" },
  { value: "autre", label: "Je ne sais pas encore" },
];

export function ContactForm() {
  const searchParams = useSearchParams();
  const formulePrefill = searchParams.get("formule") ?? "";
  const totalPrefill = searchParams.get("total") ?? "";
  const addonsPrefill = searchParams.get("addons") ?? "";
  const fromConfigurator = !!formulePrefill;

  const addonsList = addonsPrefill
    ? addonsPrefill.split(",").filter(Boolean)
    : [];

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

    setIsPending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          addons: addonsList,
          totalEstime: totalPrefill === "devis" ? "Sur devis" : totalPrefill ? `${totalPrefill} €` : undefined,
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
      {/* Récap formule quand on vient du configurateur */}
      {fromConfigurator && (
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 space-y-2.5 mb-2">
          <div className="flex items-center gap-2 text-sm text-accent font-semibold">
            <Check className="w-4 h-4 shrink-0" />
            Formule {formulePrefill}
            {totalPrefill && (
              <span className="ml-auto font-black text-base">
                {totalPrefill === "devis" ? "Sur devis" : `${totalPrefill} €`}
              </span>
            )}
          </div>
          {addonsList.length > 0 && (
            <ul className="space-y-1 pl-6">
              {addonsList.map((addon) => (
                <li key={addon} className="text-xs text-foreground/60 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-accent/50 shrink-0" />
                  {addon}
                </li>
              ))}
            </ul>
          )}
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
