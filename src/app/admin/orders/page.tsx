'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  amount: number;
  currency: string;
  paymentStatus: 'captured' | 'pending' | 'failed' | 'refunded';
  fulfillmentStatus: 'fulfilled' | 'shipped' | 'delivered' | 'unfulfilled' | 'partial';
  salesChannel: string;
  date: string;
  items: number;
  region?: string;
}

interface FilterOption {
  id: string;
  label: string;
  type: 'select' | 'date' | 'text';
  options?: string[];
}

interface ActiveFilter {
  id: string;
  label: string;
  value: string;
}

const filterOptions: FilterOption[] = [
  { id: 'status', label: 'Status', type: 'select', options: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] },
  { id: 'paymentStatus', label: 'Payment Status', type: 'select', options: ['Captured', 'Pending', 'Failed', 'Refunded'] },
  { id: 'fulfillmentStatus', label: 'Fulfillment Status', type: 'select', options: ['Fulfilled', 'Shipped', 'Delivered', 'Unfulfilled', 'Partial'] },
  { id: 'salesChannel', label: 'Sales Channel', type: 'select', options: ['Default Sales Channel', 'Online Store', 'Manual'] },
  { id: 'region', label: 'Region', type: 'select', options: ['North America', 'Europe', 'Asia', 'Other'] },
  { id: 'date', label: 'Date', type: 'date' },
];

export default function Orders() {
  const [orders] = useState<Order[]>([
    { id: 'ORD-001', orderNumber: '#509', customer: 'John Smith', email: 'john@example.com', amount: 358.28, currency: 'USD', paymentStatus: 'captured', fulfillmentStatus: 'fulfilled', salesChannel: 'Default Sales Channel', date: '2026-03-31', items: 2, region: 'North America' },
    { id: 'ORD-002', orderNumber: '#508', customer: 'Emma Wilson', email: 'emma@example.com', amount: 62.54, currency: 'USD', paymentStatus: 'captured', fulfillmentStatus: 'fulfilled', salesChannel: 'Default Sales Channel', date: '2026-03-31', items: 1, region: 'Europe' },
    { id: 'ORD-003', orderNumber: '#507', customer: 'Michael Brown', email: 'michael@example.com', amount: 12.00, currency: 'EUR', paymentStatus: 'captured', fulfillmentStatus: 'fulfilled', salesChannel: 'Default Sales Channel', date: '2026-03-30', items: 3, region: 'Europe' },
    { id: 'ORD-004', orderNumber: '#506', customer: 'Sarah Davis', email: 'sarah@example.com', amount: 136.74, currency: 'USD', paymentStatus: 'captured', fulfillmentStatus: 'fulfilled', salesChannel: 'Default Sales Channel', date: '2026-03-29', items: 1, region: 'North America' },
    { id: 'ORD-005', orderNumber: '#505', customer: 'David Lee', email: 'david@example.com', amount: 62.54, currency: 'USD', paymentStatus: 'captured', fulfillmentStatus: 'shipped', salesChannel: 'Default Sales Channel', date: '2026-03-28', items: 2, region: 'Asia' },
    { id: 'ORD-006', orderNumber: '#504', customer: 'Lisa Chen', email: 'lisa@example.com', amount: 79.00, currency: 'CAD', paymentStatus: 'captured', fulfillmentStatus: 'shipped', salesChannel: 'Default Sales Channel', date: '2026-03-27', items: 1, region: 'North America' },
    { id: 'ORD-007', orderNumber: '#503', customer: 'James Wilson', email: 'james@example.com', amount: 115.54, currency: 'USD', paymentStatus: 'captured', fulfillmentStatus: 'shipped', salesChannel: 'Default Sales Channel', date: '2026-03-27', items: 2, region: 'North America' },
    { id: 'ORD-008', orderNumber: '#502', customer: 'Anna Zhang', email: 'anna@example.com', amount: 126.14, currency: 'USD', paymentStatus: 'captured', fulfillmentStatus: 'shipped', salesChannel: 'Default Sales Channel', date: '2026-03-24', items: 1, region: 'Asia' },
    { id: 'ORD-009', orderNumber: '#501', customer: 'Robert Taylor', email: 'robert@example.com', amount: 316.94, currency: 'USD', paymentStatus: 'captured', fulfillmentStatus: 'shipped', salesChannel: 'Default Sales Channel', date: '2026-03-23', items: 3, region: 'North America' },
    { id: 'ORD-010', orderNumber: '#500', customer: 'Maria Garcia', email: 'maria@example.com', amount: 55.00, currency: 'EUR', paymentStatus: 'captured', fulfillmentStatus: 'shipped', salesChannel: 'Default Sales Channel', date: '2026-03-22', items: 1, region: 'Europe' },
    { id: 'ORD-011', orderNumber: '#499', customer: 'Kevin Wang', email: 'kevin@example.com', amount: 94.34, currency: 'USD', paymentStatus: 'captured', fulfillmentStatus: 'shipped', salesChannel: 'Default Sales Channel', date: '2026-03-21', items: 2, region: 'Asia' },
    { id: 'ORD-012', orderNumber: '#498', customer: 'Jennifer Liu', email: 'jennifer@example.com', amount: 84.00, currency: 'EUR', paymentStatus: 'captured', fulfillmentStatus: 'delivered', salesChannel: 'Default Sales Channel', date: '2026-03-20', items: 1, region: 'Europe' },
    { id: 'ORD-013', orderNumber: '#497', customer: 'Chris Martin', email: 'chris@example.com', amount: 136.74, currency: 'USD', paymentStatus: 'captured', fulfillmentStatus: 'shipped', salesChannel: 'Default Sales Channel', date: '2026-03-19', items: 2, region: 'North America' },
    { id: 'ORD-014', orderNumber: '#496', customer: 'Amanda White', email: 'amanda@example.com', amount: 94.34, currency: 'USD', paymentStatus: 'captured', fulfillmentStatus: 'shipped', salesChannel: 'Default Sales Channel', date: '2026-03-18', items: 1, region: 'Europe' },
    { id: 'ORD-015', orderNumber: '#495', customer: 'Daniel Kim', email: 'daniel@example.com', amount: 167.48, currency: 'USD', paymentStatus: 'captured', fulfillmentStatus: 'shipped', salesChannel: 'Default Sales Channel', date: '2026-03-18', items: 3, region: 'Asia' },
  ]);
  
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState<string | null>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 20;

  // Close filter menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setShowFilterMenu(false);
        setShowFilterDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Search filter
      const matchesSearch = 
        order.customer.toLowerCase().includes(search.toLowerCase()) ||
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.email.toLowerCase().includes(search.toLowerCase()) ||
        order.orderNumber.toLowerCase().includes(search.toLowerCase());
      
      if (!matchesSearch) return false;

      // Active filters
      for (const filter of activeFilters) {
        if (filter.id === 'paymentStatus' && order.paymentStatus.toLowerCase() !== filter.value.toLowerCase()) {
          return false;
        }
        if (filter.id === 'fulfillmentStatus' && order.fulfillmentStatus.toLowerCase() !== filter.value.toLowerCase()) {
          return false;
        }
        if (filter.id === 'salesChannel' && order.salesChannel !== filter.value) {
          return false;
        }
        if (filter.id === 'region' && order.region !== filter.value) {
          return false;
        }
      }
      
      return true;
    });
  }, [orders, search, activeFilters]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredOrders.length);
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const addFilter = (filterId: string, filterLabel: string, value: string) => {
    // Remove existing filter of same type
    const newFilters = activeFilters.filter(f => f.id !== filterId);
    newFilters.push({ id: filterId, label: filterLabel, value });
    setActiveFilters(newFilters);
    setShowFilterDropdown(null);
    setCurrentPage(1);
  };

  const removeFilter = (filterId: string) => {
    setActiveFilters(activeFilters.filter(f => f.id !== filterId));
  };

  const getPaymentStatusDot = (status: string) => {
    const colors: Record<string, string> = {
      captured: 'bg-green-500',
      pending: 'bg-yellow-500',
      failed: 'bg-red-500',
      refunded: 'bg-gray-500',
    };
    return colors[status] || 'bg-gray-400';
  };

  const getFulfillmentStatusDot = (status: string) => {
    const colors: Record<string, string> = {
      fulfilled: 'bg-green-500',
      shipped: 'bg-blue-500',
      delivered: 'bg-green-600',
      unfulfilled: 'bg-gray-400',
      partial: 'bg-yellow-500',
    };
    return colors[status] || 'bg-gray-400';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      CAD: 'CA$',
      GBP: '£',
      AUD: 'A$',
    };
    const symbol = symbols[currency] || currency;
    return `${symbol}${amount.toFixed(2)} ${currency}`;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className="px-6 py-4 border-b">
        <h1 className="text-xl font-medium">Orders</h1>
      </header>

      {/* Toolbar */}
      <div className="px-6 py-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2" ref={filterMenuRef}>
            <button 
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center gap-2 px-3 py-2 text-sm border rounded hover:bg-gray-50 transition-colors"
            >
              <Filter size={16} />
              Add filter
            </button>
            
            {/* Filter Dropdown Menu */}
            {showFilterMenu && (
              <div className="absolute mt-2 top-20 left-6 bg-white border rounded shadow-lg z-50 min-w-[200px]">
                {filterOptions.map((option) => (
                  <div key={option.id} className="relative">
                    <button
                      onClick={() => setShowFilterDropdown(showFilterDropdown === option.id ? null : option.id)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
                    >
                      <span>{option.label}</span>
                      <ChevronLeft size={14} className={`transform ${showFilterDropdown === option.id ? '-rotate-90' : ''}`} />
                    </button>
                    
                    {/* Submenu for filter values */}
                    {showFilterDropdown === option.id && option.options && (
                      <div className="absolute left-full top-0 bg-white border rounded shadow-lg min-w-[150px] ml-0.5">
                        {option.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => addFilter(option.id, option.label, opt)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Active Filter Tags */}
            {activeFilters.map((filter) => (
              <div key={filter.id} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm">
                <span className="text-gray-600">{filter.label}:</span>
                <span className="font-medium">{filter.value}</span>
                <button 
                  onClick={() => removeFilter(filter.id)}
                  className="ml-1 hover:bg-gray-200 rounded p-0.5"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-3 py-2 border rounded text-sm focus:outline-none focus:border-gray-400 w-64"
              />
            </div>
            <button className="p-2 border rounded hover:bg-gray-50 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="border-b">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Order</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Customer</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Sales Channel</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Payment</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Fulfillment</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Order Total</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr 
                key={order.id} 
                className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                  localStorage.setItem('current_order', JSON.stringify(order));
                  window.location.href = '/admin/orders/detail/';
                }}
              >
                <td className="py-3 px-4 text-sm text-blue-600 hover:underline">{order.orderNumber}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{formatDate(order.date)}</td>
                <td className="py-3 px-4 text-sm text-gray-900">{order.email}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{order.salesChannel}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getPaymentStatusDot(order.paymentStatus)}`}></span>
                    <span className="text-sm text-gray-700 capitalize">{order.paymentStatus}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getFulfillmentStatusDot(order.fulfillmentStatus)}`}></span>
                    <span className="text-sm text-gray-700 capitalize">{order.fulfillmentStatus}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-right text-gray-900">{formatCurrency(order.amount, order.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {currentOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="px-6 py-3 border-t flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {startIndex + 1} — {endIndex} of {filteredOrders.length} results
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {currentPage} of {totalPages} pages
            </span>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
