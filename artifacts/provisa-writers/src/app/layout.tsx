import type { Metadata } from "next";
import "@/provisa/globals.css";
import { siteOrigin } from "@/provisa/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: "Professional Profile & Visa Support | Provisa Writers",
    template: "%s",
  },
  description:
    "Provisa Writers helps professionals prepare clear career profiles and visa application materials for international opportunities.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Professional Profile & Visa Support | Provisa Writers",
    description:
      "Provisa Writers helps professionals prepare clear career profiles and visa application materials for international opportunities.",
    url: "/",
    siteName: "Provisa Writers",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Profile & Visa Support | Provisa Writers",
    description:
      "Provisa Writers helps professionals prepare clear career profiles and visa application materials for international opportunities.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}