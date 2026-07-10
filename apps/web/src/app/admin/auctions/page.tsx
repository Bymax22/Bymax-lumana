'use client';

import React, { useState, useEffect } from 'react';
import { adminApi } from '@/lib/adminApi';

interface Auction {
  id: string;
  status: string;
  startPrice: number;
  startTime: string;
  endTime: string;
  vehicle?: { make: string; model: string };
  seller?: { name: string };
  createdAt: string;
}

export default function AdminAuctions() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const data = await adminApi('/admin/auctions?skip=0&take=20');
      setAuctions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch auctions');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const updated = await adminApi(`/admin/auctions/${id}/approve`, {
        method: 'PUT',
      });
      setAuctions(auctions.map((a) => (a.id === id ? updated : a)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const updated = await adminApi(`/admin/auctions/${id}/reject`, {
        method: 'PUT',
      });
      setAuctions(auctions.map((a) => (a.id === id ? updated : a)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this auction?')) return;
    try {
      await adminApi(`/admin/auctions/${id}`, { method: 'DELETE' });
      setAuctions(auctions.filter((a) => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Auctions Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : auctions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No auctions found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Vehicle</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Seller</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Start Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {auctions.map((auction) => (
                <tr key={auction.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {auction.vehicle?.make} {auction.vehicle?.model}
                  </td>
                  <td className="px-6 py-4">{auction.seller?.name || 'N/A'}</td>
                  <td className="px-6 py-4">${auction.startPrice.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded text-sm ${
                        auction.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : auction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {auction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {auction.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(auction.id)}
                          className="text-green-600 hover:underline mr-2"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(auction.id)}
                          className="text-orange-600 hover:underline mr-2"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(auction.id)}
                      className="text-red-600 hover:underline"
                    >
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
