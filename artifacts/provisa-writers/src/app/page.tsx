import { createPageMetadata } from "@/provisa/seo";
import SiteApp from "@/provisa/site-app";

export const metadata = createPageMetadata({
  title: "Professional Profile & Visa Support | Provisa Writers",
  description:
    "Connecting you to international opportunities and pathways that help you grow your career, advance your ambitions, and explore global mobility.",
  path: "/",
});

export default function Page() {
  return <SiteApp initialPath="/" />;
}