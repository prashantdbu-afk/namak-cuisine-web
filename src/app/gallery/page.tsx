import type { Metadata } from "next";
import { InteriorPage } from "@/components/site/InteriorPage";
import { galleryItems } from "@/content/gallery";
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
      <section className="gallery-page section">
        {galleryItems.map((x, i) => (
          <figure key={x} className={`gallery-shot shot-${(i % 3) + 1}`}>
            <div role="img" aria-label={`Abstract study: ${x}`} />
            <figcaption>{x}</figcaption>
          </figure>
        ))}
      </section>
    </InteriorPage>
  );
}
