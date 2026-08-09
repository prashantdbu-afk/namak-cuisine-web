import {
  foodProcessingConfig,
  type FoodMediaStatus,
  type FoodMediaStyle,
  type FoodMediaUse,
  type FoodBackgroundFamily,
} from "@/media/food-processing-config";
import { getImageRecord } from "@/media/manifest";

export type MenuMediaPlacement = {
  itemId: string;
  imageId: string;
  styleFamily: FoodMediaStyle;
  uses: FoodMediaUse[];
  status: FoodMediaStatus;
  featured: boolean;
  menuAspectRatio: number;
  backgroundFamily: FoodBackgroundFamily;
};

export const menuMediaPlacements: MenuMediaPlacement[] = foodProcessingConfig
  .filter(
    (record): record is typeof record & { itemId: string } =>
      record.itemId !== null,
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

export const homepageFoodImageIds = [
  "food-hyderabadi-chicken-dum-biryani",
  "food-bharwan-paneer-tikka",
  "food-tandoori-masaledar-lamb-chops",
] as const;

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
