'use client';

import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  avgOrderValue: number;
  revenueChange: number;
  ordersChange: number;
}

interface RecentOrder {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    avgOrderValue: 0,
    revenueChange: 0,
    ordersChange: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  useEffect(() => {
    // 模拟数据 - 实际应该从 API 获取
    setStats({
      totalRevenue: 12847.50,
      totalOrders: 156,
      totalCustomers: 89,
      avgOrderValue: 82.35,
      revenueChange: 12.5,
      ordersChange: 8.2,
    });

    setRecentOrders([
      { id: 'ORD-001', customer: 'John Smith', email: 'john@example.com', total: 147.00, status: 'delivered', date: '2026-03-31' },
      { id: 'ORD-002', customer: 'Emma Wilson', email: 'emma@example.com', total: 89.00, status: 'processing', date: '2026-03-31' },
      { id: 'ORD-003', customer: 'Michael Brown', email: 'michael@example.com', total: 245.00, status: 'pending', date: '2026-03-30' },
      { id: 'ORD-004', customer: 'Sarah Davis', email: 'sarah@example.com', total: 68.00, status: 'shipped', date: '2026-03-30' },
      { id: 'ORD-005', customer: 'David Lee', email: 'david@example.com', total: 189.00, status: 'delivered', date: '2026-03-29' },
    ]);
  }, []);

  const statCards = [
    { 
      label: 'Total Revenue', 
      value: `$${stats.totalRevenue.toLocaleString()}`, 
      icon: DollarSign,
      change: stats.revenueChange,
      changeLabel: 'vs last month'
    },
    { 
      label: 'Total Orders', 
      value: stats.totalOrders.toString(), 
      icon: ShoppingBag,
      change: stats.ordersChange,
      changeLabel: 'vs last month'
    },
    { 
      label: 'Total Customers', 
      value: stats.totalCustomers.toString(), 
      icon: Users,
      change: 0,
      changeLabel: 'new this month'
    },
    { 
      label: 'Avg Order Value', 
      value: `$${stats.avgOrderValue}`, 
      icon: TrendingUp,
      change: 0,
      changeLabel: 'vs last month'
    },
  ];

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;
          return (
            <div key={idx} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-medium mt-1">{stat.value}</p>
                </div>
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Icon size={20} />
                </div>
              </div>
              {stat.change !== 0 && (
                <div className={`flex items-center gap-1 mt-4 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  <span>{Math.abs(stat.change)}%</span>
                  <span className="text-gray-400">{stat.changeLabel}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Recent Orders</h2>
            <a href="/admin/orders" className="text-sm text-blue-600 hover:underline">View all</a>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Order ID</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Customer</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Total</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{order.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-gray-500">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
