import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MediaReviewGrid } from "@/components/media/MediaReviewGrid";
import { isMediaReviewAvailable } from "@/config/publication";
import { foodProcessingConfig } from "@/media/food-processing-config";

export const metadata: Metadata = {
  title: "Food Media Review",
  robots: { index: false, follow: false },
};

export default function MediaReviewPage() {
  if (!isMediaReviewAvailable()) notFound();
  return (
    <>
      <section className="interior-hero media-review-hero">
        <p className="eyebrow">Private review</p>
        <h1>Food media contact sheet.</h1>
        <p>
          Original sources, previous processing, enhanced masters, responsive
          crops, mappings, completeness, and duplicate checks. This page is
          excluded from navigation and search indexing.
        </p>
      </section>
      <section className="media-review section">
        <MediaReviewGrid records={foodProcessingConfig} />
      </section>
    </>
  );
}
