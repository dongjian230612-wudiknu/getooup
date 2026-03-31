'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';

interface OrderInfo {
  orderId: string;
  items: any[];
  shipping: {
    email: string;
    firstName: string;
    lastName: string;
  };
  total: number;
}

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const paymentMethod = searchParams.get('payment') || 'stripe';

  useEffect(() => {
    const pendingOrder = localStorage.getItem('pending_order');
    if (pendingOrder) {
      const orderData = JSON.parse(pendingOrder);
      setOrder(orderData);
      
      // Clear cart after successful order
      localStorage.removeItem('cart');
      
      // Store order in order history
      const orderHistory = JSON.parse(localStorage.getItem('order_history') || '[]');
      orderHistory.push({
        ...orderData,
        date: new Date().toISOString(),
        status: 'confirmed',
        paymentMethod,
      });
      localStorage.setItem('order_history', JSON.stringify(orderHistory));
      localStorage.removeItem('pending_order');
    } else {
      router.push('/');
    }
  }, [router, paymentMethod]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={40} />
          </div>

          <h1 className="text-2xl font-medium mb-2">Thank You for Your Order!</h1>
          <p className="text-gray-500 mb-6">
            Your order has been confirmed and will be shipped soon.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Order Number</span>
              <span className="font-medium">{order.orderId}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium capitalize">{paymentMethod}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Email</span>
              <span className="font-medium">{order.shipping.email}</span>
            </div>
            <div className="flex justify-between pt-4 border-t">
              <span className="font-medium">Total</span>
              <span className="font-medium text-lg">${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Mail size={16} />
              <span>A confirmation email has been sent to {order.shipping.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Package size={16} />
              <span>You'll receive tracking info once your order ships</span>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2"
            >
              Continue Shopping
              <ArrowRight size={18} />
            </button>
            
            <a
              href="mailto:support@getooup.com"
              className="block w-full py-3 text-gray-600 hover:text-black"
            >
              Need help? Contact support@getooup.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-black"></div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
