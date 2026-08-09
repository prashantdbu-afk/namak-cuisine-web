import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  barCategories,
  barMenuItems,
  foodCategories,
  foodMenuItems,
  formatPrice,
  menuCategories,
  menuItems,
  validateMenuData,
} from "@/content/menu";
import { MenuExperience } from "./MenuExperience";
import { publicMenuMediaPlacements } from "@/content/menu-media";
import { barCategoryMedia } from "@/content/bar-media";

describe("physical menu data", () => {
  it("uses exact public names, printed categories, and integer-cent prices", () => {
    expect(validateMenuData()).toBe(true);
    expect(menuCategories.map((entry) => entry.name)).toContain(
      "EMBERS NON-VEG",
    );
    expect(
      menuItems.find((entry) => entry.name === "Buratta Bomb"),
    ).toMatchObject({ priceCents: 1200 });
    expect(menuItems.some((entry) => entry.name === "Burrata Bomb")).toBe(
      false,
    );
    expect(
      menuItems.every(
        (entry) =>
          entry.priceCents === null || Number.isInteger(entry.priceCents),
      ),
    ).toBe(true);
    expect(formatPrice(1200)).toBe("$12");
    expect(formatPrice(650)).toBe("$6.50");
    expect(formatPrice(2200)).toBe("$22");
    expect(formatPrice(2200)).not.toBe("$22.00");
  });

  it("renders food prices, descriptions, and exact names", () => {
    render(
      <MenuExperience
        activeMenu="food"
        categories={foodCategories}
        items={foodMenuItems}
      />,
    );
    expect(screen.getByText("Buratta Bomb")).toBeVisible();
    expect(screen.getAllByText("$12").length).toBeGreaterThan(0);
    expect(screen.getByText(/mashed potatoes and cheese/i)).toBeVisible();
    expect(screen.getByRole("link", { name: "Bar & Wine" })).toHaveAttribute(
      "href",
      "/bar",
    );
  });

  it("lazy-loads selected menu media without creating empty frames", () => {
    const { container } = render(
      <MenuExperience
        activeMenu="food"
        categories={foodCategories}
        items={foodMenuItems}
        placements={publicMenuMediaPlacements}
      />,
    );
    expect(container.querySelectorAll("[data-media-frame]")).toHaveLength(
      publicMenuMediaPlacements.length,
    );
    expect(container.querySelectorAll('img[loading="lazy"]')).toHaveLength(
      publicMenuMediaPlacements.length,
    );
    expect(container.querySelectorAll(".menu-food-image")).toHaveLength(
      publicMenuMediaPlacements.length,
    );
    expect(container.querySelectorAll(".priced-menu-item")).toHaveLength(
      foodMenuItems.length,
    );
  });

  it("searches descriptions and aliases without changing the visible name", () => {
    render(
      <MenuExperience
        activeMenu="food"
        categories={foodCategories}
        items={foodMenuItems}
      />,
    );
    const search = screen.getByRole("searchbox", { name: "Search dishes" });
    fireEvent.change(search, { target: { value: "Burrata Bomb" } });
    expect(screen.getByText("Buratta Bomb")).toBeVisible();
    expect(screen.queryByText("Burrata Bomb")).toBeNull();
    fireEvent.change(search, { target: { value: "black lentils" } });
    expect(screen.getByText("Dal Makhani")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(screen.getByText("Butter Chicken")).toBeVisible();
  });

  it("renders bar and wine prices with Taj Mahal variants", () => {
    render(
      <MenuExperience
        activeMenu="bar"
        categories={barCategories}
        items={barMenuItems}
      />,
    );
    expect(screen.getByText("Taj Mahal")).toBeVisible();
    expect(screen.getByText("330ml")).toBeVisible();
    expect(screen.getByText("650ml")).toBeVisible();
    expect(screen.getAllByText("$7").length).toBeGreaterThan(0);
    expect(screen.getAllByText("$9").length).toBeGreaterThan(0);
    expect(screen.getByText("Ramirana Syrah Blend, Chile")).toBeVisible();
    expect(screen.getByRole("link", { name: "Food Menu" })).toHaveAttribute(
      "href",
      "/menu",
    );
  });

  it("uses lazy editorial imagery only at bar category level", () => {
    const { container } = render(
      <MenuExperience
        activeMenu="bar"
        categories={barCategories}
        items={barMenuItems}
        categoryMedia={barCategoryMedia}
      />,
    );
    expect(container.querySelectorAll(".bar-category-feature")).toHaveLength(
      11,
    );
    expect(
      container.querySelectorAll('.bar-category-feature img[loading="lazy"]'),
    ).toHaveLength(11);
    expect(container.querySelectorAll(".priced-menu-item img")).toHaveLength(0);
    for (const feature of container.querySelectorAll(".bar-category-feature")) {
      const heading = feature.parentElement?.querySelector("h2");
      expect(
        feature.compareDocumentPosition(heading as Node) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    }
    expect(container.textContent).not.toMatch(/pexels\.com|images\.pexels/i);
  });

  it("keeps internal and third-party review language out of public output", () => {
    const { container } = render(
      <MenuExperience
        activeMenu="bar"
        categories={barCategories}
        items={barMenuItems}
      />,
    );
    expect(container.textContent).not.toMatch(
      /Toast|Grubhub|DoorDash|Uber Eats|owner approval|source confidence/i,
    );
  });
});
