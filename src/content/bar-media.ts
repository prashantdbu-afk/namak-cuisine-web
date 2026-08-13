import { barStockPresentation } from "@/media/bar-stock";

export type BarCategoryMedia = {
  categoryId: string;
  imageId: string;
  label: string;
};

const labels: Record<string, string> = {
  "bar-stock-draft-beer": "Draft Beer",
  "bar-stock-beer": "Beer",
  "bar-stock-whiskey": "Whiskey",
  "bar-stock-gin": "Gin",
  "bar-stock-vodka": "Vodka",
  "bar-stock-tequila": "Tequila",
  "bar-stock-rum": "Rum",
  "bar-stock-aperitivo-liquor": "Aperitivo / Liquor",
  "bar-stock-white-wine": "White Wine",
  "bar-stock-red-wine": "Red Wine",
  "bar-stock-sparkling-wine": "Sparkling Wine",
};

export const barCategoryMedia: BarCategoryMedia[] = Object.entries(
  barStockPresentation,
)
  .filter(
    ([id, presentation]) => id !== "bar-stock-hero" && presentation.categoryId,
  )
  .map(([imageId, presentation]) => ({
    categoryId: presentation.categoryId as string,
    imageId,
    label: labels[imageId],
  }));

export const barHeroImageId = "bar-stock-hero";
