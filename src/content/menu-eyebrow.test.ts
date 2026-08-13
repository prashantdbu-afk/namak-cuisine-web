import { describe, expect, it } from "vitest";
import { barCategories, foodCategories } from "./menu";
import { getMenuSectionEyebrow } from "./menu-eyebrow";

const barCategory = (name: string) => {
  const category = barCategories.find((entry) => entry.name === name);
  if (!category) throw new Error(`Missing bar category: ${name}`);
  return category;
};

describe("menu section eyebrow labels", () => {
  it.each(["DRAFT BEER", "WHISKEY", "GIN"])(
    "does not label %s as a wine list",
    (name) => {
      expect(getMenuSectionEyebrow("bar", barCategory(name))).toBe(
        "NAMAK BAR MENU",
      );
    },
  );

  it.each(["BUBBLES", "WHITE", "RED"])(
    "labels %s as the bottle wine list",
    (name) => {
      expect(getMenuSectionEyebrow("bar", barCategory(name))).toBe("WINE LIST");
    },
  );

  it("gives wines by the glass its own label", () => {
    expect(
      getMenuSectionEyebrow("bar", barCategory("WINES BY THE GLASS")),
    ).toBe("WINES BY THE GLASS");
  });

  it("preserves the food-menu label", () => {
    expect(getMenuSectionEyebrow("food", foodCategories[0])).toBe("Namak menu");
  });
});
