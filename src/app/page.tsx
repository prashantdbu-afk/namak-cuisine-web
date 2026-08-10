import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";
import { createPageMetadata } from "@/lib/seo";
export const dynamic = "force-dynamic";
export const metadata: Metadata = createPageMetadata("home");
export default function Page() {
  return <HomePage />;
}
