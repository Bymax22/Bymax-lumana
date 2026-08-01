'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { adminApi } from '@/lib/adminApi';

export default function EditAdminPage() {
  const params = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const pageId = typeof params?.id === 'string' ? params.id : undefined;
    if (!pageId) {
      setError('Invalid page ID');
      setLoading(false);
      return;
    }

    const loadPage = async () => {
      try {
        const data = await adminApi(`/admin/pages/${pageId}`);
        setTitle(data.title || '');
        setSlug(data.slug || '');
        setContent(data.content || '');
        setStatus(data.status || 'draft');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load page');
      } finally {
        setLoading(false);
      }
    };

    void loadPage();
  }, [params]);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSaving(true);

    const pageId = typeof params?.id === 'string' ? params.id : undefined;
    if (!pageId) {
      setError('Invalid page ID');
      setSaving(false);
      return;
    }

    try {
      await adminApi(`/admin/pages/${pageId}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          content: content.trim(),
          status,
        }),
      });
      router.push('/admin/pages');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    const pageId = typeof params?.id === 'string' ? params.id : undefined;
    if (!pageId) {
      setError('Invalid page ID');
      return;
    }

    try {
      await adminApi(`/admin/pages/${pageId}/publish`, { method: 'PUT' });
      setStatus('published');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish');
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center text-slate-400">Loading page…</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-black/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-red-400">Edit page</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Edit content page</h1>
            <p className="mt-2 text-sm text-slate-400">Update content, slug, and publication status for this website page.</p>
          </div>
          <Link href="/admin/pages" className="rounded-full border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-slate-300 transition hover:border-red-500 hover:text-white">
            Back to pages
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-black/20">
        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-300">
            <span>Page title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-red-500"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>URL slug</span>
            <input
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              required
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-red-500"
            />
          </label>
        </div>

        <label className="mt-6 space-y-2 text-sm text-slate-300">
          <span>Content</span>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={10}
            required
            className="w-full rounded-3xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-red-500"
          />
        </label>

        <label className="mt-6 space-y-2 text-sm text-slate-300">
          <span>Status</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-red-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
          <button
            type="button"
            onClick={handlePublish}
            className="rounded-full border border-green-600 bg-green-600/10 px-6 py-2.5 text-sm font-medium text-green-200 transition hover:bg-green-600/20"
          >
            Publish now
          </button>
          <Link
            href="/admin/pages"
            className="rounded-full border border-slate-700 bg-slate-950/70 px-6 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-500"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
