import type { Metadata } from "next";
import { InteriorPage } from "@/components/site/InteriorPage";
import { about } from "@/content/about";
export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Learn about the point of view behind Namak Indian Restaurant & Bar.",
  alternates: { canonical: "/about" },
};
export default function About() {
  return (
    <InteriorPage
      eyebrow={about.eyebrow}
      title={about.title}
      intro={about.body}
    />
  );
}
