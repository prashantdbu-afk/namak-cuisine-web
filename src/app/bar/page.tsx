import type { Metadata } from "next";
import { InteriorPage } from "@/components/site/InteriorPage";
export const metadata: Metadata = {
  title: "Bar",
  description:
    "Discover the evening atmosphere at Namak Indian Restaurant & Bar in Dallas.",
  alternates: { canonical: "/bar" },
};
export default function Bar() {
  return (
    <InteriorPage
      eyebrow="After dark"
      title="A slower kind of evening."
      intro="Settle in for conversation, crafted drinks, and an evening that moves at its own pace."
    />
  );
}
