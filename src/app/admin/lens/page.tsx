'use client';

import { useState } from 'react';
import { X, Upload, ChevronDown, Plus, Search, MoreHorizontal } from 'lucide-react';

interface LensVariant {
  id: string;
  title: string;
  sku: string;
  material: string;
  type: string;
  inventory: string;
  price: number;
}

const lensVariants: LensVariant[] = [
  { id: '1', title: '1.60', sku: 'LENS-160', material: '1.60', type: '-', inventory: 'Unlimited', price: 0 },
  { id: '2', title: '1.67', sku: 'LENS-167', material: '1.67', type: '-', inventory: 'Unlimited', price: 40 },
  { id: '3', title: '1.74', sku: 'LENS-174', material: '1.74', type: '-', inventory: 'Unlimited', price: 80 },
  { id: '4', title: 'Progressive', sku: 'LENS-PROG', material: '1.60', type: 'Progressive', inventory: 'Unlimited', price: 80 },
  { id: '5', title: '1.60-customized', sku: 'LENS-160-CUST', material: '1.60-CUSTOMIZED', type: '-', inventory: 'Unlimited', price: 0 },
  { id: '6', title: '1.67-customized', sku: 'LENS-167-CUST', material: '1.67-CUSTOMIZED', type: '-', inventory: 'Unlimited', price: 40 },
  { id: '7', title: '1.74-customized', sku: 'LENS-174-CUST', material: '1.74-CUSTOMIZED', type: '-', inventory: 'Unlimited', price: 80 },
  { id: '8', title: 'Anti-fatigue', sku: 'LENS-ANTI', material: '-', type: 'Anti-fatigue', inventory: 'Unlimited', price: 20 },
  { id: '9', title: 'Color-tint', sku: 'LENS-COLOR', material: '-', type: 'Color-tint', inventory: 'Unlimited', price: 20 },
  { id: '10', title: 'Blue-light-filtering', sku: 'LENS-BLUE', material: '-', type: 'Blue-light-filtering', inventory: 'Unlimited', price: 20 },
];

const materialOptions = ['1.60', '1.67', '1.67-CUSTOMIZED', '1.74', '1.74-CUSTOMIZED', '1.60-CUSTOMIZED'];
const typeOptions = ['Responsive', 'Progressive', 'Classic', 'Blue-light-filtering', 'Anti-fatigue', 'Color-tint'];

export default function LensManagement() {
  const [activeTab, setActiveTab] = useState('details');
  const [variants, setVariants] = useState(lensVariants);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVariants = variants.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="h-14 bg-white border-b flex items-center justify-between px-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button className="p-1 hover:bg-gray-100 rounded">
            <X size={20} className="text-gray-500" />
          </button>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span>Products</span>
            <span>/</span>
            <span className="text-black">Lens</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800">
            Save
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="flex px-4">
          {['Details', 'Organize', 'Variants'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab.toLowerCase() 
                  ? 'border-black text-black' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'}
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="col-span-2 space-y-6">
            {/* General Section */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="font-medium mb-6">General</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Title</label>
                  <input
                    type="text"
                    defaultValue="Lens"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Subtitle</label>
                    <input
                      type="text"
                      placeholder="-"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Handle</label>
                    <div className="flex items-center">
                      <span className="px-3 py-2 border border-r-0 rounded-l-lg bg-gray-50 text-gray-500 text-sm">/</span>
                      <input
                        type="text"
                        defaultValue="lens"
                        className="flex-1 px-3 py-2 border rounded-r-lg focus:outline-none focus:border-black text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Description</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black text-sm"
                    placeholder="-"
                  />
                </div>
              </div>
            </div>

            {/* Media Section */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium">Media</h2>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreHorizontal size={16} className="text-gray-400" />
                </button>
              </div>
              
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload size={24} className="text-gray-400" />
                </div>
                <p className="text-sm font-medium mb-1">Upload images</p>
                <p className="text-xs text-gray-500">Drag and drop images here or click to upload.</p>
              </div>
            </div>

            {/* Options Section */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium">Options</h2>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreHorizontal size={16} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Material</label>
                  <div className="flex flex-wrap gap-2">
                    {materialOptions.map((opt) => (
                      <span key={opt} className="px-2 py-1 bg-gray-100 rounded text-xs">{opt}</span>
                    ))}
                    <button className="px-2 py-1 border rounded text-xs hover:bg-gray-50">...</button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <div className="flex flex-wrap gap-2">
                    {typeOptions.map((opt) => (
                      <span key={opt} className="px-2 py-1 bg-gray-100 rounded text-xs">{opt}</span>
                    ))}
                    <button className="px-2 py-1 border rounded text-xs hover:bg-gray-50">...</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Variants Section */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium">Variants</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-black w-48"
                    />
                  </div>
                  <button className="px-3 py-1.5 bg-black text-white rounded-lg text-sm hover:bg-gray-800">
                    Create
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Title</th>
                      <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">SKU</th>
                      <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Material</th>
                      <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Type</th>
                      <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Inventory</th>
                      <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Price</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVariants.map((variant) => (
                      <tr key={variant.id} className="border-t hover:bg-gray-50">
                        <td className="py-2 px-3 text-sm">{variant.title}</td>
                        <td className="py-2 px-3 text-sm text-gray-600">{variant.sku}</td>
                        <td className="py-2 px-3 text-sm text-gray-600">{variant.material}</td>
                        <td className="py-2 px-3 text-sm text-gray-600">{variant.type}</td>
                        <td className="py-2 px-3 text-sm text-gray-600">{variant.inventory}</td>
                        <td className="py-2 px-3 text-sm">${variant.price}</td>
                        <td className="py-2 px-3">
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <MoreHorizontal size={14} className="text-gray-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                <span>1 — {filteredVariants.length} of {filteredVariants.length} results</span>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>Prev</button>
                  <button className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm font-medium">Published</span>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreHorizontal size={16} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Sales Channels */}
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Sales Channels</span>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreHorizontal size={16} className="text-gray-400" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">🌐</span>
                <span>Default Sales Channel</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Available in 1 of 1 sales channels</p>
            </div>

            {/* Shipping */}
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Shipping configuration</span>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreHorizontal size={16} className="text-gray-400" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">📦</span>
                <div>
                  <p className="text-sm">FedEx</p>
                  <p className="text-xs text-gray-500">Normal</p>
                </div>
              </div>
            </div>

            {/* Organize */}
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Organize</span>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreHorizontal size={16} className="text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Collection</span>
                  <span className="text-sm px-2 py-0.5 bg-gray-100 rounded">Lens</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Categories</span>
                  <span className="text-sm text-gray-400">-</span>
                </div>
              </div>
            </div>

            {/* Attributes */}
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Attributes</span>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreHorizontal size={16} className="text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-3 text-sm">
                {['Height', 'Width', 'Length', 'Weight', 'MID code', 'HS code', 'Country of origin'].map((attr) => (
                  <div key={attr} className="flex items-center justify-between">
                    <span className="text-gray-500">{attr}</span>
                    <span className="text-gray-400">{attr === 'Weight' ? '10' : '-'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
