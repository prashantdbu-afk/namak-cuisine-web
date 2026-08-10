import type { Metadata } from "next";
import { InteriorPage } from "@/components/site/InteriorPage";
import { PageBreadcrumb } from "@/components/seo/PageBreadcrumb";
import { createPageMetadata } from "@/lib/seo";
export const metadata: Metadata = createPageMetadata("accessibility");
export default function Accessibility() {
  return (
    <>
      <PageBreadcrumb name="Accessibility" path="/accessibility" />
      <InteriorPage
        eyebrow="Our commitment"
        title="A welcome without barriers."
        intro="We aim for a website that works across devices and assistive technologies, with semantic structure, keyboard access, visible focus, strong contrast, reduced-motion support, and generous touch targets. If something prevents you from using this site, please call us so we can help and improve it."
      />
    </>
  );
}
