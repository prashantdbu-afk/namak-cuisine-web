import { JsonLd } from "./JsonLd";
import { createBreadcrumbSchema } from "@/lib/seo";

export function PageBreadcrumb({ name, path }: { name: string; path: string }) {
  return <JsonLd data={createBreadcrumbSchema(name, path)} />;
}
