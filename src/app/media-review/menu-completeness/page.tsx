import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MenuCompletenessGrid } from "@/components/media/MenuCompletenessGrid";
import { isMediaReviewAvailable } from "@/config/publication";

export const metadata: Metadata = {
  title: "Full Menu Image Completeness",
  robots: { index: false, follow: false },
};

export default function MenuCompletenessPage() {
  if (!isMediaReviewAvailable()) notFound();
  return (
    <>
      <section className="interior-hero media-review-hero">
        <p className="eyebrow">Private review</p>
        <h1>Full menu image completeness.</h1>
        <p>
          Every owner-supplied food photograph, its exact menu mapping, final
          rendering, visibility, and internal presentation tier. This page is
          excluded from navigation and search indexing.
        </p>
      </section>
      <section className="media-review section">
        <MenuCompletenessGrid />
      </section>
    </>
  );
}
