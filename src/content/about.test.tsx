import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AboutPage, { metadata } from "@/app/about/page";
import { aboutHero, aboutSections } from "./about";
import { getApprovedVenueImage, wideDiningOverviewIds } from "./venue-media";
import { getImageRecord } from "@/media/manifest";

describe("Our Story experience", () => {
  it("uses approved typed content with varied production-ready media", () => {
    expect(aboutSections).toHaveLength(4);
    expect(aboutSections.some(({ imageKind }) => imageKind === "food")).toBe(
      true,
    );
    expect(
      [
        aboutHero.imageId,
        ...aboutSections.map(({ imageId }) => imageId),
      ].filter((id) => wideDiningOverviewIds.has(id)),
    ).toHaveLength(0);

    getApprovedVenueImage(aboutHero.imageId);
    for (const section of aboutSections) {
      const media =
        section.imageKind === "venue"
          ? getApprovedVenueImage(section.imageId)
          : getImageRecord(section.imageId);
      expect(media.rightsStatus).toBe("approved");
      expect(media.productionReady).toBe(true);
      expect(section.editorialLabel).not.toBe(media.alt);
    }
  });

  it("renders approved copy, customer links, captions, and valid schema", () => {
    const { container } = render(<AboutPage />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Rooted in Indian flavor. Made for today.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Where tradition meets fresh ideas."),
    ).toBeVisible();
    expect(screen.getByText("A table made for sharing.")).toBeVisible();
    expect(screen.getByText(/5500 Greenville Ave #600/)).toBeVisible();
    expect(screen.getByText("Bring Namak to your gathering.")).toBeVisible();

    for (const [label, href] of [
      ["Explore the Menu", "/menu"],
      ["Explore the Bar", "/bar"],
      ["Plan Catering", "/catering"],
      ["Visit Namak", "/visit"],
    ]) {
      expect(screen.getAllByRole("link", { name: label })[0]).toHaveAttribute(
        "href",
        href,
      );
    }

    const renderedText = container.textContent ?? "";
    expect(renderedText).not.toContain("OWNER_REVIEW_REQUIRED");
    expect(renderedText).not.toMatch(
      /founder|award-winning|Michelin|executive chef/i,
    );
    for (const image of container.querySelectorAll("img")) {
      expect(renderedText).not.toContain(image.getAttribute("alt") ?? "");
    }

    const schema = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')
        ?.textContent ?? "{}",
    );
    expect(schema["@graph"][0]["@type"]).toBe("BreadcrumbList");
    expect(schema["@graph"][0].itemListElement).toHaveLength(2);
    expect(schema["@graph"][1]["@type"]).toBe("AboutPage");
  });

  it("publishes the exact approved metadata", () => {
    expect(metadata.title).toEqual({
      absolute: "Our Story | Modern Indian Restaurant in Dallas | Namak",
    });
    expect(metadata.description).toBe(
      "Discover Namak on Greenville Avenue in Dallas, where Indian flavors, tandoor cooking, curries, biryani, distinctive drinks, warm hospitality, and catering come together.",
    );
    expect(metadata.alternates).toEqual({
      canonical: "https://namakcuisine.com/about",
    });
  });
});
