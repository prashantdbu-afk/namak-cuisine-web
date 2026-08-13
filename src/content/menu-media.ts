import {
  foodProcessingConfig,
  type FoodMediaStatus,
  type FoodMediaStyle,
  type FoodMediaUse,
  type FoodBackgroundFamily,
} from "@/media/food-processing-config";
import type { PlateSystem, VisualCompliance } from "@/media/plating-audit";
import { getImageRecord } from "@/media/manifest";
import { menuItems } from "@/content/menu";

export type MenuImagePresentationTier =
  "curated" | "standardized-original" | "hold";

export type MenuMediaPlacement = {
  itemId: string;
  imageId: string;
  styleFamily: FoodMediaStyle;
  uses: FoodMediaUse[];
  status: FoodMediaStatus;
  featured: boolean;
  menuAspectRatio: number;
  backgroundFamily: FoodBackgroundFamily;
  targetPlateSystem: PlateSystem;
  visualCompliance: VisualCompliance;
  menuEligible: boolean;
  presentationTier: Exclude<MenuImagePresentationTier, "hold">;
};

const validMenuItemIds = new Set(menuItems.map((item) => item.id));

export function getMenuImagePresentationTier(record: {
  itemId: string | null;
  status: FoodMediaStatus;
  uses: FoodMediaUse[];
  visualCompliance: VisualCompliance;
}): MenuImagePresentationTier {
  if (
    record.itemId === null ||
    !validMenuItemIds.has(record.itemId) ||
    record.status !== "approved" ||
    !record.uses.includes("menu-feature")
  ) {
    return "hold";
  }

  return record.visualCompliance === "pass"
    ? "curated"
    : "standardized-original";
}

export const menuMediaPlacements: MenuMediaPlacement[] = foodProcessingConfig
  .filter(
    (record): record is typeof record & { itemId: string } =>
      record.itemId !== null && validMenuItemIds.has(record.itemId),
  )
  .map((record) => ({
    itemId: record.itemId,
    imageId: record.imageId,
    styleFamily: record.styleFamily,
    uses: record.uses,
    status: record.status,
    featured: record.featured,
    menuAspectRatio: record.menuAspectRatio,
    backgroundFamily: record.backgroundFamily,
    targetPlateSystem: record.targetPlateSystem,
    visualCompliance: record.visualCompliance,
    menuEligible: record.menuEligible,
    presentationTier:
      record.visualCompliance === "pass" ? "curated" : "standardized-original",
  }));

export const publicMenuMediaPlacements = menuMediaPlacements.filter(
  (placement) => {
    const media = getImageRecord(placement.imageId);
    return (
      placement.status === "approved" &&
      placement.uses.includes("menu-feature") &&
      media.rightsStatus === "approved" &&
      media.productionReady
    );
  },
);

export const homepageFoodFeatures = [
  { name: "Bhutte Ke Kebab", imageId: "food-bhutte-ke-kebab" },
  { name: "Buratta Bomb", imageId: "food-buratta-bomb" },
  { name: "Burrata Chaat", imageId: "food-burrata-chaat" },
  {
    name: "Classic Chicken Tikka",
    imageId: "food-classic-chicken-tikka",
  },
] as const;

export const homepageFoodImageIds = homepageFoodFeatures.map(
  (feature) => feature.imageId,
);

export const galleryImageIds = [
  "food-classic-chicken-tikka",
  "food-coconut-carrot-soup",
  "food-chur-chur-naan",
  "food-fish-moilee",
  "food-hyderabadi-chicken-dum-biryani",
  "food-papdi-chaat",
  "venue-main-outdoor",
  "food-saag-burrata",
] as const;
