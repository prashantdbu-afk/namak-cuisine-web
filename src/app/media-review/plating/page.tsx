import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlatingReviewGrid } from "@/components/media/PlatingReviewGrid";
import { isMediaReviewAvailable } from "@/config/publication";
import { foodProcessingConfig } from "@/media/food-processing-config";

export const metadata: Metadata = {
  title: "Private Plating Compliance Review",
  robots: { index: false, follow: false },
};

export default function PlatingReviewPage() {
  if (!isMediaReviewAvailable()) notFound();
  return (
    <>
      <section className="interior-hero media-review-hero">
        <p className="eyebrow">Private review</p>
        <h1>Plating compliance audit.</h1>
        <p>
          Every source is classified by its actual visible vessel, background,
          camera angle, and lighting. Noncompliant photographs remain private
          while their menu items continue as complete text-only rows.
        </p>
      </section>
      <section className="media-review section">
        <PlatingReviewGrid records={foodProcessingConfig} />
      </section>
    </>
  );
}
