import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteApp from "@/provisa/site-app";
import { getLegalDocumentBySlug, legalDocuments } from "@/provisa/legal-content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return legalDocuments.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const document = getLegalDocumentBySlug(slug);
  if (!document) return { title: "Legal Information | Provisa Writers" };

  const title = `${document.title} | Provisa Writers`;
  return {
    title,
    description: document.summary,
    openGraph: { title, description: document.summary, type: "website" },
  };
}

export default async function LegalDocumentPage({ params }: PageProps) {
  const { slug } = await params;
  const document = getLegalDocumentBySlug(slug);
  if (!document) notFound();

  return <SiteApp initialPath={`/legal/${document.slug}`} />;
}