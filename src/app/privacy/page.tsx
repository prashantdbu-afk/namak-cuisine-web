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
      intro="Namak collects only the information needed to respond to direct inquiries. The website does not create customer accounts, automatically enroll visitors in marketing, or load advertising."
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
          Submitting an inquiry does not create a confirmed booking, and it does
          not subscribe you to marketing.
        </p>
        <h2>Google Maps</h2>
        <p>
          A static map preview may be delivered through Namak’s website. Google
          Maps interactive content loads only after you choose “View Interactive
          Map.” After that interaction, Google may receive technical connection
          information such as your IP address, browser details, and referring
          page. The website does not automatically request your location.
        </p>
        <h2>Website analytics</h2>
        <p>
          On the production website, Namak uses Google Analytics to understand
          how visitors use the site and which restaurant actions, such as calls
          or direction requests, are most helpful. Google may process technical
          information about your device, browser, and interactions under its own
          privacy terms. Namak does not send catering form entries, names, email
          addresses, phone numbers, or notes to Google Analytics.
        </p>
        <p>
          When Namak&apos;s first-party analytics is enabled, the site uses a
          random visitor identifier and a random session identifier to count
          visits and understand actions such as Menu views, calls, and direction
          requests. It does not use fingerprinting or collect form contents for
          analytics, and the analytics database does not retain full IP
          addresses.
        </p>
      </section>
    </InteriorPage>
  );
}
