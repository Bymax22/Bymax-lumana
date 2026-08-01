'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, Tags, ShoppingCart } from 'lucide-react';
import { publicApi } from '@/lib/publicApi';

type Category = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  featured?: boolean;
};

type Product = {
  id: string;
  name: string;
  sku?: string;
  price: number;
  stock: number;
  category?: { name?: string; id?: string };
  status?: string;
  featured?: boolean;
  description?: string;
  images?: string[];
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
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', icon: '📦', featured: false });
  const [categoryEditingId, setCategoryEditingId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    description: '',
    price: '120',
    stock: '20',
    categoryId: '',
    brandId: '',
    imageUrls: '',
    featured: false,
    status: 'ACTIVE',
  });
  const [productEditingId, setProductEditingId] = useState<string | null>(null);

  const categoryOptions = useMemo(() => categories.map((category) => ({ value: category.id, label: category.name })), [categories]);

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

  function resetCategoryForm() {
    setCategoryForm({ name: '', description: '', icon: '📦', featured: false });
    setCategoryEditingId(null);
  }

  function resetProductForm() {
    setProductForm({ name: '', sku: '', description: '', price: '120', stock: '20', categoryId: '', brandId: '', imageUrls: '', featured: false, status: 'ACTIVE' });
    setProductEditingId(null);
  }

  async function handleCreateOrUpdateCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const payload = {
        name: categoryForm.name,
        description: categoryForm.description,
        icon: categoryForm.icon,
        featured: categoryForm.featured,
      };

      if (categoryEditingId) {
        const updated = await publicApi(`/shop/categories/${categoryEditingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setCategories((current) => current.map((category) => (category.id === categoryEditingId ? { ...category, ...updated } : category)));
      } else {
        const created = await publicApi('/shop/categories', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setCategories((current) => [created, ...current]);
      }

      resetCategoryForm();
      setMessage(categoryEditingId ? 'Category updated successfully.' : 'Category created successfully.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save category.');
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateOrUpdateProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const imageUrls = productForm.imageUrls
        .split(/\s*[\n,]+\s*/)
        .map((url) => url.trim())
        .filter(Boolean);

      const payload: any = {
        name: productForm.name,
        sku: productForm.sku,
        description: productForm.description,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        categoryId: productForm.categoryId || categories[0]?.id,
        brandId: productForm.brandId || undefined,
        featured: productForm.featured,
        status: productForm.status,
        condition: 'NEW',
        specs: { color: 'Black' },
      };

      if (imageUrls.length > 0) {
        payload.images = imageUrls;
      }

      if (productEditingId) {
        const updated = await publicApi(`/shop/products/${productEditingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setProducts((current) => current.map((product) => (product.id === productEditingId ? { ...product, ...updated } : product)));
      } else {
        const created = await publicApi('/shop/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setProducts((current) => [created, ...current]);
      }

      resetProductForm();
      setMessage(productEditingId ? 'Product updated successfully.' : 'Product created successfully.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save product.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm('Delete this category?')) return;
    try {
      await publicApi(`/shop/categories/${id}`, { method: 'DELETE' });
      setCategories((current) => current.filter((category) => category.id !== id));
      setMessage('Category deleted.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to delete category.');
    }
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm('Delete this product?')) return;
    try {
      await publicApi(`/shop/products/${id}`, { method: 'DELETE' });
      setProducts((current) => current.filter((product) => product.id !== id));
      setMessage('Product deleted.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to delete product.');
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

  function startEditCategory(category: Category) {
    setCategoryEditingId(category.id);
    setCategoryForm({ name: category.name, description: category.description || '', icon: category.icon || '📦', featured: category.featured || false });
  }

  function startEditProduct(product: Product) {
    setProductEditingId(product.id);
    setProductForm({
      name: product.name,
      sku: product.sku || '',
      description: product.description || '',
      price: String(product.price),
      stock: String(product.stock),
      categoryId: product.category?.id || '',
      brandId: '',
      imageUrls: (product.images || []).join('\n'),
      featured: product.featured || false,
      status: product.status || 'ACTIVE',
    });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
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
                {categoryEditingId ? 'Edit category' : 'Create category'}
              </div>
              <form onSubmit={handleCreateOrUpdateCategory} className="mt-6 space-y-4">
                <input value={categoryForm.name} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Category name" required />
                <textarea value={categoryForm.description} onChange={(event) => setCategoryForm({ ...categoryForm, description: event.target.value })} className="min-h-[100px] w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Description" />
                <input value={categoryForm.icon} onChange={(event) => setCategoryForm({ ...categoryForm, icon: event.target.value })} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Icon" />
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input type="checkbox" checked={categoryForm.featured} onChange={(event) => setCategoryForm({ ...categoryForm, featured: event.target.checked })} />
                  Featured category
                </label>
                <div className="flex flex-wrap gap-3">
                  <button type="submit" disabled={saving} className="rounded-2xl bg-red-500 px-5 py-3 font-medium text-white disabled:opacity-60">
                    {saving ? 'Saving…' : categoryEditingId ? 'Save category' : 'Create category'}
                  </button>
                  {categoryEditingId ? <button type="button" onClick={resetCategoryForm} className="rounded-2xl border border-slate-700 px-5 py-3 text-sm text-slate-300">Cancel</button> : null}
                </div>
              </form>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Tags className="h-5 w-5 text-red-400" />
                Categories
              </div>
              <div className="mt-6 space-y-3">
                {categories.map((category) => (
                  <div key={category.id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-100">{category.name}</p>
                        <p className="text-sm text-slate-400">{category.description || 'No description'}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => startEditCategory(category)} className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300">Edit</button>
                        <button onClick={() => void handleDeleteCategory(category.id)} className="rounded-full border border-red-700/50 px-3 py-1 text-sm text-red-300">Delete</button>
                      </div>
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
                {productEditingId ? 'Edit product' : 'Create product'}
              </div>
              <form onSubmit={handleCreateOrUpdateProduct} className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <input value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Product name" required />
                  <input value={productForm.sku} onChange={(event) => setProductForm({ ...productForm, sku: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="SKU" required />
                  <input value={productForm.price} type="number" onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Price" required />
                  <input value={productForm.stock} type="number" onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Stock" required />
                  <select value={productForm.categoryId} onChange={(event) => setProductForm({ ...productForm, categoryId: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
                    <option value="">Select category</option>
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <input value={productForm.brandId} onChange={(event) => setProductForm({ ...productForm, brandId: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Brand ID (optional)" />
                </div>
                <textarea value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} className="min-h-[100px] w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Description" />
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input type="checkbox" checked={productForm.featured} onChange={(event) => setProductForm({ ...productForm, featured: event.target.checked })} />
                    Featured product
                  </label>
                  <select value={productForm.status} onChange={(event) => setProductForm({ ...productForm, status: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
                  </select>
                </div>
                <textarea
                  value={productForm.imageUrls}
                  onChange={(event) => setProductForm({ ...productForm, imageUrls: event.target.value })}
                  className="min-h-[110px] w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
                  placeholder="Image URLs (one per line or comma-separated)"
                />
                <div className="flex flex-wrap gap-3">
                  <button type="submit" disabled={saving} className="rounded-2xl bg-red-500 px-5 py-3 font-medium text-white disabled:opacity-60">
                    {saving ? 'Saving…' : productEditingId ? 'Save product' : 'Create product'}
                  </button>
                  {productEditingId ? <button type="button" onClick={resetProductForm} className="rounded-2xl border border-slate-700 px-5 py-3 text-sm text-slate-300">Cancel</button> : null}
                </div>
              </form>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Package className="h-5 w-5 text-red-400" />
                Product catalog
              </div>
              <div className="mt-6 space-y-3">
                {products.map((product) => (
                  <div key={product.id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                    <div className="grid gap-4 md:grid-cols-[0.95fr_0.45fr] md:items-center">
                      <div className="flex gap-4">
                        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-slate-700 bg-slate-900/70">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-sm text-slate-500">No image</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-100">{product.name}</p>
                          <p className="text-sm text-slate-400">{product.category?.name || 'Uncategorized'} • {product.stock} in stock</p>
                          {product.images && product.images.length > 1 ? (
                            <div className="mt-3 flex gap-2 overflow-x-auto">
                              {product.images.slice(1, 4).map((image, index) => (
                                <div key={`${product.id}-thumb-${index}`} className="h-12 w-12 flex-none overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/70">
                                  <img src={image} alt={`${product.name} preview ${index + 2}`} className="h-full w-full object-cover" />
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <span className="rounded-full bg-red-500/10 px-3 py-1 text-sm text-red-300">${product.price}</span>
                        <button onClick={() => startEditProduct(product)} className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300">Edit</button>
                        <button onClick={() => void handleDeleteProduct(product.id)} className="rounded-full border border-red-700/50 px-3 py-1 text-sm text-red-300">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
