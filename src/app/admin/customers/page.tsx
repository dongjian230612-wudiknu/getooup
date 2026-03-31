'use client';

import { useState } from 'react';
import { Search, Filter, MoreHorizontal, Mail } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  joined: string;
  lastOrder: string;
}

export default function Customers() {
  const [customers] = useState<Customer[]>([
    { id: 'CUST-001', name: 'John Smith', email: 'john@example.com', orders: 5, totalSpent: 523.00, joined: '2025-12-15', lastOrder: '2026-03-31' },
    { id: 'CUST-002', name: 'Emma Wilson', email: 'emma@example.com', orders: 3, totalSpent: 267.00, joined: '2026-01-20', lastOrder: '2026-03-31' },
    { id: 'CUST-003', name: 'Michael Brown', email: 'michael@example.com', orders: 8, totalSpent: 892.00, joined: '2025-11-08', lastOrder: '2026-03-30' },
    { id: 'CUST-004', name: 'Sarah Davis', email: 'sarah@example.com', orders: 2, totalSpent: 136.00, joined: '2026-02-14', lastOrder: '2026-03-30' },
    { id: 'CUST-005', name: 'David Lee', email: 'david@example.com', orders: 4, totalSpent: 445.00, joined: '2025-12-22', lastOrder: '2026-03-29' },
  ]);
  const [search, setSearch] = useState('');

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(search.toLowerCase()) ||
    customer.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="h-14 border-b flex items-center justify-between px-6">
        <h1 className="text-lg font-medium">Customers</h1>
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
              <th className="text-left py-3 px-6 text-xs font-medium text-gray-500">Customer</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Orders</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Total Spent</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Joined</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Last Order</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{customer.name}</p>
                      <p className="text-xs text-gray-500">{customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm">{customer.orders}</td>
                <td className="py-3 px-4 text-sm font-medium">${customer.totalSpent.toFixed(2)}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{customer.joined}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{customer.lastOrder}</td>
                <td className="py-3 px-4">
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <MoreHorizontal size={16} className="text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No customers found</p>
          </div>
        )}
      </div>
    </div>
  );
}
