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
  Menu,
  X
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  { id: 'orders', label: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
  { id: 'products', label: 'Products', icon: Package, href: '/admin/products' },
  { id: 'customers', label: 'Customers', icon: Users, href: '/admin/customers' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 w-64 bg-black text-white z-50
        transform transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <h1 className="text-xl font-light tracking-widest">GETOOUP</h1>
          <p className="text-gray-400 text-sm">Admin</p>
        </div>

        <nav className="px-4 pb-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg mb-1
                  transition-colors
                  ${isActive 
                    ? 'bg-white text-black' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'}
                `}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white w-full"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-auto">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Welcome, Admin</span>
            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
