import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Settings, 
  Plus, 
  Minus, 
  Search, 
  X, 
  Check, 
  AlertCircle,
  Package
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { expressApi, productsApi } from '../../services/api';
import { Product } from '../../data/dashboardData';
import { cn } from '../ui/utils';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ExpressModeProps {
  onExit?: () => void;
  embedded?: boolean;
}

export function ExpressMode({ onExit, embedded = false }: ExpressModeProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [pinnedItemIds, setPinnedItemIds] = useState<number[]>([]);
  const [suggestions, setSuggestions] = useState<number[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [processingItems, setProcessingItems] = useState<Set<number>>(new Set());

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
          await expressApi.recordSale(item.productId, item.quantity);
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

  const handleTap = async (product: Product) => {
    if (isEditMode) return;

    // Optimistic UI update (optional, but good for feedback)
    // We rely on toast for success feedback to keep it fast
    // and vibration if available
    if (navigator.vibrate) navigator.vibrate(50);

    setProcessingItems(prev => new Set(prev).add(product.id));

    try {
      const result = await expressApi.recordSale(product.id, 1);
      
      if (result.success) {
        toast.success(`Sold 1 ${product.name}`, {
          duration: 1000,
          position: 'bottom-center',
          icon: <Check className="w-4 h-4 text-green-500" />
        });
        
        // Update local stock
        setProducts(prev => prev.map(p => 
          p.id === product.id ? { ...p, stock: result.newStock } : p
        ));
      }
    } catch (error) {
      // Offline fallback
      const queue = JSON.parse(localStorage.getItem('express_offline_queue') || '[]');
      queue.push({ productId: product.id, quantity: 1, timestamp: new Date().toISOString() });
      localStorage.setItem('express_offline_queue', JSON.stringify(queue));
      
      // Optimistic update locally
      setProducts(prev => prev.map(p => 
        p.id === product.id ? { ...p, stock: p.stock - 1 } : p
      ));
      
      toast.success(`Sold 1 ${product.name} (Offline)`, {
        duration: 1000,
        position: 'bottom-center',
        icon: <Check className="w-4 h-4 text-orange-500" />
      });
    } finally {
      setProcessingItems(prev => {
        const next = new Set(prev);
        next.delete(product.id);
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
              {pinnedProducts.map((product, index) => (
                <motion.button
                  key={`${product.id}-${index}`}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => isEditMode ? handlePinToggle(product.id) : handleTap(product)}
                  className={cn(
                    "relative aspect-square rounded-2xl p-4 flex flex-col items-center justify-center gap-3 text-center transition-all shadow-md",
                    "bg-white border-2 hover:border-[#0F4C81]/30",
                    isEditMode ? "border-dashed border-gray-300" : "border-transparent",
                    processingItems.has(product.id) ? "ring-2 ring-green-500 bg-green-50" : ""
                  )}
                >
                  {isEditMode && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                      <Minus className="w-4 h-4" />
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
                    <p className="text-[#0F4C81] font-bold mt-1">₹{product.sellingPrice}</p>
                  </div>

                  {/* Stock Indicator */}
                  <div className={cn(
                    "absolute bottom-2 right-2 text-[10px] font-medium px-2 py-0.5 rounded-full",
                    product.stock <= 5 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
                  )}>
                    {product.stock} left
                  </div>
                </motion.button>
              ))}

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
                      {suggestions.map((id, index) => {
                        const p = products.find(prod => prod.id === id);
                        if (!p || pinnedItemIds.includes(p.id)) return null;
                        return (
                          <div 
                            key={`${p.id}-${index}`}
                            onClick={() => handlePinToggle(p.id)}
                            className="bg-white p-3 rounded-lg border border-[#0F4C81]/10 flex items-center gap-3 cursor-pointer hover:bg-blue-50"
                          >
                            <Plus className="w-4 h-4 text-[#0F4C81]" />
                            <div className="text-left overflow-hidden">
                              <p className="font-medium text-sm truncate">{p.name}</p>
                              <p className="text-xs text-gray-500">₹{p.sellingPrice}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {availableProducts.slice(0, 20).map(product => (
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
                        <p className="text-xs text-gray-500">₹{product.sellingPrice} • Stock: {product.stock}</p>
                      </div>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-[#0F4C81]">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}