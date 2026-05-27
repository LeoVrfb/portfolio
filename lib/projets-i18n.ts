import type { Projet } from "./projets"

type ProjetsDataTranslator = {
  (key: string): string
  has: (key: string) => boolean
}

/**
 * Renvoie les champs textuels d'un projet pour les cartes/listes, en privilégiant
 * la traduction `projetsData.<slug>.<field>` quand elle existe, sinon retombe sur
 * la valeur FR de `lib/projets.ts`. Utiliser côté client après
 * `const tProjetsData = useTranslations("projetsData")`, ou côté server avec
 * `await getTranslations("projetsData")`.
 */
export function localizeProjetCard(
  projet: Projet,
  tProjetsData: ProjetsDataTranslator,
) {
  const titre = tProjetsData.has(`${projet.slug}.titre`)
    ? tProjetsData(`${projet.slug}.titre`)
    : projet.titre
  const description = tProjetsData.has(`${projet.slug}.description`)
    ? tProjetsData(`${projet.slug}.description`)
    : projet.description
  return { titre, description }
}
