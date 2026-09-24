import type { Metadata } from "next";
import "@/provisa/globals.css";

export const metadata: Metadata = {
  title: "Provisa Writers",
  description: "Connecting professionals to global opportunities.",
  openGraph: {
    title: "Provisa Writers",
    description: "Connecting professionals to global opportunities.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}