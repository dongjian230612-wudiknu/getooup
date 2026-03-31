'use client';

import { useState } from 'react';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const [stats] = useState({
    revenue: 12847.50,
    orders: 156,
    customers: 89,
    avgOrder: 82.36,
  });

  const [recentOrders] = useState([
    { id: 'ORD-001', customer: 'John Smith', amount: 156.00, status: 'completed', date: '2026-03-31' },
    { id: 'ORD-002', customer: 'Emma Wilson', amount: 89.00, status: 'processing', date: '2026-03-31' },
    { id: 'ORD-003', customer: 'Michael Brown', amount: 245.00, status: 'completed', date: '2026-03-30' },
    { id: 'ORD-004', customer: 'Sarah Davis', amount: 67.00, status: 'pending', date: '2026-03-30' },
    { id: 'ORD-005', customer: 'David Lee', amount: 178.00, status: 'completed', date: '2026-03-29' },
  ]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: 'bg-green-100 text-green-700',
      processing: 'bg-blue-100 text-blue-700',
      pending: 'bg-yellow-100 text-yellow-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="h-14 border-b flex items-center px-6">
        <h1 className="text-lg font-medium">Dashboard</h1>
      </header>

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-100 rounded-lg">
                <DollarSign size={18} />
              </div>
              <span className="text-sm text-gray-500">Total Revenue</span>
            </div>
            <p className="text-2xl font-medium">${stats.revenue.toLocaleString()}</p>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-100 rounded-lg">
                <ShoppingBag size={18} />
              </div>
              <span className="text-sm text-gray-500">Total Orders</span>
            </div>
            <p className="text-2xl font-medium">{stats.orders}</p>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Users size={18} />
              </div>
              <span className="text-sm text-gray-500">Customers</span>
            </div>
            <p className="text-2xl font-medium">{stats.customers}</p>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-100 rounded-lg">
                <TrendingUp size={18} />
              </div>
              <span className="text-sm text-gray-500">Avg Order</span>
            </div>
            <p className="text-2xl font-medium">${stats.avgOrder}</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="border rounded-lg">
          <div className="px-4 py-3 border-b">
            <h2 className="font-medium">Recent Orders</h2>
          </div>
          
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">Order</th>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">Customer</th>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">Date</th>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">Status</th>
                <th className="text-right py-2 px-4 text-xs font-medium text-gray-500">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="py-3 px-4 text-sm">{order.id}</td>
                  <td className="py-3 px-4 text-sm">{order.customer}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{order.date}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-right">${order.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
