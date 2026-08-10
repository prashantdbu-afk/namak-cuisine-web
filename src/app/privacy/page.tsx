import type { Metadata } from "next";
import { InteriorPage } from "@/components/site/InteriorPage";
import { PageBreadcrumb } from "@/components/seo/PageBreadcrumb";
import { createPageMetadata } from "@/lib/seo";
export const metadata: Metadata = createPageMetadata("privacy");
export default function Privacy() {
  return (
    <>
      <PageBreadcrumb name="Privacy" path="/privacy" />
      <InteriorPage
        eyebrow="Legal"
        title="Privacy, plainly stated."
        intro="Namak collects only the information needed to respond to direct inquiries. The website does not create customer accounts or automatically enroll visitors in marketing."
      >
        <section className="interior-body section legal-copy">
          <h2>Catering inquiries</h2>
          <p>
            A catering inquiry may include your name, email, phone number, event
            category, function or ceremony name, event date, event location,
            estimated guest count, food preference, selected menu interests, and
            additional notes you choose to provide.
          </p>
          <p>
            Namak uses this information to review your inquiry, contact you, and
            discuss availability, menu options, catering details, and pricing.
            Submitting an inquiry does not create a confirmed booking, and it
            does not subscribe you to marketing.
          </p>
          <h2>Google Maps</h2>
          <p>
            A static map preview may be delivered through Namak’s website.
            Google Maps interactive content loads only after you choose “View
            Interactive Map.” After that interaction, Google may receive
            technical connection information such as your IP address, browser
            details, and referring page. The website does not automatically
            request your location.
          </p>
          <h2>Website analytics</h2>
          <p>
            When configured, Namak uses Google Analytics or Google Tag Manager
            to understand page visits and actions such as menu views, calls,
            directions, reservations, social links, and catering inquiries.
            These tools may receive technical information such as device,
            browser, approximate location, and interaction data. Namak does not
            send the contents of inquiry forms to analytics platforms.
          </p>
        </section>
      </InteriorPage>
    </>
  );
}
