'use client';

import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Eye } from 'lucide-react';
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
}

export default function Products() {
  const [productList, setProductList] = useState<AdminProduct[]>(products as AdminProduct[]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredProducts = productList.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const toggleBestSeller = (productId: string) => {
    setProductList(productList.map(product => 
      product.id === productId 
        ? { ...product, bestSeller: !product.bestSeller }
        : product
    ));
  };

  const deleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProductList(productList.filter(product => product.id !== productId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Products</h1>
          <p className="text-gray-500">Manage your product catalog</p>
        </div>
        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
          >
            <option value="all">All Categories</option>
            <option value="standard">Standard</option>
            <option value="asiafit">AsiaFit</option>
            <option value="sunglasses">Sunglasses</option>
            <option value="lenses">Lenses</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Product</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Category</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Price</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Colors</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Best Seller</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl">👓</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">${product.price}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {product.colors.slice(0, 3).map((color, idx) => (
                        <div 
                          key={idx} 
                          className="w-5 h-5 rounded-full border border-gray-200"
                          title={color}
                        />
                      ))}
                      {product.colors.length > 3 && (
                        <span className="text-sm text-gray-500">+{product.colors.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleBestSeller(product.id)}
                      className={`
                        w-10 h-6 rounded-full transition-colors relative
                        ${product.bestSeller ? 'bg-black' : 'bg-gray-300'}
                      `}
                    >
                      <span className={`
                        absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
                        ${product.bestSeller ? 'translate-x-5 left-0.5' : 'translate-x-0.5 left-0.5'}
                      `}/>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}
