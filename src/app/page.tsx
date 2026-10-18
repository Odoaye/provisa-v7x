import { createPageMetadata } from "@/provisa/seo";
import SiteApp from "@/provisa/site-app";

export const metadata = createPageMetadata({
  title: "Professional Profile & Visa Support | Provisa Writers",
  description:
    "Provisa Writers helps professionals prepare clear career profiles and visa application materials for international opportunities.",
  path: "/",
});

export default function Page() {
  return <SiteApp initialPath="/" />;
}