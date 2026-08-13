import type { Metadata } from "next";
import { InteriorPage } from "@/components/site/InteriorPage";
import { VenueGalleryCard } from "@/components/gallery/VenueGalleryCard";
import { galleryImageIds } from "@/content/menu-media";
import { publicGallerySections } from "@/content/venue-media";

const foodGalleryCaptions: Record<(typeof galleryImageIds)[number], string> = {
  "food-classic-chicken-tikka": "Classic Chicken Tikka",
  "food-coconut-carrot-soup": "Coconut Carrot Soup",
  "food-chur-chur-naan": "Chur Chur Naan",
  "food-fish-moilee": "Fish Moilee",
  "food-hyderabadi-chicken-dum-biryani": "Hyderabadi Chicken Dum Biryani",
  "food-papdi-chaat": "Papdi Chaat",
  "venue-main-outdoor": "Namak after dark",
  "food-saag-burrata": "Saag Burrata",
};
export const metadata: Metadata = {
  title: {
    absolute: "Restaurant Gallery | Namak Indian Restaurant & Bar Dallas",
  },
  description:
    "Explore the dining room, bar, food, exterior, and welcoming atmosphere at Namak Indian Restaurant & Bar on Greenville Avenue in Dallas.",
  alternates: { canonical: "https://namakcuisine.com/gallery" },
};
export default function Gallery() {
  const gallerySections = [
    ...publicGallerySections,
    { id: "food", label: "Food", imageIds: galleryImageIds },
  ];

  return (
    <InteriorPage
      eyebrow="Inside Namak"
      title="Come for the flavor. Stay for the warmth."
      intro="Step inside Namak—from the dining room and bar to the dishes and details that make every visit memorable."
    >
      <nav className="gallery-filters" aria-label="Gallery sections">
        {gallerySections.map((section) => (
          <a key={section.id} href={`#${section.id}`}>
            {section.label}
          </a>
        ))}
      </nav>
      {gallerySections.map((section) => (
        <section
          className="gallery-section section"
          id={section.id}
          key={section.id}
        >
          <div className="section-head">
            <div>
              <p className="eyebrow">The gallery</p>
              <h2>{section.label}</h2>
            </div>
          </div>
          <div
            className={`gallery-page gallery-count-${Math.min(section.imageIds.length, 3)}`}
          >
            {section.imageIds.map((imageId) => (
              <VenueGalleryCard
                key={imageId}
                imageId={imageId}
                source={section.id === "food" ? "general" : "venue"}
                caption={
                  section.id === "food"
                    ? foodGalleryCaptions[
                        imageId as keyof typeof foodGalleryCaptions
                      ]
                    : undefined
                }
              />
            ))}
          </div>
        </section>
      ))}
    </InteriorPage>
  );
}
