import { createPageMetadata } from "@/provisa/seo";
import SiteApp from "@/provisa/site-app";

export const metadata = createPageMetadata({
  title: "Meet the Founder | Provisa Writers",
  description:
    "Meet the team behind Provisa Writers and learn about its work supporting professionals pursuing global career opportunities.",
  path: "/founder",
});

export default function FounderPage() {
  return <SiteApp initialPath="/founder" />;
}