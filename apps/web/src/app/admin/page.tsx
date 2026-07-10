'use client';

import type { ElementType } from 'react';
import Link from 'next/link';
import { Plus, Sparkles, Edit3, Tag } from 'lucide-react';

interface QuickAction {
  href: string;
  label: string;
  icon: ElementType;
}

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Vehicles', value: '0', color: 'bg-blue-500' },
    { label: 'Active Auctions', value: '0', color: 'bg-green-500' },
    { label: 'Total Users', value: '0', color: 'bg-purple-500' },
    { label: 'Support Tickets', value: '0', color: 'bg-orange-500' },
  ];

  const quickActions: QuickAction[] = [
    { href: '/admin/vehicles/new', label: 'Add Vehicle', icon: Plus },
    { href: '/admin/auctions/new', label: 'Create Auction', icon: Sparkles },
    { href: '/admin/blogs/new', label: 'Write Blog', icon: Edit3 },
    { href: '/admin/brands/new', label: 'Add Brand', icon: Tag },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.color} text-white p-6 rounded-lg shadow-lg`}
          >
            <p className="text-gray-100 text-sm">{stat.label}</p>
            <p className="text-4xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 bg-white p-4 rounded-lg shadow hover:shadow-lg transition border-l-4 border-red-500 hover:border-red-700"
              >
                <Icon className="h-5 w-5 text-red-500" />
                <span className="text-gray-900 font-semibold">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Recent Activity</h2>
        <p className="text-gray-500">Activity will be displayed here...</p>
      </div>
    </div>
  );
}
