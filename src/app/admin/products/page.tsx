'use client';

import { useState } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Package, ShoppingBag, Users, Settings, Tag, Grid, Box, DollarSign, Layers } from 'lucide-react';
import { products } from '@/lib/data';

interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  colors: string[];
  image: string;
  bestSeller: boolean;
  status: 'published' | 'draft';
}

const navItems = [
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'products', label: 'Products', icon: Package, active: true },
  { id: 'collections', label: 'Collections', icon: Layers },
  { id: 'categories', label: 'Categories', icon: Grid },
  { id: 'inventory', label: 'Inventory', icon: Box },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'promotions', label: 'Promotions', icon: Tag },
  { id: 'pricelists', label: 'Price Lists', icon: DollarSign },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Products() {
  const [productList, setProductList] = useState<AdminProduct[]>(
    (products as AdminProduct[]).map(p => ({ ...p, status: 'published' }))
  );
  const [search, setSearch] = useState('');
  const [activeNav, setActiveNav] = useState('products');

  const filteredProducts = productList.filter(product => 
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.description.toLowerCase().includes(search.toLowerCase())
  );

  const getCategoryLabel = (cat: string) => {
    const map: Record<string, string> = {
      standard: 'Standard',
      asiafit: 'AsiaFit',
      sunglasses: 'Sunglasses',
      lenses: 'Lenses',
    };
    return map[cat] || cat;
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black text-white rounded flex items-center justify-center font-bold text-sm">
              G
            </div>
            <span className="font-medium">Getooup</span>
          </div>
        </div>

        {/* Search */}
        <div className="p-3">
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
        <nav className="flex-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-0.5
                  ${isActive 
                    ? 'bg-gray-100 text-black font-medium' 
                    : 'text-gray-600 hover:bg-gray-50'}
                `}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-14 border-b flex items-center justify-between px-6">
          <h1 className="text-lg font-medium">Products</h1>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50">
              Export
            </button>
            <button className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50">
              Import
            </button>
            <button 
              onClick={() => window.location.href = '/admin/product-edit/'}
              className="px-3 py-1.5 text-sm bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-1"
            >
              <Plus size={16} />
              Create
            </button>
          </div>
        </header>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b flex items-center justify-between">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50">
            <Filter size={16} />
            Add filter
          </button>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-gray-400 w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500">Product</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Collection</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Sales Channels</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Variants</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Status</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded border flex items-center justify-center overflow-hidden">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <Package size={16} className="text-gray-400" />
                        )}
                      </div>
                      <span className="text-sm">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">{getCategoryLabel(product.category)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">Default Sales Channel</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">{product.colors.length} variant{product.colors.length !== 1 ? 's' : ''}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-sm">Published</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <MoreHorizontal size={16} className="text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
