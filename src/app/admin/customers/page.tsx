'use client';

import { useState } from 'react';
import { Search, Mail, ShoppingBag } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  joined: string;
  lastOrder: string;
}

const mockCustomers: Customer[] = [
  { id: 'CUST-001', name: 'John Smith', email: 'john@example.com', orders: 5, totalSpent: 523.00, joined: '2025-12-15', lastOrder: '2026-03-31' },
  { id: 'CUST-002', name: 'Emma Wilson', email: 'emma@example.com', orders: 3, totalSpent: 267.00, joined: '2026-01-20', lastOrder: '2026-03-31' },
  { id: 'CUST-003', name: 'Michael Brown', email: 'michael@example.com', orders: 8, totalSpent: 892.00, joined: '2025-11-08', lastOrder: '2026-03-30' },
  { id: 'CUST-004', name: 'Sarah Davis', email: 'sarah@example.com', orders: 2, totalSpent: 136.00, joined: '2026-02-14', lastOrder: '2026-03-30' },
  { id: 'CUST-005', name: 'David Lee', email: 'david@example.com', orders: 4, totalSpent: 445.00, joined: '2025-12-22', lastOrder: '2026-03-29' },
];

export default function Customers() {
  const [customers] = useState<Customer[]>(mockCustomers);
  const [search, setSearch] = useState('');

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(search.toLowerCase()) ||
    customer.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium">Customers</h1>
        <p className="text-gray-500">View and manage your customers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p className="text-gray-500 text-sm">Total Customers</p>
          <p className="text-3xl font-medium mt-1">{customers.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p className="text-gray-500 text-sm">New This Month</p>
          <p className="text-3xl font-medium mt-1">12</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p className="text-gray-500 text-sm">Avg. Order Value</p>
          <p className="text-3xl font-medium mt-1">$105.00</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Customer</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Orders</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Total Spent</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Joined</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Last Order</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-medium">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1">
                      <ShoppingBag size={14} />
                      {customer.orders}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">${customer.totalSpent.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-500">{customer.joined}</td>
                  <td className="px-6 py-4 text-gray-500">{customer.lastOrder}</td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Mail size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
