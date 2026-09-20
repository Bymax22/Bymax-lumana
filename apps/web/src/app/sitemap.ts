import type { MetadataRoute } from 'next';

const publicRoutes = [
  '/',
  '/vehicles',
  '/hire',
  '/shop',
  '/auctions',
  '/dealers',
  '/services',
  '/finance',
  '/import-calculator',
  '/shipping-calculator',
  '/track-shipment',
  '/blog',
  '/about',
  '/contact',
];

function siteOrigin() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lumanainvestment.com').replace(/\/$/, '');
}

async function getPublicItems(path: string) {
  const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
  if (!apiBase) return [];

  try {
    const response = await fetch(`${apiBase}${path}`, { next: { revalidate: 3600 } });
    if (!response.ok) return [];
    const payload = await response.json();
    return Array.isArray(payload) ? payload : payload?.data || payload?.items || [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteOrigin();
  const now = new Date();
  const [vehicles, rentalVehicles, products] = await Promise.all([
    getPublicItems('/vehicles'),
    getPublicItems('/hire/vehicles?take=50'),
    getPublicItems('/shop/products?take=50'),
  ]);

  return [
    ...publicRoutes.map((route) => ({ url: `${origin}${route}`, lastModified: now, changeFrequency: 'daily' as const, priority: route === '/' ? 1 : 0.7 })),
    ...vehicles.filter((item: any) => item?.id).map((item: any) => ({ url: `${origin}/vehicles/${item.id}`, lastModified: item.updatedAt || now, changeFrequency: 'daily' as const, priority: 0.8 })),
    ...rentalVehicles.filter((item: any) => item?.id).map((item: any) => ({ url: `${origin}/hire/${item.id}`, lastModified: item.updatedAt || now, changeFrequency: 'daily' as const, priority: 0.8 })),
    ...products.filter((item: any) => item?.id).map((item: any) => ({ url: `${origin}/shop/${item.id}`, lastModified: item.updatedAt || now, changeFrequency: 'weekly' as const, priority: 0.7 })),
  ];
}
