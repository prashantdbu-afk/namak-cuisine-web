import type { Metadata } from "next";
import { InteriorPage } from "@/components/site/InteriorPage";
import { InquiryForm } from "@/components/forms/InquiryForm";
export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Namak Indian Restaurant & Bar in Dallas.",
  alternates: { canonical: "/contact" },
};
export default function Contact() {
  return (
    <InteriorPage
      eyebrow="Contact"
      title="Start a conversation."
      intro="Questions about your visit? Call our team—we’ll be glad to help."
    >
      <section className="section form-section">
        <InquiryForm />
      </section>
    </InteriorPage>
  );
}
