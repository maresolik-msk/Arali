import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Banknote, 
  QrCode, 
  ShoppingBag,
  RotateCcw,
  CheckCircle2,
  X,
  PackageSearch
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { toast } from 'sonner';
import { productsApi, ordersApi } from '../services/api';
import { generateProductImage } from '../services/ai';
import type { Product, Order, OrderItem } from '../data/dashboardData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface CartItem extends Product {
  cartQuantity: number;
}

export function POS() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'summary' | 'payment' | 'success'>('summary');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('cash');
  const [amountPaid, setAmountPaid] = useState('');

  // Load products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await productsApi.getAll();
        setProducts(data || []);
      } catch (error) {
        console.error('Error loading products:', error);
        toast.error('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Categories
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['All', ...Array.from(cats).sort()];
  }, [products]);

  // Cart calculations
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.sellingPrice * item.cartQuantity), 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.cartQuantity, 0);
  }, [cart]);

  // Cart actions
  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.cartQuantity >= product.stock) {
          toast.warning('Cannot add more than available stock');
          return prev;
        }
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, cartQuantity: item.cartQuantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, cartQuantity: 1 }];
    });
    toast.success(`Added ${product.name} to cart`);
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === productId) {
          const newQuantity = item.cartQuantity + delta;
          if (newQuantity <= 0) return item; // Don't remove, just stop at 1
          
          const product = products.find(p => p.id === productId);
          if (product && newQuantity > product.stock) {
            toast.warning(`Only ${product.stock} items available`);
            return item;
          }
          
          return { ...item, cartQuantity: newQuantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    if (confirm('Are you sure you want to clear the cart?')) {
      setCart([]);
    }
  };

  // Checkout process
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsCheckoutOpen(true);
    setCheckoutStep('summary');
  };

  const processPayment = async () => {
    setIsProcessing(true);
    try {
      // 1. Create Order
      const orderItems: OrderItem[] = cart.map(item => ({
        productId: item.id,
        productName: item.name,
        quantity: item.cartQuantity,
        price: item.sellingPrice,
        subtotal: item.sellingPrice * item.cartQuantity
      }));

      const newOrder = {
        customerId: 0, // Guest customer for now, or could implement customer selection
        customerName: 'Guest Customer',
        items: orderItems,
        totalAmount: cartTotal,
        status: 'Completed' as const,
        notes: `Paid via ${paymentMethod}`
      };

      await ordersApi.add(newOrder as any); // Using 'any' because strict typing might mismatch with partial order

      // 2. Update Inventory (Record Sales)
      // Run sequentially to avoid race conditions or backend overload
      for (const item of cart) {
        await productsApi.recordSales(item.id, item.cartQuantity);
      }

      // 3. Update local product state
      const updatedProducts = await productsApi.getAll();
      setProducts(updatedProducts);

      setCheckoutStep('success');
      setCart([]);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetCheckout = () => {
    setIsCheckoutOpen(false);
    setCheckoutStep('summary');
    setPaymentMethod('cash');
    setAmountPaid('');
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-6 p-6">
      {/* Left Column: Product Grid */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-9 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <ScrollArea className="w-full sm:w-auto whitespace-nowrap pb-2 sm:pb-0">
            <div className="flex gap-2">
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full ${selectedCategory === cat ? 'bg-[#0F4C81]' : ''}`}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-4 border-[#0F4C81]/20 border-t-[#0F4C81] rounded-full animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <PackageSearch className="w-16 h-16 mb-4 opacity-20" />
              <p>No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <Card 
                  key={product.id}
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 group border-none shadow-md"
                  onClick={() => addToCart(product)}
                >
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    {product.imageUrl ? (
                      <ImageWithFallback
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                    )}
                    {product.stock <= 5 && product.stock > 0 && (
                      <Badge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600">
                        Low Stock: {product.stock}
                      </Badge>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Badge variant="destructive">Out of Stock</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold truncate" title={product.name}>{product.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{product.category}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-[#0F4C81]">₹{product.sellingPrice}</span>
                      <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Cart */}
      <div className="w-full md:w-[400px] flex flex-col h-full bg-white rounded-xl shadow-xl border border-[#0F4C81]/10 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-[#0F4C81]/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#0F4C81]" />
            <h2 className="font-semibold text-[#0F4C81]">Current Order</h2>
          </div>
          <Badge variant="secondary" className="bg-white text-[#0F4C81]">{cartItemCount} Items</Badge>
        </div>

        <ScrollArea className="flex-1 p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
              <p>Cart is empty</p>
              <p className="text-sm text-gray-400">Select products to add to cart</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                       <ImageWithFallback
                        src={item.imageUrl || ''} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-sm truncate pr-2" title={item.name}>{item.name}</h4>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[#0F4C81] font-semibold text-sm">₹{item.sellingPrice * item.cartQuantity}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                          disabled={item.cartQuantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{item.cartQuantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-full bg-[#0F4C81]/10 hover:bg-[#0F4C81]/20 text-[#0F4C81] flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>

        <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Tax (5%)</span>
              <span>₹{(cartTotal * 0.05).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-[#0F4C81] pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>₹{(cartTotal * 1.05).toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
              onClick={clearCart}
              disabled={cart.length === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button 
              className="bg-[#0F4C81] hover:bg-[#0F4C81]/90"
              onClick={handleCheckout}
              disabled={cart.length === 0}
            >
              Pay Now
            </Button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-[500px]" aria-describedby="checkout-description">
          <DialogHeader>
            <DialogTitle>
              {checkoutStep === 'summary' && 'Order Summary'}
              {checkoutStep === 'payment' && 'Payment Method'}
              {checkoutStep === 'success' && 'Order Completed'}
            </DialogTitle>
            <DialogDescription id="checkout-description">
              {checkoutStep === 'success' 
                ? 'Your order has been successfully processed.' 
                : `Total Amount: ₹${(cartTotal * 1.05).toFixed(2)}`
              }
            </DialogDescription>
          </DialogHeader>

          {checkoutStep === 'summary' && (
            <div className="space-y-4 py-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 max-h-[300px] overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.cartQuantity}x {item.name}</span>
                    <span className="font-medium">₹{item.sellingPrice * item.cartQuantity}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold">
                  <span>Total (Inc. Tax)</span>
                  <span>₹{(cartTotal * 1.05).toFixed(2)}</span>
                </div>
              </div>
              <Button className="w-full bg-[#0F4C81]" onClick={() => setCheckoutStep('payment')}>
                Proceed to Payment
              </Button>
            </div>
          )}

          {checkoutStep === 'payment' && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-3 gap-3">
                <Button 
                  variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                  className={`h-24 flex flex-col gap-2 ${paymentMethod === 'cash' ? 'bg-[#0F4C81]' : ''}`}
                  onClick={() => setPaymentMethod('cash')}
                >
                  <Banknote className="w-8 h-8" />
                  Cash
                </Button>
                <Button 
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  className={`h-24 flex flex-col gap-2 ${paymentMethod === 'card' ? 'bg-[#0F4C81]' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard className="w-8 h-8" />
                  Card
                </Button>
                <Button 
                  variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                  className={`h-24 flex flex-col gap-2 ${paymentMethod === 'upi' ? 'bg-[#0F4C81]' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <QrCode className="w-8 h-8" />
                  UPI
                </Button>
              </div>

              {paymentMethod === 'cash' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount Received</label>
                  <Input 
                    type="number" 
                    placeholder="Enter amount" 
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                  />
                  {amountPaid && parseFloat(amountPaid) >= (cartTotal * 1.05) && (
                    <div className="text-green-600 text-sm font-medium mt-1">
                      Change to return: ₹{(parseFloat(amountPaid) - (cartTotal * 1.05)).toFixed(2)}
                    </div>
                  )}
                </div>
              )}

              <Button 
                className="w-full bg-[#0F4C81]" 
                onClick={processPayment}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Complete Order'}
              </Button>
            </div>
          )}

          {checkoutStep === 'success' && (
            <div className="py-8 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0F4C81]">Payment Successful!</h3>
                <p className="text-gray-500">Order has been created successfully.</p>
              </div>
              <Button onClick={resetCheckout} className="mt-4">
                Start New Sale
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
