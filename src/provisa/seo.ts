import type { Metadata } from "next";

export const siteOrigin = "https://www.provisawriters.com";

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
          },
          twitter: {
            card: "summary_large_image",
            title,
            description,
          },
        }),
  };
}
