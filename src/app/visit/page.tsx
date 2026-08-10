import type { Metadata } from "next";
import { InteriorPage } from "@/components/site/InteriorPage";
import { getMapConfiguration } from "@/config/map";
import { RestaurantMap } from "@/components/site/RestaurantMap";
import { PageBreadcrumb } from "@/components/seo/PageBreadcrumb";
import { FaqSection } from "@/components/seo/FaqSection";
import { visitFaqs } from "@/content/faqs";
import { createPageMetadata } from "@/lib/seo";
export const dynamic = "force-dynamic";
export const metadata: Metadata = createPageMetadata("visit");
export default function Visit() {
  return (
    <>
      <PageBreadcrumb name="Visit" path="/visit" />
      <InteriorPage
        eyebrow="Visit Namak"
        title="We’ll meet you on Greenville."
        intro="Find Namak Indian Restaurant & Bar on Greenville Avenue in Dallas, with current hours, directions, and contact details below."
      >
        <section className="visit-page section">
          <RestaurantMap configuration={getMapConfiguration()} />
        </section>
        <FaqSection title="Planning your visit." faqs={visitFaqs} />
      </InteriorPage>
    </>
  );
}
