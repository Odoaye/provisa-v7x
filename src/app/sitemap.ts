import type { MetadataRoute } from "next";
import { serviceCatalog } from "@/provisa/service-catalog";
import { siteOrigin } from "@/provisa/seo";

const fixedPaths = [
  "/",
  "/founder",
  "/services",
  "/testimonials",
  "/legal/privacy-policy",
  "/legal/terms-of-use",
  "/legal/disclaimer",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...fixedPaths,
    ...serviceCatalog.map(({ slug }) => `/services/${slug}`),
  ];

  return paths.map((path) => ({
    url: new URL(path, siteOrigin).toString(),
  }));
}
