'use client';

import React, { useEffect, useState } from 'react';
import { RefreshCcw, Trash2, UserCog } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchUsers();
    const timer = window.setInterval(() => {
      void fetchUsers();
    }, 15000);

    return () => window.clearInterval(timer);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi('/admin/users?skip=0&take=20');
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (id: string, role: string) => {
    try {
      const updated = await adminApi(`/admin/users/${id}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role }),
      });
      setUsers((current) => current.map((u) => (u.id === id ? { ...u, role: updated.role || role } : u)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    try {
      await adminApi(`/admin/users/${id}`, { method: 'DELETE' });
      setUsers((current) => current.filter((u) => u.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-black/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-red-400">User management</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">People and access control</h1>
            <p className="mt-2 text-sm text-slate-400">Review accounts, adjust roles, and remove users safely from the control center.</p>
          </div>
          <button onClick={() => void fetchUsers()} className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-slate-300 transition hover:border-red-500 hover:text-white">
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center text-slate-400">Loading users…</div>
      ) : users.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center text-slate-400">No users found.</div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl shadow-black/20">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-950/80">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Created</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/60">
                  <td className="px-6 py-4 text-sm font-medium text-slate-100">{user.name || 'Unnamed user'}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{user.email}</td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => void handleUpdateRole(user.id, e.target.value)}
                      className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                    >
                      <option value="CUSTOMER">Customer</option>
                      <option value="DEALER">Dealer</option>
                      <option value="ADMIN">Admin</option>
                      <option value="INSPECTOR">Inspector</option>
                      <option value="DRIVER">Driver</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => void handleDelete(user.id)} className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/20">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
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
