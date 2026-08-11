import type { Metadata } from "next";
import { InteriorPage } from "@/components/site/InteriorPage";
import { VenueGalleryCard } from "@/components/gallery/VenueGalleryCard";
import { galleryImageIds } from "@/content/menu-media";
import { venueGallerySections } from "@/content/venue-media";

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
  title: "Gallery",
  description: "A visual preview of the Namak experience in Dallas.",
  alternates: { canonical: "/gallery" },
};
export default function Gallery() {
  return (
    <InteriorPage
      eyebrow="The gallery"
      title="Atmosphere, in fragments."
      intro="Light, color, fire, and the quiet details that shape an evening at Namak."
    >
      <nav className="gallery-filters" aria-label="Gallery sections">
        {[
          ...venueGallerySections,
          { id: "food", label: "Food", imageIds: galleryImageIds },
        ].map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-disabled={section.imageIds.length === 0 || undefined}
          >
            {section.label}
            {section.imageIds.length === 0 ? " · photography in review" : ""}
          </a>
        ))}
      </nav>
      {[
        ...venueGallerySections,
        { id: "food", label: "Food", imageIds: galleryImageIds },
      ].map((section) => (
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
          {section.imageIds.length === 0 ? (
            <p className="gallery-review-note">
              Kitchen photography is being reviewed. We will publish it only
              when it meets the same quality and privacy standard as the rest of
              the gallery.
            </p>
          ) : (
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
          )}
        </section>
      ))}
    </InteriorPage>
  );
}
