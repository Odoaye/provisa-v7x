import SiteApp from '../site-app';

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const initialPath = slug.length === 0 ? '/' : `/${slug.join('/')}`;

  return <SiteApp initialPath={initialPath} />;
}