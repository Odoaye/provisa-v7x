import type { Metadata } from "next";
import SiteApp from "@/provisa/site-app";

const title = "Our Services | Provisa Writers";
const description =
  "Explore Provisa Writers' global opportunities consulting, U.S. skilled worker migration, and visa application support.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website" },
};

export default function ServicesPage() {
  return <SiteApp initialPath="/services" />;
}