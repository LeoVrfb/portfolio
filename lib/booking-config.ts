// Configuration centrale du booking (slots, fuseau, fenêtre de réservation).
// Tout est ici : si tu veux changer les horaires, c'est ce fichier que tu touches.

export const BOOKING_CONFIG = {
  // Fuseau de référence pour l'affichage des slots côté visiteur.
  // Toutes les dates renvoyées au front sont calculées dans ce fuseau.
  timezone: "Europe/Paris",

  // Durée d'un créneau en minutes.
  slotDurationMin: 15,

  // Jours travaillés. 0 = dimanche, 1 = lundi, ..., 6 = samedi.
  // Lun-Ven uniquement.
  workingDays: [1, 2, 3, 4, 5] as const,

  // Plage horaire travaillée (heure locale Europe/Paris).
  // Format "HH:mm". Le dernier slot commence à end - slotDurationMin.
  workingHours: {
    start: "12:00",
    end: "20:00",
  },

  // Combien de jours dans le futur on autorise la réservation.
  bookingWindowDays: 30,

  // Préavis minimum (en minutes) entre maintenant et le 1er slot dispo.
  // Évite qu'un visiteur réserve un créneau dans 5 minutes.
  minNoticeMin: 60,
} as const

export type BookingConfig = typeof BOOKING_CONFIG
