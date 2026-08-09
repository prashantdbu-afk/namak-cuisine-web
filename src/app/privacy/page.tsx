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
      intro="This website does not submit inquiry forms, create customer accounts, or load advertising, embedded maps, or third-party media. Standard hosting logs may be processed by the hosting provider for security and reliable operation."
    />
  );
}
