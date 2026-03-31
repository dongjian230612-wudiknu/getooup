'use client';

import { useState } from 'react';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { products, lensOptions } from '@/lib/data';
import { Product, CartItem, Prescription, LensOption } from '@/types';
import { formatPrice, validatePrescription } from '@/lib/utils';

// 辅助函数：获取颜色对应的十六进制值
function getColorHex(color: string): string {
  const colorMap: Record<string, string> = {
    'Black': '#000000',
    'Tortoise': '#8B4513',
    'Bean Red': '#A0522D',
    'Purple': '#9370DB',
    'Tea Grey': '#9CA3AF',
    'Light Brown': '#D2B48C',
    'Grey': '#808080',
    'Brown': '#8B4513',
    'Gold': '#FFD700',
    'Silver': '#C0C0C0',
    'Clear': 'rgba(200,200,200,0.3)',
    'Clear Tea': '#D2B48C',
    'Clear Grey': 'rgba(128,128,128,0.3)',
    'Gunmetal': '#2C3539',
    'Pink': '#FFC0CB',
    'Black White': '#333333',
    'Dark Blue': '#000080',
  };
  return colorMap[color] || '#cccccc';
}

// 生成 Sphere 选项: -18.00 到 +10.00，步进 0.25，0.00 排在最前
function generateSphereOptions(): string[] {
  const options: string[] = ['0.00'];
  // 负数部分从 -0.25 到 -18.00
  for (let v = -0.25; v >= -18.0; v -= 0.25) {
    options.push(v.toFixed(2));
  }
  // 正数部分从 +0.25 到 +10.00
  for (let v = 0.25; v <= 10.0; v += 0.25) {
    options.push(`+${v.toFixed(2)}`);
  }
  return options;
}

// 生成 Cylinder 选项: -6.00 到 0.00，步进 0.25，0.00 排在最前
function generateCylinderOptions(): string[] {
  const options: string[] = ['0.00'];
  for (let v = -0.25; v >= -6.0; v -= 0.25) {
    options.push(v.toFixed(2));
  }
  return options;
}

// 生成 Axis 选项: 0 到 180
function generateAxisOptions(): string[] {
  const options: string[] = [];
  for (let v = 0; v <= 180; v++) {
    options.push(v.toString());
  }
  return options;
}

// 生成 PD 选项: 48 到 80
function generatePDOptions(): string[] {
  const options: string[] = [];
  for (let v = 48; v <= 80; v++) {
    options.push(v.toString());
  }
  return options;
}

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedLens, setSelectedLens] = useState<LensOption | null>(null);
  const [step, setStep] = useState(1);
  const [prescription, setPrescription] = useState<Prescription>({
    rightSphere: '', rightCylinder: '', rightAxis: '',
    leftSphere: '', leftCylinder: '', leftAxis: '',
    pd: '', add: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  const addToCart = () => {
    if (!selectedProduct || !selectedLens) return;
    const validation = validatePrescription(prescription);
    if (!validation.valid) { setErrors(validation.errors); return; }
    const newItem: CartItem = {
      product: selectedProduct,
      color: selectedColor || selectedProduct.colors[0],
      lens: selectedLens,
      prescription,
      quantity: 1,
    };
    setCart([...cart, newItem]);
    setShowModal(false);
    setSelectedProduct(null);
    setStep(1);
    setErrors([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price + item.lens.price, 0);

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedColor(product.colors[0]);
    setStep(1);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner */}
      <div className="bg-black text-white text-center py-2 text-xs tracking-wide">
        Free Shipping on Orders Over $70
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="text-2xl font-light tracking-widest">GETOOUP</a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#standard" className="text-sm hover:opacity-70 transition-opacity">Standard</a>
              <a href="#asiafit" className="text-sm hover:opacity-70 transition-opacity">AsiaFit</a>
              <a href="#sunglasses" className="text-sm hover:opacity-70 transition-opacity">Sunglasses</a>
              <a href="#lenses" className="text-sm hover:opacity-70 transition-opacity">Lenses</a>
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <button className="hover:opacity-70"><Search size={20} /></button>
              <button className="hover:opacity-70"><User size={20} /></button>
              <button className="hover:opacity-70 relative" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart size={20} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-black text-xs w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>
                )}
              </button>
              <button className="md:hidden hover:opacity-70" onClick={() => setIsMenuOpen(true)}><Menu size={20} /></button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="p-4 flex justify-between items-center border-b">
            <span className="text-xl font-light tracking-widest">GETOOUP</span>
            <button onClick={() => setIsMenuOpen(false)}><X size={24} /></button>
          </div>
          <nav className="p-6 space-y-6 text-lg">
            <a href="#standard" onClick={() => setIsMenuOpen(false)} className="block">Standard</a>
            <a href="#asiafit" onClick={() => setIsMenuOpen(false)} className="block">AsiaFit</a>
            <a href="#sunglasses" onClick={() => setIsMenuOpen(false)} className="block">Sunglasses</a>
            <a href="#lenses" onClick={() => setIsMenuOpen(false)} className="block">Lenses</a>
          </nav>
        </div>
      )}

      {/* Hero */}
      <section className="relative h-[70vh] overflow-hidden" style={{ background: 'linear-gradient(135deg, #87CEEB 0%, #B0E0E6 50%, #E0F6FF 100%)' }}>
        <div className="container mx-auto h-full flex items-center">
          {/* 左侧文字 */}
          <div className="relative z-10 w-full md:w-1/2 px-4 md:px-12">
            <div className="text-black">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-2">Better Lenses</h1>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6">Better Price</h1>
              <p className="text-lg text-gray-700 mb-8">Welcome to try it on</p>
              <a href="#standard" className="inline-block bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors">
                View More
              </a>
            </div>
          </div>
          
          {/* 右侧图片 - 占满右半边 */}
          <div className="hidden md:block absolute right-0 top-0 h-full w-1/2">
            <img 
              src="/images/hero-model.png" 
              alt="Hero" 
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
        
        {/* 移动端背景图 */}
        <div className="md:hidden absolute inset-0">
          <img 
            src="/images/hero-model.png" 
            alt="Hero" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(135, 206, 235, 0.8), rgba(224, 246, 255, 0.9))' }} />
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl mb-3">💰</div>
              <p className="font-medium">Better Price</p>
              <p className="text-sm text-gray-500">Total Value $49</p>
            </div>
            <div>
              <div className="text-4xl mb-3">🔍</div>
              <p className="font-medium">Lens</p>
              <p className="text-sm text-gray-500">China Factory</p>
            </div>
            <div>
              <div className="text-4xl mb-3">🚚</div>
              <p className="font-medium">Deliver Goods</p>
              <p className="text-sm text-gray-500">Door-To-Door</p>
            </div>
            <div>
              <div className="text-4xl mb-3">↩️</div>
              <p className="font-medium">30-Day</p>
              <p className="text-sm text-gray-500">Exchange & Return</p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section id="standard" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light mb-4">Browse best selling styles</h2>
            <p className="text-gray-500">Statistics for the last month</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 8).map((product) => (
              <div key={product.id} className="group cursor-pointer" onClick={() => openProduct(product)}>
                {/* 产品图片区域 */}
                <div className="relative aspect-square bg-white rounded-lg overflow-hidden mb-3">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">👓</div>
                  )}
                  
                  {/* Best Seller 标签 - 左上 */}
                  {product.bestSeller && (
                    <div className="absolute top-3 left-3 bg-black text-white px-3 py-1 text-xs rounded">
                      Best Seller
                    </div>
                  )}
                  
                  {/* AR Try-On 按钮 - 底部中央 */}
                  <button className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 border border-gray-200 px-4 py-1.5 rounded-full text-xs flex items-center gap-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>📷</span> AR Try-On
                  </button>
                </div>
                
                {/* 产品信息 */}
                <div className="px-1">
                  <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                  <p className="font-medium mb-2">${product.price}</p>
                  
                  {/* 颜色选择器 - 小方块 */}
                  <div className="flex gap-1.5">
                    {product.colors.slice(0, 4).map((color, idx) => (
                      <div 
                        key={idx} 
                        className="w-5 h-5 rounded-sm border border-gray-300 overflow-hidden" 
                        title={color}
                      >
                        <div className="w-full h-full" style={{ backgroundColor: getColorHex(color) }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="#all" className="inline-block border border-black px-8 py-3 rounded-full hover:bg-black hover:text-white transition-colors">
              View More
            </a>
          </div>
        </div>
      </section>

      {/* Real People Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light mb-4">Real People, Real Style</h2>
            <p className="text-gray-500">Real wearers, captured in everyday moments</p>
          </div>
          
          {/* 模特图片网格 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 1, name: "Sarah", style: "DU301 Classic", image: "/images/model-1.png" },
              { id: 2, name: "Michael", style: "DU302 Modern", image: "/images/model-2.jpg" },
              { id: 3, name: "Emma", style: "8096 Rectangle", image: "/images/model-3.jpg" },
              { id: 4, name: "David", style: "8095 Round", image: "" },
              { id: 5, name: "Lisa", style: "8097 Cat Eye", image: "" },
              { id: 6, name: "James", style: "OG203 Titanium", image: "" },
              { id: 7, name: "Anna", style: "DU303 Elegant", image: "" },
              { id: 8, name: "Chris", style: "8098 Oval", image: "" },
            ].map((person) => (
              <div key={person.id} className="group relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                {person.image ? (
                  <img 
                    src={person.image} 
                    alt={`${person.name} wearing ${person.style}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <span className="text-4xl mb-2">👤</span>
                    <span className="text-xs text-gray-400">Model Photo</span>
                  </div>
                )}
                
                {/* 悬停显示信息 */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                  <p className="font-medium">{person.name}</p>
                  <p className="text-sm text-gray-300">{person.style}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* 社交媒体标签 */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">Share your style with #GetooupStyle</p>
          </div>
        </div>
      </section>

      {/* Journal Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light mb-4">Style & Vision</h2>
            <p className="text-gray-500">Discover eyewear trends, styling tips, and vision care insights</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: "Prices That Surprise. Quality That Stuns.", desc: "We believe that great eyewear doesn't need a luxury price tag." },
              { title: "Measure Your Pupillary Distance (PD) at Home", desc: "Step by step how to measure your PD at home with just a mirror." },
              { title: "The Journey to Perfect Eyewear: 1.5 Years", desc: "After 18 months of design and testing, we're proud to share our product." },
              { title: "Designed for Lasting Comfort and Style", desc: "Every frame is built with attention to detail, ensuring durability." },
            ].map((article, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="font-medium mb-2">{article.title}</h3>
                <p className="text-gray-500 text-sm">{article.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">Get the inside scoop on new frames, events, and more</p>
          <div className="flex max-w-md mx-auto gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 border border-gray-300 px-4 py-2 rounded-full focus:outline-none focus:border-black"
            />
            <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors">
              Submit
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-medium mb-4">Follow Us</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="#" className="block hover:text-white">TikTok</a>
                <a href="#" className="block hover:text-white">YouTube</a>
                <a href="#" className="block hover:text-white">Instagram</a>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-4">PRODUCTS</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="#" className="block hover:text-white">Standard</a>
                <a href="#" className="block hover:text-white">AsiaFit</a>
                <a href="#" className="block hover:text-white">Sunglasses</a>
                <a href="#" className="block hover:text-white">Journal</a>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-4">GETOOUP</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="#" className="block hover:text-white">Home</a>
                <a href="#" className="block hover:text-white">About</a>
                <a href="#" className="block hover:text-white">Contact</a>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-4">POLICIES</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="#" className="block hover:text-white">Shipping Policy</a>
                <a href="#" className="block hover:text-white">Return & Refund</a>
                <a href="#" className="block hover:text-white">Privacy Policy</a>
                <a href="#" className="block hover:text-white">Terms & Conditions</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            ©2026 Getooup. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Product Modal */}
      {showModal && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedLens={selectedLens}
          setSelectedLens={setSelectedLens}
          prescription={prescription}
          setPrescription={setPrescription}
          step={step}
          setStep={setStep}
          errors={errors}
          onClose={() => setShowModal(false)}
          onAddToCart={addToCart}
        />
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <CartSidebar cart={cart} onClose={() => setIsCartOpen(false)} total={cartTotal} />
      )}
    </div>
  );
}

// Product Modal Component
// Product Modal Component - Multioo Style
function ProductModal({ product, selectedColor, setSelectedColor, selectedLens, setSelectedLens, prescription, setPrescription, step, setStep, errors, onClose, onAddToCart }: any) {
  const [selectedHighIndex, setSelectedHighIndex] = useState('1.60');
  const [isProgressive, setIsProgressive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showLensOptions, setShowLensOptions] = useState(false);
  const [hasPrescription, setHasPrescription] = useState<boolean | null>(null);

  const total = product.price + (selectedLens?.price || 0) + (selectedHighIndex === '1.67' ? 40 : selectedHighIndex === '1.74' ? 80 : 0) + (isProgressive ? 80 : 0);
  
  const productImages = product.images || [product.image];

  const handleFrameOnly = () => {
    setSelectedLens(lensOptions[0]);
    setStep(3);
  };

  const handleSelectLenses = () => {
    setShowLensOptions(true);
  };

  const handlePrescriptionChoice = (hasRx: boolean) => {
    setHasPrescription(hasRx);
    if (hasRx) {
      // 有处方，设置默认值为 0.00
      setPrescription({
        rightSphere: '0.00', rightCylinder: '0.00', rightAxis: '',
        leftSphere: '0.00', leftCylinder: '0.00', leftAxis: '',
        pd: '', add: ''
      });
    } else {
      // 无处方，清空
      setPrescription({
        rightSphere: '', rightCylinder: '', rightAxis: '',
        leftSphere: '', leftCylinder: '', leftAxis: '',
        pd: '', add: ''
      });
    }
  };

  const handleAddToCartWithoutRx = () => {
    onAddToCart();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-auto">
        <div className="p-4 flex justify-between items-center border-b">
          <div className="text-sm text-gray-500">
            Home / {product.category === 'asiafit' ? 'AsiaFit' : 'Standard'} / {product.id.toUpperCase()}
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
        </div>
        
        <div className="md:flex">
          {/* 左侧产品图片 */}
          <div className="md:w-3/5 bg-white p-6">
            <div className="flex gap-4">
              <div className="w-20 flex flex-col gap-2">
                {productImages.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 border-2 rounded overflow-hidden ${selectedImage === idx ? 'border-blue-500' : 'border-gray-200'}`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              
              <div className="flex-1 relative">
                <div className="aspect-square flex items-center justify-center bg-gray-50 rounded-lg">
                  <img src={productImages[selectedImage]} alt={product.name} className="max-w-full max-h-full object-contain" />
                </div>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  <button className="bg-white border border-gray-300 px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-sm">
                    <span>👓</span> AR Try-On
                  </button>
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-sm">
                    <span>✨</span> AI Try-On
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">{product.description}</p>
            </div>
          </div>
          
          {/* 右侧产品信息 */}
          <div className="md:w-2/5 p-6 border-l">
            {step === 1 && !showLensOptions && (
              <div>
                <h2 className="text-2xl font-medium mb-1">{product.name}</h2>
                <p className="text-gray-600 mb-4">Select your options</p>
                
                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <div>Material: {product.material || 'Acetate'}</div>
                  <div>Weight: {product.weight || '20g'}</div>
                </div>
                
                <hr className="my-6" />
                
                <div className="mb-6">
                  <p className="text-sm font-medium mb-3">Color</p>
                  <div className="flex gap-2 mb-3">
                    {product.colors.map((color: string, idx: number) => (
                      <button
                        key={color}
                        onClick={() => {
                          setSelectedColor(color);
                          setSelectedImage(idx % productImages.length);
                        }}
                        className={`w-10 h-10 rounded border-2 overflow-hidden ${selectedColor === color ? 'border-black' : 'border-gray-200'}`}
                        title={color}
                      >
                        <div className="w-full h-full" style={{ backgroundColor: getColorHex(color) }} />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{selectedColor || 'Select a color'}</p>
                </div>
                
                <div className="space-y-3">
                  <button onClick={handleFrameOnly} className="w-full border-2 border-gray-300 py-3 rounded font-medium hover:border-black transition-colors">
                    Frame Only
                  </button>
                  <button onClick={handleSelectLenses} className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-800 transition-colors">
                    Select Lenses
                  </button>
                </div>
              </div>
            )}

            {showLensOptions && step !== 3 && (
              <div>
                <button onClick={() => setShowLensOptions(false)} className="text-sm text-gray-500 mb-4">← Back to Frame</button>
                <h3 className="font-medium mb-4">Choose Your Lenses</h3>
                
                <div className="space-y-3 mb-6">
                  {lensOptions.map((lens: LensOption) => (
                    <div key={lens.id} onClick={() => setSelectedLens(lens)} className={`p-4 border-2 rounded-lg cursor-pointer ${selectedLens?.id === lens.id ? 'border-black' : 'border-gray-200'}`}>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{lens.name}</span>
                        <span className="text-gray-600">{lens.price === 0 ? 'Free' : `+$${lens.price}`}</span>
                      </div>
                      <p className="text-xs text-gray-500">{lens.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <p className="font-medium mb-3">Lens Material</p>
                  <div className="space-y-2">
                    {['1.60', '1.67', '1.74'].map((idx) => (
                      <label key={idx} className="flex items-center gap-3 p-3 border rounded cursor-pointer">
                        <input type="radio" name="index" checked={selectedHighIndex === idx} onChange={() => setSelectedHighIndex(idx)} />
                        <span className="text-sm">{idx === '1.60' ? '1.60 Mid-Index' : idx === '1.67' ? '1.67 High-Index (+$40)' : '1.74 Ultra High-Index (+$80)'}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-3 p-3 border rounded cursor-pointer mb-6">
                  <input type="checkbox" checked={isProgressive} onChange={(e) => setIsProgressive(e.target.checked)} />
                  <span className="text-sm">Progressive Lenses (+$80)</span>
                </label>

                <div className="flex gap-3">
                  <button onClick={() => setShowLensOptions(false)} className="flex-1 border-2 border-gray-300 py-3 rounded">Back</button>
                  <button onClick={() => setStep(3)} disabled={!selectedLens} className="flex-1 bg-black text-white py-3 rounded disabled:bg-gray-300">Continue</button>
                </div>
              </div>
            )}

            {step === 3 && hasPrescription === null && (
              <div>
                <button onClick={() => setStep(1)} className="text-sm text-gray-500 mb-4">← Back</button>
                <h3 className="font-medium mb-6">Do you have a prescription?</h3>
                
                <div className="space-y-3 mb-6">
                  <button onClick={() => handlePrescriptionChoice(true)} className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-black text-left">
                    <div className="font-medium mb-1">I have a prescription</div>
                    <div className="text-sm text-gray-500">Enter your prescription details</div>
                  </button>
                  
                  <button onClick={() => handlePrescriptionChoice(false)} className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-black text-left">
                    <div className="font-medium mb-1">I don&apos;t have a prescription</div>
                    <div className="text-sm text-gray-500">Order now and provide prescription later</div>
                  </button>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Total</span>
                    <span className="text-2xl font-medium">${total}</span>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && hasPrescription === true && (
              <div>
                <button onClick={() => setHasPrescription(null)} className="text-sm text-gray-500 mb-4">← Back</button>
                <h3 className="font-medium mb-4">Enter Your Prescription</h3>
                
                {errors.length > 0 && (
                  <div className="bg-red-50 p-4 rounded mb-4 text-red-600 text-sm">
                    {errors.map((err: string, i: number) => <p key={i}>{err}</p>)}
                  </div>
                )}

                {/* 表头 */}
                <div className="grid grid-cols-4 gap-2 mb-2 text-sm font-medium text-gray-600">
                  <div></div>
                  <div>SPH</div>
                  <div>CYL</div>
                  <div>AXIS</div>
                </div>

                {/* 右眼 */}
                <div className="grid grid-cols-4 gap-2 mb-2 items-center">
                  <div className="text-sm text-gray-500">Right Eye (OD)</div>
                  <select 
                    className="border p-2 rounded text-sm w-full"
                    value={prescription.rightSphere}
                    onChange={(e) => setPrescription({...prescription, rightSphere: e.target.value})}
                  >
                    <option value="">Select</option>
                    {generateSphereOptions().map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                  <select 
                    className="border p-2 rounded text-sm w-full"
                    value={prescription.rightCylinder}
                    onChange={(e) => setPrescription({...prescription, rightCylinder: e.target.value})}
                  >
                    <option value="">Select</option>
                    {generateCylinderOptions().map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                  <select 
                    className="border p-2 rounded text-sm w-full"
                    value={prescription.rightAxis}
                    onChange={(e) => setPrescription({...prescription, rightAxis: e.target.value})}
                  >
                    <option value="">Select</option>
                    {generateAxisOptions().map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                {/* 左眼 */}
                <div className="grid grid-cols-4 gap-2 mb-4 items-center">
                  <div className="text-sm text-gray-500">Left Eye (OS)</div>
                  <select 
                    className="border p-2 rounded text-sm w-full"
                    value={prescription.leftSphere}
                    onChange={(e) => setPrescription({...prescription, leftSphere: e.target.value})}
                  >
                    <option value="">Select</option>
                    {generateSphereOptions().map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                  <select 
                    className="border p-2 rounded text-sm w-full"
                    value={prescription.leftCylinder}
                    onChange={(e) => setPrescription({...prescription, leftCylinder: e.target.value})}
                  >
                    <option value="">Select</option>
                    {generateCylinderOptions().map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                  <select 
                    className="border p-2 rounded text-sm w-full"
                    value={prescription.leftAxis}
                    onChange={(e) => setPrescription({...prescription, leftAxis: e.target.value})}
                  >
                    <option value="">Select</option>
                    {generateAxisOptions().map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">PD (Pupillary Distance)</p>
                  <select 
                    className="border p-2 rounded text-sm w-full"
                    value={prescription.pd}
                    onChange={(e) => setPrescription({...prescription, pd: e.target.value})}
                  >
                    <option value="">Select PD</option>
                    {generatePDOptions().map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-xl font-medium">Total: ${total}</span>
                  <button onClick={onAddToCart} className="bg-black text-white px-8 py-3 rounded">Add to Cart</button>
                </div>
              </div>
            )}

            {step === 3 && hasPrescription === false && (
              <div>
                <button onClick={() => setHasPrescription(null)} className="text-sm text-gray-500 mb-4">← Back</button>
                <h3 className="font-medium mb-4">No Prescription</h3>
                
                <p className="text-gray-600 mb-6">You can order now and provide your prescription later via email.</p>
                
                <div className="bg-gray-50 p-4 rounded mb-6">
                  <p className="text-sm text-gray-600 mb-2">Order Summary:</p>
                  <div className="flex justify-between text-sm">
                    <span>{product.name}</span>
                    <span>{selectedColor}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>{selectedLens?.name || 'Classic Clear'}</span>
                    <span>{selectedLens?.price === 0 ? 'Free' : `+$${selectedLens?.price}`}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-xl font-medium">Total: ${total}</span>
                  <button onClick={handleAddToCartWithoutRx} className="bg-black text-white px-8 py-3 rounded">Add to Cart</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Cart Sidebar Component
function CartSidebar({ cart, onClose, total }: { cart: CartItem[], onClose: () => void, total: number }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-medium">Cart ({cart.length})</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="p-4">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Your cart is empty</p>
          ) : (
            <>
              {cart.map((item, idx) => (
                <div key={idx} className="border-b py-4">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{item.product.name}</span>
                    <span>${item.product.price + item.lens.price}</span>
                  </div>
                  <p className="text-sm text-gray-500">{item.color} / {item.lens.name}</p>
                </div>
              ))}
              
              <div className="pt-4">
                <div className="flex justify-between text-xl font-medium mb-4">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
                <button className="w-full bg-black text-white py-4 rounded-full">Checkout</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
