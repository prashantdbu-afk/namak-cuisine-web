export type MenuKind = "food" | "bar";

export type MenuCategory = {
  id: string;
  name: string;
  order: number;
  kind: MenuKind;
};

export type MenuItemVariant = {
  label: string;
  priceCents: number;
};

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  priceCents: number | null;
  variants?: MenuItemVariant[];
  searchAliases?: string[];
};

export const menuDisplay = {
  showFoodPrices: true,
  showBarPrices: true,
  showWinePrices: true,
} as const;

export const menuMetadata = {
  source: "Owner-provided physical menu",
  lastVerified: "2026-08-09",
  pricesVisible: true,
} as const;

const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const category = (
  kind: MenuKind,
  name: string,
  order: number,
): MenuCategory => ({ id: `${kind}-${slug(name)}`, name, order, kind });

const foodCategoryNames = [
  "AMUSE-BOUCHE",
  "SOUPS",
  "EMBERS VEG",
  "EMBERS NON-VEG",
  "VEG ENTREES",
  "NON-VEG ENTREES",
  "BIRYANI AND PULAO",
  "SIDES",
  "INDIAN BREADS",
  "KIDS MENU",
  "DRINKS",
  "DESSERTS",
] as const;

const barCategoryNames = [
  "DRAFT BEER",
  "INDIAN BEERS",
  "WHISKEY",
  "GIN",
  "VODKA",
  "TEQUILA",
  "RUM",
  "APERITIVO / AMARO",
  "LIQUOR",
  "WINES BY THE GLASS",
  "BUBBLES",
  "WHITE",
  "ROSE",
  "RED",
] as const;

export const menuCategories: MenuCategory[] = [
  ...foodCategoryNames.map((name, index) => category("food", name, index + 1)),
  ...barCategoryNames.map((name, index) => category("bar", name, index + 1)),
];

type ItemInput = Omit<MenuItem, "id" | "categoryId">;
const item = (categoryName: string, input: ItemInput): MenuItem => ({
  id: `${slug(categoryName)}-${slug(input.name)}`,
  categoryId: `${
    foodCategoryNames.includes(
      categoryName as (typeof foodCategoryNames)[number],
    )
      ? "food"
      : "bar"
  }-${slug(categoryName)}`,
  ...input,
});
const priced = (
  categoryName: string,
  name: string,
  description: string | null,
  priceCents: number,
  searchAliases?: string[],
) => item(categoryName, { name, description, priceCents, searchAliases });
const variant = (
  categoryName: string,
  name: string,
  variants: MenuItemVariant[],
) =>
  item(categoryName, { name, description: null, priceCents: null, variants });

export const menuItems: MenuItem[] = [
  priced(
    "AMUSE-BOUCHE",
    "Truffle Dahi Puchka",
    "Crispy semolina shells filled with tangy yogurt lightly infused with truffle oil.",
    1200,
  ),
  priced(
    "AMUSE-BOUCHE",
    "Raw Mango Salad",
    "Shredded raw mango tossed with balsamic vinegar, spices, and a touch of sweetness.",
    1200,
  ),
  priced(
    "AMUSE-BOUCHE",
    "Bun Tikki",
    "Crispy potato patty with spiced nuts and chutneys served in a toasted bun.",
    1200,
  ),
  priced(
    "AMUSE-BOUCHE",
    "Buratta Bomb",
    "Mashed potatoes and cheese topped with spicy tomato salsa and crispy khakhra padi.",
    1200,
    ["Burrata Bomb"],
  ),
  priced(
    "AMUSE-BOUCHE",
    "Jhol Momo",
    "Steamed dumplings served in a spicy and tangy jhol broth.",
    1800,
  ),
  priced(
    "AMUSE-BOUCHE",
    "Samosa Chaat",
    "Crispy samosas topped with yogurt, tamarind relish, and spices.",
    1200,
  ),
  priced(
    "AMUSE-BOUCHE",
    "Papdi Chaat",
    "Crispy wafers with potatoes, yogurt, pomegranate, and tamarind relish.",
    1200,
  ),
  priced(
    "AMUSE-BOUCHE",
    "Pani Puri",
    "Crispy puris filled with spiced potato and chickpeas served with five flavored waters.",
    1500,
  ),
  priced(
    "AMUSE-BOUCHE",
    "Chapli Smash Burger",
    "Spiced lamb patty with chutney and onions in a toasted bun.",
    1500,
  ),

  priced(
    "SOUPS",
    "Coconut Carrot Soup",
    "Smooth carrot soup blended with creamy coconut milk and aromatic spices.",
    1200,
  ),
  priced(
    "SOUPS",
    "Murgh Yakhni Shorba",
    "A light chicken broth flavored with cinnamon, cardamom, and saffron.",
    1500,
  ),
  priced(
    "SOUPS",
    "Murgh Badam Shorba",
    "Delicately spiced chicken soup enriched with almond paste.",
    1500,
  ),
  priced(
    "SOUPS",
    "Lentil Soup",
    "Hearty lentil soup simmered with aromatic spices.",
    1200,
  ),

  priced(
    "EMBERS VEG",
    "Malai Tandoori Broccoli",
    "Broccoli marinated in creamy malai and grilled in a tandoor.",
    1400,
  ),
  priced(
    "EMBERS VEG",
    "Tandoori Bharwan Mushroom",
    "Cheese- and herb-stuffed mushrooms cooked in a spiced yogurt marinade.",
    1400,
  ),
  priced(
    "EMBERS VEG",
    "Bharwan Paneer Tikka",
    "Stuffed cottage cheese cubes grilled in a traditional tandoor.",
    1800,
  ),
  priced(
    "EMBERS VEG",
    "Hara Bhara Kebab",
    "Spinach and green pea patties pan-fried until crisp.",
    1400,
  ),
  priced(
    "EMBERS VEG",
    "Bhutte Ke Kebab",
    "Sweetcorn and potato patties spiced and fried golden.",
    1400,
  ),
  priced(
    "EMBERS VEG",
    "Punjabi Samosa",
    "Crispy pastry filled with spiced potatoes, peas, and nuts.",
    1000,
  ),
  priced(
    "EMBERS VEG",
    "Brijwasi Dahi Balla",
    "Soft lentil fritters topped with yogurt, chutneys, and spices.",
    1200,
  ),
  priced(
    "EMBERS VEG",
    "Burrata Chaat",
    "Indian-style chaat with burrata, khakhra, pomegranate, and tangy chutneys.",
    1200,
    ["Buratta Chaat"],
  ),

  priced(
    "EMBERS NON-VEG",
    "Amritsari Macchi",
    "Crispy gram flour-coated fish fried with Punjabi spices.",
    2200,
  ),
  priced(
    "EMBERS NON-VEG",
    "Lehsuni Jhinga",
    "Prawns marinated with garlic, coriander, and spices.",
    2400,
  ),
  priced(
    "EMBERS NON-VEG",
    "Classic Chicken Tikka",
    "Boneless chicken marinated in yogurt and grilled in a tandoor.",
    1800,
  ),
  priced(
    "EMBERS NON-VEG",
    "Tandoori Salmon",
    "Spiced salmon fillet tandoor-grilled for a smoky finish.",
    2200,
  ),
  priced(
    "EMBERS NON-VEG",
    "Bhatti Da Kukarh",
    "Tandoor-roasted chicken infused with traditional Punjabi spices.",
    1800,
  ),
  priced(
    "EMBERS NON-VEG",
    "Chicken Afghani Tikka",
    "Boneless chicken in creamy yogurt marinade grilled to perfection.",
    1800,
  ),
  priced(
    "EMBERS NON-VEG",
    "Tandoori Chicken",
    "Whole chicken marinated in spiced yogurt and roasted in a tandoor.",
    2200,
  ),
  priced(
    "EMBERS NON-VEG",
    "Lamb Seekh Kebab",
    "Ground lamb skewered and roasted with aromatic spices.",
    2000,
  ),
  priced(
    "EMBERS NON-VEG",
    "Tandoori Masaledar Lamb chops",
    "Spiced lamb chops marinated in yogurt and roasted in a tandoor.",
    3500,
  ),

  priced(
    "VEG ENTREES",
    "Saag Burrata",
    "Mustard greens and spinach cooked with dill, fenugreek, and burrata cheese.",
    2200,
  ),
  priced(
    "VEG ENTREES",
    "Tandoori Paneer Makhani",
    "Grilled paneer cubes served in a creamy tomato gravy.",
    2200,
  ),
  priced(
    "VEG ENTREES",
    "Rajasthani Kadhi Kachori",
    "Crispy kachori served with tangy spiced yogurt curry.",
    2100,
  ),
  priced(
    "VEG ENTREES",
    "Dal Makhani",
    "Black lentils slow-cooked in creamy tomato sauce.",
    2200,
  ),
  priced(
    "VEG ENTREES",
    "Raw Mango Curry",
    "Tangy curry made with raw mango and mixed vegetables.",
    2000,
  ),
  priced(
    "VEG ENTREES",
    "Malai Kofta",
    "Vegetable dumplings in a rich cashew cream gravy.",
    2200,
  ),
  priced(
    "VEG ENTREES",
    "Pindi Chole",
    "Chickpeas cooked with Punjabi spices, served with kulcha.",
    2400,
  ),
  priced(
    "VEG ENTREES",
    "Dal Tadka",
    "Yellow lentils tempered with chili, cumin, and tomatoes.",
    2200,
  ),
  priced(
    "VEG ENTREES",
    "Bhindi Do Pyaza",
    "Okra stir-fried with onions and Indian spices.",
    2200,
  ),
  priced(
    "VEG ENTREES",
    "Subz Korma",
    "Mixed vegetables cooked in a mild yogurt and nut-based curry.",
    2200,
  ),
  priced(
    "VEG ENTREES",
    "Mix Vegetables",
    "Seasonal vegetables cooked in spiced onion-tomato gravy.",
    2000,
  ),
  priced(
    "VEG ENTREES",
    "Paneer Tikka Masala",
    "Grilled paneer cubes in a robust tomato-based curry.",
    2200,
  ),
  priced(
    "VEG ENTREES",
    "Kadhai Paneer",
    "Paneer and peppers cooked in spiced tomato gravy with kadhai masala.",
    2200,
  ),
  priced(
    "VEG ENTREES",
    "Saag Paneer",
    "Paneer cubes in creamy spinach and mustard leaf sauce.",
    2200,
  ),
  priced(
    "VEG ENTREES",
    "Matar Paneer",
    "Paneer and green peas in a spiced onion-tomato gravy.",
    2200,
  ),

  priced(
    "NON-VEG ENTREES",
    "Fish Moilee",
    "Fish simmered in a creamy coconut curry with South Indian spices.",
    2400,
  ),
  priced(
    "NON-VEG ENTREES",
    "Prawn Mango Curry",
    "Prawns cooked in a tangy raw mango curry with spices.",
    2400,
  ),
  priced(
    "NON-VEG ENTREES",
    "Butter Chicken",
    "Chicken simmered in buttery tomato gravy with cream.",
    2200,
  ),
  priced(
    "NON-VEG ENTREES",
    "Chicken Tikka Masala",
    "Grilled chicken pieces in spiced tomato curry.",
    2200,
  ),
  priced(
    "NON-VEG ENTREES",
    "Chicken Korma",
    "Chicken cooked in a mild yogurt and nut-based curry.",
    2400,
  ),
  priced(
    "NON-VEG ENTREES",
    "Old Delhi Lamb Nihari",
    "Slow-cooked lamb in a rich, spiced gravy.",
    2800,
  ),
  priced(
    "NON-VEG ENTREES",
    "Laal Maas",
    "Spicy Rajasthani lamb curry with red chili and smoked spices.",
    2800,
  ),
  priced(
    "NON-VEG ENTREES",
    "Chicken Vindaloo",
    "Spicy Goan-style chicken curry with vinegar and red chili.",
    2200,
  ),
  priced(
    "NON-VEG ENTREES",
    "Lamb Vindaloo",
    "Hot and tangy Goan lamb curry with red chili and vinegar.",
    2400,
  ),
  priced(
    "NON-VEG ENTREES",
    "Shrimp Vindaloo",
    "Shrimp cooked in spicy Goan vindaloo sauce.",
    2500,
  ),
  priced(
    "NON-VEG ENTREES",
    "Kadai Shrimp",
    "Prawns sautéed with peppers, onions, and kadai masala.",
    2500,
  ),
  priced(
    "NON-VEG ENTREES",
    "Coriander Prawns",
    "Prawns cooked with coriander, coconut, and curry leaves.",
    2500,
  ),
  priced(
    "NON-VEG ENTREES",
    "Meat Rogan Josh",
    "Kashmiri-style curry with tender meat in spiced yogurt gravy.",
    2400,
  ),

  priced(
    "BIRYANI AND PULAO",
    "Hyderabadi Chicken Dum Biryani",
    "Layered basmati rice and chicken slow-cooked with Hyderabadi spices.",
    2400,
  ),
  priced(
    "BIRYANI AND PULAO",
    "Lucknowi Goat Biryani",
    "Goat and basmati rice cooked with fragrant Lucknowi spices.",
    2600,
  ),
  priced(
    "BIRYANI AND PULAO",
    "Veg Dum Biryani",
    "Basmati rice and vegetables slow-cooked with mild spices.",
    2000,
  ),
  priced(
    "BIRYANI AND PULAO",
    "Kathal Biryani",
    "Jackfruit and rice cooked together with aromatic spices.",
    2000,
  ),
  priced(
    "BIRYANI AND PULAO",
    "Jeera Pulao",
    "Basmati rice flavored with cumin seeds.",
    1000,
  ),
  priced(
    "BIRYANI AND PULAO",
    "Matar Pulao",
    "Rice cooked with green peas and whole spices.",
    1200,
  ),
  priced(
    "BIRYANI AND PULAO",
    "Vegetable Pulao",
    "Rice cooked with mixed vegetables and mild spices.",
    1400,
  ),

  priced(
    "SIDES",
    "Cucumber Raita",
    "Yogurt with cucumber and roasted cumin.",
    500,
  ),
  priced(
    "SIDES",
    "Burani Raita",
    "Garlic-flavored yogurt with mild spices.",
    500,
  ),
  priced(
    "SIDES",
    "Masala Papad",
    "Crispy papad topped with onions, tomatoes, and spices.",
    400,
  ),
  priced(
    "SIDES",
    "Homemade Preserves and Pickles",
    "Traditional Indian pickles and preserves made from seasonal produce.",
    500,
  ),

  priced(
    "INDIAN BREADS",
    "Chur Chur Naan",
    "Crispy crushed naan topped with butter.",
    900,
  ),
  priced(
    "INDIAN BREADS",
    "Lachcha Paratha",
    "Layered whole-wheat flatbread cooked until flaky.",
    600,
  ),
  priced(
    "INDIAN BREADS",
    "Tandoori Roti",
    "Whole-wheat flatbread baked in a tandoor.",
    400,
  ),
  priced(
    "INDIAN BREADS",
    "Masala Roti",
    "Spiced whole-wheat flatbread roasted in a tandoor.",
    500,
  ),
  priced(
    "INDIAN BREADS",
    "Naan",
    "Soft white-flour flatbread baked in a tandoor.",
    400,
  ),
  priced(
    "INDIAN BREADS",
    "Garlic Naan",
    "Naan topped with garlic and herbs.",
    500,
  ),
  priced(
    "INDIAN BREADS",
    "Rumali Roti",
    "Thin, handkerchief-style roti cooked on dome griddle.",
    700,
  ),
  priced(
    "INDIAN BREADS",
    "Cheese Naan",
    "Naan stuffed with melted cheese and buttered.",
    650,
  ),
  priced(
    "INDIAN BREADS",
    "Bullet Naan",
    "Spicy naan brushed with chili butter.",
    650,
  ),
  priced(
    "INDIAN BREADS",
    "Breadbasket",
    "Assortment of naan, roti, and masala.",
    1200,
  ),

  priced(
    "KIDS MENU",
    "Mac N' Cheese",
    "Creamy mac and cheese served with fries and a soft drink.",
    1500,
  ),
  priced("KIDS MENU", "French Fries", "Crispy golden potato fries.", 600),

  priced(
    "DRINKS",
    "Mango Lassi",
    "Blend of ripe mangoes, yogurt, and sugar.",
    600,
  ),
  priced(
    "DRINKS",
    "Milkshakes",
    "Choice of chocolate, strawberry, or Oreo flavor.",
    800,
  ),
  priced(
    "DRINKS",
    "Masala Buttermilk",
    "Spiced yogurt-based drink with herbs.",
    600,
  ),
  priced("DRINKS", "Buttermilk", "Plain churned yogurt drink.", 600),
  priced("DRINKS", "Iced Tea", "Choice of sweetened or unsweetened.", 400),

  priced(
    "DESSERTS",
    "Ghevar Glow",
    "A crispy, sweet honeycomb like dessert made with flour, ghee, and sugar syrup.",
    1200,
  ),
  priced(
    "DESSERTS",
    "Gulab Jamun Bliss",
    "Soft milk-based dumplings soaked in fragrant sugar syrup.",
    1200,
  ),
  priced(
    "DESSERTS",
    "Kesar Gajar Halwa Dream",
    "Layers of carrot halwa and flaky pastry topped with nuts and cream.",
    1400,
  ),
  priced(
    "DESSERTS",
    "Sweet Silk Bites (Cham Cham).",
    "Soft, oval-shaped Bengali sweet made from chhena (curdled milk), soaked in sugar.",
    1400,
  ),
  priced(
    "DESSERTS",
    "Kesari Phirni",
    "Coarsely rice, slowly cooked in full fat milk, flavored with saffron, cardamom and nuts.",
    1200,
  ),

  priced("DRAFT BEER", "Heineken", null, 700),
  priced("DRAFT BEER", "Blue Moon", null, 700),
  priced("DRAFT BEER", "Modelo", null, 700),
  priced("DRAFT BEER", "Community", null, 700),
  variant("INDIAN BEERS", "Taj Mahal", [
    { label: "330ml", priceCents: 700 },
    { label: "650ml", priceCents: 900 },
  ]),
  ...[
    "Modelo",
    "Corona",
    "Dos Equis",
    "Budweiser",
    "Heineken",
    "Shiner Bock",
    "Stella Artois",
    "Michelob Ultra",
  ].map((name) => priced("INDIAN BEERS", name, null, 500)),

  ...[
    "The Glenlivet 12 years",
    "Macallan 12 years",
    "Glenfiddich 12 years",
    "Chivas Regal 12 years",
    "J.W Black Label 12 years",
    "Dalmore 12 years",
    "Jack Daniels",
    "Woodford Reserve",
    "Makers Mark",
  ].map((name) => priced("WHISKEY", name, null, 1300)),
  ...[
    "Jim Beam",
    "Jameson",
    "J.W Red Label",
    "J&B",
    "Seagram's 7",
    "Crown Royal",
    "Dewar's White",
  ].map((name) => priced("WHISKEY", name, null, 800)),

  priced("GIN", "Tanqueray", null, 1300),
  priced("GIN", "Bombay Sapphire", null, 1100),
  priced("GIN", "Beefeater", null, 800),
  priced("VODKA", "Grey Goose", null, 1300),
  priced("VODKA", "Beluga", null, 1300),
  priced("VODKA", "Absolut", null, 800),
  priced("VODKA", "Smirnoff", null, 800),
  priced("VODKA", "Skol", null, 800),
  priced("VODKA", "Ketel One", null, 900),
  priced("VODKA", "Titos", null, 900),
  priced("TEQUILA", "Patron Silver", null, 1000),
  priced("TEQUILA", "Don Julio", null, 1000),
  priced("TEQUILA", "Jose Cuervo Gold", null, 800),
  priced("TEQUILA", "Jose Cuervo Silver", null, 800),
  priced("RUM", "Bacardi", null, 800),
  priced("RUM", "Captain Morgan", null, 800),
  priced("RUM", "Old Monk", null, 800),
  priced("RUM", "Malibu Coconut", null, 700),
  priced("APERITIVO / AMARO", "Aperol", null, 600),
  priced("APERITIVO / AMARO", "Campari", null, 600),
  priced("APERITIVO / AMARO", "Jagermeister", null, 700),
  priced("LIQUOR", "Baileys", null, 600),
  priced("LIQUOR", "Cointreau", null, 600),
  priced("LIQUOR", "Kahlua", null, 600),
  priced("LIQUOR", "Jaan", null, 600),

  priced("WINES BY THE GLASS", "Jean Louis Blanc de Blancs (187)", null, 700),
  priced("WINES BY THE GLASS", "Fantinel Prosecco", null, 1000),
  priced("WINES BY THE GLASS", "Cabert Pinot Grigio, Italy", null, 700),
  priced("WINES BY THE GLASS", "Lillie's Sauvignon Blanc, CA", null, 900),
  priced("WINES BY THE GLASS", "Bouchard Chardonnay, France", null, 800),
  priced("WINES BY THE GLASS", "Messina Hoff Riesling, Texas", null, 800),
  priced("WINES BY THE GLASS", "Bouchard Pinot Noir, France", null, 800),
  priced("WINES BY THE GLASS", "Raymond 'R' Merlot, CA", null, 1000),
  priced("WINES BY THE GLASS", "Raymond 'R' Cabernet, CA", null, 1000),
  priced("WINES BY THE GLASS", "Fantini Montepulciano, Italy", null, 800),
  priced("WINES BY THE GLASS", "Avignonesi Rosso, Italy", null, 900),

  priced("BUBBLES", "Fantinel Prosecco", null, 3000),
  priced("WHITE", "Cabert Pinot Grigio, Italy", null, 2100),
  priced("WHITE", "Lillie's Sauvignon Blanc, CA", null, 2700),
  priced("WHITE", "Alpine Rift Sauv Blanc, NZ", null, 3600),
  priced("WHITE", "Marramiero Vermintino, Italy", null, 3600),
  priced("WHITE", "Bouchard Chardonnay, France", null, 2400),
  priced("WHITE", "Truchard Chardonnay, CA", null, 4800),
  priced("WHITE", "Messina Hoff Riesling, TX", null, 2400),
  priced("WHITE", "Dr. Fischer Riesling, Germany", null, 4200),
  priced("ROSE", "Commanderie Bargemone, France", null, 3600),
  priced("RED", "Bouchard Pinot Noir, France", null, 2400),
  priced("RED", "Brick & Mortar", null, 4800),
  priced("RED", "Pinot Noir, CA", null, 3300),
  priced("RED", "Mauro Molino Barbera, Italy", null, 2700),
  priced("RED", "Fantini Montepulciano, Italy", null, 3000),
  priced("RED", "Raymond 'R' Merlot, CA", null, 2700),
  priced("RED", "Avignonesi Rosso, Italy", null, 3000),
  priced("RED", "Raymond 'R' Cabernet, CA", null, 3900),
  priced("RED", "Bull by the Horns", null, 3900),
  priced("RED", "Cabernet, CA", null, 3600),
  priced("RED", "Ramirana Syrah Blend, Chile", null, 3600),
];

export const foodCategories = menuCategories.filter(
  (entry) => entry.kind === "food",
);
export const barCategories = menuCategories.filter(
  (entry) => entry.kind === "bar",
);
export const foodMenuItems = menuItems.filter((entry) =>
  entry.categoryId.startsWith("food-"),
);
export const barMenuItems = menuItems.filter((entry) =>
  entry.categoryId.startsWith("bar-"),
);

export const formatPrice = (priceCents: number) => {
  if (!Number.isInteger(priceCents) || priceCents < 0)
    throw new Error("Menu prices must be non-negative integer cents.");
  const dollars = Math.floor(priceCents / 100);
  const cents = priceCents % 100;
  return cents === 0
    ? `$${dollars}`
    : `$${dollars}.${String(cents).padStart(2, "0")}`;
};

export const createMenuStructuredData = (
  name: string,
  categories: MenuCategory[],
  items: MenuItem[],
) => ({
  "@context": "https://schema.org",
  "@type": "Menu",
  name,
  hasMenuSection: categories.map((entry) => ({
    "@type": "MenuSection",
    name: entry.name,
    hasMenuItem: items
      .filter((menuItem) => menuItem.categoryId === entry.id)
      .map((menuItem) => ({
        "@type": "MenuItem",
        name: menuItem.name,
        ...(menuItem.description ? { description: menuItem.description } : {}),
        ...(menuItem.priceCents !== null
          ? {
              offers: {
                "@type": "Offer",
                price: (menuItem.priceCents / 100).toFixed(2),
                priceCurrency: "USD",
              },
            }
          : {}),
      })),
  })),
});

export function validateMenuData() {
  const categoryIds = new Set<string>();
  for (const entry of menuCategories) {
    if (!entry.id || categoryIds.has(entry.id))
      throw new Error(`Invalid or duplicate category ID: ${entry.id}`);
    categoryIds.add(entry.id);
  }
  const itemIds = new Set<string>();
  for (const entry of menuItems) {
    if (!entry.name.trim() || !categoryIds.has(entry.categoryId))
      throw new Error(`Invalid menu item: ${entry.id}`);
    if (itemIds.has(entry.id))
      throw new Error(`Duplicate item ID: ${entry.id}`);
    itemIds.add(entry.id);
    if (
      entry.priceCents !== null &&
      (!Number.isInteger(entry.priceCents) || entry.priceCents < 0)
    )
      throw new Error(`Invalid price: ${entry.id}`);
    if (entry.priceCents === null && !entry.variants?.length)
      throw new Error(`Missing price: ${entry.id}`);
    for (const choice of entry.variants ?? []) {
      if (
        !choice.label.trim() ||
        !Number.isInteger(choice.priceCents) ||
        choice.priceCents < 0
      )
        throw new Error(`Invalid variant: ${entry.id}`);
    }
  }
  return true;
}

validateMenuData();
