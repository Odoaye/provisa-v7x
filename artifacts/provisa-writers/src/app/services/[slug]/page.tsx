import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteApp from "@/provisa/site-app";
import { getServiceBySlug, serviceCatalog } from "@/provisa/service-catalog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceCatalog.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service | Provisa Writers" };

  const title = `${service.title} | Provisa Writers`;
  return {
    title,
    description: service.detail,
    openGraph: { title, description: service.detail, type: "website" },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return <SiteApp initialPath={`/services/${service.slug}`} />;
}