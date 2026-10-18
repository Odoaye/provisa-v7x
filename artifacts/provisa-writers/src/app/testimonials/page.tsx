import SiteApp from "@/provisa/site-app";
import { createPageMetadata } from "@/provisa/seo";

export const metadata = createPageMetadata({
  title: "Testimonials | Provisa Writers",
  description: "Read testimonials shared by professionals who have worked with Provisa Writers.",
  path: "/testimonials",
});

export default function TestimonialsPage() {
  return <SiteApp initialPath="/testimonials" />;
}