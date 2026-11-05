import type { Metadata } from "next";

export const siteOrigin = "https://www.provisawriters.com";

export const shareImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Provisa Writers: connecting professionals to global opportunities",
};

type PageSeo = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageSeo): Metadata {
  return {
    title,
    description,
    ...(noIndex
      ? { robots: { index: false, follow: false } }
      : {
          alternates: { canonical: path },
          openGraph: {
            title,
            description,
            url: path,
            siteName: "Provisa Writers",
            type: "website",
            images: [shareImage],
          },
          twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [shareImage.url],
          },
        }),
  };
}
