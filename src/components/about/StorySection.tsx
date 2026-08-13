import Link from "next/link";
import type { AboutSection } from "@/content/about";
import { StoryMedia } from "./StoryMedia";

export function StorySection({ section }: { section: AboutSection }) {
  return (
    <section
      className={`story-section story-media-${section.imagePosition} ${section.tone === "dark" ? "story-section-dark" : ""}`}
      id={section.id}
    >
      <div className="story-copy">
        <p className="eyebrow">{section.eyebrow}</p>
        <h2>{section.heading}</h2>
        <p>{section.body}</p>
        {section.link ? (
          <Link className="text-link" href={section.link.href}>
            {section.link.label} <span aria-hidden>→</span>
          </Link>
        ) : null}
      </div>
      <StoryMedia
        imageId={section.imageId}
        imageKind={section.imageKind}
        editorialLabel={section.editorialLabel}
      />
    </section>
  );
}
