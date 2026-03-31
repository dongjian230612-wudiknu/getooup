'use client';

import { useState } from 'react';
import { X, Upload, Plus, ToggleLeft, ToggleRight, Check } from 'lucide-react';

interface ProductForm {
  title: string;
  subtitle: string;
  handle: string;
  description: string;
}

interface VariantOption {
  name: string;
  values: string[];
}

export default function ProductEdit() {
  const [activeTab, setActiveTab] = useState('details');
  const [hasVariants, setHasVariants] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [form, setForm] = useState<ProductForm>({
    title: '',
    subtitle: '',
    handle: '',
    description: '',
  });

  const [options, setOptions] = useState<VariantOption[]>([
    { name: 'Color', values: ['Black', 'Tortoise', 'Clear', 'Brown'] }
  ]);
  const [newOptionValue, setNewOptionValue] = useState('');

  const handleSubmit = async () => {
    if (!form.title) {
      alert('Please enter a product title');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save to localStorage for demo
    const existingProducts = JSON.parse(localStorage.getItem('admin_products') || '[]');
    const newProduct = {
      id: `PROD-${Date.now()}`,
      ...form,
      hasVariants,
      options: hasVariants ? options : [],
      createdAt: new Date().toISOString(),
    };
    
    localStorage.setItem('admin_products', JSON.stringify([...existingProducts, newProduct]));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      // Redirect to products list
      window.location.href = '/admin/products/';
    }, 1500);
  };

  const addOptionValue = (optionIndex: number) => {
    if (!newOptionValue.trim()) return;
    
    const newOptions = [...options];
    newOptions[optionIndex].values.push(newOptionValue.trim());
    setOptions(newOptions);
    setNewOptionValue('');
  };

  const removeOptionValue = (optionIndex: number, valueIndex: number) => {
    const newOptions = [...options];
    newOptions[optionIndex].values.splice(valueIndex, 1);
    setOptions(newOptions);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <Check size={18} />
          <span>Product created successfully!</span>
        </div>
      )}

      {/* Header */}
      <header className="h-14 bg-white border-b flex items-center justify-between px-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <a href="/admin/products/" className="p-1 hover:bg-gray-100 rounded">
            <X size={20} className="text-gray-500" />
          </a>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span>Products</span>
            <span>/</span>
            <span className="text-black">New Product</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.location.href = '/admin/products/'}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Continue'}
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
                  <label className="block text-sm font-medium mb-1.5">Title *</label>
                  <input
                    type="text"
                    placeholder="Winter jacket"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black text-sm"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium mb-1.5">Subtitle</label>
                  <input
                    type="text"
                    placeholder="Warm and cozy"
                    value={form.subtitle}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
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
                      value={form.handle}
                      onChange={(e) => setForm({ ...form, handle: e.target.value })}
                      className="flex-1 px-3 py-2 border rounded-r-lg focus:outline-none focus:border-black text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
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
            
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center cursor-pointer hover:border-gray-300 transition-colors">
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
                  <button 
                    onClick={() => setOptions([...options, { name: 'Size', values: [] }])}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
                  >
                    <Plus size={14} />
                    Add option
                  </button>
                </div>

                <div className="space-y-4">
                  {options.map((option, optionIndex) => (
                    <div key={optionIndex} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">{option.name}</span>
                        <button 
                          onClick={() => {
                            const newOptions = [...options];
                            newOptions.splice(optionIndex, 1);
                            setOptions(newOptions);
                          }}
                          className="text-gray-400 hover:text-red-500"
                        >
                          🗑️
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {option.values.map((value, valueIndex) => (
                          <span 
                            key={valueIndex} 
                            className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm flex items-center gap-1"
                          >
                            {value}
                            <button 
                              onClick={() => removeOptionValue(optionIndex, valueIndex)}
                              className="text-gray-400 hover:text-red-500 ml-1"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          placeholder="Add value..."
                          value={newOptionValue}
                          onChange={(e) => setNewOptionValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addOptionValue(optionIndex);
                            }
                          }}
                          className="px-3 py-1.5 border rounded-lg text-sm w-32 focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
