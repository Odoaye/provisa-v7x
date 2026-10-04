import type { Metadata } from "next";
import SiteApp from "@/provisa/site-app";

export const metadata: Metadata = {
  title: "Testimonials | Provisa Writers",
  description: "Read testimonials shared by professionals who have worked with Provisa Writers.",
  openGraph: {
    title: "Testimonials | Provisa Writers",
    description: "Read testimonials shared by professionals who have worked with Provisa Writers.",
    type: "website",
  },
};

export default function TestimonialsPage() {
  return <SiteApp initialPath="/testimonials" />;
}