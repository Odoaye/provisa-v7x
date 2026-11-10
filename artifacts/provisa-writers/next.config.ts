import type { NextConfig } from "next";

// Pages from the old website that Google still lists. Send visitors to the
// closest page on the current site instead of a "page not found" error.
const oldSiteRedirects = [
  { source: "/about", destination: "/#about" },
  { source: "/service", destination: "/services" },
  { source: "/service/:slug*", destination: "/services" },
  { source: "/services/immigration-writing", destination: "/services/visa-application-support" },
  { source: "/testimonial", destination: "/testimonials" },
  { source: "/contact", destination: "/#contact" },
  { source: "/faq", destination: "/" },
  { source: "/news", destination: "/" },
  { source: "/blog", destination: "/" },
  { source: "/blog/:slug*", destination: "/" },
  { source: "/category/:slug*", destination: "/" },
  { source: "/tag/:slug*", destination: "/" },
  { source: "/author/:slug*", destination: "/" },
  { source: "/feed", destination: "/" },
  { source: "/top-5-mistakes-to-avoid-in-your-eb-2-niw-petition-letter", destination: "/" },
  { source: "/how-to-write-powerful-letters-of-recommendation-for-u-s-immigration-petitions", destination: "/" },
  { source: "/academic-cv-vs-professional-resume-whats-the-difference-and-which-one-do-you-need", destination: "/" },
  { source: "/why-generic-letters-fail-and-how-to-craft-ones-that-truly-persuade-uscis", destination: "/" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@workspace/db"],
  images: { unoptimized: true },
  async redirects() {
    return oldSiteRedirects.map((rule) => ({ ...rule, permanent: true }));
  },
};

export default nextConfig;
