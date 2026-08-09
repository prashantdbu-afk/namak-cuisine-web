export type FoodMediaStyle = "ivory-plate" | "indian-vessel" | "bread-basket";
export type FoodMediaUse =
  | "homepage-hero"
  | "homepage-signature"
  | "category-feature"
  | "menu-feature"
  | "gallery"
  | "gallery-only";
export type FoodMediaStatus = "approved" | "review" | "hold" | "reshoot";
export type FoodBackgroundFamily = "warm-neutral" | "cool-stone" | "warm-oat";
export type FoodCrop = {
  left: number;
  top: number;
  width: number;
  height: number;
} | null;

export type FoodProcessingRecord = {
  sourceFilename: string;
  imageId: string;
  itemId: string | null;
  publicName: string;
  category: string;
  styleFamily: FoodMediaStyle;
  uses: FoodMediaUse[];
  status: FoodMediaStatus;
  featured: boolean;
  qualityScore: 1 | 2 | 3 | 4 | 5;
  alt: string;
  focalPoint: { x: number; y: number };
  menuFocalPoint: { x: number; y: number };
  editorialFocalPoint: { x: number; y: number };
  brightness: number;
  saturation: number;
  contrast: number;
  gamma: number;
  sharpenSigma: number;
  crop: FoodCrop;
  backgroundFamily: FoodBackgroundFamily;
  menuAspectRatio: number;
  enhancementNotes: string;
  allowDuplicateImage?: boolean;
  outputQuality: number;
  notes: string;
};

const approved = (
  sourceFilename: string,
  imageId: string,
  itemId: string | null,
  publicName: string,
  category: string,
  styleFamily: FoodMediaStyle,
  uses: FoodMediaUse[],
  alt: string,
  options: Partial<
    Pick<
      FoodProcessingRecord,
      | "featured"
      | "qualityScore"
      | "notes"
      | "focalPoint"
      | "menuFocalPoint"
      | "editorialFocalPoint"
      | "brightness"
      | "saturation"
      | "contrast"
      | "gamma"
      | "sharpenSigma"
      | "crop"
      | "backgroundFamily"
      | "menuAspectRatio"
      | "enhancementNotes"
      | "allowDuplicateImage"
    >
  > = {},
): FoodProcessingRecord => {
  const seed = [...imageId].reduce(
    (sum, character) => sum + character.charCodeAt(0),
    0,
  );
  const tuning = {
    brightness: 1.018 + (seed % 6) * 0.006,
    saturation: 1.018 + (seed % 5) * 0.009,
    contrast: 1.018 + (seed % 4) * 0.01,
    gamma: 0.98 + (seed % 4) * 0.01,
    sharpenSigma: 0.48 + (seed % 5) * 0.07,
  };

  return {
    sourceFilename,
    imageId,
    itemId,
    publicName,
    category,
    styleFamily,
    uses,
    status: "approved",
    featured: options.featured ?? false,
    qualityScore: options.qualityScore ?? 4,
    alt,
    focalPoint: options.focalPoint ?? { x: 0.5, y: 0.5 },
    menuFocalPoint: options.menuFocalPoint ??
      options.focalPoint ?? { x: 0.5, y: 0.5 },
    editorialFocalPoint: options.editorialFocalPoint ??
      options.focalPoint ?? { x: 0.5, y: 0.5 },
    brightness: options.brightness ?? tuning.brightness,
    saturation: options.saturation ?? tuning.saturation,
    contrast: options.contrast ?? tuning.contrast,
    gamma: options.gamma ?? tuning.gamma,
    sharpenSigma: options.sharpenSigma ?? tuning.sharpenSigma,
    crop: options.crop ?? null,
    backgroundFamily:
      options.backgroundFamily ??
      (styleFamily === "bread-basket"
        ? "warm-oat"
        : styleFamily === "indian-vessel"
          ? "cool-stone"
          : "warm-neutral"),
    menuAspectRatio: options.menuAspectRatio ?? 5 / 3,
    enhancementNotes:
      options.enhancementNotes ??
      "Gentle luminance, contrast, saturation, and texture correction reviewed for this source.",
    allowDuplicateImage: options.allowDuplicateImage,
    outputQuality: 82,
    notes:
      options.notes ?? "Production ready after restrained web preparation.",
  };
};

const notPublic = (
  sourceFilename: string,
  imageId: string,
  itemId: string | null,
  publicName: string,
  category: string,
  styleFamily: FoodMediaStyle,
  status: "review" | "hold" | "reshoot",
  notes: string,
): FoodProcessingRecord => ({
  sourceFilename,
  imageId,
  itemId,
  publicName,
  category,
  styleFamily,
  uses: ["gallery-only"],
  status,
  featured: false,
  qualityScore: status === "review" ? 3 : 2,
  alt: "",
  focalPoint: { x: 0.5, y: 0.5 },
  menuFocalPoint: { x: 0.5, y: 0.5 },
  editorialFocalPoint: { x: 0.5, y: 0.5 },
  brightness: 1,
  saturation: 1,
  contrast: 1,
  gamma: 1,
  sharpenSigma: 0.4,
  crop: null,
  backgroundFamily: styleFamily === "bread-basket" ? "warm-oat" : "cool-stone",
  menuAspectRatio: 5 / 3,
  enhancementNotes: "No public enhancement while this source remains on hold.",
  outputQuality: 80,
  notes,
});

export const foodProcessingConfig: FoodProcessingRecord[] = [
  approved(
    "Bharwan Paneer Tikka  - This is Siganture Dish.avif",
    "food-bharwan-paneer-tikka",
    "embers-veg-bharwan-paneer-tikka",
    "Bharwan Paneer Tikka",
    "EMBERS VEG",
    "ivory-plate",
    ["homepage-signature", "category-feature", "menu-feature"],
    "Bharwan Paneer Tikka served with onion, lemon, and green chutney.",
    { featured: true, qualityScore: 5 },
  ),
  approved(
    "Bhutte ke Kebab.avif",
    "food-bhutte-ke-kebab",
    "embers-veg-bhutte-ke-kebab",
    "Bhutte Ke Kebab",
    "EMBERS VEG",
    "ivory-plate",
    ["menu-feature", "gallery"],
    "Bhutte Ke Kebab arranged on a light ceramic plate.",
  ),
  approved(
    "Buratta Bomb.avif",
    "food-buratta-bomb",
    "amuse-bouche-buratta-bomb",
    "Buratta Bomb",
    "AMUSE-BOUCHE",
    "ivory-plate",
    ["menu-feature", "gallery"],
    "Buratta Bomb arranged on a light plate with greens.",
  ),
  approved(
    "Burrata Chaat .avif",
    "food-burrata-chaat",
    "embers-veg-burrata-chaat",
    "Burrata Chaat",
    "EMBERS VEG",
    "ivory-plate",
    ["menu-feature", "gallery"],
    "Burrata Chaat presented on a white plate.",
  ),
  approved(
    "Chapli Smash Burger.avif",
    "food-chapli-smash-burger",
    "amuse-bouche-chapli-smash-burger",
    "Chapli Smash Burger",
    "AMUSE-BOUCHE",
    "ivory-plate",
    ["menu-feature", "gallery"],
    "Chapli Smash Burger served with chutneys.",
  ),
  approved(
    "Cheese Naan .avif",
    "food-cheese-naan",
    "indian-breads-cheese-naan",
    "Cheese Naan",
    "INDIAN BREADS",
    "bread-basket",
    ["menu-feature", "gallery"],
    "Cheese Naan in a lined bread basket.",
  ),
  notPublic(
    "Chicken Boneless Biryani .avif",
    "food-chicken-boneless-biryani",
    null,
    "Chicken Boneless Biryani",
    "UNMAPPED",
    "indian-vessel",
    "hold",
    "No exact physical-menu item is confirmed; do not substitute the Hyderabadi biryani mapping.",
  ),
  approved(
    "Chur Chur Naan .avif",
    "food-chur-chur-naan",
    "indian-breads-chur-chur-naan",
    "Chur Chur Naan",
    "INDIAN BREADS",
    "bread-basket",
    ["category-feature", "menu-feature", "gallery"],
    "Chur Chur Naan in a lined bread basket.",
    { qualityScore: 5 },
  ),
  approved(
    "Coconut Carrot Soup.avif",
    "food-coconut-carrot-soup",
    "soups-coconut-carrot-soup",
    "Coconut Carrot Soup",
    "SOUPS",
    "indian-vessel",
    ["category-feature", "menu-feature", "gallery"],
    "Coconut Carrot Soup served in a natural coconut vessel.",
    { qualityScore: 5 },
  ),
  notPublic(
    "Desert.webp",
    "food-unidentified-dessert",
    null,
    "Unidentified dessert",
    "UNMAPPED",
    "indian-vessel",
    "hold",
    "Filename and presentation do not identify an exact physical-menu dessert.",
  ),
  approved(
    "Embers Non Veg - Bhatti Da Kukarh .avif",
    "food-bhatti-da-kukarh",
    "embers-non-veg-bhatti-da-kukarh",
    "Bhatti Da Kukarh",
    "EMBERS NON-VEG",
    "ivory-plate",
    ["menu-feature", "gallery"],
    "Bhatti Da Kukarh served on a light ceramic plate.",
  ),
  approved(
    "Embers Non Veg - Classic Chicken Tikka .avif",
    "food-classic-chicken-tikka",
    "embers-non-veg-classic-chicken-tikka",
    "Classic Chicken Tikka",
    "EMBERS NON-VEG",
    "ivory-plate",
    ["homepage-signature", "menu-feature", "gallery"],
    "Classic Chicken Tikka served with onion, lemon, and green chutney.",
    { featured: true },
  ),
  approved(
    "Embers Non Veg - Lamb Seekh Kebab .avif",
    "food-lamb-seekh-kebab",
    "embers-non-veg-lamb-seekh-kebab",
    "Lamb Seekh Kebab",
    "EMBERS NON-VEG",
    "ivory-plate",
    ["menu-feature", "gallery"],
    "Lamb Seekh Kebab presented with onion and chutney.",
    {
      qualityScore: 3,
      notes: "Usable selectively; dark food needs careful crop separation.",
    },
  ),
  approved(
    "Embers Non Veg - Tandoori Full.avif",
    "food-tandoori-full",
    "embers-non-veg-tandoori-chicken",
    "Tandoori Chicken",
    "EMBERS NON-VEG",
    "ivory-plate",
    ["menu-feature", "gallery"],
    "Tandoori Chicken served with onion, lemon, and green chutney.",
    {
      enhancementNotes:
        "Owner-confirmed mapping; lifted shadows retain detail in the tandoori char.",
    },
  ),
  approved(
    "Embers Non Veg - Tandoori Masaledaar Lambchops .avif",
    "food-tandoori-masaledar-lamb-chops",
    "embers-non-veg-tandoori-masaledar-lamb-chops",
    "Tandoori Masaledar Lamb chops",
    "EMBERS NON-VEG",
    "ivory-plate",
    ["homepage-signature", "category-feature", "menu-feature", "gallery"],
    "Tandoori Masaledar Lamb chops served with onion, lemon, and chutney.",
    { featured: true, qualityScore: 5 },
  ),
  approved(
    "Embers Non Veg - Tandoori Salmon .avif",
    "food-tandoori-salmon",
    "embers-non-veg-tandoori-salmon",
    "Tandoori Salmon",
    "EMBERS NON-VEG",
    "ivory-plate",
    ["menu-feature", "gallery"],
    "Tandoori Salmon plated with greens and edible flowers.",
  ),
  approved(
    "Garlic Naan.avif",
    "food-garlic-naan",
    "indian-breads-garlic-naan",
    "Garlic Naan",
    "INDIAN BREADS",
    "bread-basket",
    ["menu-feature", "gallery"],
    "Garlic Naan in a lined bread basket.",
  ),
  approved(
    "Hara Bhara Kebab .avif",
    "food-hara-bhara-kebab",
    "embers-veg-hara-bhara-kebab",
    "Hara Bhara Kebab",
    "EMBERS VEG",
    "ivory-plate",
    ["menu-feature", "gallery"],
    "Hara Bhara Kebab arranged on a banana leaf with onion and chutney.",
  ),
  approved(
    "Hyderabadi Chicken Dum Biryani .avif",
    "food-hyderabadi-chicken-dum-biryani",
    "biryani-and-pulao-hyderabadi-chicken-dum-biryani",
    "Hyderabadi Chicken Dum Biryani",
    "BIRYANI AND PULAO",
    "indian-vessel",
    [
      "homepage-hero",
      "homepage-signature",
      "category-feature",
      "menu-feature",
      "gallery",
    ],
    "Hyderabadi Chicken Dum Biryani served with raita and gravy.",
    { featured: true, qualityScore: 5 },
  ),
  approved(
    "Jhol Momo Non-Veg.avif",
    "food-jhol-momo-non-veg",
    "amuse-bouche-jhol-momo",
    "Jhol Momo",
    "AMUSE-BOUCHE",
    "indian-vessel",
    ["menu-feature", "gallery"],
    "Jhol Momo served in a spiced broth.",
    {
      enhancementNotes:
        "Owner-confirmed mapping; crop keeps the full bowl and momo arrangement.",
    },
  ),
  approved(
    "Lachcha Paratha .avif",
    "food-lachcha-paratha",
    "indian-breads-lachcha-paratha",
    "Lachcha Paratha",
    "INDIAN BREADS",
    "bread-basket",
    ["menu-feature", "gallery"],
    "Lachcha Paratha stacked in a lined bread basket.",
  ),
  approved(
    "Main Outdoor.webp",
    "venue-main-outdoor",
    null,
    "Namak restaurant exterior",
    "VENUE",
    "ivory-plate",
    ["gallery"],
    "Namak Indian Restaurant & Bar exterior at night.",
    {
      qualityScore: 4,
      notes: "Owner-approved venue photograph; not a food-media placement.",
    },
  ),
  approved(
    "Malai Tandoori Broccoli .avif",
    "food-malai-tandoori-broccoli",
    "embers-veg-malai-tandoori-broccoli",
    "Malai Tandoori Broccoli",
    "EMBERS VEG",
    "ivory-plate",
    ["menu-feature", "gallery"],
    "Malai Tandoori Broccoli served with onion, lemon, and green chutney.",
  ),
  approved(
    "Masala Roti.avif",
    "food-masala-roti",
    "indian-breads-masala-roti",
    "Masala Roti",
    "INDIAN BREADS",
    "bread-basket",
    ["menu-feature", "gallery"],
    "Masala Roti in a lined bread basket.",
  ),
  approved(
    "Murgh Badami Shorba.avif",
    "food-murgh-badam-shorba",
    "soups-murgh-badam-shorba",
    "Murgh Badam Shorba",
    "SOUPS",
    "indian-vessel",
    ["menu-feature", "gallery"],
    "Murgh Badam Shorba served in a shallow blue-gray bowl.",
  ),
  approved(
    "NON-VEG ENTREES -  Fish Moilee Fish Moilee.avif",
    "food-fish-moilee",
    "non-veg-entrees-fish-moilee",
    "Fish Moilee",
    "NON-VEG ENTREES",
    "indian-vessel",
    ["category-feature", "menu-feature", "gallery"],
    "Fish Moilee served in a dark blue-gray bowl.",
  ),
  approved(
    "NON-VEG ENTREES -  Prawn Mango Curry.avif",
    "food-prawn-mango-curry",
    "non-veg-entrees-prawn-mango-curry",
    "Prawn Mango Curry",
    "NON-VEG ENTREES",
    "indian-vessel",
    ["menu-feature", "gallery"],
    "Prawn Mango Curry served in a light ceramic bowl.",
  ),
  approved(
    "NON-VEG ENTREES - Butter Chicken.avif",
    "food-butter-chicken",
    "non-veg-entrees-butter-chicken",
    "Butter Chicken",
    "NON-VEG ENTREES",
    "indian-vessel",
    ["homepage-signature", "menu-feature", "gallery"],
    "Butter Chicken served in a neutral ceramic bowl.",
  ),
  approved(
    "NON-VEG ENTREES - Chicken Korma .avif",
    "food-chicken-korma",
    "non-veg-entrees-chicken-korma",
    "Chicken Korma",
    "NON-VEG ENTREES",
    "indian-vessel",
    ["menu-feature", "gallery"],
    "Chicken Korma served in a light ceramic bowl.",
  ),
  approved(
    "NON-VEG ENTREES - Chicken Tikka Masala.avif",
    "food-chicken-tikka-masala",
    "non-veg-entrees-chicken-tikka-masala",
    "Chicken Tikka Masala",
    "NON-VEG ENTREES",
    "indian-vessel",
    ["menu-feature", "gallery"],
    "Chicken Tikka Masala served in a white bowl.",
  ),
  approved(
    "NON-VEG ENTREES - Chicken Vindaloo .avif",
    "food-chicken-vindaloo",
    "non-veg-entrees-chicken-vindaloo",
    "Chicken Vindaloo",
    "NON-VEG ENTREES",
    "indian-vessel",
    ["menu-feature", "gallery"],
    "Chicken Vindaloo served in a rustic ceramic bowl.",
  ),
  approved(
    "NON-VEG ENTREES - Coriander Prawns .avif",
    "food-coriander-prawns",
    "non-veg-entrees-coriander-prawns",
    "Coriander Prawns",
    "NON-VEG ENTREES",
    "indian-vessel",
    ["menu-feature", "gallery"],
    "Coriander Prawns served in a handled metal bowl.",
  ),
  notPublic(
    "NON-VEG ENTREES - Kadai Chicken .avif",
    "food-kadai-chicken",
    null,
    "Kadai Chicken",
    "UNMAPPED",
    "indian-vessel",
    "hold",
    "Kadai Chicken is not present in the current physical menu.",
  ),
  approved(
    "Papdi Chat.avif",
    "food-papdi-chaat",
    "amuse-bouche-papdi-chaat",
    "Papdi Chaat",
    "AMUSE-BOUCHE",
    "ivory-plate",
    ["menu-feature", "gallery"],
    "Papdi Chaat presented in a shallow ceramic bowl.",
  ),
  approved(
    "Punjabi Samosa.avif",
    "food-punjabi-samosa",
    "embers-veg-punjabi-samosa",
    "Punjabi Samosa",
    "EMBERS VEG",
    "ivory-plate",
    ["menu-feature", "gallery"],
    "Punjabi Samosa served with chutneys on a white plate.",
  ),
  approved(
    "Raw Mango Salad.avif",
    "food-raw-mango-salad",
    "amuse-bouche-raw-mango-salad",
    "Raw Mango Salad",
    "AMUSE-BOUCHE",
    "ivory-plate",
    ["menu-feature", "gallery"],
    "Raw Mango Salad presented on a white plate.",
  ),
  approved(
    "Samosa Chat.avif",
    "food-samosa-chaat",
    "amuse-bouche-samosa-chaat",
    "Samosa Chaat",
    "AMUSE-BOUCHE",
    "ivory-plate",
    ["menu-feature", "gallery"],
    "Samosa Chaat served in a shallow ceramic bowl.",
  ),
  approved(
    "Tandoori Roti .avif",
    "food-tandoori-roti",
    "indian-breads-tandoori-roti",
    "Tandoori Roti",
    "INDIAN BREADS",
    "bread-basket",
    ["menu-feature", "gallery"],
    "Tandoori Roti in a lined bread basket.",
  ),
  approved(
    "VEG ENTREES - Dal Makhani.avif",
    "food-dal-makhani",
    "veg-entrees-dal-makhani",
    "Dal Makhani",
    "VEG ENTREES",
    "indian-vessel",
    ["category-feature", "menu-feature", "gallery"],
    "Dal Makhani served in a handled metal bowl.",
  ),
  approved(
    "VEG ENTREES - Malai Kofta.avif",
    "food-malai-kofta",
    "veg-entrees-malai-kofta",
    "Malai Kofta",
    "VEG ENTREES",
    "indian-vessel",
    ["menu-feature", "gallery"],
    "Malai Kofta served in a light ceramic bowl.",
  ),
  approved(
    "VEG ENTREES - Paneer Tikka Masala.avif",
    "food-paneer-tikka-masala",
    "veg-entrees-paneer-tikka-masala",
    "Paneer Tikka Masala",
    "VEG ENTREES",
    "indian-vessel",
    ["menu-feature", "gallery"],
    "Paneer Tikka Masala served in a shallow metal bowl.",
  ),
  approved(
    "VEG ENTREES - Pindi Chole.avif",
    "food-pindi-chole",
    "veg-entrees-pindi-chole",
    "Pindi Chole",
    "VEG ENTREES",
    "indian-vessel",
    ["menu-feature", "gallery"],
    "Pindi Chole served in a ceramic bowl.",
  ),
  approved(
    "VEG ENTREES - Saag Buratta.avif",
    "food-saag-burrata",
    "veg-entrees-saag-burrata",
    "Saag Burrata",
    "VEG ENTREES",
    "indian-vessel",
    ["menu-feature", "gallery"],
    "Saag Burrata presented with greens and roasted vegetables.",
  ),
  approved(
    "VEG ENTREES - Tandoori Paneer Makhani.avif",
    "food-tandoori-paneer-makhani",
    "veg-entrees-tandoori-paneer-makhani",
    "Tandoori Paneer Makhani",
    "VEG ENTREES",
    "indian-vessel",
    ["menu-feature", "gallery"],
    "Tandoori Paneer Makhani served in a neutral ceramic bowl.",
  ),
  approved(
    "Veg Dum Biryani .avif",
    "food-veg-dum-biryani",
    "biryani-and-pulao-veg-dum-biryani",
    "Veg Dum Biryani",
    "BIRYANI AND PULAO",
    "indian-vessel",
    ["menu-feature", "gallery"],
    "Veg Dum Biryani served with raita.",
    {
      qualityScore: 3,
      notes: "Usable selectively; the crop includes a partial second plate.",
    },
  ),
];

export const SAFE_FOOD_ADJUSTMENT_LIMITS = {
  brightness: { min: 0.98, max: 1.08 },
  saturation: { min: 0.98, max: 1.12 },
  contrast: { min: 1, max: 1.08 },
  gamma: { min: 0.96, max: 1.04 },
  sharpenSigma: { min: 0.4, max: 0.9 },
  outputQuality: { min: 72, max: 90 },
} as const;
