import { describe, expect, it } from "vitest";
import { getOpeningHoursSpecification } from "@/content/hours";
import { cateringFaqs, visitFaqs } from "@/content/faqs";
import {
  createBreadcrumbSchema,
  createFaqSchema,
  createPageMetadata,
  createRestaurantSchema,
  publicPageSeo,
} from "./seo";

describe("public SEO metadata", () => {
  it("uses unique titles and descriptions in the requested length range", () => {
    const entries = Object.values(publicPageSeo);
    expect(new Set(entries.map((entry) => entry.title)).size).toBe(
      entries.length,
    );
    expect(new Set(entries.map((entry) => entry.description)).size).toBe(
      entries.length,
    );
    for (const entry of entries) {
      expect(entry.description.length, entry.path).toBeGreaterThanOrEqual(140);
      expect(entry.description.length, entry.path).toBeLessThanOrEqual(160);
    }
  });

  it("creates canonical, Open Graph, and Twitter metadata", () => {
    const metadata = createPageMetadata("menu");
    expect(metadata.title).toEqual({
      absolute: "Indian Restaurant Menu in Dallas | Namak",
    });
    expect(metadata.alternates).toEqual({ canonical: "/menu" });
    expect(metadata.openGraph).toMatchObject({ url: "/menu" });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
  });
});

describe("structured data", () => {
  it("creates canonical breadcrumbs", () => {
    const schema = createBreadcrumbSchema("Bar", "/bar");
    expect(schema).toMatchObject({ "@type": "BreadcrumbList" });
    expect(schema.itemListElement).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ position: 2, name: "Bar" }),
      ]),
    );
  });

  it("keeps visible FAQ copy and schema aligned", () => {
    for (const faqs of [visitFaqs, cateringFaqs]) {
      const schema = createFaqSchema(faqs);
      expect(schema.mainEntity).toHaveLength(faqs.length);
      expect(schema.mainEntity[0]).toMatchObject({
        name: faqs[0].question,
        acceptedAnswer: { text: faqs[0].answer },
      });
    }
  });

  it("uses verified Restaurant fields and never invents ratings", () => {
    const schema = createRestaurantSchema(getOpeningHoursSpecification());
    expect(schema).toMatchObject({
      "@type": "Restaurant",
      telephone: "214-730-0047",
      menu: "https://namakcuisine.com/menu",
      hasMap: expect.stringContaining("google.com/maps"),
    });
    expect(schema.openingHoursSpecification).not.toHaveLength(0);
    expect(schema).not.toHaveProperty("aggregateRating");
    expect(schema).not.toHaveProperty("review");
  });
});
