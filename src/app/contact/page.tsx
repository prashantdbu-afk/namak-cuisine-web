import type { Metadata } from "next";
import { InteriorPage } from "@/components/site/InteriorPage";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { PageBreadcrumb } from "@/components/seo/PageBreadcrumb";
import { createPageMetadata } from "@/lib/seo";
export const metadata: Metadata = createPageMetadata("contact");
export default function Contact() {
  return (
    <>
      <PageBreadcrumb name="Contact" path="/contact" />
      <InteriorPage
        eyebrow="Contact"
        title="Start a conversation."
        intro="Questions about visiting our Indian restaurant and bar on Greenville Avenue in Dallas? Call our team—we’ll be glad to help."
      >
        <section className="section form-section">
          <InquiryForm />
        </section>
      </InteriorPage>
    </>
  );
}
