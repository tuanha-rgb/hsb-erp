// src/shop/HSBShopViewer.tsx - Customer Shopping Interface
import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingCart, Search, Filter, X, Plus, Minus, Trash2,
  ChevronLeft, ChevronRight, Star, Tag, Package,
  CreditCard, CheckCircle, Loader, ArrowLeft, QrCode
} from 'lucide-react';
import { collection, onSnapshot, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';
import { Product, Category, CATEGORIES, formatCurrency } from './inventory';

interface CartItem extends Product {
  quantity: number;
}

interface CheckoutData {
  orderId: string;
  items: CartItem[];
  totalPrice: number;
  totalPoints: number;
  paymentMethod: 'cash' | 'points' | 'qr';
  qrCode?: string;
  customerName?: string;
  customerEmail?: string;
}

type ShopView = 'browse' | 'cart' | 'checkout' | 'success';

interface HSBShopViewerProps {
  userId?: string;
  userName?: string;
}

export default function HSBShopViewer({ userId = 'guest', userName = 'Guest User' }: HSBShopViewerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<ShopView>('browse');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | Category>('all');

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartSidebar, setShowCartSidebar] = useState(false);

  // Carousel
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Checkout
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'points' | 'qr'>('qr');

  // Load products from Firebase
  useEffect(() => {
    const q = query(
      collection(db, 'shop_products'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          lastRestocked: doc.data().lastRestocked?.toDate(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        })) as Product[];

        setProducts(productsData.filter(p => p.stock > 0)); // Only show in-stock items
        setLoading(false);
      },
      (error) => {
        console.error('Error loading products:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Featured products (newest 5)
  const featuredProducts = useMemo(() => {
    return products
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, 5);
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = searchTerm === '' ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.itemCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, filterCategory]);

  // Cart calculations
  const cartTotal = useMemo(() => {
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalPoints = cart.reduce((sum, item) => sum + (item.hsbPoints * item.quantity), 0);
    return { totalPrice, totalPoints, itemCount: cart.reduce((sum, item) => sum + item.quantity, 0) };
  }, [cart]);

  // Cart functions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity < product.stock) {
          return prev.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return prev; // Max stock reached
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (quantity > product.stock) return; // Can't exceed stock

    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Checkout functions
  const proceedToCheckout = () => {
    if (cart.length === 0) return;
    setActiveView('checkout');
  };

  const confirmOrder = () => {
    const orderId = `HSB-ORDER-${Date.now()}`;
    const checkout: CheckoutData = {
      orderId,
      items: cart,
      totalPrice: cartTotal.totalPrice,
      totalPoints: cartTotal.totalPoints,
      paymentMethod,
      customerName: userName,
      qrCode: paymentMethod === 'qr' ? 'PLACEHOLDER_QR_CODE' : undefined
    };

    setCheckoutData(checkout);
    setActiveView('success');
  };

  const resetShop = () => {
    clearCart();
    setActiveView('browse');
    setCheckoutData(null);
  };

  // Carousel navigation
  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  useEffect(() => {
    if (featuredProducts.length > 0) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredProducts.length]);

  // Render functions
  const renderFeaturedCarousel = () => {
  if (featuredProducts.length === 0) return null;

  const currentProduct = featuredProducts[carouselIndex];

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-3xl shadow-lg overflow-hidden">
      <div className="relative h-96">
        <div className="absolute inset-0 flex items-center justify-between px-12 py-8">
          {/* Left: Text Content */}
          <div className="flex-1 max-w-lg text-white z-10 space-y-4">
            <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold uppercase tracking-wide">
              Featured
            </span>
            <h2 className="text-5xl font-bold leading-tight">{currentProduct.name}</h2>
            <p className="text-lg opacity-90 leading-relaxed">
  Discover our featured {currentProduct.category} product with exclusive benefits for HSB members.
</p>
            <div className="flex gap-4 pt-2">
              <button className="px-6 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all">
                Preview
              </button>
              <button
                onClick={() => addToCart(currentProduct)}
                className="px-6 py-2.5 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                View Product
              </button>
            </div>
          </div>

          {/* Right: Product Image */}
          <div className="flex-1 flex items-center justify-end">
            <div className="relative">
              <img
                src={currentProduct.image}
                alt={currentProduct.name}
                className="w-56 h-80 object-cover rounded-lg shadow-2xl opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all z-20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all z-20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {featuredProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCarouselIndex(index)}
              className={`h-2 rounded-full transition-all ${
                carouselIndex === index ? 'w-8 bg-white' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

  const renderProductCard = (product: Product) => (
    <div
      key={product.id}
      className="w-64 h-96 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
    >
      <div className="w-36 h-36 items-center justify-center relative mx-auto">
        <img
          src={product.image}
          alt={product.name}
          className="w-36 h-36 object-cover"
        />
     
        {product.stock <= product.reorderLevel && (
          <div className="absolute top-2 left-2">
            <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
              Low Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

        <div className="flex items-center gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500">Price</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(product.price)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Points</p>
            <p className="text-xl font-bold text-blue-600">{product.hsbPoints}</p>
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          <p>Stock: <span className="font-semibold">{product.stock} units</span></p>
        </div>

        <button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );

  const renderBrowse = () => (
  <div className="space-y-3">
    {/* Featured Carousel */}
    {renderFeaturedCarousel()}

    {/* Filters */}
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products by name or item code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-5 py-3 rounded-xl font-medium text-sm transition-colors whitespace-nowrap ${
                filterCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {typeof cat === 'string' ? cat.charAt(0).toUpperCase() + cat.slice(1) : cat}
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* Products Grid */}
    {loading ? (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    ) : filteredProducts.length === 0 ? (
      <div className="bg-white rounded-2xl shadow-sm p-12 border border-gray-100 text-center">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">No Products Found</h3>
        <p className="text-gray-600">Try adjusting your search or filters</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map(renderProductCard)}
      </div>
    )}
  </div>
);

  const renderCartSidebar = () => (
    <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
      showCartSidebar ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Shopping Cart ({cartTotal.itemCount})
          </h3>
          <button
            onClick={() => setShowCartSidebar(false)}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 bg-gray-50 p-4 rounded-xl">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate">{item.name}</h4>
                  <p className="text-xs text-gray-500 mb-2">{item.itemCode}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-semibold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm">
                    <span className="font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                    <span className="text-gray-500 ml-2">/ {item.hsbPoints * item.quantity} pts</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">{formatCurrency(cartTotal.totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">HSB Points:</span>
                <span className="font-semibold text-blue-600">{cartTotal.totalPoints} pts</span>
              </div>
            </div>
            <button
              onClick={proceedToCheckout}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderCheckout = () => (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => setActiveView('browse')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Shop
      </button>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-3">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="font-bold text-xl text-gray-900">{formatCurrency(cartTotal.totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-blue-600">HSB Points:</span>
                <span className="font-bold text-xl text-blue-600">{cartTotal.totalPoints} pts</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h3>
            <div className="space-y-3 mb-6">
              <button
                onClick={() => setPaymentMethod('qr')}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'qr'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <QrCode className="w-6 h-6 text-blue-600" />
                  <div className="text-left">
                    <p className="font-semibold">QR Code Payment</p>
                    <p className="text-sm text-gray-600">Scan QR to pay</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('points')}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'points'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-blue-600" />
                  <div className="text-left">
                    <p className="font-semibold">HSB Points</p>
                    <p className="text-sm text-gray-600">Pay with {cartTotal.totalPoints} points</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('cash')}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <div className="text-left">
                    <p className="font-semibold">Cash on Pickup</p>
                    <p className="text-sm text-gray-600">Pay when collecting</p>
                  </div>
                </div>
              </button>
            </div>

            <button
              onClick={confirmOrder}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => {
    if (!checkoutData) return null;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h2>
          <p className="text-gray-600 mb-8">
            Thank you for your order. Your order ID is <span className="font-mono font-semibold">{checkoutData.orderId}</span>
          </p>

          {checkoutData.paymentMethod === 'qr' && (
            <div className="mb-8">
              <div className="bg-gray-100 rounded-xl p-8 mb-4">
                {/* QR Code Placeholder */}
                <div className="w-64 h-64 mx-auto bg-white rounded-xl flex items-center justify-center border-2 border-gray-300">
                  <div className="text-center">
                    <QrCode className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-semibold">QR Code</p>
                    <p className="text-sm text-gray-500">Scan to pay {formatCurrency(checkoutData.totalPrice)}</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Scan this QR code with your banking app to complete payment
              </p>
            </div>
          )}

          {checkoutData.paymentMethod === 'points' && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <p className="text-blue-900 font-semibold mb-2">Payment with HSB Points</p>
              <p className="text-blue-700">{checkoutData.totalPoints} points will be deducted from your account</p>
            </div>
          )}

          {checkoutData.paymentMethod === 'cash' && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
              <p className="text-orange-900 font-semibold mb-2">Cash on Pickup</p>
              <p className="text-orange-700">Please bring {formatCurrency(checkoutData.totalPrice)} when collecting your order</p>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-bold text-gray-900 mb-4">Order Details</h3>
            <div className="space-y-2">
              {checkoutData.items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.name} x {item.quantity}</span>
                  <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(checkoutData.totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={resetShop}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading shop...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w mx-auto p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">HSB Shop</h1>
                <p className="text-sm text-gray-600">Welcome, {userName}</p>
              </div>
            </div>

            <button
              onClick={() => setShowCartSidebar(true)}
              className="relative px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Cart
              {cartTotal.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartTotal.itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w mx-auto p-3">
        {activeView === 'browse' && renderBrowse()}
        {activeView === 'checkout' && renderCheckout()}
        {activeView === 'success' && renderSuccess()}
      </div>

      {/* Cart Sidebar */}
      {renderCartSidebar()}

      {/* Overlay */}
      {showCartSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowCartSidebar(false)}
        />
      )}
    </div>
  );
}
