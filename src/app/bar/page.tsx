import type { Metadata } from "next";
import { MenuExperience } from "@/components/menu/MenuExperience";
import { MediaFrame } from "@/components/media/MediaFrame";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { getApprovedVenueImage, venuePlacements } from "@/content/venue-media";
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
      <section className="interior-hero menu-hero bar-menu-hero">
        <div>
          <p className="eyebrow">NAMAK BAR MENU</p>
          <h1>Bar &amp; Wine.</h1>
          <p>
            Explore draft beer, spirits, wines by the glass, and the complete
            wine list.
          </p>
        </div>
        <MediaFrame aspectRatio={5 / 3} className="bar-hero-image">
          <ResponsiveImage
            media={getApprovedVenueImage(venuePlacements.barHero)}
          />
        </MediaFrame>
      </section>
      <MenuExperience
        activeMenu="bar"
        categories={barCategories}
        items={barMenuItems}
        categoryMedia={[]}
      />
    </>
  );
}
