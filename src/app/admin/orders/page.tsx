'use client';

import { useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  items: number;
}

const mockOrders: Order[] = [
  { id: 'ORD-001', customer: 'John Smith', email: 'john@example.com', total: 147.00, status: 'delivered', date: '2026-03-31', items: 2 },
  { id: 'ORD-002', customer: 'Emma Wilson', email: 'emma@example.com', total: 89.00, status: 'processing', date: '2026-03-31', items: 1 },
  { id: 'ORD-003', customer: 'Michael Brown', email: 'michael@example.com', total: 245.00, status: 'pending', date: '2026-03-30', items: 3 },
  { id: 'ORD-004', customer: 'Sarah Davis', email: 'sarah@example.com', total: 68.00, status: 'shipped', date: '2026-03-30', items: 1 },
  { id: 'ORD-005', customer: 'David Lee', email: 'david@example.com', total: 189.00, status: 'delivered', date: '2026-03-29', items: 2 },
  { id: 'ORD-006', customer: 'Lisa Chen', email: 'lisa@example.com', total: 312.00, status: 'processing', date: '2026-03-29', items: 4 },
  { id: 'ORD-007', customer: 'James Wilson', email: 'james@example.com', total: 56.00, status: 'cancelled', date: '2026-03-28', items: 1 },
  { id: 'ORD-008', customer: 'Anna Zhang', email: 'anna@example.com', total: 178.00, status: 'delivered', date: '2026-03-28', items: 2 },
];

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.email.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const updateStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium">Orders</h1>
        <p className="text-gray-500">Manage and track all your orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Order ID</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Customer</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Items</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Total</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{order.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-gray-500">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{order.items} items</td>
                  <td className="px-6 py-4 font-medium">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{order.date}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value as Order['status'])}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-black"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
