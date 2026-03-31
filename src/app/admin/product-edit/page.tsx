'use client';

import { useState } from 'react';
import { X, Upload, Plus, ToggleLeft, ToggleRight } from 'lucide-react';

export default function ProductEdit() {
  const [activeTab, setActiveTab] = useState('details');
  const [hasVariants, setHasVariants] = useState(false);

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
            <span className="text-black">New Product</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">
            Save as draft
          </button>
          <button className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800">
            Continue
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
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-3xl mx-auto">
          {/* General Section */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h2 className="font-medium mb-6">General</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium mb-1.5">Title</label>
                  <input
                    type="text"
                    placeholder="Winter jacket"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black text-sm"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium mb-1.5">Subtitle</label>
                  <input
                    type="text"
                    placeholder="Warm and cozy"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black text-sm"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium mb-1.5">Handle</label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 border border-r-0 rounded-l-lg bg-gray-50 text-gray-500 text-sm">/</span>
                    <input
                      type="text"
                      placeholder="winter-jacket"
                      className="flex-1 px-3 py-2 border rounded-r-lg focus:outline-none focus:border-black text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black text-sm"
                  placeholder="A warm and cozy jacket"
                />
              </div>
            </div>
          </div>

          {/* Media Section */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-medium">Media</h2>
                <p className="text-xs text-gray-500">Optional</p>
              </div>
            </div>
            
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Upload size={20} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium mb-1">Upload images</p>
              <p className="text-xs text-gray-500">Drag and drop images here or click to upload.</p>
            </div>
          </div>

          {/* Variants Section */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="font-medium mb-4">Variants</h2>
            
            <div className="flex items-start gap-3">
              <button
                onClick={() => setHasVariants(!hasVariants)}
                className="mt-0.5"
              >
                {hasVariants ? (
                  <ToggleRight size={24} className="text-black" />
                ) : (
                  <ToggleLeft size={24} className="text-gray-300" />
                )}
              </button>
              <div>
                <p className="text-sm font-medium">Yes, this is a product with variants</p>
                <p className="text-xs text-gray-500">When unchecked, we will create a default variant for you</p>
              </div>
            </div>

            {hasVariants && (
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium text-sm">Options</span>
                  <button className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50">
                    <Plus size={14} />
                    Add option
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">Color</span>
                      <button className="text-gray-400 hover:text-red-500">🗑️</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['Black', 'Tortoise', 'Clear', 'Brown'].map((color) => (
                        <span key={color} className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm">{color}</span>
                      ))}
                      <input
                        type="text"
                        placeholder="Add value..."
                        className="px-3 py-1.5 border rounded-lg text-sm w-32 focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
