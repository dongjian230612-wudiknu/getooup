'use client';

import { useState, useEffect } from 'react';
import { X, Copy, MoreHorizontal, Package, CheckCircle, Clock } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  variant: string;
  description?: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Prescription {
  productName: string;
  rightEye: { sph: string; cyl: string; axis: string };
  leftEye: { sph: string; cyl: string; axis: string };
  pd: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  billingAddressSame: boolean;
}

interface Payment {
  id: string;
  date: string;
  method: string;
  status: 'captured' | 'pending' | 'failed';
  amount: number;
}

interface Fulfillment {
  id: string;
  status: 'awaiting' | 'shipped' | 'delivered';
  items: string[];
  shippingFrom: string;
  provider: string;
  tracking?: string;
}

interface Activity {
  id: string;
  action: string;
  detail?: string;
  time: string;
}

interface OrderData {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: string;
  date: string;
  items: number;
}

// Default data when no order is selected
const defaultOrder = {
  id: '#509',
  date: 'Mar 31, 2026 8:35 AM',
  channel: 'Default Sales Channel',
  status: 'captured' as const,
  fulfillmentStatus: 'fulfilled' as const,
};

const defaultItems: OrderItem[] = [
  { id: '1', name: 'lens', variant: 'TYPE-BLUE Ⓒ', description: 'Blue-light-filtering - -', price: 20.00, quantity: 1 },
  { id: '2', name: 'lens', variant: '1.74 Ⓒ', description: '--1.74', price: 80.00, quantity: 1 },
  { id: '3', name: 'lens', variant: 'TYPE-BLUE Ⓒ', description: 'Blue-light-filtering - -', price: 20.00, quantity: 1 },
  { id: '4', name: 'lens', variant: '1.74 Ⓒ', description: '--1.74', price: 80.00, quantity: 1 },
  { id: '5', name: 'SP985', variant: 'SP985-C12 Ⓒ', description: 'Tea Grey', price: 89.00, quantity: 1, image: '/products/sp985.jpg' },
  { id: '6', name: 'DU502', variant: 'DU502-N1 Ⓒ', description: 'Black', price: 49.00, quantity: 1, image: '/products/du502.jpg' },
];

const defaultPrescriptions: Prescription[] = [
  {
    productName: 'SP985 Tea Grey Glasses',
    rightEye: { sph: '-6.50', cyl: '-0.25', axis: '30' },
    leftEye: { sph: '-6.00', cyl: '-0.75', axis: '170' },
    pd: '73.00 (Shared)',
  },
  {
    productName: 'DU502 Rounded Rectangle Black Glasses',
    rightEye: { sph: '-5.75', cyl: '-0.25', axis: '30' },
    leftEye: { sph: '-5.25', cyl: '-0.25', axis: '170' },
    pd: '73.00 (Shared)',
  },
];

const defaultCustomer: Customer = {
  id: 'T. Tongmei Xu',
  name: 'Tongmei Xu',
  email: 'mayxu2013@gmail.com',
  phone: '14256983727',
  shippingAddress: {
    name: 'Tongmei Xu',
    line1: '23524 NE 22ND ST',
    line2: 'Sammamish Washington',
    city: 'Sammamish',
    state: 'Washington',
    zip: '98074',
    country: 'United States',
  },
  billingAddressSame: true,
};

const defaultPayment: Payment = {
  id: '#TFK8492',
  date: '31 Mar, 2026, 08:35:14',
  method: 'Pp_useepay_ussepay',
  status: 'captured',
  amount: 358.28,
};

const defaultFulfillment: Fulfillment = {
  id: '#1',
  status: 'awaiting',
  items: [
    '1x Blue-light-filtering',
    '1x 1.74',
    '1x Blue-light-filtering',
    '1x 1.74',
    '1x SP985 Tea Grey Glasses',
    '1x DU502 Rounded Rectangle Black Glasses',
  ],
  shippingFrom: 'ShenZhen Location',
  provider: 'Manual',
  tracking: '-',
};

const defaultActivities: Activity[] = [
  { id: '1', action: 'Items fulfilled', detail: '6 items', time: 'about 10 hours ago' },
  { id: '2', action: 'Payment captured', detail: '$ 358.28 USD', time: 'about 10 hours ago' },
  { id: '3', action: 'Order placed', detail: '$ 358.28 USD', time: 'about 18 hours ago' },
];

export default function OrderDetail() {
  const [currentOrder, setCurrentOrder] = useState<OrderData | null>(null);
  
  const [order, setOrder] = useState({
    id: '#509',
    date: 'Mar 31, 2026 8:35 AM',
    channel: 'Default Sales Channel',
    status: 'captured' as 'captured' | 'pending',
    fulfillmentStatus: 'fulfilled' as 'fulfilled' | 'awaiting',
  });
  const [items, setItems] = useState<OrderItem[]>(defaultItems);
  const [prescriptions] = useState<Prescription[]>(defaultPrescriptions);
  const [customer, setCustomer] = useState<Customer>(defaultCustomer);
  const [payment, setPayment] = useState<Payment>(defaultPayment);
  const [fulfillment] = useState<Fulfillment>(defaultFulfillment);
  const [activities] = useState<Activity[]>(defaultActivities);

  useEffect(() => {
    // Load order from localStorage
    const savedOrder = localStorage.getItem('current_order');
    if (savedOrder) {
      try {
        const orderData: OrderData = JSON.parse(savedOrder);
        setCurrentOrder(orderData);
        
        // Update order display with list data
        setOrder({
          id: orderData.id,
          date: orderData.date,
          channel: 'Default Sales Channel',
          status: orderData.status === 'delivered' ? 'captured' : 'pending',
          fulfillmentStatus: orderData.status === 'delivered' ? 'fulfilled' : 'awaiting',
        });
        
        // Update customer
        setCustomer({
          ...defaultCustomer,
          name: orderData.customer,
          email: orderData.email,
          id: orderData.customer,
          shippingAddress: {
            ...defaultCustomer.shippingAddress,
            name: orderData.customer,
          },
        });
        
        // Update payment
        setPayment({
          ...defaultPayment,
          amount: orderData.amount,
          status: orderData.status === 'delivered' ? 'captured' : 'pending',
        });
        
        // Generate simple items based on order
        setItems([
          { id: '1', name: 'Product', variant: orderData.id, price: orderData.amount, quantity: 1 },
        ]);
      } catch (e) {
        console.error('Failed to parse order data', e);
      }
    }
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  const tax = currentOrder ? currentOrder.amount * 0.1 : 20.28;
  const total = currentOrder ? currentOrder.amount : subtotal + shipping + tax;
  const discount = 0;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="h-14 bg-white border-b flex items-center justify-between px-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <a href="/admin/orders/" className="p-1 hover:bg-gray-100 rounded">
            <X size={20} className="text-gray-500" />
          </a>
          <div className="flex items-center gap-2">
            <span className="font-medium">{order.id}</span>
            <button 
              onClick={() => copyToClipboard(order.id)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Copy size={14} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{order.date} from {order.channel}</span>
          <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
            <CheckCircle size={12} />
            {order.status === 'captured' ? 'Captured' : 'Pending'}
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
            <CheckCircle size={12} />
            {order.fulfillmentStatus === 'fulfilled' ? 'Fulfilled' : 'Awaiting'}
          </div>
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreHorizontal size={20} className="text-gray-400" />
          </button>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6">
          {/* Left Column - Order Details */}
          <div className="col-span-2 space-y-6">
            {/* Summary */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium">Summary</h2>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreHorizontal size={16} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                      ) : (
                        <Package size={16} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.variant}</p>
                      {item.description && item.description !== '-' && (
                        <p className="text-xs text-gray-400">{item.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm">${item.price.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{item.quantity}x</p>
                    </div>
                    <p className="text-sm font-medium w-16 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Item Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping Subtotal</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax Total</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-medium pt-2">
                  <span>Order Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Discount Total</span>
                  <span>${discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total After Discount</span>
                  <span>${(total - discount).toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t space-y-1">
                <div className="flex justify-between text-sm font-medium">
                  <span>Paid Total</span>
                  <span>$ {total.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Outstanding amount</span>
                  <span>$ 0.00 USD</span>
                </div>
              </div>
            </div>

            {/* Payments */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium">Payments</h2>
                <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                  <CheckCircle size={12} />
                  {payment.status === 'captured' ? 'Captured' : 'Pending'}
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm font-medium">{payment.id}</p>
                    <p className="text-xs text-gray-500">{payment.date}</p>
                  </div>
                  <span className="text-sm text-gray-600">{payment.method}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs ${payment.status === 'captured' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                    {payment.status === 'captured' ? 'Captured' : 'Pending'}
                  </span>
                  <span className="text-sm font-medium">${payment.amount.toFixed(2)}</span>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-2 flex justify-between text-sm font-medium">
                <span>Total paid by customer</span>
                <span>$ {payment.amount.toFixed(2)} USD</span>
              </div>
            </div>

            {/* Fulfillment */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium">Fulfillment #{fulfillment.id}</h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                    <Clock size={12} />
                    Awaiting shipping
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-2">Items</p>
                  <div className="space-y-1">
                    {fulfillment.items.map((item, idx) => (
                      <p key={idx} className="text-sm">{item}</p>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Shipping from</p>
                    <p className="text-sm text-blue-600">{fulfillment.shippingFrom}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Provider</p>
                    <p className="text-sm">{fulfillment.provider}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500 mb-1">Tracking</p>
                  <p className="text-sm">{fulfillment.tracking}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex justify-end gap-2">
                <button className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">
                  Mark as delivered
                </button>
                <button className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800">
                  Mark as shipped
                </button>
              </div>
            </div>

            {/* Metadata & JSON */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="font-medium text-sm">Metadata</span>
                <span className="text-xs text-gray-500">0 keys</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-medium text-sm">JSON</span>
                <span className="text-xs text-gray-500">44 keys</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Prescription */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="font-medium mb-4">Prescription</h2>
              
              <div className="space-y-4">
                {prescriptions.map((rx, idx) => (
                  <div key={idx} className="text-sm">
                    <p className="font-medium mb-2">{rx.productName}</p>
                    <div className="space-y-1 text-xs text-gray-600">
                      <p>(R): SPH: {rx.rightEye.sph} CYL: {rx.rightEye.cyl} AXIS: {rx.rightEye.axis}</p>
                      <p>(L): SPH: {rx.leftEye.sph} CYL: {rx.leftEye.cyl} AXIS: {rx.leftEye.axis}</p>
                      <p>PD: {rx.pd}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium">Customer</h2>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreHorizontal size={16} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">ID</span>
                  <span>{customer.id}</span>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Contact</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{customer.email}</span>
                    <button 
                      onClick={() => copyToClipboard(customer.email)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Copy size={14} className="text-gray-400" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm">{customer.phone}</span>
                    <button 
                      onClick={() => copyToClipboard(customer.phone)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Copy size={14} className="text-gray-400" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Shipping address</p>
                  <div className="text-sm">
                    <p>{customer.shippingAddress.name}</p>
                    <p>{customer.shippingAddress.line1}</p>
                    {customer.shippingAddress.line2 && <p>{customer.shippingAddress.line2}</p>}
                    <p>{customer.shippingAddress.city}, {customer.shippingAddress.state} {customer.shippingAddress.zip}</p>
                    <p>{customer.shippingAddress.country}</p>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(JSON.stringify(customer.shippingAddress))}
                    className="mt-2 p-1 hover:bg-gray-100 rounded"
                  >
                    <Copy size={14} className="text-gray-400" />
                  </button>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Billing address</span>
                  <span>{customer.billingAddressSame ? 'Same as shipping address' : 'Different'}</span>
                </div>
              </div>
            </div>

            {/* Activity */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="font-medium mb-4">Activity</h2>
              
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="w-2 h-2 mt-1.5 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.action}</p>
                      {activity.detail && (
                        <p className="text-xs text-gray-500">{activity.detail}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-4 text-sm text-blue-600 hover:underline">
                Show 1 more activity
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
