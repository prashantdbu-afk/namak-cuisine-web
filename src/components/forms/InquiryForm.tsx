import { integrations } from "@/config/integrations";
import { site } from "@/config/site";

export function InquiryForm({
  kind = "general",
}: {
  kind?: "general" | "private";
}) {
  const external =
    integrations.contactForm.mode === "external" &&
    integrations.contactForm.externalUrl;
  return (
    <div className="contact-cta" data-inquiry-kind={kind}>
      <p className="eyebrow dark">Speak with our team</p>
      <h2>
        {kind === "private"
          ? "Tell us about your gathering."
          : "We’re here to help."}
      </h2>
      <p>Call Namak directly for personal assistance.</p>
      <div className="button-row">
        <a className="button button-dark" href={site.phoneHref}>
          Call {site.phone}
        </a>
        {external && (
          <a className="button button-dark" href={external}>
            Open inquiry form
          </a>
        )}
      </div>
    </div>
  );
}
