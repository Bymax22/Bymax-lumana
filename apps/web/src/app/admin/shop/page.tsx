'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, Tags, ShoppingCart } from 'lucide-react';
import { publicApi } from '@/lib/publicApi';

type Category = {
  id: string;
  name: string;
  description?: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category?: { name?: string };
};

type Order = {
  id: string;
  status: string;
  totalAmount?: number;
  user?: { name?: string; email?: string };
};

export default function ShopAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', icon: '📦' });
  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    description: '',
    price: '120',
    stock: '20',
    categoryId: '',
    brandId: '',
  });

  async function loadData() {
    try {
      const [categoriesRes, productsRes, ordersRes] = await Promise.all([
        publicApi('/shop/categories'),
        publicApi('/shop/products?take=30'),
        publicApi('/shop/orders/all?take=20'),
      ]);

      setCategories(normalizeList(categoriesRes));
      setProducts(normalizeList(productsRes?.data || productsRes));
      setOrders(normalizeList(ordersRes?.data || ordersRes));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to load shop data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function handleCreateCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const created = await publicApi('/shop/categories', {
        method: 'POST',
        body: JSON.stringify(categoryForm),
      });
      setCategories((current) => [created, ...current]);
      setCategoryForm({ name: '', description: '', icon: '📦' });
      setMessage('Category created successfully.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to create category.');
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        categoryId: productForm.categoryId || categories[0]?.id,
        brandId: productForm.brandId || undefined,
        condition: 'NEW',
        images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80'],
        specs: { color: 'Black' },
      };

      const created = await publicApi('/shop/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setProducts((current) => [created, ...current]);
      setProductForm({ name: '', sku: '', description: '', price: '120', stock: '20', categoryId: '', brandId: '' });
      setMessage('Product created successfully.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to create product.');
    } finally {
      setSaving(false);
    }
  }

  async function handleOrderStatus(id: string, status: string) {
    try {
      const updated = await publicApi(`/shop/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      setOrders((current) => current.map((order) => (order.id === id ? { ...order, status: updated.status } : order)));
      setMessage('Order status updated.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update order status.');
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-900">
            <ArrowLeft className="h-4 w-4" />
            Back to admin
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/30">
          <p className="text-sm uppercase tracking-[0.3em] text-red-400">Shop operations</p>
          <h1 className="mt-2 text-3xl font-semibold">Manage categories, products, and orders</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-400">Keep the marketplace stocked and update order progress directly from the admin panel.</p>
        </div>

        {message ? <div className="rounded-2xl border border-red-700/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{message}</div> : null}

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Tags className="h-5 w-5 text-red-400" />
                Create category
              </div>
              <form onSubmit={handleCreateCategory} className="mt-6 space-y-4">
                <input value={categoryForm.name} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Category name" required />
                <textarea value={categoryForm.description} onChange={(event) => setCategoryForm({ ...categoryForm, description: event.target.value })} className="min-h-[100px] w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Description" />
                <input value={categoryForm.icon} onChange={(event) => setCategoryForm({ ...categoryForm, icon: event.target.value })} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Icon" />
                <button type="submit" disabled={saving} className="rounded-2xl bg-red-500 px-5 py-3 font-medium text-white disabled:opacity-60">
                  {saving ? 'Creating…' : 'Create category'}
                </button>
              </form>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Package className="h-5 w-5 text-red-400" />
                Product catalog
              </div>
              {loading ? <p className="mt-6 text-sm text-slate-400">Loading products…</p> : null}
              <div className="mt-6 space-y-3">
                {products.map((product) => (
                  <div key={product.id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-100">{product.name}</p>
                        <p className="text-sm text-slate-400">{product.category?.name || 'Uncategorized'} • {product.stock} in stock</p>
                      </div>
                      <span className="rounded-full bg-red-500/10 px-3 py-1 text-sm text-red-300">${product.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Package className="h-5 w-5 text-red-400" />
                Create product
              </div>
              <form onSubmit={handleCreateProduct} className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <input value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Product name" required />
                  <input value={productForm.sku} onChange={(event) => setProductForm({ ...productForm, sku: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="SKU" required />
                  <input value={productForm.price} type="number" onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Price" required />
                  <input value={productForm.stock} type="number" onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Stock" required />
                  <input value={productForm.categoryId} onChange={(event) => setProductForm({ ...productForm, categoryId: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Category ID" />
                  <input value={productForm.brandId} onChange={(event) => setProductForm({ ...productForm, brandId: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Brand ID (optional)" />
                </div>
                <textarea value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} className="min-h-[100px] w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Description" />
                <button type="submit" disabled={saving} className="rounded-2xl bg-red-500 px-5 py-3 font-medium text-white disabled:opacity-60">
                  {saving ? 'Creating…' : 'Create product'}
                </button>
              </form>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <ShoppingCart className="h-5 w-5 text-red-400" />
                Order queue
              </div>
              <div className="mt-6 space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-100">Order {order.id.slice(0, 8)}</p>
                        <p className="text-sm text-slate-400">{order.user?.name || 'Customer'} • ${order.totalAmount || 0}</p>
                      </div>
                      <select value={order.status} onChange={(event) => void handleOrderStatus(order.id, event.target.value)} className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function normalizeList(payload: any): any[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && Array.isArray(payload.data)) {
    return payload.data;
  }

  return [];
}
