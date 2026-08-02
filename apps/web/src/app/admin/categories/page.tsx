'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  _count?: { products: number };
  createdAt: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  useEffect(() => {
    void fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await adminApi('/admin/categories?skip=0&take=50');
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: '', description: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const startNewCategory = () => {
    setError(null);
    setEditingId(null);
    setForm({ name: '', description: '' });
    setShowForm(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = form.name.trim();
    const description = form.description.trim();

    if (!name) {
      setError('Category name is required.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (editingId) {
        const updated = await adminApi(`/admin/categories/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify({ name, description }),
        });

        setCategories((current) => current.map((category) => (category.id === editingId ? { ...category, ...updated } : category)));
      } else {
        const created = await adminApi('/admin/categories', {
          method: 'POST',
          body: JSON.stringify({ name, description }),
        });
        setCategories((current) => [created, ...current]);
      }

      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;

    try {
      await adminApi(`/admin/categories/${id}`, { method: 'DELETE' });
      setCategories((current) => current.filter((category) => category.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setForm({ name: category.name, description: category.description || '' });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-500">Categories</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Manage vehicle categories</h1>
          <p className="mt-2 text-sm text-slate-600">Create, update, and remove categories directly from the admin dashboard.</p>
        </div>
        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              startNewCategory();
            }
          }}
          className="rounded-2xl bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700"
        >
          {showForm ? 'Close form' : '+ Add category'}
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Category name</label>
              <input
                type="text"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                required
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-0 focus:border-red-500"
                placeholder="e.g. SUVs"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-0 focus:border-red-500"
                placeholder="Optional summary"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" disabled={submitting} className="rounded-2xl bg-green-600 px-5 py-3 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70">
              {submitting ? (editingId ? 'Saving…' : 'Creating…') : editingId ? 'Save changes' : 'Create category'}
            </button>
            <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600">Loading categories…</div>
      ) : categories.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600">No categories found.</div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Description</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      {category.icon ? (
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-lg">{category.icon}</span>
                      ) : (
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-500">CAT</span>
                      )}
                      <div>
                        <div>{category.name}</div>
                        <div className="text-xs text-slate-500">{category._count?.products ?? 0} products</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{category.description || '—'}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-3">
                      <button onClick={() => startEdit(category)} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                        Edit
                      </button>
                      <button onClick={() => void handleDelete(category.id)} className="text-sm font-medium text-red-600 hover:text-red-700">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
