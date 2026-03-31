'use client';

import { useState } from 'react';
import { Search, Filter, MoreHorizontal } from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  items: number;
}

export default function Orders() {
  const [orders] = useState<Order[]>([
    { id: 'ORD-001', customer: 'John Smith', email: 'john@example.com', amount: 156.00, status: 'delivered', date: '2026-03-31', items: 2 },
    { id: 'ORD-002', customer: 'Emma Wilson', email: 'emma@example.com', amount: 89.00, status: 'processing', date: '2026-03-31', items: 1 },
    { id: 'ORD-003', customer: 'Michael Brown', email: 'michael@example.com', amount: 245.00, status: 'shipped', date: '2026-03-30', items: 3 },
    { id: 'ORD-004', customer: 'Sarah Davis', email: 'sarah@example.com', amount: 67.00, status: 'pending', date: '2026-03-30', items: 1 },
    { id: 'ORD-005', customer: 'David Lee', email: 'david@example.com', amount: 178.00, status: 'delivered', date: '2026-03-29', items: 2 },
  ]);
  const [search, setSearch] = useState('');

  const filteredOrders = orders.filter(order =>
    order.customer.toLowerCase().includes(search.toLowerCase()) ||
    order.id.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="h-14 border-b flex items-center justify-between px-6">
        <h1 className="text-lg font-medium">Orders</h1>
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
              <th className="text-left py-3 px-6 text-xs font-medium text-gray-500">Order</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Customer</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Items</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Date</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Status</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">Total</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr 
                key={order.id} 
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  localStorage.setItem('current_order', JSON.stringify(order));
                  window.location.href = '/admin/orders/detail/';
                }}
              >
                <td className="py-3 px-6 text-sm font-medium text-blue-600">{order.id}</td>
                <td className="py-3 px-4">
                  <div>
                    <p className="text-sm">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.email}</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{order.items}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{order.date}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-right font-medium">${order.amount.toFixed(2)}</td>
                <td className="py-3 px-4">
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <MoreHorizontal size={16} className="text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
