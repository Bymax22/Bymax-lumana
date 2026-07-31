import { publicApi } from '@/lib/publicApi';
import ProductDetailClient from '@/components/ProductDetailClient';

interface Props {
  params: Promise<{ id: string }>;
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
