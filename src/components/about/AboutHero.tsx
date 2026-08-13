import type { aboutHero } from "@/content/about";
import { StoryMedia } from "./StoryMedia";

export function AboutHero({ content }: { content: typeof aboutHero }) {
  return (
    <header className="about-hero">
      <div className="about-hero-copy">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.heading}</h1>
        <p>{content.introduction}</p>
      </div>
      <StoryMedia
        imageId={content.imageId}
        imageKind="venue"
        editorialLabel={content.editorialLabel}
        priority
      />
    </header>
  );
}
