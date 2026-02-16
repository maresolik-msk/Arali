import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Settings, 
  Plus, 
  Minus, 
  Search, 
  X, 
  Check, 
  AlertCircle,
  Package,
  ChevronRight
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { toast } from 'sonner';
import { expressApi, productsApi } from '../../services/api';
import type { Product, ProductVariant } from '../../data/dashboardData';
import { cn } from '../ui/utils';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ExpressModeProps {
  onExit?: () => void;
  embedded?: boolean;
}

// Helper: get active variants for a product
function getActiveVariants(product: Product): ProductVariant[] {
  return (product.variants || []).filter((v: ProductVariant) => v.isActive !== false);
}

// Helper: compute effective stock for display
function getEffectiveStock(product: Product): number {
  const activeVars = getActiveVariants(product);
  if (product.hasVariants && activeVars.length > 0) {
    // Sum base units across variants, then compute total packs
    return activeVars.reduce((sum, v) => {
      if (v.isLoose) return sum + (v.stockInBaseUnit || 0); // loose: raw base units
      return sum + Math.floor((v.stockInBaseUnit || 0) / (v.packSizeInBaseUnit || 1));
    }, 0);
  }
  return product.stock;
}

// Helper: get display price for product tile
function getDisplayPrice(product: Product): string {
  const activeVars = getActiveVariants(product);
  if (product.hasVariants && activeVars.length > 0) {
    const prices = activeVars.map(v => v.sellingPrice).sort((a, b) => a - b);
    if (prices.length === 1) return `₹${prices[0]}`;
    if (prices[0] === prices[prices.length - 1]) return `₹${prices[0]}`;
    return `₹${prices[0]}–₹${prices[prices.length - 1]}`;
  }
  return `₹${product.sellingPrice}`;
}

// Helper: stock display text
function getStockDisplay(product: Product): { text: string; color: string } {
  const activeVars = getActiveVariants(product);
  if (product.hasVariants && activeVars.length > 0) {
    const totalBase = activeVars.reduce((sum, v) => sum + (v.stockInBaseUnit || 0), 0);
    if (totalBase <= 0) return { text: 'Out of Stock', color: 'bg-red-200 text-red-800' };
    // Show total in most appropriate unit
    const unitType = activeVars[0]?.unitType || 'count';
    let label: string;
    if (unitType === 'weight') {
      label = totalBase >= 1000 ? `${(totalBase / 1000).toFixed(1)} kg` : `${totalBase} g`;
    } else if (unitType === 'volume') {
      label = totalBase >= 1000 ? `${(totalBase / 1000).toFixed(1)} L` : `${totalBase} ml`;
    } else {
      label = `${totalBase} pcs`;
    }
    if (totalBase <= 500 && unitType !== 'count') return { text: label, color: 'bg-red-100 text-red-700' };
    return { text: label, color: 'bg-gray-100 text-gray-600' };
  }
  if (product.stock <= 0) return { text: 'Out of Stock', color: 'bg-red-200 text-red-800' };
  if (product.stock <= 5) return { text: `${product.stock} left`, color: 'bg-red-100 text-red-700' };
  return { text: `${product.stock} left`, color: 'bg-gray-100 text-gray-600' };
}

export function ExpressMode({ onExit, embedded = false }: ExpressModeProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [pinnedItemIds, setPinnedItemIds] = useState<number[]>([]);
  const [suggestions, setSuggestions] = useState<number[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [processingItems, setProcessingItems] = useState<Set<string>>(new Set());

  // Variant selection state
  const [variantSelectProduct, setVariantSelectProduct] = useState<Product | null>(null);
  const [isVariantSelectOpen, setIsVariantSelectOpen] = useState(false);
  const [looseQty, setLooseQty] = useState('');

  // Load initial data
  useEffect(() => {
    loadData();
    processOfflineQueue();
  }, []);

  const processOfflineQueue = async () => {
    if (!navigator.onLine) return;
    
    try {
      const queue = JSON.parse(localStorage.getItem('express_offline_queue') || '[]');
      if (queue.length === 0) return;

      const newQueue = [];
      for (const item of queue) {
        try {
          await expressApi.recordSale(item.productId, item.quantity, item.variantId, item.looseQuantityInBaseUnit);
        } catch (e) {
          newQueue.push(item); // Keep if failed
        }
      }
      
      localStorage.setItem('express_offline_queue', JSON.stringify(newQueue));
      if (queue.length > newQueue.length) {
        toast.success(`Synced ${queue.length - newQueue.length} offline sales`);
      }
    } catch (e) {
      console.error('Error processing offline queue', e);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [allProducts, config, suggestedIds] = await Promise.all([
        productsApi.getAll(),
        expressApi.getConfig(),
        expressApi.getSuggestions()
      ]);
      
      setProducts(allProducts || []);
      setPinnedItemIds(config.pinnedItemIds || []);
      setSuggestions(suggestedIds || []);
    } catch (error) {
      console.error('Failed to load express data', error);
      toast.error('Failed to load express mode data');
    } finally {
      setLoading(false);
    }
  };

  const handlePinToggle = (productId: number) => {
    setPinnedItemIds(prev => {
      const newIds = prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      return newIds;
    });
  };

  const saveConfig = async () => {
    try {
      await expressApi.updateConfig(pinnedItemIds);
      setIsEditMode(false);
      toast.success('Express layout saved');
    } catch (error) {
      toast.error('Failed to save layout');
    }
  };

  // Handle tap on a product tile
  const handleTap = async (product: Product) => {
    if (isEditMode) return;

    const activeVariants = getActiveVariants(product);
    const effectiveStock = getEffectiveStock(product);

    // Block if out of stock
    if (effectiveStock <= 0) {
      toast.error(`${product.name} is out of stock`, {
        duration: 1500,
        position: 'bottom-center',
        icon: <AlertCircle className="w-4 h-4 text-red-500" />
      });
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      return;
    }

    // Multi-variant product: show variant selection dialog
    if (product.hasVariants && activeVariants.length > 1) {
      setVariantSelectProduct(product);
      setIsVariantSelectOpen(true);
      setLooseQty('');
      return;
    }

    // Single variant: auto-sell that variant
    if (product.hasVariants && activeVariants.length === 1) {
      const variant = activeVariants[0];
      if (variant.isLoose) {
        // Loose single variant: show variant picker for quantity entry
        setVariantSelectProduct(product);
        setIsVariantSelectOpen(true);
        setLooseQty('');
        return;
      }
      await executeVariantSale(product, variant);
      return;
    }

    // Legacy non-variant product
    await executeLegacySale(product);
  };

  // Execute a variant-based sale
  const executeVariantSale = async (product: Product, variant: ProductVariant, looseBaseQty?: number) => {
    if (navigator.vibrate) navigator.vibrate(50);
    const processingKey = `${product.id}-${variant.id}`;
    setProcessingItems(prev => new Set(prev).add(processingKey));

    try {
      const result = await expressApi.recordSale(
        product.id,
        looseBaseQty ? 1 : 1,
        variant.id,
        looseBaseQty
      );

      if (result.success) {
        const unitLabel = looseBaseQty
          ? (variant.unitType === 'weight'
            ? (looseBaseQty >= 1000 ? `${(looseBaseQty / 1000).toFixed(2)} kg` : `${looseBaseQty} g`)
            : variant.unitType === 'volume'
              ? (looseBaseQty >= 1000 ? `${(looseBaseQty / 1000).toFixed(2)} L` : `${looseBaseQty} ml`)
              : `${looseBaseQty} pcs`)
          : variant.variantName;

        toast.success(`Sold ${product.name} — ${unitLabel}`, {
          duration: 1000,
          position: 'bottom-center',
          icon: <Check className="w-4 h-4 text-green-500" />
        });

        // Update local product with returned data
        if (result.product) {
          setProducts(prev => prev.map(p =>
            p.id === product.id ? { ...result.product!, id: p.id } : p
          ));
        } else {
          // Fallback: refresh
          setProducts(prev => prev.map(p =>
            p.id === product.id ? { ...p, stock: result.newStock } : p
          ));
        }
      }
    } catch (error: any) {
      const errorMsg = error?.message || '';
      if (errorMsg.includes('Insufficient stock') || errorMsg.includes('Out of stock')) {
        toast.error(`${product.name} — ${variant.variantName} is out of stock`, {
          duration: 1500,
          position: 'bottom-center',
          icon: <AlertCircle className="w-4 h-4 text-red-500" />
        });
      } else if (!navigator.onLine || errorMsg === 'Failed to fetch' || errorMsg === 'Request timeout') {
        const queue = JSON.parse(localStorage.getItem('express_offline_queue') || '[]');
        queue.push({
          productId: product.id,
          variantId: variant.id,
          quantity: 1,
          looseQuantityInBaseUnit: looseBaseQty || null,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('express_offline_queue', JSON.stringify(queue));
        toast.success(`Sold ${product.name} — ${variant.variantName} (Offline)`, {
          duration: 1000,
          position: 'bottom-center',
          icon: <Check className="w-4 h-4 text-orange-500" />
        });
      } else {
        toast.error(`Sale failed: ${errorMsg}`, { duration: 2000, position: 'bottom-center' });
      }
    } finally {
      setProcessingItems(prev => {
        const next = new Set(prev);
        next.delete(processingKey);
        return next;
      });
      setIsVariantSelectOpen(false);
      setVariantSelectProduct(null);
      setLooseQty('');
    }
  };

  // Execute a legacy (non-variant) sale
  const executeLegacySale = async (product: Product) => {
    if (navigator.vibrate) navigator.vibrate(50);
    const processingKey = `${product.id}`;
    setProcessingItems(prev => new Set(prev).add(processingKey));

    try {
      const result = await expressApi.recordSale(product.id, 1);
      
      if (result.success) {
        toast.success(`Sold 1 ${product.name}`, {
          duration: 1000,
          position: 'bottom-center',
          icon: <Check className="w-4 h-4 text-green-500" />
        });
        
        setProducts(prev => prev.map(p => 
          p.id === product.id ? { ...p, stock: result.newStock } : p
        ));
      }
    } catch (error: any) {
      const errorMsg = error?.message || '';
      if (errorMsg.includes('Out of stock') || errorMsg.includes('Insufficient stock')) {
        toast.error(`${product.name} is out of stock`, {
          duration: 1500,
          position: 'bottom-center',
          icon: <AlertCircle className="w-4 h-4 text-red-500" />
        });
        setProducts(prev => prev.map(p =>
          p.id === product.id ? { ...p, stock: 0 } : p
        ));
        return;
      }

      if (!navigator.onLine || errorMsg === 'Failed to fetch' || errorMsg === 'Request timeout') {
        const queue = JSON.parse(localStorage.getItem('express_offline_queue') || '[]');
        queue.push({ productId: product.id, quantity: 1, timestamp: new Date().toISOString() });
        localStorage.setItem('express_offline_queue', JSON.stringify(queue));

        setProducts(prev => prev.map(p =>
          p.id === product.id ? { ...p, stock: Math.max(0, p.stock - 1) } : p
        ));

        toast.success(`Sold 1 ${product.name} (Offline)`, {
          duration: 1000,
          position: 'bottom-center',
          icon: <Check className="w-4 h-4 text-orange-500" />
        });
      } else {
        toast.error(`Sale failed: ${errorMsg}`, {
          duration: 2000,
          position: 'bottom-center',
        });
      }
    } finally {
      setProcessingItems(prev => {
        const next = new Set(prev);
        next.delete(processingKey);
        return next;
      });
    }
  };

  const pinnedProducts = pinnedItemIds
    .map(id => products.find(p => p.id === id))
    .filter(Boolean) as Product[];

  const availableProducts = products.filter(p => 
    !pinnedItemIds.includes(p.id) && 
    (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={cn(
      embedded ? "w-full mt-6" : "fixed inset-0 bg-[#F5F9FC] z-50 flex flex-col"
    )}>
      {/* Header - Only show if not embedded */}
      {!embedded && (
      <header className="bg-white border-b border-[#0F4C81]/10 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="font-bold text-[#0F4C81] text-lg leading-tight">Express Mode</h1>
            <p className="text-xs text-muted-foreground">Tap to sell instantly</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isEditMode ? (
            <Button size="sm" onClick={saveConfig} className="bg-green-600 hover:bg-green-700 text-white">
              <Check className="w-4 h-4 mr-1" /> Done
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setIsEditMode(true)} className="border-[#0F4C81]/20 text-[#0F4C81]">
              <Settings className="w-4 h-4 mr-1" /> Edit Items
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={onExit} className="text-gray-500 hover:text-red-500">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </header>
      )}

      {/* Embedded Header / Controls */}
      {embedded && (
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="font-bold text-[#0F4C81] flex items-center gap-2">
            <Zap className="w-4 h-4 fill-current text-amber-500" />
            Instant Sell
          </h3>
          {isEditMode ? (
            <Button size="xs" onClick={saveConfig} className="h-7 bg-green-600 text-white text-xs">
              <Check className="w-3 h-3 mr-1" /> Done
            </Button>
          ) : (
            <Button size="xs" variant="ghost" onClick={() => setIsEditMode(true)} className="h-7 text-[#0F4C81] text-xs hover:bg-blue-50">
              <Settings className="w-3 h-3 mr-1" /> Edit
            </Button>
          )}
        </div>
      )}

      {/* Main Grid */}
      <div className={cn("flex-1 overflow-y-auto", !embedded && "p-4")}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-[#0F4C81]/20 border-t-[#0F4C81] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Active Express Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {pinnedProducts.map((product, index) => {
                const effectiveStock = getEffectiveStock(product);
                const stockInfo = getStockDisplay(product);
                const displayPrice = getDisplayPrice(product);
                const activeVars = getActiveVariants(product);
                const hasMultipleVariants = product.hasVariants && activeVars.length > 1;
                const processingKey = `${product.id}`;
                const isProcessing = processingItems.has(processingKey) || 
                  activeVars.some(v => processingItems.has(`${product.id}-${v.id}`));

                return (
                  <motion.button
                    key={`${product.id}-${index}`}
                    whileTap={{ scale: effectiveStock <= 0 && !isEditMode ? 1 : 0.95 }}
                    onClick={() => isEditMode ? handlePinToggle(product.id) : handleTap(product)}
                    className={cn(
                      "relative aspect-square rounded-2xl p-4 flex flex-col items-center justify-center gap-3 text-center transition-all shadow-md",
                      "bg-white border-2 hover:border-[#0F4C81]/30",
                      isEditMode ? "border-dashed border-gray-300" : "border-transparent",
                      isProcessing ? "ring-2 ring-green-500 bg-green-50" : "",
                      effectiveStock <= 0 && !isEditMode ? "opacity-60 grayscale cursor-not-allowed" : ""
                    )}
                  >
                    {isEditMode && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                        <Minus className="w-4 h-4" />
                      </div>
                    )}
                    
                    {/* Variant badge */}
                    {hasMultipleVariants && !isEditMode && (
                      <div className="absolute top-2 left-2 flex items-center gap-0.5 px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                        <Package className="w-3 h-3" />
                        <span className="text-[9px] font-semibold">{activeVars.length}</span>
                      </div>
                    )}

                    <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                      {product.imageUrl ? (
                        <ImageWithFallback src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-gray-900 leading-tight line-clamp-2">{product.name}</h3>
                      <p className="text-[#0F4C81] font-bold mt-1">{displayPrice}</p>
                      {hasMultipleVariants && !isEditMode && (
                        <span className="text-[9px] text-gray-400 flex items-center justify-center gap-0.5 mt-0.5">
                          Tap to choose <ChevronRight className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>

                    {/* Stock Indicator */}
                    <div className={cn(
                      "absolute bottom-2 right-2 text-[10px] font-medium px-2 py-0.5 rounded-full",
                      stockInfo.color
                    )}>
                      {stockInfo.text}
                    </div>
                  </motion.button>
                );
              })}

              {/* Add Placeholder (only in edit mode) */}
              {isEditMode && (
                <div className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
                  <Plus className="w-8 h-8 mb-2" />
                  <span className="text-sm">Add Items below</span>
                </div>
              )}
            </div>

            {/* Selection Area (Edit Mode Only) */}
            {isEditMode && (
              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Search className="w-4 h-4" /> Add items to Express Grid
                </h3>
                <Input 
                  placeholder="Search to add..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mb-4 bg-white"
                />
                
                {/* Suggestions */}
                {suggestions.length > 0 && !searchQuery && (
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-[#0F4C81] uppercase tracking-wider mb-3">Suggested for you</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {suggestions
                        .map(id => products.find(prod => prod.id === id))
                        .filter((p): p is Product => !!p && !pinnedItemIds.includes(p.id))
                        .map(p => (
                          <div 
                            key={p.id}
                            onClick={() => handlePinToggle(p.id)}
                            className="bg-white p-3 rounded-lg border border-[#0F4C81]/10 flex items-center gap-3 cursor-pointer hover:bg-blue-50"
                          >
                            <Plus className="w-4 h-4 text-[#0F4C81]" />
                            <div className="text-left overflow-hidden">
                              <p className="font-medium text-sm truncate">{p.name}</p>
                              <p className="text-xs text-gray-500">{getDisplayPrice(p)}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {availableProducts.slice(0, 20).map(product => {
                    const activeVars = getActiveVariants(product);
                    const hasVars = product.hasVariants && activeVars.length > 0;
                    return (
                      <div 
                        key={product.id}
                        onClick={() => handlePinToggle(product.id)}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 cursor-pointer hover:border-[#0F4C81]/30"
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                           {product.imageUrl ? (
                              <ImageWithFallback src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                           ) : <Package className="w-5 h-5 m-auto text-gray-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{product.name}</p>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-500">{getDisplayPrice(product)}</span>
                            {hasVars && (
                              <span className="text-[9px] px-1 py-0.5 bg-purple-50 text-purple-600 rounded font-medium">
                                {activeVars.length} variant{activeVars.length > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-[#0F4C81]">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Variant Selection Dialog */}
      <Dialog open={isVariantSelectOpen} onOpenChange={(open) => { if (!open) { setIsVariantSelectOpen(false); setVariantSelectProduct(null); setLooseQty(''); } }}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden bg-white">
          <div className="bg-gradient-to-r from-[#0F4C81] to-[#1a6bb5] px-5 py-4 text-white">
            <DialogHeader>
              <DialogTitle className="text-white text-base">
                Quick Sell — Select Variant
              </DialogTitle>
              <DialogDescription className="text-blue-100 text-sm">
                {variantSelectProduct?.name} — Tap a variant to sell instantly
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-4 space-y-2 max-h-[50vh] overflow-y-auto">
            {variantSelectProduct?.variants?.filter((v: ProductVariant) => v.isActive !== false).map((variant: ProductVariant) => {
              const unitType = variant.unitType || 'count';
              const baseLabel = unitType === 'weight' ? 'g' : unitType === 'volume' ? 'ml' : 'pcs';
              const stockBase = variant.stockInBaseUnit || 0;
              const stockDisplay = unitType === 'weight' && stockBase >= 1000
                ? `${(stockBase / 1000).toFixed(1)} kg`
                : unitType === 'volume' && stockBase >= 1000
                  ? `${(stockBase / 1000).toFixed(1)} L`
                  : `${stockBase} ${baseLabel}`;
              const packLabel = variant.isLoose
                ? 'Loose'
                : unitType === 'weight' && variant.packSizeInBaseUnit >= 1000
                  ? `${variant.packSizeInBaseUnit / 1000} kg`
                  : unitType === 'volume' && variant.packSizeInBaseUnit >= 1000
                    ? `${variant.packSizeInBaseUnit / 1000} L`
                    : `${variant.packSizeInBaseUnit} ${baseLabel}`;
              const packs = variant.isLoose ? null : Math.floor(stockBase / (variant.packSizeInBaseUnit || 1));
              const outOfStock = !variant.isLoose && (packs === null || packs <= 0);
              const looseOutOfStock = variant.isLoose && stockBase <= 0;
              const isDisabled = outOfStock || looseOutOfStock;
              const isProcessing = processingItems.has(`${variantSelectProduct?.id}-${variant.id}`);

              return (
                <div
                  key={variant.id}
                  className={cn(
                    "rounded-xl border p-3 transition-all",
                    isDisabled ? "opacity-50 bg-gray-50" : "hover:border-[#0F4C81]/40 hover:shadow-sm cursor-pointer bg-white",
                    isProcessing ? "ring-2 ring-green-400 bg-green-50" : ""
                  )}
                >
                  <div
                    className="flex items-center gap-3"
                    onClick={() => {
                      if (isDisabled || variant.isLoose) return;
                      if (variantSelectProduct) {
                        executeVariantSale(variantSelectProduct, variant);
                      }
                    }}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                      variant.isLoose ? "bg-green-100 text-green-700" : "bg-[#0F4C81]/10 text-[#0F4C81]"
                    )}>
                      <Package className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{variant.variantName}</p>
                      <p className="text-xs text-gray-500">
                        {packLabel} &middot; Stock: {stockDisplay}
                        {packs !== null && !variant.isLoose && <span> ({packs} packs)</span>}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-green-700">₹{variant.sellingPrice}</p>
                      {variant.isLoose && <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">Loose</span>}
                      {isDisabled && <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">Out</span>}
                      {!isDisabled && !variant.isLoose && (
                        <span className="text-[10px] text-blue-500 flex items-center justify-end gap-0.5 mt-0.5">
                          Tap to sell <Zap className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Loose quantity input */}
                  {variant.isLoose && !looseOutOfStock && (
                    <div className="mt-2 flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="text-[10px] text-gray-500 block mb-1">
                          Enter quantity ({baseLabel})
                        </label>
                        <input
                          type="number"
                          placeholder={`e.g., ${unitType === 'weight' ? '500' : unitType === 'volume' ? '250' : '5'}`}
                          value={looseQty}
                          onChange={e => setLooseQty(e.target.value)}
                          className="w-full h-8 px-2 rounded border border-gray-200 text-sm"
                          min="1"
                          onClick={e => e.stopPropagation()}
                        />
                      </div>
                      <Button
                        size="sm"
                        className="h-8 bg-green-600 hover:bg-green-700 text-white text-xs"
                        disabled={!looseQty || parseFloat(looseQty) <= 0 || isProcessing}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (variantSelectProduct && looseQty) {
                            executeVariantSale(variantSelectProduct, variant, parseFloat(looseQty));
                          }
                        }}
                      >
                        {isProcessing ? (
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <span>Sell Loose</span>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="border-t p-3">
            <Button variant="outline" className="w-full" onClick={() => { setIsVariantSelectOpen(false); setVariantSelectProduct(null); setLooseQty(''); }}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
