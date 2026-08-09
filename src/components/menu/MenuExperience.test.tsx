import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  menuCategories,
  menuItems,
  publishedCategories,
  publishedMenuItems,
} from "@/content/menu";
import { MenuExperience } from "./MenuExperience";

describe("menu experience", () => {
  it("publishes only reconciled items, without prices or hidden records", () => {
    const { container } = render(
      <MenuExperience
        categories={publishedCategories}
        items={publishedMenuItems}
      />,
    );
    expect(container.textContent).not.toContain("$");
    expect(screen.queryByText("Raj Kachori Chat")).toBeNull();
    expect(screen.queryByText("Veg Thali")).toBeNull();
    expect(screen.queryByText("Tandoori Salmon")).toBeNull();
    for (const category of publishedCategories)
      expect(
        screen.getByRole("heading", { name: category.name }),
      ).toBeInTheDocument();
    expect(
      menuCategories.some(
        (category) => category.publicationStatus === "hidden",
      ),
    ).toBe(true);
    expect(menuItems.every((item) => item.price === null)).toBe(true);
    expect(menuCategories).toHaveLength(16);
    expect(publishedCategories).toHaveLength(5);
    expect(menuItems).toHaveLength(128);
    expect(publishedMenuItems).toHaveLength(20);
    expect(
      menuItems.filter((item) => item.publicationStatus === "review"),
    ).toHaveLength(106);
    expect(
      menuItems.filter((item) => item.publicationStatus === "hidden"),
    ).toHaveLength(2);
  });
  it("searches normalized display names case-insensitively and clears", () => {
    render(
      <MenuExperience
        categories={publishedCategories}
        items={publishedMenuItems}
      />,
    );
    const search = screen.getByRole("searchbox", { name: "Search dishes" });
    fireEvent.change(search, { target: { value: "PANEER" } });
    expect(screen.getByText("Bharwan Paneer Tikka")).toBeVisible();
    expect(screen.queryByText("Butter Chicken")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(screen.getByText("Butter Chicken")).toBeVisible();
  });
  it("links every category navigation target to a rendered section", () => {
    const { container } = render(
      <MenuExperience
        categories={publishedCategories}
        items={publishedMenuItems}
      />,
    );
    for (const link of screen
      .getByRole("navigation", { name: "Menu categories" })
      .querySelectorAll("a"))
      expect(container.querySelector(link.getAttribute("href")!)).toBeTruthy();
  });
  it("contains no provider references or image frames without approved images", () => {
    const { container } = render(
      <MenuExperience
        categories={publishedCategories}
        items={publishedMenuItems}
      />,
    );
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("[data-media-frame]")).toBeNull();
    expect(container.textContent).not.toMatch(
      /Toast|Grubhub|DoorDash|Uber Eats|owner approval|placeholder|details forthcoming|source confidence/i,
    );
  });
  it("renders an approved image through ResponsiveImage", () => {
    const approved = [
      { ...publishedMenuItems[0], image: { mediaId: "menu-test-image" } },
    ];
    const categories = publishedCategories.filter(
      (entry) => entry.id === approved[0].categoryId,
    );
    const { container } = render(
      <MenuExperience categories={categories} items={approved} />,
    );
    expect(container.querySelector("[data-media-frame] img")).toHaveAttribute(
      "loading",
      "lazy",
    );
    expect(container.querySelector("img")?.getAttribute("src")).not.toMatch(
      /^https?:/,
    );
  });
});
