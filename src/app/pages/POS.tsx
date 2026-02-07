import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router';
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
  PackageSearch,
  PauseCircle,
  PlayCircle,
  FileText,
  Printer,
  Share2,
  History,
  AlertCircle,
  Zap
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '../components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { productsApi, ordersApi, invoicesApi, heldBillsApi, auditLogsApi, shopSettingsApi } from '../services/api';
import { generateProductImage } from '../services/ai';
import type { Product, Order, OrderItem, PaymentMethod } from '../data/dashboardData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface CartItem extends Product {
  cartQuantity: number;
}

interface HeldBill {
  id: string;
  items: CartItem[];
  totalAmount: number;
  customerName?: string; // Optional customer name for held bill
  createdAt: string;
}

import { ExpressMode } from '../components/sales/ExpressMode';

export function POS() {
  const location = useLocation();
  const [isExpressMode, setIsExpressMode] = useState(location.state?.mode === 'express');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Checkout States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'summary' | 'payment' | 'success'>('summary');
  
  // Payment States
  const [paymentMode, setPaymentMode] = useState<'single' | 'split'>('single');
  const [splitPayments, setSplitPayments] = useState<PaymentMethod[]>([]);
  const [currentSplitMethod, setCurrentSplitMethod] = useState<'CASH' | 'CARD' | 'UPI'>('CASH');
  const [currentSplitAmount, setCurrentSplitAmount] = useState('');
  const [singlePaymentMethod, setSinglePaymentMethod] = useState<'CASH' | 'CARD' | 'UPI'>('CASH');
  const [amountReceived, setAmountReceived] = useState('');

  // Held Bills State
  const [heldBills, setHeldBills] = useState<HeldBill[]>([]);
  const [isHeldBillsOpen, setIsHeldBillsOpen] = useState(false);

  // Success State
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  
  // Settings
  const [gstIn, setGstIn] = useState<string | undefined>(undefined);

  // Load products & Held Bills on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [productsData, heldBillsData, settings] = await Promise.all([
          productsApi.getAll(),
          heldBillsApi.getAll().catch(() => []), // Fail gracefully if API not ready
          shopSettingsApi.get().catch(() => ({ gstIn: undefined } as any))
        ]);
        setProducts(productsData || []);
        setHeldBills(heldBillsData || []);
        setGstIn(settings?.gstIn);
        
        // Load cart from local storage (Offline Safety)
        const savedCart = localStorage.getItem('pos_cart');
        if (savedCart) {
          try {
            setCart(JSON.parse(savedCart));
          } catch (e) {
            console.error('Failed to load cart from local storage');
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load data. Please check your connection.');
        toast.error('Failed to load initial data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('pos_cart', JSON.stringify(cart));
  }, [cart]);

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
  const cartSubtotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.sellingPrice * item.cartQuantity), 0);
  }, [cart]);

  const taxAmount = cartSubtotal * 0.05; // 5% Tax assumption
  const cartTotal = cartSubtotal + taxAmount;

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
    toast.success(`Added ${product.name}`);
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    auditLogsApi.log({ action: 'VOID_ITEM', reason: 'User removed item from cart', orderId: 'draft' });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === productId) {
          const newQuantity = item.cartQuantity + delta;
          if (newQuantity <= 0) return item; 
          
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
      auditLogsApi.log({ action: 'VOID_CART', reason: 'User cleared entire cart', orderId: 'draft' });
    }
  };

  // Hold Bill Logic
  const handleHoldBill = async () => {
    if (cart.length === 0) return;
    
    try {
      const bill: any = {
        id: `held-${Date.now()}`,
        items: cart,
        totalAmount: cartTotal,
        createdAt: new Date().toISOString(),
        customerName: 'Walk-in Customer' // Could add input for this
      };
      
      // Optimistic update
      setHeldBills(prev => [bill, ...prev]);
      setCart([]);
      
      // Async backend call
      await heldBillsApi.add(bill);
      auditLogsApi.log({ action: 'HOLD_BILL', reason: 'User held bill', orderId: bill.id });
      
      toast.success('Bill held successfully');
    } catch (error) {
      console.error('Error holding bill:', error);
      toast.error('Failed to save held bill (saved locally only)');
    }
  };

  const handleResumeBill = async (bill: HeldBill) => {
    if (cart.length > 0) {
      if (!confirm('Current cart is not empty. Overwrite?')) return;
    }
    
    setCart(bill.items);
    setHeldBills(prev => prev.filter(b => b.id !== bill.id));
    setIsHeldBillsOpen(false);
    
    // Async cleanup
    try {
      await heldBillsApi.delete(bill.id);
    } catch (e) {
      console.error("Failed to delete held bill from server", e);
    }
  };

  // Checkout process
  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsCheckoutOpen(true);
    setCheckoutStep('summary');
    setPaymentMode('single');
    setSplitPayments([]);
    setAmountReceived('');
  };

  const addSplitPayment = () => {
    if (!currentSplitAmount || parseFloat(currentSplitAmount) <= 0) return;
    
    const amount = parseFloat(currentSplitAmount);
    setSplitPayments(prev => [...prev, { method: currentSplitMethod, amount }]);
    setCurrentSplitAmount('');
  };

  const removeSplitPayment = (index: number) => {
    setSplitPayments(prev => prev.filter((_, i) => i !== index));
  };

  const totalSplitPaid = splitPayments.reduce((sum, p) => sum + p.amount, 0);
  const remainingSplitAmount = Math.max(0, cartTotal - totalSplitPaid);

  const processPayment = async () => {
    // Validation
    if (paymentMode === 'split') {
        if (Math.abs(totalSplitPaid - cartTotal) > 1) { // 1 rupee tolerance
            toast.error(`Payment mismatch. Total paid: ₹${totalSplitPaid}, Required: ₹${cartTotal.toFixed(2)}`);
            return;
        }
    } else {
        // Single payment validation implicitly handled by flow, but good to check
    }

    setIsProcessing(true);
    try {
      // 1. Prepare Payment Breakup
      const paymentBreakup: PaymentMethod[] = paymentMode === 'single' 
        ? [{ method: singlePaymentMethod, amount: cartTotal }]
        : splitPayments;

      // 2. Create Order
      const orderItems: OrderItem[] = cart.map(item => ({
        productId: item.id,
        productName: item.name,
        quantity: item.cartQuantity,
        price: item.sellingPrice,
        subtotal: item.sellingPrice * item.cartQuantity
      }));

      const newOrder = {
        customerId: 0,
        customerName: 'Guest Customer',
        items: orderItems,
        totalAmount: cartTotal,
        status: 'Completed' as const,
        paymentBreakup: paymentBreakup,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // @ts-ignore - TS might complain about optional fields but API handles it
      const createdOrder = await ordersApi.add(newOrder);
      setLastOrder(createdOrder);

      // 3. Generate Invoice (Async)
      const invoice = {
          id: `inv-${Date.now()}`,
          orderId: createdOrder.id,
          invoiceNumber: `INV-${new Date().getFullYear()}-${Date.now().toString().substr(-6)}`,
          type: gstIn ? 'GST' : 'SIMPLE',
          subtotal: cartSubtotal,
          tax: taxAmount,
          total: cartTotal,
          paymentBreakup: paymentBreakup,
          createdAt: new Date().toISOString()
      };
      await invoicesApi.create(invoice);

      // 4. Update Inventory
      for (const item of cart) {
        await productsApi.recordSales(item.id, item.cartQuantity);
      }

      // 5. Update local state
      const updatedProducts = await productsApi.getAll();
      setProducts(updatedProducts);

      setCheckoutStep('success');
      setCart([]);
      localStorage.removeItem('pos_cart');
      
      toast.success('Order completed successfully!');
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
    setSinglePaymentMethod('CASH');
    setAmountReceived('');
    setLastOrder(null);
  };

  const handlePrintInvoice = () => {
      toast.info("Printing invoice...");
      // In a real app, this would trigger window.print() on a hidden iframe
  };

  const handleShareInvoice = () => {
      // Share logic (WhatsApp)
      const message = `Invoice for Order #${lastOrder?.id}. Total: ₹${lastOrder?.totalAmount}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
  };

  if (isExpressMode) {
    return <ExpressMode onExit={() => setIsExpressMode(false)} />;
  }

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
          <Button 
            className="bg-amber-100 hover:bg-amber-200 text-amber-700 border-none shadow-sm"
            onClick={() => setIsExpressMode(true)}
          >
            <Zap className="w-4 h-4 mr-2 fill-current" />
            Express Mode
          </Button>
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
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-red-500 gap-4">
              <AlertCircle className="w-12 h-12" />
              <p>{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="border-red-200 hover:bg-red-50 text-red-600">
                Retry
              </Button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <PackageSearch className="w-16 h-16 mb-4 opacity-20" />
              <p>No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product, index) => (
                <Card 
                  key={`${product.id}-${index}`}
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
                        Low: {product.stock}
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
          <div className="flex gap-2">
             <Sheet open={isHeldBillsOpen} onOpenChange={setIsHeldBillsOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 text-[#0F4C81]">
                        <History className="w-4 h-4 mr-1" />
                        Held ({heldBills.length})
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Held Bills</SheetTitle>
                        <SheetDescription>Resume a previously held bill.</SheetDescription>
                    </SheetHeader>
                    <div className="mt-4 space-y-3">
                        {heldBills.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No held bills.</p>
                        ) : heldBills.map(bill => (
                            <Card key={bill.id} className="p-3 flex justify-between items-center">
                                <div>
                                    <p className="font-bold">₹{bill.totalAmount.toFixed(2)}</p>
                                    <p className="text-xs text-gray-500">{new Date(bill.createdAt).toLocaleTimeString()}</p>
                                    <p className="text-xs text-gray-500">{bill.items.length} items</p>
                                </div>
                                <Button size="sm" onClick={() => handleResumeBill(bill)}>Resume</Button>
                            </Card>
                        ))}
                    </div>
                </SheetContent>
             </Sheet>
             <Badge variant="secondary" className="bg-white text-[#0F4C81]">{cartItemCount} Items</Badge>
          </div>
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
              <span>₹{cartSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Tax (5%)</span>
              <span>₹{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-[#0F4C81] pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
              onClick={clearCart}
              disabled={cart.length === 0}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
                variant="outline"
                className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 border-orange-200"
                onClick={handleHoldBill}
                disabled={cart.length === 0}
            >
                <PauseCircle className="w-4 h-4 mr-1" /> Hold
            </Button>
            <Button 
              className="bg-[#0F4C81] hover:bg-[#0F4C81]/90"
              onClick={handleCheckout}
              disabled={cart.length === 0}
            >
              Pay
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
              {checkoutStep === 'payment' && 'Payment'}
              {checkoutStep === 'success' && 'Order Completed'}
            </DialogTitle>
            <DialogDescription id="checkout-description">
              {checkoutStep === 'success' 
                ? 'Your order has been successfully processed.' 
                : `Total Payable: ₹${cartTotal.toFixed(2)}`
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
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>
              <Button className="w-full bg-[#0F4C81]" onClick={() => setCheckoutStep('payment')}>
                Proceed to Payment
              </Button>
            </div>
          )}

          {checkoutStep === 'payment' && (
            <div className="space-y-6 py-4">
              {/* Payment Mode Selector */}
              <Tabs value={paymentMode} onValueChange={(v: any) => setPaymentMode(v)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="single">Single Payment</TabsTrigger>
                  <TabsTrigger value="split">Split Payment</TabsTrigger>
                </TabsList>
              </Tabs>

              {paymentMode === 'single' ? (
                  <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        {['CASH', 'CARD', 'UPI'].map((method) => (
                            <Button 
                                key={method}
                                variant={singlePaymentMethod === method ? 'default' : 'outline'}
                                className={`h-20 flex flex-col gap-2 ${singlePaymentMethod === method ? 'bg-[#0F4C81]' : ''}`}
                                onClick={() => setSinglePaymentMethod(method as any)}
                            >
                                {method === 'CASH' && <Banknote className="w-6 h-6" />}
                                {method === 'CARD' && <CreditCard className="w-6 h-6" />}
                                {method === 'UPI' && <QrCode className="w-6 h-6" />}
                                {method}
                            </Button>
                        ))}
                      </div>
                      {singlePaymentMethod === 'CASH' && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Amount Received</label>
                          <Input 
                            type="number" 
                            placeholder="Enter amount" 
                            value={amountReceived}
                            onChange={(e) => setAmountReceived(e.target.value)}
                          />
                          {amountReceived && parseFloat(amountReceived) >= cartTotal && (
                            <div className="text-green-600 text-sm font-medium mt-1">
                              Change to return: ₹{(parseFloat(amountReceived) - cartTotal).toFixed(2)}
                            </div>
                          )}
                        </div>
                      )}
                  </div>
              ) : (
                  <div className="space-y-4">
                      <div className="bg-gray-50 p-3 rounded-md mb-2">
                          <div className="flex justify-between text-sm mb-1">
                              <span>Total Due:</span>
                              <span className="font-bold">₹{cartTotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-1 text-green-600">
                              <span>Paid:</span>
                              <span>₹{totalSplitPaid.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm font-bold text-red-500 border-t pt-1">
                              <span>Remaining:</span>
                              <span>₹{remainingSplitAmount.toFixed(2)}</span>
                          </div>
                      </div>

                      <div className="flex gap-2">
                          <Select value={currentSplitMethod} onValueChange={(v: any) => setCurrentSplitMethod(v)}>
                              <SelectTrigger className="w-[100px]">
                                  <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="CASH">Cash</SelectItem>
                                  <SelectItem value="CARD">Card</SelectItem>
                                  <SelectItem value="UPI">UPI</SelectItem>
                              </SelectContent>
                          </Select>
                          <Input 
                              type="number" 
                              placeholder="Amount" 
                              value={currentSplitAmount}
                              onChange={(e) => setCurrentSplitAmount(e.target.value)}
                              className="flex-1"
                          />
                          <Button onClick={addSplitPayment} disabled={!currentSplitAmount}>Add</Button>
                      </div>

                      <div className="space-y-2">
                          {splitPayments.map((payment, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-white border p-2 rounded">
                                  <span>{payment.method}</span>
                                  <div className="flex items-center gap-2">
                                      <span className="font-bold">₹{payment.amount}</span>
                                      <button onClick={() => removeSplitPayment(idx)} className="text-red-500"><X size={14} /></button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              <Button 
                className="w-full bg-[#0F4C81]" 
                onClick={processPayment}
                disabled={isProcessing || (paymentMode === 'split' && remainingSplitAmount > 1)}
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
                <p className="text-gray-500">Order #{lastOrder?.id} created.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 w-full mt-6">
                  <Button variant="outline" onClick={handlePrintInvoice}>
                      <Printer className="w-4 h-4 mr-2" /> Print Invoice
                  </Button>
                  <Button variant="outline" onClick={handleShareInvoice}>
                      <Share2 className="w-4 h-4 mr-2" /> Share
                  </Button>
              </div>

              <Button onClick={resetCheckout} className="w-full">
                Start New Sale
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
