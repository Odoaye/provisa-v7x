import { createPageMetadata } from "@/provisa/seo";
import SiteApp from "@/provisa/site-app";

export const metadata = createPageMetadata({
  title: "Admin | Provisa Writers",
  description: "Provisa Writers content administration.",
  path: "/admin",
  noIndex: true,
});

export default function AdminPage() {
  return <SiteApp initialPath="/admin" />;
}