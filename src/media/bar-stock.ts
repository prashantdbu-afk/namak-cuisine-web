import type { FocalPoint, StockMediaMetadata } from "./types";

export type BarStockSlotId =
  | "bar-stock-hero"
  | "bar-stock-draft-beer"
  | "bar-stock-beer"
  | "bar-stock-whiskey"
  | "bar-stock-gin"
  | "bar-stock-vodka"
  | "bar-stock-tequila"
  | "bar-stock-rum"
  | "bar-stock-aperitivo-liquor"
  | "bar-stock-white-wine"
  | "bar-stock-red-wine"
  | "bar-stock-sparkling-wine";

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

type CandidateSeed = {
  assetId: string;
  title: string;
  photographer: string;
  score: number;
  rationale: string;
};

const pexels = (
  slotId: BarStockSlotId,
  seed: CandidateSeed,
  role: BarStockCandidate["role"],
): BarStockCandidate => ({
  candidateId: `${slotId}-${role}`,
  slotId,
  provider: "pexels",
  assetId: seed.assetId,
  sourcePageUrl: `https://www.pexels.com/photo/${seed.assetId}/`,
  previewUrl: `https://images.pexels.com/photos/${seed.assetId}/pexels-photo-${seed.assetId}.jpeg?auto=compress&cs=tinysrgb&w=900`,
  directDownloadUrl: `https://images.pexels.com/photos/${seed.assetId}/pexels-photo-${seed.assetId}.jpeg`,
  photographer: seed.photographer,
  photographerProfileUrl: null,
  title: seed.title,
  licenseName: "Pexels License",
  licenseUrl: "https://www.pexels.com/license/",
  licenseCheckedAt: "2026-08-09",
  representation: "editorial-generic",
  role,
  score: seed.score,
  rationale: seed.rationale,
  brandCheck: "none visible",
  peopleCheck: "none recognizable",
});

const candidateSet = (
  slotId: BarStockSlotId,
  recommended: CandidateSeed,
  alternate1: CandidateSeed,
  alternate2: CandidateSeed,
) => [
  pexels(slotId, recommended, "recommended"),
  pexels(slotId, alternate1, "alternate-1"),
  pexels(slotId, alternate2, "alternate-2"),
];

const warmDark =
  "Low-key editorial lighting, clean glassware, warm highlights, and no visible brand or venue.";
const paleDark =
  "Pale drink, restrained garnish, shallow focus, and a dark neutral background suit the shared series.";
const wineDark =
  "Label-free glass study with a dark field, controlled highlights, and premium crop flexibility.";

export const barStockCandidates: BarStockCandidate[] = [
  ...candidateSet(
    "bar-stock-hero",
    {
      assetId: "32912383",
      title: "Elegant cocktail with rosemary garnish at night",
      photographer: "jose luis Umana",
      score: 4.8,
      rationale: paleDark,
    },
    {
      assetId: "33727405",
      title: "Classic cocktail on a dark wooden table",
      photographer: "Sertaç",
      score: 4.4,
      rationale: warmDark,
    },
    {
      assetId: "27126836",
      title: "Cocktail with citrus and herbs on black",
      photographer: "Vitor Diniz",
      score: 4.3,
      rationale: warmDark,
    },
  ),
  ...candidateSet(
    "bar-stock-draft-beer",
    {
      assetId: "15852347",
      title: "Beer poured into an unbranded glass",
      photographer: "Andrew Patrick Photo",
      score: 4.9,
      rationale: warmDark,
    },
    {
      assetId: "13027755",
      title: "Golden beer pour against black",
      photographer: "Andrew Patrick Photo",
      score: 4.6,
      rationale: warmDark,
    },
    {
      assetId: "13027759",
      title: "Close-up beer pour with foam",
      photographer: "Andrew Patrick Photo",
      score: 4.4,
      rationale: warmDark,
    },
  ),
  ...candidateSet(
    "bar-stock-beer",
    {
      assetId: "5659578",
      title: "Dark ale with a frothy head",
      photographer: "Eva Bronzini",
      score: 4.8,
      rationale: warmDark,
    },
    {
      assetId: "15991209",
      title: "Frothy beer against a dark background",
      photographer: "Andrew Patrick Photo",
      score: 4.5,
      rationale: warmDark,
    },
    {
      assetId: "12946715",
      title: "Beer glass close-up on dark",
      photographer: "Vinícius Caricatte",
      score: 4.3,
      rationale: warmDark,
    },
  ),
  ...candidateSet(
    "bar-stock-whiskey",
    {
      assetId: "10747957",
      title: "Amber spirit with ice on black",
      photographer: "Михаил Шорохов",
      score: 4.9,
      rationale: warmDark,
    },
    {
      assetId: "19009806",
      title: "Cold glass with amber spirit",
      photographer: "Stepan Vrany",
      score: 4.5,
      rationale: warmDark,
    },
    {
      assetId: "14590024",
      title: "Textured crystal glass with amber spirit",
      photographer: "Budget Bizar",
      score: 4.3,
      rationale: warmDark,
    },
  ),
  ...candidateSet(
    "bar-stock-gin",
    {
      assetId: "8084693",
      title: "Pale cocktail with herbs",
      photographer: "Ivan S",
      score: 4.8,
      rationale: paleDark,
    },
    {
      assetId: "7376780",
      title: "Gin and tonic with cucumber",
      photographer: "Arina Krasnikova",
      score: 4.4,
      rationale: paleDark,
    },
    {
      assetId: "7259040",
      title: "Botanical highball on black",
      photographer: "Aram Diseño",
      score: 4.2,
      rationale: paleDark,
    },
  ),
  ...candidateSet(
    "bar-stock-vodka",
    {
      assetId: "14537769",
      title: "Clear cocktail with lemon and herbs",
      photographer: "AHMED AQEELY",
      score: 4.8,
      rationale: paleDark,
    },
    {
      assetId: "5946766",
      title: "Clear cocktail with orange",
      photographer: "Charlotte May",
      score: 4.3,
      rationale: paleDark,
    },
    {
      assetId: "28617307",
      title: "Chilled citrus cocktail on dark",
      photographer: "pedro furtado",
      score: 4.2,
      rationale: paleDark,
    },
  ),
  ...candidateSet(
    "bar-stock-tequila",
    {
      assetId: "32912396",
      title: "Pale cocktail with lime",
      photographer: "jose luis Umana",
      score: 4.8,
      rationale: paleDark,
    },
    {
      assetId: "28902894",
      title: "Citrus cocktail with lime splash",
      photographer: "pedro furtado",
      score: 4.4,
      rationale: paleDark,
    },
    {
      assetId: "36593622",
      title: "Crushed-ice cocktail with lime",
      photographer: "Mohamed Olwy",
      score: 4.2,
      rationale: paleDark,
    },
  ),
  ...candidateSet(
    "bar-stock-rum",
    {
      assetId: "16806420",
      title: "Amber cocktail in crystal on black",
      photographer: "Blue Arauz",
      score: 4.8,
      rationale: warmDark,
    },
    {
      assetId: "33727405",
      title: "Amber cocktail on dark wood",
      photographer: "Sertaç",
      score: 4.4,
      rationale: warmDark,
    },
    {
      assetId: "14590024",
      title: "Amber spirit in textured crystal",
      photographer: "Budget Bizar",
      score: 4.2,
      rationale: warmDark,
    },
  ),
  ...candidateSet(
    "bar-stock-aperitivo-liquor",
    {
      assetId: "30770992",
      title: "Red-orange drink with citrus peel",
      photographer: "Paolo Sbalzer",
      score: 4.9,
      rationale: warmDark,
    },
    {
      assetId: "11278007",
      title: "Orange drink in a vintage glass",
      photographer: "Marta Dzedyshko",
      score: 4.4,
      rationale: warmDark,
    },
    {
      assetId: "35800323",
      title: "Orange drink against a dark background",
      photographer: "Carlos Morocho",
      score: 4.3,
      rationale: warmDark,
    },
  ),
  ...candidateSet(
    "bar-stock-white-wine",
    {
      assetId: "9523151",
      title: "White wine poured against black",
      photographer: "Сослан",
      score: 4.9,
      rationale: wineDark,
    },
    {
      assetId: "8775386",
      title: "White wine tasting in candlelight",
      photographer: "Pavel Danilyuk",
      score: 4.4,
      rationale: wineDark,
    },
    {
      assetId: "10508264",
      title: "White wine poured in a minimal setting",
      photographer: "Ron Lach",
      score: 4.2,
      rationale: wineDark,
    },
  ),
  ...candidateSet(
    "bar-stock-red-wine",
    {
      assetId: "12861281",
      title: "Red wine poured against black",
      photographer: "iCliff Agendia",
      score: 4.9,
      rationale: wineDark,
    },
    {
      assetId: "29436323",
      title: "Red wine pouring close-up",
      photographer: "Andrew Patrick Photo",
      score: 4.6,
      rationale: wineDark,
    },
    {
      assetId: "312080",
      title: "Red wine poured into crystal",
      photographer: "freestocks.org",
      score: 4.4,
      rationale: wineDark,
    },
  ),
  ...candidateSet(
    "bar-stock-sparkling-wine",
    {
      assetId: "30002077",
      title: "Sparkling wine glass with warm bokeh",
      photographer: "Mohammad Hammad",
      score: 4.8,
      rationale: wineDark,
    },
    {
      assetId: "14756646",
      title: "Champagne glasses in a dark room",
      photographer: "Shubham Kumar",
      score: 4.3,
      rationale: wineDark,
    },
    {
      assetId: "36087550",
      title: "Champagne flute on black",
      photographer: "Yunuen Zempoaltecatl",
      score: 4.1,
      rationale: wineDark,
    },
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
  "bar-stock-draft-beer": {
    mediaId: "bar-stock-draft-beer",
    output: "bar-draft-beer.webp",
    alt: "Beer being poured into an unbranded glass against a dark background.",
    focalPoint: { x: 0.48, y: 0.55 },
    categoryId: "bar-draft-beer",
  },
  "bar-stock-beer": {
    mediaId: "bar-stock-beer",
    output: "bar-beer.webp",
    alt: "Dark ale with a soft frothy head against a charcoal background.",
    focalPoint: { x: 0.5, y: 0.5 },
    categoryId: "bar-indian-beers",
  },
  "bar-stock-whiskey": {
    mediaId: "bar-stock-whiskey",
    output: "bar-whiskey.webp",
    alt: "Amber spirit served over ice in a rocks glass.",
    focalPoint: { x: 0.52, y: 0.55 },
    categoryId: "bar-whiskey",
  },
  "bar-stock-gin": {
    mediaId: "bar-stock-gin",
    output: "bar-gin.webp",
    alt: "Pale botanical cocktail with a restrained herb garnish.",
    focalPoint: { x: 0.72, y: 0.34 },
    categoryId: "bar-gin",
  },
  "bar-stock-vodka": {
    mediaId: "bar-stock-vodka",
    output: "bar-vodka.webp",
    alt: "Clear cocktail with lemon and herbs on a dark background.",
    focalPoint: { x: 0.5, y: 0.5 },
    categoryId: "bar-vodka",
  },
  "bar-stock-tequila": {
    mediaId: "bar-stock-tequila",
    output: "bar-tequila.webp",
    alt: "Pale-gold cocktail with lime in warm evening light.",
    focalPoint: { x: 0.5, y: 0.5 },
    categoryId: "bar-tequila",
  },
  "bar-stock-rum": {
    mediaId: "bar-stock-rum",
    output: "bar-rum.webp",
    alt: "Amber cocktail in a crystal glass against black.",
    focalPoint: { x: 0.5, y: 0.5 },
    categoryId: "bar-rum",
  },
  "bar-stock-aperitivo-liquor": {
    mediaId: "bar-stock-aperitivo-liquor",
    output: "bar-aperitivo-liquor.webp",
    alt: "Red-orange aperitivo-style drink with citrus peel.",
    focalPoint: { x: 0.52, y: 0.36 },
    categoryId: "bar-aperitivo-amaro",
  },
  "bar-stock-white-wine": {
    mediaId: "bar-stock-white-wine",
    output: "bar-white-wine.webp",
    alt: "White wine being poured into a stemmed glass against black.",
    focalPoint: { x: 0.52, y: 0.5 },
    categoryId: "bar-white",
  },
  "bar-stock-red-wine": {
    mediaId: "bar-stock-red-wine",
    output: "bar-red-wine.webp",
    alt: "Red wine being poured into a stemmed glass against black.",
    focalPoint: { x: 0.52, y: 0.5 },
    categoryId: "bar-red",
  },
  "bar-stock-sparkling-wine": {
    mediaId: "bar-stock-sparkling-wine",
    output: "bar-sparkling-wine.webp",
    alt: "Sparkling wine in a stemmed glass with warm evening bokeh.",
    focalPoint: { x: 0.5, y: 0.3 },
    categoryId: "bar-bubbles",
  },
};
