import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { StoryCTA } from "@/components/about/StoryCTA";
import { StorySection } from "@/components/about/StorySection";
import { site } from "@/config/site";
import { aboutClosing, aboutHero, aboutSections } from "@/content/about";

export const metadata: Metadata = {
  title: { absolute: "Our Story | Modern Indian Restaurant in Dallas | Namak" },
  description:
    "Discover Namak on Greenville Avenue in Dallas, where Indian flavors, tandoor cooking, curries, biryani, distinctive drinks, warm hospitality, and catering come together.",
  alternates: { canonical: "https://namakcuisine.com/about" },
};

export default function AboutPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: site.domain,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Our Story",
            item: `${site.domain}/about`,
          },
        ],
      },
      {
        "@type": "AboutPage",
        name: "Our Story",
        url: `${site.domain}/about`,
        description: metadata.description,
      },
    ],
  };

  return (
    <div className="about-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <AboutHero content={aboutHero} />
      <div className="about-story">
        {aboutSections.map((section) => (
          <StorySection key={section.id} section={section} />
        ))}
      </div>
      <StoryCTA content={aboutClosing} />
    </div>
  );
}
