import { barStockPresentation } from "@/media/bar-stock";

export type BarCategoryMedia = {
  categoryId: string;
  imageId: string;
  label: string;
};

const labels: Record<string, string> = {
  "bar-stock-beer": "Beer",
  "bar-stock-whiskey": "Whiskey",
  "bar-stock-clear-spirits": "Gin & Vodka",
  "bar-stock-agave-rum": "Tequila & Rum",
  "bar-stock-aperitivo": "Aperitivo & Liquor",
  "bar-stock-wine-glass": "Wines by the Glass",
  "bar-stock-wine-list": "Wine List",
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
