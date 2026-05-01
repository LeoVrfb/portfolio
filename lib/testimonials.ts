// Témoignages clients affichés sur les pages des formules.
// Note : pour l'instant on affiche tous les témoignages sur toutes les formules.
// Si besoin un jour de filtrer par formule, ajouter un champ `formules?: string[]`.

export type Testimonial = {
  nom: string
  role: string // "Cleaning Service" / "Voix off" / etc.
  projet: string // nom du projet, ex: "Bald Art"
  avis: string
  note: 5 // toujours 5 étoiles pour l'instant
}

export const testimonials: Testimonial[] = [
  {
    nom: "Greg",
    role: "Artiste peintre",
    projet: "Bald Art",
    avis: "J'avais déjà testé Wix avant pour vendre mes tableaux. Léo a tout repris à zéro et fait un truc qui me ressemble vraiment. Mes clients me disent que le site donne envie d'acheter.",
    note: 5,
  },
  {
    nom: "Julia",
    role: "Professeure de russe",
    projet: "Cours de russe",
    avis: "Je cherchais un site simple pour présenter mes cours en ligne. Léo a compris exactement ce dont j'avais besoin et m'a livré en moins d'une semaine. Je recommande vivement.",
    note: 5,
  },
  {
    nom: "Hachim",
    role: "Gérant",
    projet: "Clean Services",
    avis: "Pour mon activité de nettoyage, j'avais besoin d'un site sérieux qui rassure les entreprises. Léo a fait un site clair et professionnel. Je reçois maintenant des demandes par le formulaire chaque semaine.",
    note: 5,
  },
  {
    nom: "Camille",
    role: "Voix off & narration",
    projet: "Camille Voice",
    avis: "Léo m'a fait un site élégant qui met vraiment en valeur mes démos audio. Le résultat est exactement ce que j'imaginais.",
    note: 5,
  },
  {
    nom: "Hugo",
    role: "Coach sportif",
    projet: "Hugo Coaching",
    avis: "Site livré dans les délais, design impeccable et hyper rapide. J'ai juste eu à fournir mes textes et photos, Léo s'est occupé de tout le reste.",
    note: 5,
  },
]
