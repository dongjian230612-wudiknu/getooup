'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    storeName: 'GETOOUP',
    storeEmail: 'support@getooup.com',
    currency: 'USD',
    shippingThreshold: 70,
    freeShippingEnabled: true,
    taxRate: 0,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="h-14 border-b flex items-center justify-between px-6">
        <h1 className="text-lg font-medium">Settings</h1>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm"
        >
          <Save size={16} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </header>

      <div className="p-6 max-w-2xl">
        <div className="space-y-6">
          {/* Store Information */}
          <div className="border rounded-lg p-6">
            <h2 className="font-medium mb-4">Store Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Store Name</label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1.5">Store Email</label>
                <input
                  type="email"
                  value={settings.storeEmail}
                  onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black text-sm"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Shipping */}
          <div className="border rounded-lg p-6">
            <h2 className="font-medium mb-4">Pricing & Shipping</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Currency</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black text-sm"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Free Shipping Threshold ($)</label>
                <input
                  type="number"
                  value={settings.shippingThreshold}
                  onChange={(e) => setSettings({ ...settings, shippingThreshold: parseFloat(e.target.value) })}
                  disabled={!settings.freeShippingEnabled}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black text-sm disabled:bg-gray-100"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.freeShippingEnabled}
                    onChange={(e) => setSettings({ ...settings, freeShippingEnabled: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm">Enable Free Shipping</span>
                </label>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="border rounded-lg p-6">
            <h2 className="font-medium mb-4">Payment Methods</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Stripe</p>
                  <p className="text-xs text-gray-500">Accept credit card payments</p>
                </div>
                <button className="text-sm text-blue-600 hover:underline">Configure</button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">PayPal</p>
                  <p className="text-xs text-gray-500">Accept PayPal payments</p>
                </div>
                <button className="text-sm text-blue-600 hover:underline">Configure</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
