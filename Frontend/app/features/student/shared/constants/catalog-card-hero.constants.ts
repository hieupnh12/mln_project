export type CatalogCardHeroTheme = {
  badge: string;
  deco: string;
  hero: string;
  sparkle: string;
  subtitle: string;
  title: string;
  watermark: string;
};

const HERO_LIGHT_TEXT: Omit<CatalogCardHeroTheme, "hero"> = {
  badge: "border-white/35 bg-white/15 text-on-primary",
  title: "text-on-primary",
  subtitle: "text-on-primary/80",
  watermark: "text-on-primary/10",
  deco: "text-on-primary/12",
  sparkle: "text-on-primary/55",
};

/** Mười tổ hợp gradient sống động — token `catalog-*` + màu brand. */
export const CATALOG_CARD_HERO_THEMES: CatalogCardHeroTheme[] = [
  {
    hero: "bg-gradient-to-br from-catalog-cyan via-secondary to-primary-container",
    ...HERO_LIGHT_TEXT,
  },
  {
    hero: "bg-gradient-to-br from-catalog-sky via-catalog-cobalt to-catalog-indigo",
    ...HERO_LIGHT_TEXT,
  },
  {
    hero: "bg-gradient-to-br from-catalog-cobalt via-catalog-indigo to-primary",
    ...HERO_LIGHT_TEXT,
  },
  {
    hero: "bg-gradient-to-br from-catalog-magenta via-catalog-violet to-primary-container",
    ...HERO_LIGHT_TEXT,
    sparkle: "text-on-primary/65",
  },
  {
    hero: "bg-gradient-to-br from-catalog-coral via-landing-red to-landing-red-deep",
    ...HERO_LIGHT_TEXT,
  },
  {
    hero: "bg-gradient-to-br from-catalog-amber via-landing-gold to-landing-red",
    ...HERO_LIGHT_TEXT,
  },
  {
    hero: "bg-gradient-to-br from-secondary-fixed via-catalog-cyan to-catalog-cobalt",
    ...HERO_LIGHT_TEXT,
  },
  {
    hero: "bg-gradient-to-br from-catalog-indigo via-catalog-violet to-tertiary",
    ...HERO_LIGHT_TEXT,
    sparkle: "text-landing-gold/75",
  },
  {
    hero: "bg-gradient-to-br from-landing-gold via-catalog-coral to-landing-red-deep",
    ...HERO_LIGHT_TEXT,
  },
  {
    hero: "bg-gradient-to-br from-catalog-sky via-secondary to-catalog-violet",
    ...HERO_LIGHT_TEXT,
  },
];

function hashCatalogHeroSeed(seed: string | number): number {
  const text = String(seed);
  let hash = 0;

  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }

  return hash;
}

/** Chọn theme ổn định theo seed (id card) + index để màu đa dạng nhưng không đổi mỗi lần render. */
export function getCatalogCardHeroTheme(index: number, seed?: string | number): CatalogCardHeroTheme {
  const bucket =
    seed != null ? hashCatalogHeroSeed(seed) + index : index;

  return (
    CATALOG_CARD_HERO_THEMES[bucket % CATALOG_CARD_HERO_THEMES.length] ??
    CATALOG_CARD_HERO_THEMES[0]
  );
}
