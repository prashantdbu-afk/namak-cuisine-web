import type { Metadata } from "next";
import { MenuExperience } from "@/components/menu/MenuExperience";
import { publishedCategories, publishedMenuItems } from "@/content/menu";

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
  return (
    <>
      <section className="interior-hero menu-hero">
        <p className="eyebrow">The menu</p>
        <h1>Built in layers.</h1>
        <p>
          Explore a focused selection from Namak’s menu, gathered for the table
          and shaped by the depth and range of Indian cooking.
        </p>
      </section>
      <MenuExperience
        categories={publishedCategories}
        items={publishedMenuItems}
      />
    </>
  );
}
