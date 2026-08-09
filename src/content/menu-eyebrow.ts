import type { MenuCategory, MenuKind } from "./menu";

export type MenuSectionEyebrow =
  "Namak menu" | "NAMAK BAR MENU" | "WINES BY THE GLASS" | "WINE LIST";

const bottleWineCategories = new Set(["BUBBLES", "WHITE", "ROSE", "RED"]);

export function getMenuSectionEyebrow(
  activeMenu: MenuKind,
  category: MenuCategory,
): MenuSectionEyebrow {
  if (activeMenu === "food") return "Namak menu";
  if (category.name === "WINES BY THE GLASS") return "WINES BY THE GLASS";
  if (bottleWineCategories.has(category.name)) return "WINE LIST";
  return "NAMAK BAR MENU";
}
