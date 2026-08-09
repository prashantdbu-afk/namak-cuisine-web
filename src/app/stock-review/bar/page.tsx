import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BarStockReview } from "@/components/media/BarStockReview";
import { isStockReviewAvailable } from "@/config/publication";

export const metadata: Metadata = {
  title: "Bar Stock Review",
  robots: { index: false, follow: false },
};

export default function BarStockReviewPage() {
  if (!isStockReviewAvailable()) notFound();
  return (
    <>
      <section className="interior-hero">
        <p className="eyebrow">Private review</p>
        <h1>Licensed bar stock curation.</h1>
        <p>
          One hero and eleven editorial category slots, each with one
          recommendation and two alternates. Source links are available only in
          this review environment.
        </p>
      </section>
      <BarStockReview />
    </>
  );
}
