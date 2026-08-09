import type { Metadata } from "next";
import { InteriorPage } from "@/components/site/InteriorPage";
export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy information for the Namak Cuisine website.",
  alternates: { canonical: "/privacy" },
};
export default function Privacy() {
  return (
    <InteriorPage
      eyebrow="Legal"
      title="Privacy, plainly stated."
      intro="This website does not submit inquiry forms, create customer accounts, or load advertising. Standard hosting logs may be processed by the hosting provider for security and reliable operation."
    >
      <section className="interior-body section legal-copy">
        <h2>Google Maps</h2>
        <p>
          A static map preview may be delivered through Namak’s website. Google
          Maps interactive content loads only after you choose “View Interactive
          Map.” After that interaction, Google may receive technical connection
          information such as your IP address, browser details, and referring
          page. The website does not automatically request your location.
        </p>
      </section>
    </InteriorPage>
  );
}
