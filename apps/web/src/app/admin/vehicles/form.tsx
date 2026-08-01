'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminApi, adminApiFormData } from '@/lib/adminApi';

interface Brand {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface VehicleImage {
  id: string;
  url: string;
}

export default function VehicleForm() {
  const router = useRouter();
  const params = useParams();
  const isEditing = !!params.id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    fuelType: 'gasoline',
    transmission: 'automatic',
    color: '',
    vin: '',
    trim: '',
    condition: 'USED',
    engine: '',
    description: '',
    brandId: '',
    categoryId: '',
  });

  useEffect(() => {
    void loadBrandsAndCategories();
    if (isEditing) {
      void loadVehicle();
    }
  }, [isEditing, params.id]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((preview) => {
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [previewUrls]);

  const loadBrandsAndCategories = async () => {
    try {
      const [brandsData, categoriesData] = await Promise.all([
        adminApi('/admin/brands?skip=0&take=100'),
        adminApi('/admin/categories?skip=0&take=100'),
      ]);
      setBrands(Array.isArray(brandsData) ? brandsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err) {
      console.error('Failed to load brands/categories', err);
    }
  };

  const loadVehicle = async () => {
    try {
      const data = await adminApi(`/admin/vehicles/${params.id}`);
      const images = Array.isArray(data.images) ? data.images.map((image: VehicleImage) => image.url) : [];
      const nextPreviewUrls = images.length ? images : data.imageUrl ? [data.imageUrl] : [];

      setFormData({
        make: data.make || '',
        model: data.model || '',
        year: data.year || new Date().getFullYear(),
        price: data.price || 0,
        mileage: data.mileage || 0,
        fuelType: data.fuelType || 'gasoline',
        transmission: data.transmission || 'automatic',
        color: data.color || '',
        vin: data.vin || '',
        trim: data.trim || '',
        condition: data.condition || 'USED',
        engine: data.engine || '',
        description: data.description || '',
        brandId: data.brandId || '',
        categoryId: data.categoryId || '',
      });
      setPreviewUrls(nextPreviewUrls);
    } catch (err) {
      setError('Failed to load vehicle');
    }
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) {
      return;
    }

    setSelectedFiles(files);
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let endpoint = '/admin/vehicles';
      let method = 'POST';

      if (isEditing) {
        endpoint = `/admin/vehicles/${params.id}`;
        method = 'PUT';
      }

      if (selectedFiles.length) {
        const formDataObj = new FormData();
        selectedFiles.forEach((file) => formDataObj.append('images', file));
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            formDataObj.append(key, String(value));
          }
        });
        await adminApiFormData(endpoint, formDataObj, { method });
      } else {
        await adminApi(endpoint, {
          method,
          body: JSON.stringify(formData),
        });
      }

      router.push('/admin/vehicles');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save vehicle');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'mileage' || name === 'year' ? Number(value) : value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-black/20">
        <p className="text-sm uppercase tracking-[0.3em] text-red-400">Vehicle editor</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">
          {isEditing ? 'Edit vehicle listing' : 'Add a new vehicle'}
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Capture the key details and upload several gallery images so the inventory looks complete.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-black/20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Make</label>
            <input
              type="text"
              name="make"
              value={formData.make}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-red-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Model</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-red-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-red-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-red-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Mileage</label>
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-red-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Color</label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-red-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">VIN</label>
            <input
              type="text"
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-red-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Trim</label>
            <input
              type="text"
              name="trim"
              value={formData.trim}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-red-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Fuel type</label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-red-500"
            >
              <option value="gasoline">Gasoline</option>
              <option value="diesel">Diesel</option>
              <option value="hybrid">Hybrid</option>
              <option value="electric">Electric</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Transmission</label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-red-500"
            >
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Condition</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-red-500"
            >
              <option value="USED">Used</option>
              <option value="NEW">New</option>
              <option value="SALVAGE">Salvage</option>
              <option value="REBUILT">Rebuilt</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Engine</label>
            <input
              type="text"
              name="engine"
              value={formData.engine}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-red-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Brand</label>
            <select
              name="brandId"
              value={formData.brandId}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-red-500"
            >
              <option value="">Select a brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Category</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-red-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-slate-300">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-red-500"
          />
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-6">
          <label className="mb-2 block text-sm font-medium text-slate-300">Vehicle gallery</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            className="w-full text-sm text-slate-400 file:mr-4 file:rounded-full file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
          />
          <p className="mt-2 text-sm text-slate-500">You can select several images at once. New uploads replace the current preview set.</p>
          {previewUrls.length > 0 && (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {previewUrls.map((preview, index) => (
                <div key={`${preview}-${index}`} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70">
                  <img src={preview} alt={`Preview ${index + 1}`} className="h-32 w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Save vehicle'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/vehicles')}
            className="rounded-full border border-slate-700 bg-slate-950/70 px-6 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
