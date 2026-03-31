'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Truck, Package } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  color: string;
  lens: {
    name: string;
    price: number;
  };
  prescription: {
    rightSphere: string;
    rightCylinder: string;
    rightAxis: string;
    leftSphere: string;
    leftCylinder: string;
    leftAxis: string;
    pd: string;
  };
  quantity: number;
}

interface ShippingInfo {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export default function Checkout() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: '',
  });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      router.push('/');
    }
  }, [router]);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price + item.lens.price, 0);
  const shipping = subtotal >= 70 ? 0 : 10;
  const total = subtotal + shipping;

  const handleStripeCheckout = async () => {
    setLoading(true);
    
    // Store order info for confirmation page
    const orderInfo = {
      items: cart,
      shipping: shippingInfo,
      subtotal,
      shippingCost: shipping,
      total,
      orderId: 'ORD-' + Date.now(),
    };
    localStorage.setItem('pending_order', JSON.stringify(orderInfo));
    
    // Redirect to Stripe Checkout
    // Note: In production, you'd create a checkout session on your backend
    // For demo, we'll simulate a successful payment
    setTimeout(() => {
      router.push('/checkout/success?payment=stripe');
    }, 1500);
  };

  const handlePayPalCheckout = async () => {
    setLoading(true);
    
    const orderInfo = {
      items: cart,
      shipping: shippingInfo,
      subtotal,
      shippingCost: shipping,
      total,
      orderId: 'ORD-' + Date.now(),
    };
    localStorage.setItem('pending_order', JSON.stringify(orderInfo));
    
    // Simulate PayPal redirect
    setTimeout(() => {
      router.push('/checkout/success?payment=paypal');
    }, 1500);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
          <button
            onClick={() => router.push('/')}
            className="mt-4 text-blue-600 hover:underline"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => step > 1 ? setStep(step - 1) : router.push('/')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft size={20} />
            </button>
            <span className="text-xl font-light tracking-widest">GETOOUP</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-center mb-8">
            {['Shipping', 'Payment', 'Confirmation'].map((label, idx) => (
              <div key={label} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${step > idx + 1 ? 'bg-black text-white' : step === idx + 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}
                `}>
                  {step > idx + 1 ? '✓' : idx + 1}
                </div>
                <span className={`ml-2 text-sm ${step >= idx + 1 ? 'text-black' : 'text-gray-400'}`}>
                  {label}
                </span>
                {idx < 2 && <div className="w-12 h-px bg-gray-300 mx-4" />}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-medium mb-6">Shipping Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">First Name</label>
                        <input
                          type="text"
                          value={shippingInfo.firstName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Last Name</label>
                        <input
                          type="text"
                          value={shippingInfo.lastName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Address</label>
                      <input
                        type="text"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        placeholder="Street address"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">City</label>
                        <input
                          type="text"
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">State</label>
                        <input
                          type="text"
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">ZIP Code</label>
                        <input
                          type="text"
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Phone</label>
                      <input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!shippingInfo.email || !shippingInfo.firstName || !shippingInfo.address}
                    className="w-full mt-6 bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-medium mb-6">Payment Method</h2>
                  
                  <div className="space-y-4">
                    {/* Stripe */}
                    <button
                      onClick={handleStripeCheckout}
                      disabled={loading}
                      className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-black transition-colors"
                    >
                      <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                        <CreditCard size={24} />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium">Credit Card (Stripe)</p>
                        <p className="text-sm text-gray-500">Pay with Visa, Mastercard, Amex</p>
                      </div>
                      {loading && <div className="animate-spin h-5 w-5 border-b-2 border-black"></div>}
                    </button>

                    {/* PayPal */}
                    <button
                      onClick={handlePayPalCheckout}
                      disabled={loading}
                      className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-black transition-colors"
                    >
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        P
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium">PayPal</p>
                        <p className="text-sm text-gray-500">Pay with your PayPal account</p>
                      </div>
                      {loading && <div className="animate-spin h-5 w-5 border-b-2 border-black"></div>}
                    </button>
                  </div>

                  <button
                    onClick={() => setStep(1)}
                    className="w-full mt-4 py-3 text-gray-600 hover:text-black"
                  >
                    ← Back to Shipping
                  </button>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h3 className="font-medium mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-4">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {item.product.image ? (
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">👓</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-xs text-gray-500">{item.color} / {item.lens.name}</p>
                        <p className="text-sm font-medium">${(item.product.price + item.lens.price).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <hr className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                {shipping === 0 && (
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                    <Truck size={14} />
                    Free shipping applied!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
