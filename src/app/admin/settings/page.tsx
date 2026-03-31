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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium">Settings</h1>
        <p className="text-gray-500">Manage your store settings</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* Store Information */}
        <div>
          <h2 className="text-lg font-medium mb-4">Store Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Store Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Store Email</label>
              <input
                type="email"
                value={settings.storeEmail}
                onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Pricing & Shipping */}
        <div>
          <h2 className="text-lg font-medium mb-4">Pricing & Shipping</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CNY">CNY (¥)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tax Rate (%)</label>
              <input
                type="number"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Free Shipping Threshold ($)</label>
              <input
                type="number"
                value={settings.shippingThreshold}
                onChange={(e) => setSettings({ ...settings, shippingThreshold: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                disabled={!settings.freeShippingEnabled}
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.freeShippingEnabled}
                  onChange={(e) => setSettings({ ...settings, freeShippingEnabled: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <span className="font-medium">Enable Free Shipping</span>
              </label>
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Payment Settings */}
        <div>
          <h2 className="text-lg font-medium mb-4">Payment Settings</h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Stripe</p>
                  <p className="text-sm text-gray-500">Accept credit card payments</p>
                </div>
                <button className="text-blue-600 hover:underline">Configure</button>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">PayPal</p>
                  <p className="text-sm text-gray-500">Accept PayPal payments</p>
                </div>
                <button className="text-blue-600 hover:underline">Configure</button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
          >
            <Save size={18} />
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
