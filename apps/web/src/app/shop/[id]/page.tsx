import { publicApi } from '@/lib/publicApi';
import ProductDetailClient from '@/components/ProductDetailClient';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await publicApi(`/shop/products/${id}`).catch(() => null);
  if (!product) return { title: 'Product | Lumana AutoPlanet' };
  const image = product.imageUrl || product.images?.[0]?.url || product.images?.[0];
  return { title: product.name, description: product.description || `${product.name} available from Lumana AutoPlanet.`, openGraph: { title: product.name, description: product.description || product.name, images: image ? [image] : [] } };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await publicApi(`/shop/products/${id}`).catch(() => null);

  if (!product) {
    return <div className="rounded-[24px] bg-[#121212] p-6 text-slate-300">Product not found</div>;
  }

  return (
    <section className="space-y-6">
      <ProductDetailClient product={product} />
    </section>
  );
}
