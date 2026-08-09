import type { Metadata } from "next";
import { MenuExperience } from "@/components/menu/MenuExperience";
import {
  createMenuStructuredData,
  foodCategories,
  foodMenuItems,
} from "@/content/menu";

export const metadata: Metadata = {
  title: "Indian Restaurant Menu in Dallas",
  description:
    "Explore the Namak Indian Restaurant & Bar menu on Greenville Avenue in Dallas, including soups, chaat, tandoor selections, and entrées.",
  keywords: [
    "Indian restaurant menu Dallas",
    "Indian restaurant Greenville Avenue Dallas",
    "Namak Indian Restaurant & Bar menu",
  ],
  alternates: { canonical: "/menu" },
};

export default function Menu() {
  const structuredData = createMenuStructuredData(
    "Namak Food Menu",
    foodCategories,
    foodMenuItems,
  );
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="interior-hero menu-hero">
        <p className="eyebrow">The menu</p>
        <h1>Built in layers.</h1>
        <p>
          Explore the complete food menu, with descriptions and current prices
          verified from Namak’s physical menu.
        </p>
      </section>
      <MenuExperience
        activeMenu="food"
        categories={foodCategories}
        items={foodMenuItems}
      />
    </>
  );
}
