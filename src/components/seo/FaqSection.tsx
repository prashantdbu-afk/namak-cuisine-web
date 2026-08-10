import { JsonLd } from "./JsonLd";
import { createFaqSchema, type FaqEntry } from "@/lib/seo";

export function FaqSection({
  title,
  faqs,
}: {
  title: string;
  faqs: readonly FaqEntry[];
}) {
  return (
    <section className="faq-section section" aria-labelledby="faq-title">
      <JsonLd data={createFaqSchema(faqs)} />
      <div className="section-head">
        <div>
          <p className="eyebrow">Good to know</p>
          <h2 id="faq-title">{title}</h2>
        </div>
      </div>
      <div className="faq-grid">
        {faqs.map((faq) => (
          <article key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
