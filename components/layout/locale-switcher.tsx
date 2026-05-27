"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

// Bouton segmented FR | EN. Préserve le chemin courant et les query params
// au switch. Annonce le changement de langue aux lecteurs d'écran via aria-label.

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("localeSwitcher");

  const switchTo = (next: Locale) => {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-white/4 p-0.5 backdrop-blur-sm",
        className
      )}
      role="group"
      aria-label={t("label")}
    >
      {routing.locales.map((code) => {
        const isActive = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => switchTo(code)}
            aria-label={code === "fr" ? t("switchToFr") : t("switchToEn")}
            aria-pressed={isActive}
            className={cn(
              "min-w-[2rem] rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wider transition-all cursor-pointer",
              isActive
                ? "bg-white/12 text-white"
                : "text-white/50 hover:text-white hover:bg-white/6"
            )}
          >
            {t(code)}
          </button>
        );
      })}
    </div>
  );
}
