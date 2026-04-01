'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Settings, 
  LogOut,
  Search,
  Layers,
  Grid,
  Box,
  Tag,
  DollarSign,
} from 'lucide-react';

const navItems = [
  { id: 'orders', label: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
  { id: 'products', label: 'Products', icon: Package, href: '/admin/products' },
  { id: 'lens', label: 'Lens', icon: Layers, href: '/admin/lens' },
  { id: 'collections', label: 'Collections', icon: Layers, href: '#' },
  { id: 'categories', label: 'Categories', icon: Grid, href: '#' },
  { id: 'inventory', label: 'Inventory', icon: Box, href: '#' },
  { id: 'customers', label: 'Customers', icon: Users, href: '/admin/customers' },
  { id: 'promotions', label: 'Promotions', icon: Tag, href: '#' },
  { id: 'pricelists', label: 'Price Lists', icon: DollarSign, href: '#' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin' || pathname === '/admin/';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [router, isLoginPage]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white flex flex-col fixed inset-y-0 left-0">
        {/* Logo */}
        <div className="h-14 border-b flex items-center px-4">
          <a href="/admin/orders" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black text-white rounded flex items-center justify-center font-bold text-sm">
              G
            </div>
            <span className="font-medium">Getooup</span>
          </a>
        </div>

        {/* Search */}
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-2 overflow-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href) && item.href !== '#';
            return (
              <a
                key={item.id}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-0.5
                  ${isActive 
                    ? 'bg-gray-100 text-black font-medium' 
                    : 'text-gray-600 hover:bg-gray-50'}
                `}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {children}
      </div>
    </div>
  );
}
