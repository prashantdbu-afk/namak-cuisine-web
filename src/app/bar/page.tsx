import type { Metadata } from "next";
import { MenuExperience } from "@/components/menu/MenuExperience";
import {
  barCategories,
  barMenuItems,
  createMenuStructuredData,
} from "@/content/menu";

export const metadata: Metadata = {
  title: "Bar & Wine Menu",
  description:
    "Explore Namak’s draft beer, spirits, wines by the glass, and full wine list in Dallas.",
  alternates: { canonical: "/bar" },
};

export default function Bar() {
  const structuredData = createMenuStructuredData(
    "Namak Bar Menu and Wine List",
    barCategories,
    barMenuItems,
  );
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="interior-hero menu-hero">
        <p className="eyebrow">NAMAK BAR MENU</p>
        <h1>Bar &amp; Wine.</h1>
        <p>
          Explore draft beer, spirits, wines by the glass, and the complete wine
          list.
        </p>
      </section>
      <MenuExperience
        activeMenu="bar"
        categories={barCategories}
        items={barMenuItems}
      />
    </>
  );
}
