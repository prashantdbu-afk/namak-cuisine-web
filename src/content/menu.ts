export type MenuCategory = {
  id: string;
  name: string;
  description?: string;
  order: number;
  publicationStatus: "published" | "hidden";
};
export type MenuImageReference = { mediaId: string };
export type MenuSourceReference = {
  provider: "toast" | "grubhub" | "doordash" | "ubereats";
  url: string;
};
export type MenuItem = {
  id: string;
  categoryId: string;
  displayName: string;
  sourceName: string;
  description: string | null;
  price: null;
  image: MenuImageReference | null;
  imageStatus: "missing" | "candidate-found" | "approved";
  sourceReferences: MenuSourceReference[];
  confidence: "high" | "medium" | "low";
  ownerApproved: boolean;
  publicationStatus: "published" | "review" | "hidden";
};

const toastUrl =
  "https://www.toasttab.com/local/order/namak-2-5500-greenville-avenue-suite-600/item-solkadhi_03ae59e5-5ca9-451c-a1eb-fa7334b6e82b";
const uberUrl =
  "https://www.ubereats.com/store/namak-indian-restaurant-%26-bar-bharat-llcs/v6ULsMx2SSaXPn0eFzJRkw";
const corroborated = new Set([
  "MURGH YAKHNI SHORBA",
  "COCONUT CARROT SOUP",
  "MURGHA BADAMI SHORBA",
  "LENTIL SOUP",
  "BUN TIKKI",
  "BURATTA BOMB",
  "RAW MANGO SALAD",
  "JHOL MOMO CHICKEN",
  "SAMOSA CHAAT",
  "PAPDI CHAT",
  "CHAPLI SMASH BURGER",
  "JHOL MOMO VEG",
  "BHARWAN PANNER TIKKA",
  "HARA BHARA KEBAB",
  "MALAI TANDOORI BROCCOLI",
  "PUNJABI SAMOSA",
  "DAL MAKHANI",
  "MALAI KOFTA",
  "PINDI CHOLE",
  "BUTTER CHICKEN",
]);
const outOfStock = new Set(["RAJ KACHORI CHAT", "VEG THALI"]);
const corrected: Record<string, string> = {
  "BURATTA BOMB": "Burrata Bomb",
  "PAPDI CHAT": "Papdi Chaat",
  "BHARWAN PANNER TIKKA": "Bharwan Paneer Tikka",
  "BURRATA CHAT": "Burrata Chaat",
  "TANDOORI PANNER MAKHANI": "Tandoori Paneer Makhani",
  "BAIGAN BHARTA": "Baingan Bharta",
  "PANNER TIKKA MASALA": "Paneer Tikka Masala",
  "KADHAI PANNER": "Kadhai Paneer",
  "SAAG PANNER": "Saag Paneer",
  "MATAR PANNER": "Matar Paneer",
  "FISH MOLIEE": "Fish Moilee",
  "KADAI SHMRIP": "Kadai Shrimp",
  "LUCKNOWNI GOAT BIRYANI": "Lucknowi Goat Biryani",
  "MASALA PAPD": "Masala Papad",
  "BURANI RATIA": "Burani Raita",
  BREADBASKET: "Bread Basket",
  THUMSUP: "Thums Up",
  "WATER`": "Water",
  "NON- VEG THALI": "Non-Veg Thali",
};
const titleCase = (value: string) =>
  value
    .toLowerCase()
    .replace(/(^|[\s(&-])\p{L}/gu, (letter) => letter.toUpperCase());
const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
const category = (
  id: string,
  name: string,
  order: number,
  published = false,
): MenuCategory => ({
  id,
  name,
  order,
  publicationStatus: published ? "published" : "hidden",
});
export const menuCategories: MenuCategory[] = [
  category("soups", "Soups", 1, true),
  category("amuse-bouche", "Amuse-Bouche", 2, true),
  category("embers-vegetarian", "Embers — Vegetarian", 3, true),
  category("embers-non-vegetarian", "Embers — Non-Vegetarian", 4),
  category("vegetarian-entrees", "Vegetarian Entrées", 5, true),
  category("non-vegetarian-entrees", "Non-Vegetarian Entrées", 6, true),
  category("biryani-pulao", "Biryani & Pulao", 7),
  category("indian-breads", "Indian Breads", 8),
  category("sides", "Sides", 9),
  category("kids-menu", "Kids Menu", 10),
  category("desserts", "Desserts", 11),
  category("mocktails", "Mocktails", 12),
  category("beverages", "Beverages", 13),
  category("chai-coffee", "Chai & Coffee", 14),
  category("lunch-specials", "Lunch Specials", 15),
  category("dosa", "Dosa", 16),
];

const rawByCategory: Record<string, string[]> = {
  beverages: [
    "ACQUA PANNA",
    "COKE",
    "DIET COKE",
    "ZERO COKE",
    "SPRITE",
    "THUMSUP",
    "LIMCA",
    "DR PEPPER",
    "GINGER ALE",
    "WATER`",
    "TOPO CHICO",
    "PERRIER",
    "CLUB SODA",
    "TONIC WATER",
  ],
  soups: [
    "MURGH YAKHNI SHORBA",
    "COCONUT CARROT SOUP",
    "MURGHA BADAMI SHORBA",
    "LENTIL SOUP",
  ],
  "amuse-bouche": [
    "BUN TIKKI",
    "BURATTA BOMB",
    "RAW MANGO SALAD",
    "TRUFFLE DAHI PUCHKA",
    "JHOL MOMO CHICKEN",
    "SAMOSA CHAAT",
    "PAPDI CHAT",
    "PANI PURI",
    "CHAPLI SMASH BURGER",
    "RAJ KACHORI CHAT",
    "JHOL MOMO VEG",
  ],
  "embers-vegetarian": [
    "BHARWAN PANNER TIKKA",
    "BHUTTE KE KEBAB",
    "BRIJWASI DAHI BHALLA",
    "BURRATA CHAT",
    "HARA BHARA KEBAB",
    "MALAI TANDOORI BROCCOLI",
    "PUNJABI SAMOSA",
    "TANDOORI BHARWAN MUSHROOM",
  ],
  "embers-non-vegetarian": [
    "BHATTI DA KUKARH",
    "CHICKEN AFGHANI TIKKA",
    "LAMB SEEKH KEBAB",
    "LEHSUNI DHANIYA JHINGA",
    "TANDOORI CHICKEN ( FULL)",
    "TANDOORI MASALEDAARI LAMBCHOPS",
    "TANDOORI SALMON",
    "AMRITSARI MACCHI",
    "CLASSIC CHICKEN TIKKA",
    "TANDOORI CHICKEN ( HALF)",
  ],
  "vegetarian-entrees": [
    "DAL MAKHANI",
    "DAL TADKA",
    "MALAI KOFTA",
    "RAW MANGO CURRY",
    "SAAG BURATTA",
    "TANDOORI PANNER MAKHANI",
    "BAIGAN BHARTA",
    "PINDI CHOLE",
    "BHINDI DO PYAZA",
    "SUBZ KORMA",
    "MIX VEGETABLES",
    "PANNER TIKKA MASALA",
    "KADHAI PANNER",
    "SAAG PANNER",
    "MATAR PANNER",
  ],
  "non-vegetarian-entrees": [
    "BUTTER CHICKEN",
    "CHICKEN KORMA",
    "CHICKEN TIKKA MASALA",
    "FISH MOLIEE",
    "LAAL MAAS",
    "OLD DELHI LAMB NIHARI",
    "PRAWN MANGO CURRY",
    "CHICKEN VINDALOO",
    "LAMB VINDALOO",
    "SHRIMP VINDALOO",
    "MEAT ROGAN JOSH",
    "KADAI SHMRIP",
    "KADAI CHICKEN",
    "CORIANDER PRAWNS",
    "LAMB KORMA",
  ],
  "biryani-pulao": [
    "HYDERABADI CHICKEN DUM BIRYANI",
    "LUCKNOWNI GOAT BIRYANI",
    "VEG DUM BIRYANI",
    "KATHAL BIRYANI",
    "CHICKEN DUM BIRYANI (BONELESS)",
    "JEERA PULAO",
    "MATAR PULAO",
    "VEGETABLE PULAO",
  ],
  sides: [
    "MASALA PAPD",
    "BURANI RATIA",
    "CUCUMBER RAITA",
    "HOMEMADE PRESERVES AND PICKLES",
  ],
  "indian-breads": [
    "CHUR CHUR NAAN",
    "LACHCHA PARATHA",
    "TANDOORI ROTI",
    "MASALA ROTI",
    "NAAN",
    "GARLIC NAAN",
    "RUMALI ROTI",
    "CHEESE NAAN",
    "BULLET NAAN",
    "BREADBASKET",
  ],
  "kids-menu": ["MAC N CHEESE", "FRENCH FRIES"],
  desserts: [
    "GHEVAR GLOW",
    "KESAR GAJAR HALWA DREAM",
    "GULAB JAMUN BLISS",
    "SWEET SILK BITES",
    "KESARI PHIRNI",
    "ROYAL FALOODA",
    "RASMALAI",
  ],
  mocktails: [
    "OLD DELHI BANTA COKE",
    "MOHABBAT E SHARBAT",
    "GREEN APPLE MANALI",
    "MANGO LASSI",
    "MINT LEMONADE",
    "MILKSHAKES",
    "MASALA BUTTERMILK",
    "BUTTERMILK",
    "ICED TEA",
    "AAM PANNA",
    "PEACH LEMONADE",
    "VIRGIN MOJITO",
  ],
  "chai-coffee": ["MASALA CHAI", "COFFEE"],
  "lunch-specials": ["VEG THALI", "NON- VEG THALI"],
  dosa: ["PLAIN DOSA", "MASALA DOSA", "CHEESE DOSA", "BENNE DOSA"],
};

export const menuItems: MenuItem[] = Object.entries(rawByCategory).flatMap(
  ([categoryId, names]) =>
    names.map((sourceName) => {
      const isCorroborated = corroborated.has(sourceName);
      const hidden = outOfStock.has(sourceName);
      return {
        id: slug(sourceName),
        categoryId,
        displayName: corrected[sourceName] ?? titleCase(sourceName),
        sourceName,
        description: null,
        price: null,
        image: null,
        imageStatus: "missing" as const,
        sourceReferences: [
          { provider: "toast" as const, url: toastUrl },
          ...(isCorroborated
            ? [{ provider: "ubereats" as const, url: uberUrl }]
            : []),
        ],
        confidence: hidden
          ? ("low" as const)
          : isCorroborated
            ? ("high" as const)
            : ("medium" as const),
        ownerApproved: false,
        publicationStatus: hidden
          ? ("hidden" as const)
          : isCorroborated
            ? ("published" as const)
            : ("review" as const),
      };
    }),
);

export type PublicMenuItem = Pick<
  MenuItem,
  "id" | "categoryId" | "displayName" | "description" | "image"
>;
export const publishedCategories = menuCategories.filter(
  (entry) => entry.publicationStatus === "published",
);
export const publishedMenuItems: PublicMenuItem[] = menuItems
  .filter((entry) => entry.publicationStatus === "published")
  .map(({ id, categoryId, displayName, description, image }) => ({
    id,
    categoryId,
    displayName,
    description,
    image,
  }));
