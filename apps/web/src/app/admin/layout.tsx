'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Car,
  Trophy,
  Tag,
  Folder,
  FileText,
  Users,
  MessageCircle,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: BarChart3 },
    { href: '/admin/vehicles', label: 'Vehicles', icon: Car },
    { href: '/admin/auctions', label: 'Auctions', icon: Trophy },
    { href: '/admin/brands', label: 'Brands', icon: Tag },
    { href: '/admin/categories', label: 'Categories', icon: Folder },
    { href: '/admin/blogs', label: 'Blog Posts', icon: FileText },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/support', label: 'Support', icon: MessageCircle },
    { href: '/admin/pages', label: 'Pages', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white shadow-lg overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">Lumana Admin</h1>
        </div>
        <nav className="p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
                  pathname === item.href
                    ? 'bg-red-600 text-white'
                    : 'hover:bg-gray-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
