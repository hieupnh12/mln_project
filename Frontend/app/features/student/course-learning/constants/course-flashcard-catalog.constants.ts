export function getFlashcardEstimatedMinutes(cardsCount: number) {
  return Math.max(1, Math.round((cardsCount * 20) / 60));
}

export const FLASHCARD_CATALOG_STYLE = {
  accent: "text-landing-red",
  cta:
    "border border-landing-red bg-landing-white text-landing-red transition hover:bg-landing-red/5",
  ctaDisabled: "border border-outline-variant/40 bg-landing-gray text-landing-text-soft",
  metaIcon: "text-landing-text-soft",
  starActive: "fill-landing-gold text-landing-gold",
  starInactive: "text-outline-variant/50",
} as const;
