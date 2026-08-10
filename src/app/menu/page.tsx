import type { Metadata } from "next";
import { MenuExperience } from "@/components/menu/MenuExperience";
import { publicMenuMediaPlacements } from "@/content/menu-media";
import {
  createMenuStructuredData,
  foodCategories,
  foodMenuItems,
} from "@/content/menu";
import { PageBreadcrumb } from "@/components/seo/PageBreadcrumb";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata("menu");

export default function Menu() {
  const structuredData = createMenuStructuredData(
    "Namak Food Menu",
    foodCategories,
    foodMenuItems,
  );
  return (
    <>
      <PageBreadcrumb name="Menu" path="/menu" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="interior-hero menu-hero">
        <p className="eyebrow">The menu</p>
        <h1>Built in layers.</h1>
        <p>
          Explore the complete food menu, with descriptions and current prices
          verified from Namak’s physical menu and served at our Greenville
          Avenue Indian restaurant in Dallas.
        </p>
      </section>
      <MenuExperience
        activeMenu="food"
        categories={foodCategories}
        items={foodMenuItems}
        placements={publicMenuMediaPlacements}
      />
    </>
  );
}
