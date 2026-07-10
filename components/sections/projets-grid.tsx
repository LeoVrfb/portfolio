"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { projets, Projet } from "@/lib/projets";
import { localizeProjetCard } from "@/lib/projets-i18n";
import { cn } from "@/lib/utils";

// ─── helpers ───────────────────────────────────────────────────────────────

type Tile = { projet: Projet; large: boolean; cls: string };

// Tuiles du bento (grille 12 colonnes, cartes en aspect-video).
// HERO : le 1er projet vitrine (le plus prioritaire, ex. BNP) domine en haut à gauche,
//        8 colonnes sur 2 rangées.
// FEATURE : les autres projets vitrine (Total, ADP) s'empilent à sa droite (4 col × 1),
//        remplissant exactement la bande 12×2 du haut, dans l'ordre de priorité.
// SMALL : les sites (freelance) en petit dessous, 4 par ligne en desktop.
const HERO = "col-span-12 lg:col-span-8 lg:row-span-2";
const FEATURE = "col-span-6 lg:col-span-4";
const SMALL = "col-span-6 lg:col-span-3";

// Mosaïque pilotée par l'importance du projet (champ `featured`) et son ordre de
// priorité dans `projets`, jamais par l'index brut. Le rendu utilise `grid-flow-dense`
// pour combler les trous (ex. quand un filtre ne laisse qu'un seul projet vitrine).
function buildMosaic(items: Projet[]): Tile[] {
  const featured = items.filter((p) => p.featured);
  const smalls = items.filter((p) => !p.featured);

  return [
    ...featured.map((projet, i) => ({
      projet,
      large: i === 0,
      cls: i === 0 ? HERO : FEATURE,
    })),
    ...smalls.map((projet) => ({ projet, large: false, cls: SMALL })),
  ];
}

// ─── PlaceholderBg ─────────────────────────────────────────────────────────

function PlaceholderBg({ projet }: { projet: Projet }) {
  if (projet.enCours) {
    return (
      <div className="absolute inset-0 bg-zinc-900">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg,rgba(255,255,255,.8) 0,rgba(255,255,255,.8) 1px,transparent 0,transparent 50%)",
            backgroundSize: "12px 12px",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-br from-zinc-800/60 to-transparent" />
      </div>
    );
  }
  if (projet.contexte === "agence") {
    return (
      <div className="absolute inset-0 bg-linear-to-br from-accent/20 via-zinc-900/80 to-zinc-950">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,.8) 1px,transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>
    );
  }
  return (
    <div className="absolute inset-0 bg-linear-to-br from-(--lavender)/15 via-zinc-900/80 to-zinc-950">
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,.8) 1px,transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
    </div>
  );
}

// ─── ProjectCard ───────────────────────────────────────────────────────────

const CONTEXT_STYLE: Record<Projet["contexte"], React.CSSProperties> = {
  agence: { color: "var(--accent)", borderColor: "rgba(162,226,208,0.5)", background: "rgba(162,226,208,0.13)" },
  freelance: { color: "var(--lavender)", borderColor: "rgba(156,220,254,0.5)", background: "rgba(156,220,254,0.13)" },
  perso: { color: "var(--gold)", borderColor: "rgba(220,196,84,0.45)", background: "rgba(220,196,84,0.12)" },
};

function ProjectCard({ projet, large, cls }: { projet: Projet; large: boolean; cls: string }) {
  const t = useTranslations("projets.grid");
  const tProjetsData = useTranslations("projetsData");
  const { titre, description } = localizeProjetCard(projet, tProjetsData);
  const hasImage = Boolean(projet.img);
  const isLarge = large;

  return (
    <Link
      href={`/projets/${projet.slug}`}
      className={cn(
        "group relative overflow-hidden rounded-2xl cursor-pointer block aspect-video",
        cls
      )}
    >
      {/* Background */}
      {hasImage ? (
        <Image
          src={projet.img}
          alt={titre}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes={
            large
              ? "(max-width: 1024px) 100vw, 66vw"
              : "(max-width: 640px) 100vw, 33vw"
          }
        />
      ) : (
        <PlaceholderBg projet={projet} />
      )}

      <div className="absolute inset-0 bg-linear-to-t from-zinc-950/95 via-zinc-950/40 to-transparent" />

      {/* Top row: context badge · enCours · arrow */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <span
          className="text-[10px] font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm uppercase tracking-wider"
          style={CONTEXT_STYLE[projet.contexte]}
        >
          {t(`context.${projet.contexte}`)}
        </span>
        <div className="flex items-center gap-2">
          {projet.enCours && (
            <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-zinc-800/80 backdrop-blur-sm border border-zinc-700/50 text-zinc-400 uppercase tracking-wider">
              {t("inProgress")}
            </span>
          )}
          <div className="w-8 h-8 rounded-full bg-zinc-800/80 backdrop-blur-sm border border-zinc-700/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowUpRight className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      </div>

      {/* Title block */}
      <div className="absolute bottom-5 left-5 right-5 transition-transform duration-300 ease-out group-hover:-translate-y-[56px]">
        <div className="flex items-center gap-2.5 mb-0.5">
          <h2
            className={cn(
              "font-black text-white leading-tight group-hover:text-accent transition-colors duration-300",
              isLarge ? "text-2xl sm:text-3xl" : "text-xl"
            )}
          >
            {projet.clientShort ?? projet.client}
          </h2>
          {projet.logo && (
            <div className="relative w-9 h-9 shrink-0 rounded-lg overflow-hidden bg-white p-1">
              <Image
                src={projet.logo}
                alt={`Logo ${projet.clientShort ?? projet.client}`}
                fill
                className="object-contain p-0.5"
                sizes="36px"
              />
            </div>
          )}
        </div>
        <p className="text-xs text-white/80">{titre}</p>
        <p className="text-[10px] text-white/55 mt-1 font-mono tracking-wider">{projet.date.slice(0, 4)}</p>
      </div>

      {/* Description */}
      <div className="absolute bottom-5 left-5 right-5 opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
        <p className="text-sm text-zinc-300/80 leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>
    </Link>
  );
}

// ─── FilterPills ───────────────────────────────────────────────────────────

function FilterPills({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value === value ? "" : opt.value)}
          className={cn(
            "text-xs px-3 py-1.5 rounded-full border transition-all duration-150 cursor-pointer",
            value === opt.value
              ? "border-accent/60 bg-accent/10 text-accent"
              : "border-foreground/20 text-foreground/90 hover:border-foreground/40"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── ProjetsGrid ───────────────────────────────────────────────────────────

export function ProjetsGrid() {
  const t = useTranslations("projets.grid");
  const tProjetsData = useTranslations("projetsData");
  const [typeFilter, setTypeFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [search, setSearch] = useState("");

  const yearOptions = useMemo(() => {
    const years = [...new Set(projets.map((p) => p.date.slice(0, 4)))]
      .sort((a, b) => b.localeCompare(a));
    return years.map((y) => ({ label: y, value: y }));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projets.filter((p) => {
      if (typeFilter && p.contexte !== typeFilter) return false;
      if (yearFilter && !p.date.startsWith(yearFilter)) return false;
      if (q) {
        const localizedTitre = localizeProjetCard(p, tProjetsData).titre;
        const haystack = `${p.client} ${p.titre} ${localizedTitre}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [typeFilter, yearFilter, search, tProjetsData]);

  const hasFilters = typeFilter || yearFilter || search.trim();

  return (
    <>
      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Search bar */}
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/55 pointer-events-none" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-8 py-2 rounded-lg border border-foreground/15 bg-foreground/5 text-sm text-foreground/80 placeholder:text-foreground/80 focus:outline-none focus:border-foreground/30 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground/55 hover:text-foreground/70 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Pills row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {/* Type */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-foreground font-medium uppercase tracking-wider shrink-0">
              {t("typeFilter")}
            </span>
            <FilterPills
              options={[
                { label: t("context.agence"), value: "agence" },
                { label: t("context.freelance"), value: "freelance" },
                { label: t("context.perso"), value: "perso" },
              ]}
              value={typeFilter}
              onChange={setTypeFilter}
            />
          </div>

          <div className="hidden sm:block w-px h-4 bg-foreground/15" />

          {/* Année */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-foreground font-medium uppercase tracking-wider shrink-0">
              {t("yearFilter")}
            </span>
            <FilterPills
              options={yearOptions}
              value={yearFilter}
              onChange={setYearFilter}
            />
          </div>

          {/* Reset */}
          {hasFilters && (
            <button
              onClick={() => {
                setTypeFilter("");
                setYearFilter("");
                setSearch("");
              }}
              className="text-xs text-foreground/50 hover:text-foreground/80 transition-colors cursor-pointer underline underline-offset-2"
            >
              {t("showAll")}
            </button>
          )}
        </div>

        {/* Results count */}
        {hasFilters && (
          <p className="text-xs text-foreground/50">
            {t("resultsCount", { count: filtered.length })}
          </p>
        )}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-12 gap-3 sm:gap-4 grid-flow-dense">
          {buildMosaic(filtered).map(({ projet, large, cls }) => (
            <ProjectCard key={projet.slug} projet={projet} large={large} cls={cls} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-foreground/30 text-sm">{t("noResults")}</p>
          <button
            onClick={() => {
              setTypeFilter("");
              setYearFilter("");
            }}
            className="mt-3 text-xs text-accent hover:text-accent/70 transition-colors cursor-pointer underline underline-offset-2"
          >
            {t("reset")}
          </button>
        </div>
      )}
    </>
  );
}
