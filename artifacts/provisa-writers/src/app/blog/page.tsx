import SiteApp from "@/provisa/site-app";
import { createPageMetadata } from "@/provisa/seo";

export const metadata = createPageMetadata({
  title: "Field Notes Blog | Provisa Writers",
  description: "Practical notes from Provisa Writers on global opportunities, professional profiles and preparing for your next move.",
  path: "/blog",
});

export default function BlogPage() {
  return <SiteApp initialPath="/blog" />;
}
