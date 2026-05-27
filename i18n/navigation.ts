import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Wrappers de next/link, useRouter, usePathname, redirect qui ajoutent
// automatiquement le préfixe de locale. À utiliser PARTOUT dans le projet
// à la place de "next/link" et "next/navigation" pour préserver la langue
// quand on navigue.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
