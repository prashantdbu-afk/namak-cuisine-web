import type { Metadata } from "next";
import { InteriorPage } from "@/components/site/InteriorPage";
import { about } from "@/content/about";
import { PageBreadcrumb } from "@/components/seo/PageBreadcrumb";
import { createPageMetadata } from "@/lib/seo";
export const metadata: Metadata = createPageMetadata("about");
export default function About() {
  return (
    <>
      <PageBreadcrumb name="Our Story" path="/about" />
      <InteriorPage
        eyebrow={about.eyebrow}
        title={about.title}
        intro={`${about.body} Our Greenville Avenue dining room brings that point of view to Dallas.`}
      />
    </>
  );
}
