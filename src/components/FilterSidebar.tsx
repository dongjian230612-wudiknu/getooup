'use client';

import { useState } from 'react';
import { X, Minus } from 'lucide-react';

interface FilterState {
  shapes: string[];
  colors: string[];
  genders: string[];
  priceRange: string | null;
  materials: string[];
  bestSellers: boolean;
  newArrivals: boolean;
}

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const filterData = {
  shopBy: [
    { id: 'bestSellers', label: 'Best Sellers', count: 12 },
    { id: 'newArrivals', label: 'New Arrivals', count: 8 },
  ],
  frameWidth: [
    { id: 'wide', label: 'Wide (140mm+)', count: 4 },
    { id: 'medium', label: 'Medium (135-139mm)', count: 6 },
    { id: 'narrow', label: 'Narrow (129mm and below)', count: 3 },
  ],
  shapes: [
    { id: 'rectangle', label: 'Rectangle', icon: '⬭', count: 8 },
    { id: 'oval', label: 'Oval', icon: '⬯', count: 5 },
    { id: 'aviator', label: 'Aviator', icon: '🕶', count: 3 },
    { id: 'square', label: 'Square', icon: '⬜', count: 6 },
    { id: 'round', label: 'Round', icon: '⭕', count: 7 },
    { id: 'cat-eye', label: 'Cat-eye', icon: '◠', count: 4 },
  ],
  rim: [
    { id: 'full-rim', label: 'Full-Rim', icon: '⬭', count: 15 },
    { id: 'semi-rimless', label: 'Semi-Rimless', icon: '◡', count: 8 },
    { id: 'rimless', label: 'Rimless', icon: '○', count: 3 },
  ],
  prices: [
    { id: '49', label: '$49 frames', count: 10 },
    { id: '69', label: '$69 frames', count: 8 },
    { id: '89', label: '$89 frames', count: 5 },
  ],
  colors: [
    { id: 'black', label: 'Black', color: '#000000' },
    { id: 'grey', label: 'Grey', color: '#808080' },
    { id: 'brown', label: 'Brown', color: '#8B4513' },
    { id: 'tortoise', label: 'Tortoise', color: '#D2691E' },
    { id: 'gold', label: 'Gold', color: '#FFD700' },
    { id: 'silver', label: 'Silver', color: '#C0C0C0' },
    { id: 'blue', label: 'Blue', color: '#4169E1' },
    { id: 'red', label: 'Red', color: '#DC143C' },
    { id: 'pink', label: 'Pink', color: '#FFB6C1' },
    { id: 'clear', label: 'Clear', color: '#E8E8E8' },
  ],
  materials: [
    { id: 'acetate', label: 'Acetate', count: 12 },
    { id: 'tr90', label: 'TR90', count: 6 },
    { id: 'metal', label: 'Metal', count: 8 },
    { id: 'titanium', label: 'Titanium', count: 4 },
    { id: 'mixed', label: 'Mixed', count: 3 },
  ],
};

export default function FilterSidebar({ isOpen, onClose, filters, onFilterChange }: FilterSidebarProps) {
  const [expanded, setExpanded] = useState<string[]>([
    'shopBy', 'frameWidth', 'shapes', 'rim', 'prices', 'colors', 'materials'
  ]);

  const toggleSection = (section: string) => {
    setExpanded(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
    const current = (filters[key] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onFilterChange({ ...filters, [key]: updated });
  };

  const setPrice = (value: string | null) => {
    onFilterChange({ ...filters, priceRange: value });
  };

  const toggleBoolean = (key: 'bestSellers' | 'newArrivals') => {
    onFilterChange({ ...filters, [key]: !filters[key] });
  };

  const clearAll = () => {
    onFilterChange({
      shapes: [],
      colors: [],
      genders: [],
      priceRange: null,
      materials: [],
      bestSellers: false,
      newArrivals: false,
    });
  };

  const getTotalFilters = () => {
    return filters.shapes.length + 
      filters.colors.length + 
      filters.materials.length +
      (filters.priceRange ? 1 : 0) +
      (filters.bestSellers ? 1 : 0) +
      (filters.newArrivals ? 1 : 0);
  };

  const totalFilters = getTotalFilters();

  const SectionHeader = ({ title, count, section }: { title: string; count: number; section: string }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex justify-between items-center py-3 border-b border-gray-200"
    >
      <span className="font-medium text-sm">
        {title} <sup className="text-gray-400">(+{count})</sup>
      </span>
      <Minus size={14} className="text-gray-400" />
    </button>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-72 bg-white z-50 
        transform transition-transform duration-300 overflow-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-medium">Shop by</h2>
            {totalFilters > 0 && (
              <sup className="text-gray-400 text-xs">(+{totalFilters})</sup>
            )}
          </div>
          <button onClick={onClose} className="lg:hidden">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-1">
          {/* Shop By */}
          <div>
            <SectionHeader title="Shop by" count={2} section="shopBy" />
            {expanded.includes('shopBy') && (
              <div className="py-3 space-y-2">
                {filterData.shopBy.map(item => (
                  <label key={item.id} className="flex items-center gap-3 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={filters[item.id as keyof FilterState] as boolean}
                      onChange={() => toggleBoolean(item.id as 'bestSellers' | 'newArrivals')}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Frame Width */}
          <div>
            <SectionHeader title="Frame Width" count={filterData.frameWidth.length} section="frameWidth" />
            {expanded.includes('frameWidth') && (
              <div className="py-3 space-y-2">
                {filterData.frameWidth.map(item => (
                  <label key={item.id} className="flex items-center gap-3 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Shape */}
          <div>
            <SectionHeader title="Shape" count={filterData.shapes.length} section="shapes" />
            {expanded.includes('shapes') && (
              <div className="py-3 space-y-2">
                {filterData.shapes.map(shape => (
                  <label key={shape.id} className="flex items-center gap-3 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={filters.shapes.includes(shape.id)}
                      onChange={() => toggleArrayFilter('shapes', shape.id)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-gray-600">{shape.icon}</span>
                    <span>{shape.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Rim */}
          <div>
            <SectionHeader title="Rim" count={filterData.rim.length} section="rim" />
            {expanded.includes('rim') && (
              <div className="py-3 space-y-2">
                {filterData.rim.map(item => (
                  <label key={item.id} className="flex items-center gap-3 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-gray-600">{item.icon}</span>
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Frame Price */}
          <div>
            <SectionHeader title="Frame price" count={filterData.prices.length} section="prices" />
            {expanded.includes('prices') && (
              <div className="py-3 space-y-2">
                {filterData.prices.map(price => (
                  <label key={price.id} className="flex items-center gap-3 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={filters.priceRange === price.id}
                      onChange={() => setPrice(filters.priceRange === price.id ? null : price.id)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span>{price.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Color */}
          <div>
            <SectionHeader title="Color" count={filterData.colors.length} section="colors" />
            {expanded.includes('colors') && (
              <div className="py-3">
                <div className="grid grid-cols-5 gap-2">
                  {filterData.colors.map(color => (
                    <button
                      key={color.id}
                      onClick={() => toggleArrayFilter('colors', color.id)}
                      className={`
                        w-8 h-8 rounded border-2 transition-all
                        ${filters.colors.includes(color.id) 
                          ? 'border-black scale-110' 
                          : 'border-gray-200 hover:border-gray-400'}
                      `}
                      style={{ backgroundColor: color.color }}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Material */}
          <div>
            <SectionHeader title="Material" count={filterData.materials.length} section="materials" />
            {expanded.includes('materials') && (
              <div className="py-3 space-y-2">
                {filterData.materials.map(item => (
                  <label key={item.id} className="flex items-center gap-3 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={filters.materials.includes(item.id)}
                      onChange={() => toggleArrayFilter('materials', item.id)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Clear Button */}
          {totalFilters > 0 && (
            <button
              onClick={clearAll}
              className="w-full mt-6 py-3 border border-gray-300 rounded text-sm hover:border-black transition-colors"
            >
              Clear ({totalFilters})
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
