import Link from "next/link";
import type { aboutClosing } from "@/content/about";

export function StoryCTA({ content }: { content: typeof aboutClosing }) {
  return (
    <section className="story-cta" aria-labelledby="story-cta-title">
      <p className="eyebrow">Visit · Dine · Gather</p>
      <h2 id="story-cta-title">{content.heading}</h2>
      <div className="button-row">
        {content.actions.map((action, index) => (
          <Link
            className={`button ${index === 0 ? "button-light" : "button-quiet"}`}
            href={action.href}
            key={action.href}
          >
            {action.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
