import type { FocalPoint, StockMediaMetadata } from "./types";

export type BarStockSlotId =
  | "bar-stock-hero"
  | "bar-stock-beer"
  | "bar-stock-whiskey"
  | "bar-stock-clear-spirits"
  | "bar-stock-agave-rum"
  | "bar-stock-aperitivo"
  | "bar-stock-wine-glass"
  | "bar-stock-wine-list";

export type BarStockCandidate = StockMediaMetadata & {
  candidateId: string;
  slotId: BarStockSlotId;
  title: string;
  previewUrl: string;
  directDownloadUrl: string;
  role: "recommended" | "alternate-1" | "alternate-2";
  score: number;
  rationale: string;
  brandCheck: "none visible";
  peopleCheck: "none recognizable";
};

const pexels = (
  slotId: BarStockSlotId,
  assetId: string,
  title: string,
  photographer: string,
  role: BarStockCandidate["role"],
  score: number,
  rationale: string,
): BarStockCandidate => ({
  candidateId: `${slotId}-${role}`,
  slotId,
  provider: "pexels",
  assetId,
  sourcePageUrl: `https://www.pexels.com/photo/${assetId}/`,
  previewUrl: `https://images.pexels.com/photos/${assetId}/pexels-photo-${assetId}.jpeg?auto=compress&cs=tinysrgb&w=900`,
  directDownloadUrl: `https://images.pexels.com/photos/${assetId}/pexels-photo-${assetId}.jpeg`,
  photographer,
  photographerProfileUrl: null,
  title,
  licenseName: "Pexels License",
  licenseUrl: "https://www.pexels.com/license/",
  licenseCheckedAt: "2026-08-09",
  representation: "editorial-generic",
  role,
  score,
  rationale,
  brandCheck: "none visible",
  peopleCheck: "none recognizable",
});

export const barStockCandidates: BarStockCandidate[] = [
  pexels(
    "bar-stock-hero",
    "32912383",
    "Elegant cocktail with rosemary garnish at night",
    "jose luis Umana",
    "recommended",
    4.7,
    "Deep evening palette, botanical detail, and flexible negative space align with Sunlit Spice.",
  ),
  pexels(
    "bar-stock-hero",
    "33727405",
    "Classic cocktail on a dark wooden table",
    "Sertaç",
    "alternate-1",
    4.3,
    "Minimal amber composition with calm low-key lighting.",
  ),
  pexels(
    "bar-stock-hero",
    "27126836",
    "Cocktail with citrus and herbs on black",
    "Vitor Diniz",
    "alternate-2",
    4.2,
    "Strong dark-field composition with restrained warm garnish.",
  ),
  pexels(
    "bar-stock-beer",
    "15852347",
    "Beer poured into an unbranded glass",
    "Andrew Patrick Photo",
    "recommended",
    4.7,
    "Tight unbranded pour with controlled foam and no identifiable venue.",
  ),
  pexels(
    "bar-stock-beer",
    "19106394",
    "Close-up beer pour",
    "Andrew Patrick Photo",
    "alternate-1",
    4.5,
    "Clean dark background and strong category clarity.",
  ),
  pexels(
    "bar-stock-beer",
    "15138585",
    "Beer glass in a dim bar setting",
    "Alp Yıldızlar",
    "alternate-2",
    4.1,
    "Warm atmosphere and useful vertical crop without readable branding.",
  ),
  pexels(
    "bar-stock-whiskey",
    "10747957",
    "Amber spirit with ice on black",
    "Михаил Шорохов",
    "recommended",
    4.8,
    "Premium amber highlights, clean glass, and no visible bottle or label.",
  ),
  pexels(
    "bar-stock-whiskey",
    "19009806",
    "Cold glass with amber spirit",
    "Stepan Vrany",
    "alternate-1",
    4.4,
    "Textural glass detail and restrained contemporary styling.",
  ),
  pexels(
    "bar-stock-whiskey",
    "14590024",
    "Textured crystal glass with amber spirit",
    "Budget Bizar",
    "alternate-2",
    4.2,
    "Warm detail and neutral context without branded packaging.",
  ),
  pexels(
    "bar-stock-clear-spirits",
    "8084693",
    "Pale cocktail with herbs",
    "Ivan S",
    "recommended",
    4.7,
    "Elegant pale drink, botanical line, and quiet neutral background.",
  ),
  pexels(
    "bar-stock-clear-spirits",
    "32912396",
    "Cocktail with lime garnish",
    "jose luis Umana",
    "alternate-1",
    4.4,
    "Fresh citrus presentation with no branded vessel.",
  ),
  pexels(
    "bar-stock-clear-spirits",
    "5946766",
    "Clear cocktail with orange",
    "Charlotte May",
    "alternate-2",
    4.1,
    "Simple glass-led composition with gentle natural color.",
  ),
  pexels(
    "bar-stock-agave-rum",
    "32912396",
    "Pale cocktail with lime",
    "jose luis Umana",
    "recommended",
    4.5,
    "Contemporary pale-gold drink and restrained citrus, without party cues.",
  ),
  pexels(
    "bar-stock-agave-rum",
    "6479543",
    "Clear drinks with lime",
    "Tara Winstead",
    "alternate-1",
    4.0,
    "Category-relevant citrus and clear glassware; busier than the recommendation.",
  ),
  pexels(
    "bar-stock-agave-rum",
    "33727405",
    "Amber cocktail on dark wood",
    "Sertaç",
    "alternate-2",
    4.2,
    "Warm restrained composition suitable for a broad spirits category.",
  ),
  pexels(
    "bar-stock-aperitivo",
    "30770992",
    "Cocktail with orange-peel garnish",
    "Paolo Sbalzer",
    "recommended",
    4.8,
    "Refined red-orange drink, understated peel, and balanced dark setting.",
  ),
  pexels(
    "bar-stock-aperitivo",
    "11278007",
    "Orange drink in a vintage glass",
    "Marta Dzedyshko",
    "alternate-1",
    4.3,
    "Soft citrus tone and restrained still-life presentation.",
  ),
  pexels(
    "bar-stock-aperitivo",
    "35800323",
    "Orange drink against dark background",
    "Carlos Morocho",
    "alternate-2",
    4.2,
    "High category relevance with controlled studio contrast.",
  ),
  pexels(
    "bar-stock-wine-glass",
    "12861281",
    "Red wine poured against black",
    "iCliff Agendia",
    "recommended",
    4.8,
    "Label-free close-up with excellent crop flexibility and no visible face.",
  ),
  pexels(
    "bar-stock-wine-glass",
    "29436323",
    "Red wine pouring close-up",
    "Andrew Patrick Photo",
    "alternate-1",
    4.5,
    "Elegant pour detail with shallow depth and neutral context.",
  ),
  pexels(
    "bar-stock-wine-glass",
    "312080",
    "Red wine poured into crystal glass",
    "freestocks.org",
    "alternate-2",
    4.4,
    "Clean black background and strong generic category representation.",
  ),
  pexels(
    "bar-stock-wine-list",
    "31631254",
    "Wine bottles in a dim cellar",
    "Mediha Ekici",
    "recommended",
    4.6,
    "Moody bottle silhouettes and unreadable labels create a generic wine-list cue.",
  ),
  pexels(
    "bar-stock-wine-list",
    "27305292",
    "Rows of wine bottles in low light",
    "Valeria Boltneva",
    "alternate-1",
    4.3,
    "Warm cellar rhythm with no prominent readable label.",
  ),
  pexels(
    "bar-stock-wine-list",
    "35740712",
    "Stacked wine bottles in warm shadow",
    "Luca Bonesini",
    "alternate-2",
    4.2,
    "Graphic bottle pattern, warm highlights, and no identifiable venue.",
  ),
];

export const selectedBarStock = barStockCandidates.filter(
  (candidate) => candidate.role === "recommended",
);

export const barStockPresentation: Record<
  BarStockSlotId,
  {
    mediaId: string;
    output: string;
    alt: string;
    focalPoint: FocalPoint;
    categoryId: string | null;
  }
> = {
  "bar-stock-hero": {
    mediaId: "bar-stock-hero",
    output: "bar-hero.webp",
    alt: "Pale cocktail with lime and rosemary garnish in warm evening light.",
    focalPoint: { x: 0.44, y: 0.5 },
    categoryId: null,
  },
  "bar-stock-beer": {
    mediaId: "bar-stock-beer",
    output: "bar-beer.webp",
    alt: "Beer being poured into an unbranded glass.",
    focalPoint: { x: 0.48, y: 0.55 },
    categoryId: "bar-draft-beer",
  },
  "bar-stock-whiskey": {
    mediaId: "bar-stock-whiskey",
    output: "bar-whiskey.webp",
    alt: "Amber spirit served over ice in a rocks glass.",
    focalPoint: { x: 0.52, y: 0.55 },
    categoryId: "bar-whiskey",
  },
  "bar-stock-clear-spirits": {
    mediaId: "bar-stock-clear-spirits",
    output: "bar-clear-spirits.webp",
    alt: "Pale cocktail with a restrained botanical garnish.",
    focalPoint: { x: 0.55, y: 0.5 },
    categoryId: "bar-gin",
  },
  "bar-stock-agave-rum": {
    mediaId: "bar-stock-agave-rum",
    output: "bar-agave-rum.webp",
    alt: "Pale-gold cocktail with lime garnish.",
    focalPoint: { x: 0.5, y: 0.5 },
    categoryId: "bar-tequila",
  },
  "bar-stock-aperitivo": {
    mediaId: "bar-stock-aperitivo",
    output: "bar-aperitivo.webp",
    alt: "Red-orange aperitivo-style drink with citrus peel.",
    focalPoint: { x: 0.52, y: 0.48 },
    categoryId: "bar-aperitivo-amaro",
  },
  "bar-stock-wine-glass": {
    mediaId: "bar-stock-wine-glass",
    output: "bar-wine-glass.webp",
    alt: "Red wine being poured into a stemmed glass.",
    focalPoint: { x: 0.52, y: 0.5 },
    categoryId: "bar-wines-by-the-glass",
  },
  "bar-stock-wine-list": {
    mediaId: "bar-stock-wine-list",
    output: "bar-wine-list.webp",
    alt: "Rows of wine bottles resting in a dim cellar.",
    focalPoint: { x: 0.5, y: 0.5 },
    categoryId: "bar-bubbles",
  },
};
