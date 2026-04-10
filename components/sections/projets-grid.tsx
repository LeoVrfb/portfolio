"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Search, X } from "lucide-react";
import { projets, Projet } from "@/lib/projets";
import { cn } from "@/lib/utils";

// ─── helpers ───────────────────────────────────────────────────────────────

function getCardClasses(index: number) {
  if (index === 0) return "col-span-12 lg:col-span-8 aspect-video";
  if (index === 1) return "col-span-12 sm:col-span-6 lg:col-span-4 aspect-video";
  return "col-span-12 sm:col-span-6 lg:col-span-4 aspect-video";
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

const CONTEXT_LABEL: Record<Projet["contexte"], string> = {
  agence: "Agence",
  freelance: "Freelance",
  perso: "Perso",
};

const CONTEXT_STYLE: Record<Projet["contexte"], React.CSSProperties> = {
  agence:    { color: "var(--accent)",  borderColor: "rgba(162,226,208,0.5)",  background: "rgba(162,226,208,0.13)" },
  freelance: { color: "var(--mauve)",   borderColor: "rgba(199,142,204,0.55)", background: "rgba(199,142,204,0.14)" },
  perso:     { color: "#94a3b8",        borderColor: "rgba(148,163,184,0.35)", background: "rgba(148,163,184,0.1)"  },
};

function ProjectCard({ projet, index }: { projet: Projet; index: number }) {
  const hasImage = Boolean(projet.img);
  const isLarge = index === 0;

  return (
    <Link
      href={`/projets/${projet.slug}`}
      className={cn(
        "group relative overflow-hidden rounded-2xl cursor-pointer block",
        getCardClasses(index)
      )}
    >
      {/* Background */}
      {hasImage ? (
        <Image
          src={projet.img}
          alt={projet.titre}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes={
            index === 0
              ? "(max-width: 1024px) 100vw, 66vw"
              : "(max-width: 640px) 100vw, 33vw"
          }
        />
      ) : (
        <PlaceholderBg projet={projet} />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-zinc-950/95 via-zinc-950/40 to-transparent" />

      {/* Top row: context badge · enCours · arrow */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <span
          className="text-[10px] font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm uppercase tracking-wider"
          style={CONTEXT_STYLE[projet.contexte]}
        >
          {CONTEXT_LABEL[projet.contexte]}
        </span>
        <div className="flex items-center gap-2">
          {projet.enCours && (
            <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-zinc-800/80 backdrop-blur-sm border border-zinc-700/50 text-zinc-400 uppercase tracking-wider">
              En cours
            </span>
          )}
          <div className="w-8 h-8 rounded-full bg-zinc-800/80 backdrop-blur-sm border border-zinc-700/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowUpRight className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      </div>

      {/* Title block — slides up on hover */}
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
        <p className="text-xs text-white/80">{projet.titre}</p>
        <p className="text-[10px] text-white/45 mt-1 font-mono tracking-wider">{projet.date.slice(0, 4)}</p>
      </div>

      {/* Description — fades in at the bottom where the title was */}
      <div className="absolute bottom-5 left-5 right-5 opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
        <p className="text-sm text-zinc-300/80 leading-relaxed line-clamp-2">
          {projet.description}
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
      if (q && !p.client.toLowerCase().includes(q) && !p.titre.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [typeFilter, yearFilter, search]);

  const hasFilters = typeFilter || yearFilter || search.trim();

  return (
    <>
      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Search bar */}
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/35 pointer-events-none" />
          <input
            type="text"
            placeholder="Rechercher un projet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-8 py-2 rounded-lg border border-foreground/15 bg-foreground/5 text-sm text-foreground/80 placeholder:text-foreground/80 focus:outline-none focus:border-foreground/30 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground/35 hover:text-foreground/70 transition-colors cursor-pointer"
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
              Type
            </span>
            <FilterPills
              options={[
                { label: "Agence", value: "agence" },
                { label: "Freelance", value: "freelance" },
                { label: "Perso", value: "perso" },
              ]}
              value={typeFilter}
              onChange={setTypeFilter}
            />
          </div>

          <div className="hidden sm:block w-px h-4 bg-foreground/15" />

          {/* Année */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-foreground font-medium uppercase tracking-wider shrink-0">
              Année
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
              Tout afficher
            </button>
          )}
        </div>

        {/* Results count */}
        {hasFilters && (
          <p className="text-xs text-foreground/50">
            {filtered.length} projet{filtered.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-12 gap-3 sm:gap-4">
          {filtered.map((projet, index) => (
            <ProjectCard key={projet.slug} projet={projet} index={index} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-foreground/30 text-sm">Aucun projet pour ces filtres.</p>
          <button
            onClick={() => {
              setTypeFilter("");
              setYearFilter("");
            }}
            className="mt-3 text-xs text-accent hover:text-accent/70 transition-colors cursor-pointer underline underline-offset-2"
          >
            Réinitialiser
          </button>
        </div>
      )}
    </>
  );
}
