'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  X, Upload, Plus, ChevronDown, Trash2, GripVertical,
  Search, Tag, Globe, Package, DollarSign, Hash, Layers,
  ToggleLeft, ToggleRight, ArrowLeft, MoreHorizontal, Copy
} from 'lucide-react';

interface Variant {
  id: string;
  sku: string;
  title: string;
  price: number;
  originalPrice?: number;
  inventory: number;
  allowBackorder: boolean;
  manageInventory: boolean;
  options: Record<string, string>;
}

interface ProductForm {
  title: string;
  subtitle: string;
  handle: string;
  description: string;
  material?: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  hsCode?: string;
  countryOfOrigin?: string;
  midCode?: string;
}

interface MediaItem {
  id: string;
  url: string;
  alt: string;
  isThumbnail: boolean;
}

export default function ProductEdit() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const isEdit = !!productId;
  
  const [activeTab, setActiveTab] = useState('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const [form, setForm] = useState<ProductForm>({
    title: '',
    subtitle: '',
    handle: '',
    description: '',
    material: '',
    weight: 0,
    dimensions: {},
    hsCode: '',
    countryOfOrigin: '',
    midCode: '',
  });

  const [status, setStatus] = useState<'published' | 'draft'>('draft');
  const [salesChannels, setSalesChannels] = useState<string[]>(['default']);
  const [collections, setCollections] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [hasVariants, setHasVariants] = useState(false);
  const [options, setOptions] = useState<{name: string; values: string[]}[]>([
    { name: 'Color', values: [] }
  ]);
  const [variants, setVariants] = useState<Variant[]>([
    {
      id: 'default',
      sku: '',
      title: 'Default',
      price: 0,
      originalPrice: 0,
      inventory: 0,
      allowBackorder: false,
      manageInventory: true,
      options: {}
    }
  ]);
  
  const [seo, setSeo] = useState({
    title: '',
    description: '',
    keywords: ''
  });

  // Load product data if editing
  useEffect(() => {
    if (isEdit) {
      const savedProducts = JSON.parse(localStorage.getItem('admin_products') || '[]');
      const product = savedProducts.find((p: any) => p.id === productId);
      if (product) {
        setForm(prev => ({ ...prev, ...product }));
        if (product.status) setStatus(product.status);
        if (product.variants?.length > 1) {
          setHasVariants(true);
          setVariants(product.variants);
        }
        if (product.options) setOptions(product.options);
        if (product.tags) setTags(product.tags);
        if (product.collections) setCollections(product.collections);
        if (product.salesChannels) setSalesChannels(product.salesChannels);
        if (product.media) setMedia(product.media);
      }
    }
  }, [isEdit, productId]);

  // Generate variants when options change
  useEffect(() => {
    if (hasVariants && options.some(o => o.values.length > 0)) {
      generateVariants();
    }
  }, [options, hasVariants]);

  const generateVariants = () => {
    const validOptions = options.filter(o => o.values.length > 0);
    if (validOptions.length === 0) return;

    const combinations: Record<string, string>[] = [{}];
    validOptions.forEach(option => {
      const newCombinations: Record<string, string>[] = [];
      combinations.forEach(combo => {
        option.values.forEach(value => {
          newCombinations.push({ ...combo, [option.name]: value });
        });
      });
      combinations.length = 0;
      combinations.push(...newCombinations);
    });

    const newVariants: Variant[] = combinations.map((combo, index) => ({
      id: `variant-${index}`,
      sku: `${form.handle || 'prod'}-${index + 1}`.toUpperCase(),
      title: Object.values(combo).join(' / '),
      price: 0,
      originalPrice: 0,
      inventory: 0,
      allowBackorder: false,
      manageInventory: true,
      options: combo
    }));

    setVariants(newVariants);
  };

  const handleSubmit = async () => {
    if (!form.title) {
      alert('Please enter a product title');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const productData = {
      id: isEdit ? productId : `PROD-${Date.now()}`,
      ...form,
      status,
      salesChannels,
      collections,
      tags,
      categories,
      media,
      hasVariants,
      options: hasVariants ? options : [],
      variants: hasVariants ? variants : [variants[0]],
      seo,
      updatedAt: new Date().toISOString(),
      createdAt: isEdit ? undefined : new Date().toISOString(),
    };

    const existingProducts = JSON.parse(localStorage.getItem('admin_products') || '[]');
    
    if (isEdit) {
      const index = existingProducts.findIndex((p: any) => p.id === productId);
      if (index >= 0) {
        existingProducts[index] = { ...existingProducts[index], ...productData };
      }
    } else {
      existingProducts.push(productData);
    }

    localStorage.setItem('admin_products', JSON.stringify(existingProducts));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      window.location.href = '/admin/products/';
    }, 1500);
  };

  const addOption = () => {
    setOptions([...options, { name: '', values: [] }]);
  };

  const updateOption = (index: number, field: 'name' | 'values', value: string | string[]) => {
    const newOptions = [...options];
    if (field === 'name') {
      newOptions[index].name = value as string;
    } else {
      newOptions[index].values = value as string[];
    }
    setOptions(newOptions);
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const addOptionValue = (optionIndex: number, value: string) => {
    if (!value.trim()) return;
    const newOptions = [...options];
    if (!newOptions[optionIndex].values.includes(value.trim())) {
      newOptions[optionIndex].values.push(value.trim());
      setOptions(newOptions);
    }
  };

  const removeOptionValue = (optionIndex: number, valueIndex: number) => {
    const newOptions = [...options];
    newOptions[optionIndex].values.splice(valueIndex, 1);
    setOptions(newOptions);
  };

  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleMediaUpload = () => {
    // Simulate media upload
    const newMedia: MediaItem = {
      id: `media-${Date.now()}`,
      url: '/images/placeholder-product.jpg',
      alt: form.title || 'Product image',
      isThumbnail: media.length === 0
    };
    setMedia([...media, newMedia]);
  };

  const removeMedia = (id: string) => {
    setMedia(media.filter(m => m.id !== id));
  };

  const setThumbnail = (id: string) => {
    setMedia(media.map(m => ({ ...m, isThumbnail: m.id === id })));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <span className="font-medium">Product {isEdit ? 'updated' : 'created'} successfully!</span>
        </div>
      )}

      {/* Header */}
      <header className="h-14 bg-white border-b flex items-center justify-between px-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <a href="/admin/products/" className="p-1.5 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={18} className="text-gray-500" />
          </a>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Products</span>
            <span className="text-gray-300">/</span>
            <span className="font-medium">{isEdit ? form.title || 'Edit Product' : 'New Product'}</span>
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
            className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : (isEdit ? 'Save' : 'Publish')}
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="flex px-4">
          {['General', 'Media', 'Variants', 'Shipping', 'Attributes', 'SEO'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-4 py-3 text-sm border-b-2 transition-colors whitespace-nowrap
                ${activeTab === tab.toLowerCase() 
                  ? 'border-black text-black font-medium' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'}
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="flex max-w-7xl mx-auto">
          {/* Left Content */}
          <div className="flex-1 p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                {/* General Section */}
                <div className="bg-white rounded-lg border shadow-sm">
                  <div className="px-6 py-4 border-b">
                    <h2 className="font-medium">General</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Title <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        placeholder="e.g. Summer Sunglasses"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Subtitle</label>
                      <input
                        type="text"
                        placeholder="Short product description"
                        value={form.subtitle}
                        onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Handle</label>
                      <div className="flex items-center">
                        <span className="px-3 py-2 border border-r-0 rounded-l-lg bg-gray-50 text-gray-500 text-sm">/</span>
                        <input
                          type="text"
                          placeholder="summer-sunglasses"
                          value={form.handle}
                          onChange={(e) => setForm({ ...form, handle: e.target.value })}
                          className="flex-1 px-3 py-2 border rounded-r-lg focus:outline-none focus:ring-1 focus:ring-black text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Description</label>
                      <textarea
                        rows={6}
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm"
                        placeholder="Detailed product description..."
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing Section (if no variants) */}
                {!hasVariants && (
                  <div className="bg-white rounded-lg border shadow-sm">
                    <div className="px-6 py-4 border-b">
                      <h2 className="font-medium">Pricing</h2>
                    </div>
                    <div className="p-6 grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Price <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={variants[0].price || ''}
                            onChange={(e) => updateVariant(0, 'price', parseFloat(e.target.value) || 0)}
                            className="w-full pl-7 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Compare at price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={variants[0].originalPrice || ''}
                            onChange={(e) => updateVariant(0, 'originalPrice', parseFloat(e.target.value) || 0)}
                            className="w-full pl-7 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Cost per item</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            className="w-full pl-7 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Inventory Section (if no variants) */}
                {!hasVariants && (
                  <div className="bg-white rounded-lg border shadow-sm">
                    <div className="px-6 py-4 border-b">
                      <h2 className="font-medium">Inventory</h2>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1.5">SKU</label>
                          <input
                            type="text"
                            value={variants[0].sku}
                            onChange={(e) => updateVariant(0, 'sku', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1.5">Barcode</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={variants[0].manageInventory}
                            onChange={(e) => updateVariant(0, 'manageInventory', e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">Track quantity</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={variants[0].allowBackorder}
                            onChange={(e) => updateVariant(0, 'allowBackorder', e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">Allow backorder</span>
                        </label>
                      </div>
                      {variants[0].manageInventory && (
                        <div>
                          <label className="block text-sm font-medium mb-1.5">Quantity</label>
                          <input
                            type="number"
                            value={variants[0].inventory}
                            onChange={(e) => updateVariant(0, 'inventory', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'media' && (
              <div className="bg-white rounded-lg border shadow-sm">
                <div className="px-6 py-4 border-b">
                  <h2 className="font-medium">Media</h2>
                </div>
                <div className="p-6">
                  {media.length > 0 ? (
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      {media.map((item) => (
                        <div key={item.id} className="relative group">
                          <div className={`aspect-square rounded-lg border overflow-hidden ${item.isThumbnail ? 'ring-2 ring-black' : ''}`}>
                            <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />
                          </div>
                          {item.isThumbnail && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 bg-black text-white text-xs rounded">
                              Thumbnail
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            {!item.isThumbnail && (
                              <button
                                onClick={() => setThumbnail(item.id)}
                                className="p-2 bg-white rounded-lg text-sm"
                                title="Set as thumbnail"
                              >
                                <Layers size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => removeMedia(item.id)}
                              className="p-2 bg-red-500 text-white rounded-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  
                  <button
                    onClick={handleMediaUpload}
                    className="w-full border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-gray-300 transition-colors"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Upload size={20} className="text-gray-400" />
                    </div>
                    <p className="text-sm font-medium mb-1">Add images</p>
                    <p className="text-xs text-gray-500">Drag and drop or click to upload</p>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'variants' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border shadow-sm">
                  <div className="px-6 py-4 border-b flex items-center justify-between">
                    <h2 className="font-medium">Product Variants</h2>
                    <button
                      onClick={() => setHasVariants(!hasVariants)}
                      className="flex items-center gap-2"
                    >
                      {hasVariants ? <ToggleRight size={24} className="text-black" /> : <ToggleLeft size={24} className="text-gray-300" />}
                      <span className="text-sm">This product has variants</span>
                    </button>
                  </div>
                  
                  {hasVariants && (
                    <div className="p-6 space-y-6">
                      {/* Options */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-medium">Options</h3>
                          <button
                            onClick={addOption}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
                          >
                            <Plus size={14} />
                            Add option
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          {options.map((option, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex items-center gap-4 mb-3">
                                <input
                                  type="text"
                                  placeholder="Option name (e.g. Color)"
                                  value={option.name}
                                  onChange={(e) => updateOption(index, 'name', e.target.value)}
                                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                                />
                                <button
                                  onClick={() => removeOption(index)}
                                  className="p-2 text-gray-400 hover:text-red-500"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {option.values.map((value, vIndex) => (
                                  <span key={vIndex} className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm flex items-center gap-1">
                                    {value}
                                    <button
                                      onClick={() => removeOptionValue(index, vIndex)}
                                      className="text-gray-400 hover:text-red-500"
                                    >
                                      <X size={14} />
                                    </button>
                                  </span>
                                ))}
                                <input
                                  type="text"
                                  placeholder="Add value..."
                                  className="px-3 py-1.5 border rounded-lg text-sm w-28"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      addOptionValue(index, e.currentTarget.value);
                                      e.currentTarget.value = '';
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Variants Table */}
                      {variants.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium mb-4">Variant Details</h3>
                          <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-50 border-b">
                                <tr>
                                  <th className="text-left py-3 px-4 font-medium">Variant</th>
                                  <th className="text-left py-3 px-4 font-medium">SKU</th>
                                  <th className="text-left py-3 px-4 font-medium">Price</th>
                                  <th className="text-left py-3 px-4 font-medium">Stock</th>
                                </tr>
                              </thead>
                              <tbody>
                                {variants.map((variant, index) => (
                                  <tr key={variant.id} className="border-b last:border-b-0">
                                    <td className="py-3 px-4">{variant.title}</td>
                                    <td className="py-3 px-4">
                                      <input
                                        type="text"
                                        value={variant.sku}
                                        onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                                        className="w-full px-2 py-1 border rounded text-sm"
                                      />
                                    </td>
                                    <td className="py-3 px-4">
                                      <div className="flex items-center">
                                        <span className="text-gray-500 mr-1">$</span>
                                        <input
                                          type="number"
                                          value={variant.price || ''}
                                          onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                                          className="w-24 px-2 py-1 border rounded text-sm"
                                        />
                                      </div>
                                    </td>
                                    <td className="py-3 px-4">
                                      <input
                                        type="number"
                                        value={variant.inventory}
                                        onChange={(e) => updateVariant(index, 'inventory', parseInt(e.target.value) || 0)}
                                        className="w-24 px-2 py-1 border rounded text-sm"
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="bg-white rounded-lg border shadow-sm">
                <div className="px-6 py-4 border-b">
                  <h2 className="font-medium">Shipping</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Weight</label>
                      <div className="flex">
                        <input
                          type="number"
                          value={form.weight || ''}
                          onChange={(e) => setForm({ ...form, weight: parseFloat(e.target.value) })}
                          className="flex-1 px-3 py-2 border rounded-l-lg text-sm"
                        />
                        <select className="px-3 py-2 border border-l-0 rounded-r-lg bg-gray-50 text-sm">
                          <option>kg</option>
                          <option>g</option>
                          <option>lb</option>
                          <option>oz</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Dimensions</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="L"
                          className="w-20 px-3 py-2 border rounded-lg text-sm"
                        />
                        <span className="text-gray-400 self-center">×</span>
                        <input
                          type="number"
                          placeholder="W"
                          className="w-20 px-3 py-2 border rounded-lg text-sm"
                        />
                        <span className="text-gray-400 self-center">×</span>
                        <input
                          type="number"
                          placeholder="H"
                          className="w-20 px-3 py-2 border rounded-lg text-sm"
                        />
                        <select className="px-2 py-2 border rounded-lg bg-gray-50 text-sm">
                          <option>cm</option>
                          <option>in</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'attributes' && (
              <div className="bg-white rounded-lg border shadow-sm">
                <div className="px-6 py-4 border-b">
                  <h2 className="font-medium">Custom Attributes</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Material</label>
                      <input
                        type="text"
                        value={form.material || ''}
                        onChange={(e) => setForm({ ...form, material: e.target.value })}
                        placeholder="e.g. Acetate, Titanium"
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Country of origin</label>
                      <input
                        type="text"
                        value={form.countryOfOrigin || ''}
                        onChange={(e) => setForm({ ...form, countryOfOrigin: e.target.value })}
                        placeholder="e.g. China, Italy"
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">HS Code</label>
                      <input
                        type="text"
                        value={form.hsCode || ''}
                        onChange={(e) => setForm({ ...form, hsCode: e.target.value })}
                        placeholder="e.g. 9003.11"
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">MID Code</label>
                      <input
                        type="text"
                        value={form.midCode || ''}
                        onChange={(e) => setForm({ ...form, midCode: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="bg-white rounded-lg border shadow-sm">
                <div className="px-6 py-4 border-b">
                  <h2 className="font-medium">SEO</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Meta Title</label>
                    <input
                      type="text"
                      value={seo.title}
                      onChange={(e) => setSeo({ ...seo, title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      maxLength={70}
                    />
                    <p className="text-xs text-gray-500 mt-1">{seo.title.length}/70 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Meta Description</label>
                    <textarea
                      rows={3}
                      value={seo.description}
                      onChange={(e) => setSeo({ ...seo, description: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      maxLength={320}
                    />
                    <p className="text-xs text-gray-500 mt-1">{seo.description.length}/320 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Keywords</label>
                    <input
                      type="text"
                      value={seo.keywords}
                      onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
                      placeholder="eyeglasses, prescription, frames"
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className={`${sidebarCollapsed ? 'w-14' : 'w-80'} border-l bg-white p-6 transition-all`}>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="absolute right-4 top-20 p-1 hover:bg-gray-100 rounded"
            >
              <ChevronDown size={16} className={`transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>

            {!sidebarCollapsed && (
              <div className="space-y-6">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                {/* Sales Channels */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                    <Globe size={14} />
                    Sales Channels
                  </label>
                  <div className="space-y-2">
                    {['default', 'pos', 'online'].map((channel) => (
                      <label key={channel} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={salesChannels.includes(channel)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSalesChannels([...salesChannels, channel]);
                            } else {
                              setSalesChannels(salesChannels.filter(c => c !== channel));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm capitalize">{channel === 'default' ? 'Default Sales Channel' : channel}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Collections */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                    <Layers size={14} />
                    Collections
                  </label>
                  <select
                    multiple
                    value={collections}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, opt => opt.value);
                      setCollections(selected);
                    }}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    size={4}
                  >
                    <option value="standard">Standard Fit</option>
                    <option value="asiafit">Asia Fit</option>
                    <option value="sunglasses">Sunglasses</option>
                    <option value="bestsellers">Best Sellers</option>
                    <option value="new">New Arrivals</option>
                  </select>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                    <Package size={14} />
                    Categories
                  </label>
                  <div className="space-y-2">
                    {['Men', 'Women', 'Kids', 'Accessories'].map((cat) => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={categories.includes(cat.toLowerCase())}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCategories([...categories, cat.toLowerCase()]);
                            } else {
                              setCategories(categories.filter(c => c !== cat.toLowerCase()));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                    <Tag size={14} />
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 rounded text-sm flex items-center gap-1">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="text-gray-400 hover:text-red-500">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add tag..."
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
