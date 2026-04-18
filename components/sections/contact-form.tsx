"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Send, Check, ArrowLeft, AlertCircle } from "lucide-react";
import { services, type Addon } from "@/lib/services";

type FormData = {
  nom: string;
  email: string;
  telephone: string;
  activite: string;
  formule: string;
  message: string;
};

type SubChoices = Record<string, Record<string, string>>;

const formulesOptions = [
  { value: "", label: "Quelle formule vous intéresse ?" },
  ...services.map((s) => ({ value: s.nom, label: `${s.nom} · ${s.prixBase} €` })),
  { value: "autre", label: "Je ne sais pas encore" },
];

function buildBackUrl(slug: string, addonIdsRaw: string, subOptionsRaw: string): string {
  if (!slug) return "/services";
  const params = new URLSearchParams();
  if (addonIdsRaw) params.set("addonIds", addonIdsRaw);
  if (subOptionsRaw) params.set("subOptions", subOptionsRaw);
  const qs = params.toString();
  return qs ? `/services/${slug}?${qs}` : `/services/${slug}`;
}

export function ContactBackLink() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? "";
  const formulePrefill = searchParams.get("formule") ?? "";
  const addonIds = searchParams.get("addonIds") ?? "";
  const subOptions = searchParams.get("subOptions") ?? "";
  const fromConfigurator = !!formulePrefill && !!slug;

  if (!fromConfigurator) return null;

  return (
    <Link
      href={buildBackUrl(slug, addonIds, subOptions)}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/65 hover:text-white transition-colors cursor-pointer mb-6 underline-offset-4 hover:underline"
    >
      <ArrowLeft className="w-3.5 h-3.5" />
      Retour à la configuration
    </Link>
  );
}

function parseSubChoicesFromUrl(raw: string): SubChoices {
  const result: SubChoices = {};
  if (!raw) return result;
  raw.split(",").filter(Boolean).forEach((entry) => {
    const [key, value] = entry.split(":");
    const [addonId, subId] = key?.split(".") ?? [];
    if (addonId && subId && value) {
      if (!result[addonId]) result[addonId] = {};
      result[addonId][subId] = value;
    }
  });
  return result;
}

function computeAddonPricing(addon: Addon, choices: Record<string, string> | undefined): { prix: number; isDevis: boolean } {
  if (addon.prix === null) return { prix: 0, isDevis: true };
  let total = addon.prix;
  let isDevis = false;
  if (addon.subOptions) {
    for (const sub of addon.subOptions) {
      const choiceId = choices?.[sub.id];
      if (!choiceId) continue;
      const choice = sub.choices.find((c) => c.id === choiceId);
      if (!choice) continue;
      if (choice.prixDelta === null) {
        isDevis = true;
      } else {
        total += choice.prixDelta;
      }
    }
  }
  return { prix: total, isDevis };
}

function isAddonIncomplete(addon: Addon, choices: Record<string, string> | undefined): boolean {
  if (!addon.subOptions) return false;
  return addon.subOptions.some((sub) => sub.required && !choices?.[sub.id]);
}

function getAddonChoicesSummary(addon: Addon, choices: Record<string, string> | undefined): string {
  if (!addon.subOptions || !choices) return "";
  const parts: string[] = [];
  for (const sub of addon.subOptions) {
    const choiceId = choices[sub.id];
    if (!choiceId) continue;
    const choice = sub.choices.find((c) => c.id === choiceId);
    if (choice) parts.push(choice.label);
  }
  return parts.join(" · ");
}

export function ContactForm() {
  const searchParams = useSearchParams();
  const formulePrefill = searchParams.get("formule") ?? "";
  const slugPrefill = searchParams.get("slug") ?? "";
  const totalPrefill = searchParams.get("total") ?? "";
  const addonIdsPrefill = searchParams.get("addonIds") ?? "";
  const subOptionsPrefill = searchParams.get("subOptions") ?? "";
  const fromConfigurator = !!formulePrefill && !!slugPrefill;

  const service = useMemo(() => services.find((s) => s.slug === slugPrefill), [slugPrefill]);

  // Sélection figée : la modification se fait depuis le configurateur, pas ici.
  const selectedAddonIds = useMemo(
    () => new Set(addonIdsPrefill.split(",").filter(Boolean)),
    [addonIdsPrefill]
  );
  const subChoices: SubChoices = useMemo(
    () => parseSubChoicesFromUrl(subOptionsPrefill),
    [subOptionsPrefill]
  );

  const selectedAddonObjects = useMemo(() => {
    if (!service) return [];
    return Array.from(selectedAddonIds)
      .map((id) => service.addons.find((a) => a.id === id))
      .filter((a): a is Addon => !!a);
  }, [service, selectedAddonIds]);

  // Calcul dynamique du total avec sub-options
  const { total, hasDevis } = useMemo(() => {
    if (!service) return { total: null as number | null, hasDevis: false };
    let t = service.prixBase;
    let devis = false;
    for (const addon of selectedAddonObjects) {
      const { prix, isDevis } = computeAddonPricing(addon, subChoices[addon.id]);
      t += prix;
      if (isDevis) devis = true;
    }
    return { total: t, hasDevis: devis };
  }, [service, selectedAddonObjects, subChoices]);

  const incompleteAddonIds = useMemo(
    () =>
      new Set(
        selectedAddonObjects
          .filter((addon) => isAddonIncomplete(addon, subChoices[addon.id]))
          .map((a) => a.id)
      ),
    [selectedAddonObjects, subChoices]
  );

  const backUrl = useMemo(() => {
    return buildBackUrl(slugPrefill, addonIdsPrefill, subOptionsPrefill);
  }, [slugPrefill, addonIdsPrefill, subOptionsPrefill]);

  const [data, setData] = useState<FormData>({
    nom: "",
    email: "",
    telephone: "",
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
  const hasIncompleteAddon = incompleteAddonIds.size > 0;
  const canSubmit = isValid && !isPending && !hasIncompleteAddon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || hasIncompleteAddon) return;

    const totalEstime = hasDevis
      ? `${total ?? ""}€+`
      : total
        ? `${total} €`
        : totalPrefill
          ? `${totalPrefill} €`
          : undefined;

    // Liste lisible des addons avec leurs sous-choix
    const addonsLabels = selectedAddonObjects.map((a) => {
      const summary = getAddonChoicesSummary(a, subChoices[a.id]);
      return summary ? `${a.label} (${summary})` : a.label;
    });

    setIsPending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          addons: addonsLabels,
          totalEstime,
        }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Message envoyé ! Je vous réponds sous 24h.");
        setData({ nom: "", email: "", telephone: "", activite: "", formule: "", message: "" });
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
      {/* Récap lecture seule quand on vient du configurateur */}
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
                {hasDevis ? `${total} €+` : `${total} €`}
              </p>
              <p className="text-[10px] text-white/40">Devis estimé</p>
            </div>
          </div>

          {/* Liste lecture seule : options sélectionnées OU base de la formule */}
          {selectedAddonObjects.length > 0 ? (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50 mb-2">
                Options sélectionnées ({selectedAddonObjects.length})
              </p>
              <div className="space-y-1">
                {selectedAddonObjects.map((addon) => {
                  const summary = getAddonChoicesSummary(addon, subChoices[addon.id]);
                  const { prix, isDevis } = computeAddonPricing(addon, subChoices[addon.id]);
                  const priceLabel = addon.prix === null
                    ? "Devis"
                    : isDevis
                      ? `${prix} €+`
                      : `+${prix} €`;
                  return (
                    <div
                      key={addon.id}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border border-accent/30 bg-accent/6"
                    >
                      <Check className="w-3.5 h-3.5 text-accent shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs block text-white">{addon.label}</span>
                        {summary && (
                          <span className="text-[10px] text-white/55 block mt-0.5">{summary}</span>
                        )}
                      </div>
                      <span className="text-xs font-bold shrink-0 text-accent">{priceLabel}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50 mb-2">
                Inclus dans la formule ({service.inclus.length})
              </p>
              <ul className="space-y-1.5">
                {service.inclus.map((item) => (
                  <li key={item.titre} className="flex items-start gap-2 text-xs text-white/85">
                    <Check className="w-3 h-3 text-accent shrink-0 mt-0.5" />
                    <span>{item.titre}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Note storytelling */}
          <div className="border-t border-white/6 pt-3">
            <p className="text-xs text-white/65 leading-relaxed">
              <span className="text-white/85 font-medium">Vous voulez ajuster votre sélection ?</span>{" "}
              Repassez par la configuration pour ajouter ou retirer des options. Le devis final sera ajusté lors de notre échange.
            </p>
          </div>
        </div>
      )}

      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-[0.2em] mb-2 block">Nom et prénom *</label>
        <input
          type="text"
          placeholder="Votre nom et prénom"
          value={data.nom}
          onChange={(e) => setData((d) => ({ ...d, nom: e.target.value }))}
          required
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        <div>
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-[0.2em] mb-2 block">
            Téléphone <span className="text-white/40 normal-case tracking-normal">(facultatif)</span>
          </label>
          <input
            type="tel"
            placeholder="06 12 34 56 78"
            value={data.telephone}
            onChange={(e) => setData((d) => ({ ...d, telephone: e.target.value }))}
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

      {hasIncompleteAddon && fromConfigurator && (
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-red-400/10 border border-red-400/30 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Une option a besoin d'être configurée.{" "}
            <Link href={backUrl} className="underline font-semibold hover:text-red-200">
              Retour à la configuration
            </Link>{" "}
            pour terminer la sélection.
          </span>
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-accent text-black text-sm font-bold rounded-xl hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
      >
        {isPending ? "Envoi en cours…" : "Envoyer ma demande"}
        {!isPending && <Send size={14} />}
      </button>

      <p className="text-xs text-white/55 text-center">
        Je réponds sous 24h, souvent moins.
      </p>
    </form>
  );
}
