import type { Metadata } from "next";
import SiteApp from "@/provisa/site-app";
import { createPageMetadata } from "@/provisa/seo";
import { getContent } from "@/server/content";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

// Gives each post its own title, description and share picture, so links
// shared on WhatsApp or LinkedIn show the post rather than the home page.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const postId = decodeURIComponent(id);
  const fallback = createPageMetadata({
    title: "Field Notes | Provisa Writers",
    description: "Practical notes from Provisa Writers on global opportunities and professional profiles.",
    path: `/blog/${id}`,
  });
  try {
    const { posts } = await getContent();
    const post = posts.find((entry) => entry.id === postId);
    if (!post) return fallback;
    const description = (post.excerpt || post.body).replace(/\s+/g, " ").trim().slice(0, 160);
    const metadata = createPageMetadata({
      title: `${post.title.trim()} | Provisa Writers`,
      description,
      path: `/blog/${id}`,
    });
    const image = post.image && /^https?:///.test(post.image) ? post.image : null;
    if (!image) return metadata;
    return {
      ...metadata,
      openGraph: { ...metadata.openGraph, type: "article", images: [{ url: image }] },
      twitter: { ...metadata.twitter, images: [image] },
    };
  } catch {
    return fallback;
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params;
  return <SiteApp initialPath={`/blog/${id}`} />;
}
