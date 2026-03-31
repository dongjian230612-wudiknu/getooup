'use client';

import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface FilterState {
  shapes: string[];
  colors: string[];
  genders: string[];
  priceRange: string | null;
  materials: string[];
}

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const filterOptions = {
  shapes: [
    { id: 'rectangle', label: 'Rectangle', icon: '▭' },
    { id: 'round', label: 'Round', icon: '○' },
    { id: 'cat-eye', label: 'Cat Eye', icon: '◠' },
    { id: 'oval', label: 'Oval', icon: '⬭' },
    { id: 'square', label: 'Square', icon: '□' },
  ],
  colors: [
    { id: 'black', label: 'Black', color: '#000000' },
    { id: 'brown', label: 'Brown', color: '#8B4513' },
    { id: 'tortoise', label: 'Tortoise', color: '#D2691E' },
    { id: 'clear', label: 'Clear', color: '#E0E0E0' },
    { id: 'gold', label: 'Gold', color: '#FFD700' },
    { id: 'silver', label: 'Silver', color: '#C0C0C0' },
  ],
  genders: [
    { id: 'unisex', label: 'Unisex' },
    { id: 'women', label: 'Women' },
    { id: 'men', label: 'Men' },
  ],
  priceRanges: [
    { id: 'under50', label: 'Under $50' },
    { id: '50-100', label: '$50 - $100' },
    { id: '100-200', label: '$100 - $200' },
    { id: 'over200', label: 'Over $200' },
  ],
  materials: [
    { id: 'acetate', label: 'Acetate' },
    { id: 'metal', label: 'Metal' },
    { id: 'titanium', label: 'Titanium' },
    { id: 'tr90', label: 'TR90' },
  ],
};

export default function FilterSidebar({ isOpen, onClose, filters, onFilterChange }: FilterSidebarProps) {
  const [expanded, setExpanded] = useState<string[]>(['shapes', 'colors', 'price']);

  const toggleSection = (section: string) => {
    setExpanded(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const toggleFilter = (category: keyof FilterState, value: string) => {
    const current = filters[category] as string[];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onFilterChange({ ...filters, [category]: updated });
  };

  const setPriceRange = (value: string | null) => {
    onFilterChange({ ...filters, priceRange: value });
  };

  const clearAll = () => {
    onFilterChange({
      shapes: [],
      colors: [],
      genders: [],
      priceRange: null,
      materials: [],
    });
  };

  const totalFilters = 
    filters.shapes.length + 
    filters.colors.length + 
    filters.genders.length + 
    (filters.priceRange ? 1 : 0) + 
    filters.materials.length;

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
          <div>
            <h2 className="text-lg font-medium">Filters</h2>
            {totalFilters > 0 && (
              <span className="text-sm text-gray-500">{totalFilters} selected</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {totalFilters > 0 && (
              <button 
                onClick={clearAll}
                className="text-sm text-gray-500 hover:text-black"
              >
                Clear
              </button>
            )}
            <button onClick={onClose} className="lg:hidden p-1">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Shapes */}
          <div>
            <button 
              onClick={() => toggleSection('shapes')}
              className="w-full flex justify-between items-center py-2 font-medium"
            >
              Frame Shapes
              <ChevronDown 
                size={16} 
                className={`transition-transform ${expanded.includes('shapes') ? '' : '-rotate-90'}`}
              />
            </button>
            {expanded.includes('shapes') && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {filterOptions.shapes.map(shape => (
                  <button
                    key={shape.id}
                    onClick={() => toggleFilter('shapes', shape.id)}
                    className={`
                      flex flex-col items-center p-3 border rounded-lg text-sm
                      ${filters.shapes.includes(shape.id) 
                        ? 'border-black bg-black text-white' 
                        : 'border-gray-200 hover:border-gray-400'}
                    `}
                  >
                    <span className="text-xl mb-1">{shape.icon}</span>
                    <span>{shape.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Colors */}
          <div>
            <button 
              onClick={() => toggleSection('colors')}
              className="w-full flex justify-between items-center py-2 font-medium"
            >
              Frame Colors
              <ChevronDown 
                size={16} 
                className={`transition-transform ${expanded.includes('colors') ? '' : '-rotate-90'}`}
              />
            </button>
            {expanded.includes('colors') && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {filterOptions.colors.map(color => (
                  <button
                    key={color.id}
                    onClick={() => toggleFilter('colors', color.id)}
                    className={`
                      flex flex-col items-center p-2 rounded-lg text-sm
                      ${filters.colors.includes(color.id) 
                        ? 'ring-2 ring-black' 
                        : 'hover:bg-gray-50'}
                    `}
                  >
                    <span 
                      className="w-8 h-8 rounded-full border border-gray-200 mb-1"
                      style={{ backgroundColor: color.color }}
                    />
                    <span className="text-xs">{color.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Gender */}
          <div>
            <button 
              onClick={() => toggleSection('gender')}
              className="w-full flex justify-between items-center py-2 font-medium"
            >
              Gender
              <ChevronDown 
                size={16} 
                className={`transition-transform ${expanded.includes('gender') ? '' : '-rotate-90'}`}
              />
            </button>
            {expanded.includes('gender') && (
              <div className="space-y-2 mt-2">
                {filterOptions.genders.map(gender => (
                  <label 
                    key={gender.id}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.genders.includes(gender.id)}
                      onChange={() => toggleFilter('genders', gender.id)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span>{gender.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div>
            <button 
              onClick={() => toggleSection('price')}
              className="w-full flex justify-between items-center py-2 font-medium"
            >
              Price Range
              <ChevronDown 
                size={16} 
                className={`transition-transform ${expanded.includes('price') ? '' : '-rotate-90'}`}
              />
            </button>
            {expanded.includes('price') && (
              <div className="space-y-2 mt-2">
                {filterOptions.priceRanges.map(price => (
                  <label 
                    key={price.id}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      checked={filters.priceRange === price.id}
                      onChange={() => setPriceRange(price.id)}
                      className="w-4 h-4"
                    />
                    <span>{price.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Materials */}
          <div>
            <button 
              onClick={() => toggleSection('materials')}
              className="w-full flex justify-between items-center py-2 font-medium"
            >
              Materials
              <ChevronDown 
                size={16} 
                className={`transition-transform ${expanded.includes('materials') ? '' : '-rotate-90'}`}
              />
            </button>
            {expanded.includes('materials') && (
              <div className="space-y-2 mt-2">
                {filterOptions.materials.map(material => (
                  <label 
                    key={material.id}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.materials.includes(material.id)}
                      onChange={() => toggleFilter('materials', material.id)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span>{material.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
