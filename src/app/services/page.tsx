import SiteApp from "@/provisa/site-app";
import { createPageMetadata } from "@/provisa/seo";

export const metadata = createPageMetadata({
  title: "Professional Profile & Visa Services | Provisa Writers",
  description:
    "Explore Provisa Writers' global opportunities consulting, U.S. skilled worker migration support, and visa application assistance.",
  path: "/services",
});

export default function ServicesPage() {
  return <SiteApp initialPath="/services" />;
}