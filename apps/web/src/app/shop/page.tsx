import { publicApi } from '@/lib/publicApi';
import ProductGrid from '@/components/ProductGrid';

function normalize(payload: unknown): any[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === 'object') {
    const p = payload as any;
    return p.data || p.items || [];
  }
  return [];
}

export default async function ShopPage() {
  const res = await publicApi('/shop/products?take=24').catch(() => ({ data: [] }));
  const products = normalize(res);

  return (
    <section className="space-y-6">
      <div className="rounded-[24px] bg-[#0d0d0d] p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase text-slate-400">Shop</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Auto Parts & Accessories</h2>
          </div>
        </div>

        <div className="mt-6">
          <ProductGrid products={products} />
        </div>
      </div>
    </section>
  );
}
