import {
  foodProcessingConfig,
  type FoodMediaStatus,
  type FoodMediaStyle,
  type FoodMediaUse,
} from "@/media/food-processing-config";

export type MenuMediaPlacement = {
  itemId: string;
  imageId: string;
  styleFamily: FoodMediaStyle;
  uses: FoodMediaUse[];
  status: FoodMediaStatus;
  featured: boolean;
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
  }));

const publicMenuImageIds = new Set([
  "food-bharwan-paneer-tikka",
  "food-buratta-bomb",
  "food-coconut-carrot-soup",
  "food-classic-chicken-tikka",
  "food-tandoori-masaledar-lamb-chops",
  "food-hyderabadi-chicken-dum-biryani",
  "food-chur-chur-naan",
  "food-fish-moilee",
  "food-butter-chicken",
  "food-dal-makhani",
  "food-malai-kofta",
  "food-papdi-chaat",
  "food-tandoori-salmon",
  "food-paneer-tikka-masala",
  "food-punjabi-samosa",
  "food-samosa-chaat",
]);

export const publicMenuMediaPlacements = menuMediaPlacements.filter(
  (record) =>
    record.status === "approved" && publicMenuImageIds.has(record.imageId),
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
