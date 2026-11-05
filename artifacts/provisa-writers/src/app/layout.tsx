import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "@/provisa/globals.css";
import { siteOrigin } from "@/provisa/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: "Professional Profile & Visa Support | Provisa Writers",
    template: "%s",
  },
  description:
    "Connecting you to international opportunities and pathways that help you grow your career, advance your ambitions, and explore global mobility.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Professional Profile & Visa Support | Provisa Writers",
    description:
      "Connecting you to international opportunities and pathways that help you grow your career, advance your ambitions, and explore global mobility.",
    url: "/",
    siteName: "Provisa Writers",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Profile & Visa Support | Provisa Writers",
    description:
      "Connecting you to international opportunities and pathways that help you grow your career, advance your ambitions, and explore global mobility.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<Analytics /></body></html>;
}