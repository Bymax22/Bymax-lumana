'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Edit3, RefreshCcw, Trash2, Upload } from 'lucide-react';
import { adminApi, adminApiFormData } from '@/lib/adminApi';

interface Brand {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  createdAt: string;
}

interface BrandFormState {
  name: string;
  description: string;
  logoFile: File | null;
}

const initialFormState = (): BrandFormState => ({ name: '', description: '', logoFile: null });

export default function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formState, setFormState] = useState<BrandFormState>(initialFormState());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void fetchBrands(true);
  }, []);

  const fetchBrands = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }

    try {
      const data = await adminApi('/admin/brands?skip=0&take=100');
      setBrands(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch brands');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormState(initialFormState());
    setEditingBrand(null);
    setShowForm(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.name.trim()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', formState.name.trim());
      formData.append('description', formState.description.trim());
      if (formState.logoFile) {
        formData.append('logo', formState.logoFile);
      }

      const payload = editingBrand
        ? await adminApiFormData(`/admin/brands/${editingBrand.id}`, formData, { method: 'PUT' })
        : await adminApiFormData('/admin/brands', formData, { method: 'POST' });

      if (editingBrand) {
        setBrands((current) => current.map((brand) => (brand.id === editingBrand.id ? { ...brand, ...payload } : brand)));
      } else {
        setBrands((current) => [payload, ...current]);
      }

      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : editingBrand ? 'Failed to update brand' : 'Failed to create brand');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this brand?')) return;
    try {
      await adminApi(`/admin/brands/${id}`, { method: 'DELETE' });
      setBrands((current) => current.filter((brand) => brand.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete brand');
    }
  };

  const openEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormState({ name: brand.name, description: brand.description ?? '', logoFile: null });
    setShowForm(true);
  };

  const logoPreview = useMemo(() => {
    if (formState.logoFile) {
      return URL.createObjectURL(formState.logoFile);
    }
    return editingBrand?.logoUrl ?? '';
  }, [editingBrand, formState.logoFile]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-black/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-red-400">Brand management</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Make, model, and logo control</h1>
            <p className="mt-2 text-sm text-slate-400">Create brands, update their logos, and remove them instantly from the admin panel.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => void fetchBrands(false)} className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-slate-300 transition hover:border-red-500 hover:text-white">
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
            <button onClick={() => { setShowForm(true); setEditingBrand(null); setFormState(initialFormState()); }} className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700">
              + Add brand
            </button>
          </div>
        </div>
      </div>

      {error ? <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div> : null}

      {showForm ? (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-red-400">{editingBrand ? 'Edit brand' : 'Create brand'}</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">{editingBrand ? 'Update brand details' : 'Add a new brand'}</h2>
            </div>
            <button type="button" onClick={resetForm} className="rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-300">Cancel</button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-300">
              <span className="mb-2 block">Brand name</span>
              <input
                value={formState.name}
                onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
                required
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
              />
            </label>
            <label className="text-sm text-slate-300">
              <span className="mb-2 block">Description</span>
              <input
                value={formState.description}
                onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
              />
            </label>
          </div>

          <label className="mt-4 block text-sm text-slate-300">
            <span className="mb-2 block">Brand logo</span>
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-4">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-slate-800 text-sm text-slate-400">
                {logoPreview ? <img src={logoPreview} alt="Current brand logo" className="h-full w-full object-cover" /> : <Upload className="h-5 w-5" />}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setFormState((current) => ({ ...current, logoFile: file }));
                }}
                className="w-full max-w-xs text-sm text-slate-400 file:mr-4 file:rounded-full file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
              />
            </div>
          </label>

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={resetForm} className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">Cancel</button>
            <button type="submit" disabled={submitting} className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60">
              {submitting ? 'Saving…' : editingBrand ? 'Save changes' : 'Create brand'}
            </button>
          </div>
        </form>
      ) : null}

      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center text-slate-400">Loading brands…</div>
      ) : brands.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center text-slate-400">No brands found.</div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl shadow-black/20">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-950/80">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Logo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Description</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {brands.map((brand) => (
                <tr key={brand.id} className="hover:bg-slate-800/60">
                  <td className="px-6 py-4">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-slate-800 text-sm text-slate-400">
                      {brand.logoUrl ? <img src={brand.logoUrl} alt={`${brand.name} logo`} className="h-full w-full object-cover" /> : <span>{brand.name.charAt(0)}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-100">{brand.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{brand.description || '—'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(brand)} className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 transition hover:border-red-500 hover:text-white">
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </button>
                      <button onClick={() => void handleDelete(brand.id)} className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/20">
                        <Trash2 className="h-4 w-4" />
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
