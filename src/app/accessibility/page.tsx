import type { Metadata } from "next";
import Link from "next/link";
import { InteriorPage } from "@/components/site/InteriorPage";
export const metadata: Metadata = {
  title: "Accessibility",
  description: "Namak Cuisine website accessibility statement.",
  alternates: { canonical: "/accessibility" },
};
export default function Accessibility() {
  return (
    <InteriorPage
      eyebrow="Our commitment"
      title="A welcome without barriers."
      intro="Namak is committed to providing an accessible digital experience for every guest. We target the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA and consider accessibility throughout the design, content, and maintenance of this website."
    >
      <section
        className="interior-body section"
        aria-labelledby="ongoing-accessibility"
      >
        <h2 id="ongoing-accessibility">Accessibility is an ongoing effort.</h2>
        <p>
          We regularly review this website with automated checks and manual
          keyboard, zoom, reflow, and screen-reader-oriented testing. As
          technology and guidance evolve, we will continue improving the
          experience.
        </p>
        <p>
          If you have difficulty using any part of this website, encounter an
          accessibility barrier, or need restaurant information in another
          format, please call our team at{" "}
          <a href="tel:+12147300047">214-730-0047</a>. Tell us which page or
          feature caused difficulty, and we will do our best to help.
        </p>
        <Link className="button button-dark" href="/contact">
          View contact options
        </Link>
      </section>
    </InteriorPage>
  );
}
