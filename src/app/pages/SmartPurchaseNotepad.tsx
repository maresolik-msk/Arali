import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { 
  Mic, 
  Send, 
  PackagePlus, 
  Trash2, 
  Plus, 
  ArrowRight, 
  Loader2, 
  Sparkles,
  ArrowLeft,
  Search,
  Check,
  Store,
  AlertTriangle,
  Info,
  Edit2,
  Save,
  Package,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router';
import { aiApi, productsApi, purchasesApi, vendorsApi } from '../services/api';
import type { Product, ProductVariant, Vendor, PurchaseItem, Purchase } from '../data/dashboardData';
import { QuickAddProductModal } from '../components/QuickAddProductModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { cn } from '../components/ui/utils';

interface PurchaseItemUI extends PurchaseItem {
  id: string; // temp id for UI
  confidence: number;
  originalText?: string;
  isNew?: boolean;
}

// ── Variant helpers ──

function getActiveVariants(product: Product): ProductVariant[] {
  return (product.variants || []).filter((v: ProductVariant) => v.isActive !== false);
}

/** Convert a user-entered quantity + unit string into base units (g/ml/pcs) */
function toBaseUnits(qty: number, unit: string, unitType?: string): number {
  const u = unit.toLowerCase().trim();
  if (['kg', 'kgs'].includes(u)) return qty * 1000;
  if (['g', 'gm', 'gms', 'gram', 'grams'].includes(u)) return qty;
  if (['l', 'ltr', 'litre', 'litres', 'liter', 'liters'].includes(u)) return qty * 1000;
  if (['ml', 'millilitre'].includes(u)) return qty;
  // For count-based or generic "pcs", "packets", "boxes" etc.
  return qty; // assume 1:1
}

/** Format base units into a human-readable label */
function formatBaseUnits(baseQty: number, unitType: string): string {
  if (unitType === 'weight') {
    return baseQty >= 1000 ? `${(baseQty / 1000).toFixed(baseQty % 1000 === 0 ? 0 : 1)} kg` : `${baseQty} g`;
  }
  if (unitType === 'volume') {
    return baseQty >= 1000 ? `${(baseQty / 1000).toFixed(baseQty % 1000 === 0 ? 0 : 1)} L` : `${baseQty} ml`;
  }
  return `${baseQty} pcs`;
}

export function SmartPurchaseNotepad() {
  const navigate = useNavigate();
  const [note, setNote] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState<string>('');
  
  // Parsed State
  const [parsedItems, setParsedItems] = useState<PurchaseItemUI[]>([]);
  const [detectedLanguage, setDetectedLanguage] = useState<'en' | 'te' | 'mixed'>('en');
  const [ambiguityQuestion, setAmbiguityQuestion] = useState<string | null>(null);
  
  const [showVendorSelect, setShowVendorSelect] = useState(false);
  
  // Confirmation State
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Query State
  const [queryResults, setQueryResults] = useState<Purchase[]>([]);
  const [showQueryResults, setShowQueryResults] = useState(false);

  // Edit Item State
  const [editingItem, setEditingItem] = useState<PurchaseItemUI | null>(null);
  const [editForm, setEditForm] = useState({
    productName: '',
    quantity: '',
    unit: 'pcs',
    costPrice: '',
    expiryDate: '',
    // New product specific
    category: 'General',
    sellingPrice: '',
    sku: '',
    addToInventory: true,
    // Variant fields
    variantId: '' as string,
    variantName: '' as string,
  });

  // Suggestions State
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Quick Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [itemToCreate, setItemToCreate] = useState<{ id: string; name: string } | null>(null);

  // Variant Picker State
  const [variantPickerItemId, setVariantPickerItemId] = useState<string | null>(null);
  const [showVariantPicker, setShowVariantPicker] = useState(false);

  // Load context
  useEffect(() => {
    async function loadData() {
      try {
        const [prods, vends] = await Promise.all([
          productsApi.getAll(),
          vendorsApi.getAll()
        ]);
        setProducts(prods || []);
        setVendors(vends || []);
      } catch (err) {
        console.error('Failed to load data', err);
      }
    }
    loadData();
  }, []);

  // Suggestions Logic
  useEffect(() => {
    if (!textareaRef.current) return;
    
    const cursorPosition = textareaRef.current.selectionStart;
    const textBeforeCursor = note.slice(0, cursorPosition);
    const words = textBeforeCursor.split(/\s+/);
    const currentWord = words[words.length - 1];

    if (currentWord.length > 1) {
      const matches = products.filter(p => 
        p.name.toLowerCase().includes(currentWord.toLowerCase())
      ).slice(0, 5);
      setSuggestions(matches);
      setActiveSuggestionIndex(0);
    } else {
      setSuggestions([]);
    }
  }, [note, products]);

  const insertSuggestion = (product: Product) => {
    if (!textareaRef.current) return;
    
    const cursorPosition = textareaRef.current.selectionStart;
    const textBeforeCursor = note.slice(0, cursorPosition);
    const textAfterCursor = note.slice(cursorPosition);
    
    const words = textBeforeCursor.split(/\s+/);
    const currentWord = words[words.length - 1];
    
    const newTextBeforeCursor = textBeforeCursor.slice(0, -currentWord.length) + product.name + ' ';
    const newNote = newTextBeforeCursor + textAfterCursor;
    
    setNote(newNote);
    setSuggestions([]);
    
    // Restore focus and cursor
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newTextBeforeCursor.length, newTextBeforeCursor.length);
      }
    }, 0);
  };

  const openEditDialog = (item: PurchaseItemUI) => {
    setEditingItem(item);
    setEditForm({
      productName: item.productName,
      quantity: item.quantity.toString(),
      unit: item.unit,
      costPrice: item.costPrice.toString(),
      expiryDate: item.expiryDate || '',
      category: 'General',
      sellingPrice: (item.costPrice * 1.4).toFixed(2), // 40% margin default
      sku: '',
      addToInventory: !item.productId, // Default to true if new
      variantId: item.variantId || '',
      variantName: item.variantName || '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      let finalProductId = editingItem.productId;
      const finalCost = parseFloat(editForm.costPrice) || 0;
      const finalQty = parseFloat(editForm.quantity) || 1;

      // Create new product if needed
      if (!finalProductId && editForm.addToInventory) {
        // Validation
        if (!editForm.productName) {
            toast.error("Product name is required");
            return;
        }

        const newProduct: Product = {
            id: Date.now(),
            name: editForm.productName,
            sku: editForm.sku || `SKU-${Date.now().toString().slice(-6)}`,
            category: editForm.category || 'General',
            stock: 0, // Stock will be added by the purchase logic later
            price: parseFloat(editForm.sellingPrice) || (finalCost * 1.4),
            costPrice: finalCost,
            sellingPrice: parseFloat(editForm.sellingPrice) || (finalCost * 1.4),
            expiryDate: editForm.expiryDate || undefined,
            alertEnabled: true,
            threshold: 5,
            vendorType: vendors.find(v => v.id.toString() === selectedVendorId)?.name || 'Unknown',
            unitsSold: 0,
            revenue: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const created = await productsApi.add(newProduct);
        finalProductId = created.id;
        
        // Update local products list so future lookups work
        setProducts(prev => [...prev, created]);
        toast.success(`Created product: ${created.name}`);
      }

      // Resolve variant fields from editForm
      let finalVariantId: string | undefined = editForm.variantId || undefined;
      let finalVariantName: string | undefined = editForm.variantName || undefined;
      let finalRestockBase: number | undefined;

      if (finalVariantId && finalProductId) {
        const prod = products.find(p => p.id === finalProductId);
        if (prod) {
          const v = getActiveVariants(prod).find(va => va.id === finalVariantId);
          if (v) {
            finalVariantName = v.variantName;
            finalRestockBase = toBaseUnits(finalQty, editForm.unit, v.unitType);
          }
        }
      }

      // Update parsedItems
      setParsedItems(prev => prev.map(item => 
        item.id === editingItem.id ? {
            ...item,
            productId: finalProductId || null,
            productName: editForm.productName,
            quantity: finalQty,
            unit: editForm.unit,
            costPrice: finalCost,
            totalCost: finalQty * finalCost,
            expiryDate: editForm.expiryDate,
            isNew: !finalProductId,
            variantId: finalVariantId,
            variantName: finalVariantName,
            restockInBaseUnit: finalRestockBase,
        } : item
      ));

      setEditingItem(null);
      toast.success("Item updated");

    } catch (error) {
        console.error("Failed to save edit:", error);
        toast.error("Failed to update item");
    }
  };

  // Speech Recognition
  const recognitionRef = useRef<any>(null);
  
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNote(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast.error('Could not hear you. Please try again.');
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const handleParse = async () => {
    if (!note.trim()) return;
    
    // Check for query intent (what did we buy?)
    const lowerNote = note.toLowerCase();
    const isQuery = 
        (lowerNote.includes('what') || lowerNote.includes('show') || lowerNote.includes('list') || lowerNote.includes('history')) &&
        (lowerNote.includes('purchase') || lowerNote.includes('buy') || lowerNote.includes('bought'));

    if (isQuery) {
        await handlePurchaseQuery();
        return;
    }
    
    setIsProcessing(true);
    setAmbiguityQuestion(null);

    try {
      const result = await aiApi.parsePurchaseNote(note, products);
      setDetectedLanguage(result.language || 'en');

      if (result.ambiguity_detected && result.clarification_question) {
          setAmbiguityQuestion(result.clarification_question);
          setIsProcessing(false);
          return;
      }
      
      const newItems: PurchaseItemUI[] = result.items.map((item: any) => {
        let matchedProduct = null;
        if (item.productId) {
           // AI returned a specific product ID — find exact match
           matchedProduct = products.find(p => String(p.id) === String(item.productId));
        }
        if (!matchedProduct && item.productName) {
           // Fuzzy name matching: check both directions (product name includes item name OR item name includes product name)
           const itemNameLower = item.productName.toLowerCase().trim();
           matchedProduct = products.find(p => {
             const prodNameLower = p.name.toLowerCase().trim();
             return prodNameLower === itemNameLower ||
                    prodNameLower.includes(itemNameLower) ||
                    itemNameLower.includes(prodNameLower);
           });
        }

        // ── Auto-detect variant for matched products ──
        let autoVariantId: string | undefined;
        let autoVariantName: string | undefined;
        let autoRestockBase: number | undefined;

        if (matchedProduct && matchedProduct.hasVariants) {
          const activeVars = getActiveVariants(matchedProduct);
          if (activeVars.length === 1) {
            // Single variant: auto-select
            const v = activeVars[0];
            autoVariantId = v.id;
            autoVariantName = v.variantName;
            const baseQty = toBaseUnits(item.quantity, item.unit || 'pcs', v.unitType);
            autoRestockBase = baseQty;
          }
          // Multi-variant: leave unset — user will pick in confirmation
        }

        return {
          id: Math.random().toString(36).substr(2, 9),
          productId: matchedProduct?.id || null,
          productName: matchedProduct ? matchedProduct.name : item.productName,
          quantity: item.quantity,
          unit: item.unit || 'pcs',
          costPrice: item.costPrice || matchedProduct?.costPrice || 0,
          totalCost: item.totalCost || (item.quantity * (item.costPrice || matchedProduct?.costPrice || 0)),
          expiryDate: item.expiryDate || matchedProduct?.expiryDate || undefined,
          confidence: item.confidence || 0.8,
          originalText: item.originalText,
          isNew: !matchedProduct,
          variantId: autoVariantId,
          variantName: autoVariantName,
          restockInBaseUnit: autoRestockBase,
        };
      });

      setParsedItems(newItems);
      setNote(''); 
      setShowConfirmation(true); // Show confirmation dialog
    } catch (error) {
      console.error('Parsing error:', error);
      toast.error('Failed to process note. Try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePurchaseQuery = async () => {
    setIsProcessing(true);
    try {
        const allPurchases = await purchasesApi.getAll();
        
        // Filter logic could be enhanced with AI to parse date ranges, but starting with "today" as default
        // or just showing recent if no specific date mentioned.
        // For "what we purchased today", we filter by today.
        
        const today = new Date();
        today.setHours(0,0,0,0);
        
        const filtered = allPurchases.filter(p => {
            const pDate = new Date(p.createdAt);
            // If user specifically asked for today
            if (note.toLowerCase().includes('today')) {
                return pDate >= today;
            }
            // Default: Show last 7 days or 10 items
            return true; 
        }).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);

        if (filtered.length === 0) {
            toast.info("No purchases found for the specified period.");
        } else {
            setQueryResults(filtered);
            setShowQueryResults(true);
            setNote(''); 
        }
    } catch (e) {
        console.error("Query failed", e);
        toast.error("Failed to fetch purchase history");
    } finally {
        setIsProcessing(false);
    }
  };

  const handleRemoveItem = (id: string) => {
    setParsedItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof PurchaseItemUI, value: any) => {
    setParsedItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        // Recalculate totals if qty or cost changes
        if (field === 'quantity' || field === 'costPrice') {
            updated.totalCost = updated.quantity * updated.costPrice;
        }
        return updated;
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    return parsedItems.reduce((sum, item) => sum + item.totalCost, 0);
  };

  const handleConfirmPurchase = async () => {
    if (parsedItems.length === 0) return;
    
    // Show processing indicator if possible (reusing isProcessing for UI feedback)
    setIsProcessing(true);

    try {
      const selectedVendor = vendors.find(v => v.id.toString() === selectedVendorId);

      // 1. Pre-process items: Create new products sequentially to avoid race conditions
      const finalItems: PurchaseItemUI[] = [];
      let productCreationFailed = false;

      for (const item of parsedItems) {
        if (!item.productId) {
           // Auto-create product
           const finalCost = item.costPrice || 0;
           const newProduct: Product = {
                id: Date.now() + Math.floor(Math.random() * 1000), 
                name: item.productName,
                sku: `SKU-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 100)}`,
                category: 'General',
                stock: 0, // Stock will be updated by the purchase endpoint
                price: finalCost * 1.4, // Default selling price 
                costPrice: finalCost,
                sellingPrice: finalCost * 1.4,
                expiryDate: item.expiryDate || undefined,
                alertEnabled: true,
                threshold: 5,
                vendorType: selectedVendor ? selectedVendor.name : 'Unknown',
                unitsSold: 0,
                revenue: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            try {
                const created = await productsApi.add(newProduct);
                console.log(`[Purchase] Created product "${created.name}" with id=${created.id}`);
                setProducts(prev => [...prev, created]);
                
                finalItems.push({
                    ...item,
                    productId: created.id,
                    isNew: false
                });
            } catch (err: any) {
                console.error("Failed to auto-create product:", item.productName, err);
                toast.error(`Failed to create "${item.productName}": ${err.message || 'Unknown error'}`);
                productCreationFailed = true;
                // Still include the item but flag it — purchase will still record it
                finalItems.push(item);
            }
        } else {
            finalItems.push(item);
        }
      }

      // Warn user if some products could not be created
      if (productCreationFailed) {
        toast.warning('Some new products could not be created. They will be recorded in the purchase but stock will not be tracked for them.');
      }

      // 2. Compute total from final items (may have been edited)
      const purchaseTotal = finalItems.reduce((sum, item) => sum + (item.totalCost || 0), 0);

      // 3. Create Purchase Record — only include PurchaseItem fields
      const purchase = {
          id: `PUR-${Date.now()}`,
          vendorId: selectedVendor ? selectedVendor.id : undefined,
          vendorName: selectedVendor ? selectedVendor.name : 'Unknown Vendor',
          items: finalItems.map(({ id, isNew, confidence, originalText, ...rest }) => rest),
          totalAmount: purchaseTotal,
          createdAt: new Date(),
          notes: 'Added via Smart Purchase Notepad'
      };

      console.log('[Purchase] Submitting purchase:', purchase.id, 'with', purchase.items.length, 'items');
      
      // Log each item for debugging
      purchase.items.forEach((item, idx) => {
        console.log(`[Purchase] Item ${idx + 1}: productId=${item.productId}, name="${item.productName}", qty=${item.quantity}, cost=${item.costPrice}, variant=${item.variantId || 'none'}, variantName=${item.variantName || '-'}, restockBase=${item.restockInBaseUnit || '-'}`);
      });

      await purchasesApi.add(purchase);

      const msg = detectedLanguage === 'te' ? 'కొనుగోలు విజయవంతంగా నమోదైంది' : 'Purchase recorded! Stock updated.';
      toast.success(msg);
      
      setParsedItems([]);
      setShowConfirmation(false);
      navigate('/dashboard/inventory');
    } catch (error: any) {
      console.error('Purchase error:', error);
      toast.error(`Failed to record purchase: ${error.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Variant Picker Logic ──
  const openVariantPicker = (itemId: string) => {
    setVariantPickerItemId(itemId);
    setShowVariantPicker(true);
  };

  const handleSelectVariant = (variant: ProductVariant, item: PurchaseItemUI) => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return;

    const baseQty = toBaseUnits(item.quantity, item.unit, variant.unitType);

    setParsedItems(prev => prev.map(it => {
      if (it.id === item.id) {
        return {
          ...it,
          variantId: variant.id,
          variantName: variant.variantName,
          restockInBaseUnit: baseQty,
          // Update cost from variant if available and item has no custom cost
          costPrice: it.costPrice || variant.costPrice || 0,
          totalCost: it.quantity * (it.costPrice || variant.costPrice || 0),
        };
      }
      return it;
    }));

    setShowVariantPicker(false);
    setVariantPickerItemId(null);
    toast.success(`Selected variant: ${variant.variantName}`);
  };

  const clearVariantSelection = (itemId: string) => {
    setParsedItems(prev => prev.map(it => {
      if (it.id === itemId) {
        return {
          ...it,
          variantId: undefined,
          variantName: undefined,
          restockInBaseUnit: undefined,
        };
      }
      return it;
    }));
  };

  /** Get the matched product for a PurchaseItemUI */
  const getItemProduct = (item: PurchaseItemUI): Product | undefined => {
    if (!item.productId) return undefined;
    return products.find(p => p.id === item.productId);
  };

  const handleCreateProduct = (item: PurchaseItemUI) => {
    setItemToCreate({ id: item.id, name: item.productName });
    setShowAddModal(true);
  };

  const handleProductCreated = (newProduct: Product) => {
    setProducts(prev => [...prev, newProduct]);
    
    if (itemToCreate) {
      setParsedItems(prev => prev.map(item => {
        if (item.id === itemToCreate.id) {
          return {
            ...item,
            productId: newProduct.id,
            productName: newProduct.name,
            costPrice: newProduct.costPrice || item.costPrice,
            totalCost: item.quantity * (newProduct.costPrice || item.costPrice),
            isNew: false
          };
        }
        return item;
      }));
    }
    setItemToCreate(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      

      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* Input Area */}
        <div className="bg-white rounded-2xl shadow-sm border p-4">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
            What did you buy?
          </label>
          
          {ambiguityQuestion ? (
              <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                          <p className="text-sm font-medium text-amber-800">{ambiguityQuestion}</p>
                          <p className="text-xs text-amber-600 mt-1">Please clarify specifically.</p>
                      </div>
                  </div>
              </div>
          ) : null}

          <div className="relative">
            <textarea
              ref={textareaRef}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. 50kg rice at 45/kg, 20 packets milk..."
              className="w-full min-h-[80px] p-3 pr-12 text-lg bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#0F4C81]/20 resize-none placeholder:text-gray-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleParse();
                } else if (e.key === 'Tab' && suggestions.length > 0) {
                   e.preventDefault();
                   insertSuggestion(suggestions[activeSuggestionIndex]);
                }
              }}
            />
            <button
              onClick={toggleListening}
              className={`absolute right-3 bottom-3 p-2 rounded-full transition-all ${
                isListening 
                  ? 'bg-red-100 text-red-600 animate-pulse' 
                  : 'bg-white shadow-sm text-gray-400 hover:text-[#0F4C81]'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                    {suggestions.map((product, idx) => (
                        <div 
                            key={`${product.id}-${idx}`}
                            className={`p-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center ${idx === activeSuggestionIndex ? 'bg-blue-50' : ''}`}
                            onClick={() => insertSuggestion(product)}
                            onMouseEnter={() => setActiveSuggestionIndex(idx)}
                        >
                            <span className="font-medium text-sm text-gray-800">{product.name}</span>
                            <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                        </div>
                    ))}
                </div>
            )}
          </div>
          
          <div className="mt-3 flex justify-end">
            <Button 
              onClick={handleParse} 
              disabled={!note.trim() || isProcessing}
              className="bg-[#0F4C81] hover:bg-[#0d3f6a] text-white rounded-full px-6"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Parse List
                </>
              )}
            </Button>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white">
          <div className="bg-[#0F4C81] p-4 text-white">
              <DialogTitle className="flex items-center gap-2 text-white">
                  <Check className="w-5 h-5" />
                  Confirm Purchase
              </DialogTitle>
              <DialogDescription className="text-blue-100">
                  Verify items and vendor before adding to stock.
              </DialogDescription>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Vendor Selector */}
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-gray-500" />
              <select
                value={selectedVendorId}
                onChange={(e) => setSelectedVendorId(e.target.value)}
                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81]"
              >
                <option value="">Select Vendor (optional)</option>
                {vendors.map(v => (
                  <option key={v.id} value={v.id.toString()}>{v.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {parsedItems.map((item, idx) => {
                  const itemProduct = getItemProduct(item);
                  const activeVars = itemProduct ? getActiveVariants(itemProduct) : [];
                  const hasVariants = itemProduct?.hasVariants && activeVars.length > 0;
                  const needsVariantSelection = hasVariants && !item.variantId;
                  const selectedVariant = item.variantId ? activeVars.find(v => v.id === item.variantId) : null;

                  return (
                    <div key={idx} className={cn(
                      "flex flex-col gap-2 p-3 rounded-lg border",
                      item.isNew ? 'bg-amber-50 border-amber-200' : needsVariantSelection ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-100'
                    )}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-gray-900">{item.productName}</p>
                            {item.isNew && <span className="text-[10px] text-amber-600 bg-amber-100 px-1 rounded">New Product</span>}
                            {hasVariants && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium flex items-center gap-0.5">
                                <Package className="w-2.5 h-2.5" /> {activeVars.length} variant{activeVars.length > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">"{item.originalText}"</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1 flex-shrink-0">
                          <span className="font-bold">{item.quantity} {item.unit}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => openEditDialog(item)}
                          >
                            <Edit2 className="w-3 h-3 mr-1" /> Edit
                          </Button>
                        </div>
                      </div>

                      {/* ── Variant Selection Row ── */}
                      {hasVariants && (
                        <div className="flex items-center gap-2">
                          {selectedVariant ? (
                            <div className="flex items-center gap-2 flex-1">
                              <div className={cn(
                                "flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium flex-1",
                                selectedVariant.isLoose ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                              )}>
                                <Package className="w-3 h-3" />
                                <span>{selectedVariant.variantName}</span>
                                {item.restockInBaseUnit != null && (
                                  <span className="text-[10px] opacity-70 ml-1">
                                    ({formatBaseUnits(item.restockInBaseUnit, selectedVariant.unitType || 'count')})
                                  </span>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-1.5 text-purple-600 hover:text-purple-700 hover:bg-purple-50 text-[10px]"
                                onClick={() => openVariantPicker(item.id)}
                              >
                                Change
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full h-7 text-xs border-purple-300 text-purple-700 hover:bg-purple-50 gap-1"
                              onClick={() => openVariantPicker(item.id)}
                            >
                              <Package className="w-3 h-3" />
                              Select Variant
                              <ChevronRight className="w-3 h-3 ml-auto" />
                            </Button>
                          )}
                        </div>
                      )}

                      <div className="flex justify-between items-center text-sm text-gray-500 border-t border-dashed border-gray-200 pt-2">
                        <div className="flex gap-4">
                          <span>Cost: ₹{item.costPrice}/unit</span>
                          {item.expiryDate && <span className="text-red-500 text-xs mt-0.5">Exp: {item.expiryDate}</span>}
                        </div>
                        <span className="font-semibold text-gray-700">Total: ₹{item.totalCost.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-semibold text-gray-600">Total Amount</span>
                <span className="text-xl font-bold text-[#0F4C81]">₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <DialogFooter className="p-4 bg-gray-50 flex-row gap-3">
            <Button variant="outline" onClick={() => setShowConfirmation(false)} className="flex-1" disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmPurchase} 
              className="flex-[2] bg-[#0F4C81] hover:bg-[#0d3f6a]"
              disabled={isProcessing || parsedItems.length === 0}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding to Inventory...
                </>
              ) : (
                'Confirm & Add to Stock'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Query Results Modal */}
      <Dialog open={showQueryResults} onOpenChange={setShowQueryResults}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-white">
          <div className="bg-[#0F4C81] p-4 text-white">
              <DialogTitle className="flex items-center gap-2 text-white">
                  <Search className="w-5 h-5" />
                  Purchase History
              </DialogTitle>
              <DialogDescription className="text-blue-100">
                  Found {queryResults.length} recent purchases.
              </DialogDescription>
          </div>
          
          <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
            {queryResults.map((purchase) => (
                <div key={purchase.id} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="font-bold text-[#0F4C81]">
                                {new Date(purchase.createdAt).toLocaleDateString()} 
                                <span className="text-xs font-normal text-gray-500 ml-2">
                                    {new Date(purchase.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </p>
                            <p className="text-sm text-gray-600">{purchase.vendorName || 'Unknown Vendor'}</p>
                        </div>
                        <div className="text-right">
                            <span className="font-bold">₹{purchase.totalAmount.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="space-y-1 pl-2 border-l-2 border-gray-200">
                        {purchase.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                                <span>{item.quantity} {item.unit} x {item.productName}</span>
                                <span className="text-gray-500">₹{item.totalCost}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
          </div>

          <DialogFooter className="p-4 bg-gray-50">
            <Button onClick={() => setShowQueryResults(false)} className="w-full bg-[#0F4C81]">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Purchase Item</DialogTitle>
            <DialogDescription>
              {editingItem?.isNew ? 'Define new product details for inventory.' : 'Update purchase details.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={editForm.productName}
                onChange={(e) => setEditForm({ ...editForm, productName: e.target.value })}
                className="col-span-3"
                disabled={!editingItem?.isNew} // Only edit name if it's new
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="qty" className="text-right">
                Qty
              </Label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id="qty"
                  type="number"
                  value={editForm.quantity}
                  onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                  className="flex-1"
                />
                <Input
                  value={editForm.unit}
                  onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                  className="w-20"
                  placeholder="Unit"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost" className="text-right">
                Cost (₹)
              </Label>
              <Input
                id="cost"
                type="number"
                value={editForm.costPrice}
                onChange={(e) => setEditForm({ ...editForm, costPrice: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiry" className="text-right">
                Expiry
              </Label>
              <Input
                id="expiry"
                type="date"
                value={editForm.expiryDate}
                onChange={(e) => setEditForm({ ...editForm, expiryDate: e.target.value })}
                className="col-span-3"
              />
            </div>

            {/* Variant Selector (for existing products with variants) */}
            {(() => {
              if (!editingItem || editingItem.isNew) return null;
              const editProduct = editingItem.productId ? products.find(p => p.id === editingItem.productId) : null;
              if (!editProduct?.hasVariants) return null;
              const editActiveVars = getActiveVariants(editProduct);
              if (editActiveVars.length === 0) return null;
              return (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">
                    Variant
                  </Label>
                  <div className="col-span-3">
                    <select
                      value={editForm.variantId}
                      onChange={(e) => {
                        const vId = e.target.value;
                        const v = editActiveVars.find(va => va.id === vId);
                        setEditForm({
                          ...editForm,
                          variantId: vId,
                          variantName: v?.variantName || '',
                          costPrice: v?.costPrice ? v.costPrice.toString() : editForm.costPrice,
                        });
                      }}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81]"
                    >
                      <option value="">-- Select Variant --</option>
                      {editActiveVars.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.variantName} ({v.packSizeInBaseUnit}{v.displayUnit}) - Cost: ₹{v.costPrice}
                        </option>
                      ))}
                    </select>
                    {editForm.variantId && (() => {
                      const sv = editActiveVars.find(v => v.id === editForm.variantId);
                      if (!sv) return null;
                      return (
                        <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-500">
                          <Package className="w-3 h-3" />
                          <span>Stock: {formatBaseUnits(sv.stockInBaseUnit, sv.unitType)}</span>
                          {sv.isLoose && <span className="text-green-600 font-medium">(Loose)</span>}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              );
            })()}

            {/* New Product Fields */}
            {editingItem?.isNew && (
                <>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="inventory" className="text-right">
                            Inventory
                        </Label>
                        <div className="col-span-3 flex items-center gap-2">
                            <Switch 
                                id="inventory" 
                                checked={editForm.addToInventory}
                                onCheckedChange={(c) => setEditForm({ ...editForm, addToInventory: c })}
                            />
                            <span className="text-sm text-gray-500">Add to product list</span>
                        </div>
                    </div>

                    {editForm.addToInventory && (
                        <>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="category" className="text-right">
                                    Category
                                </Label>
                                <Input
                                    id="category"
                                    value={editForm.category}
                                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                    className="col-span-3"
                                    placeholder="e.g. Groceries"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="sell" className="text-right">
                                    Sell Price
                                </Label>
                                <Input
                                    id="sell"
                                    type="number"
                                    value={editForm.sellingPrice}
                                    onChange={(e) => setEditForm({ ...editForm, sellingPrice: e.target.value })}
                                    className="col-span-3"
                                    placeholder="Recommended selling price"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="sku" className="text-right">
                                    SKU
                                </Label>
                                <Input
                                    id="sku"
                                    placeholder="Auto-generated if empty"
                                    value={editForm.sku}
                                    onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                        </>
                    )}
                </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleSaveEdit}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Variant Picker Dialog ── */}
      <Dialog open={showVariantPicker} onOpenChange={(open) => {
        if (!open) {
          setShowVariantPicker(false);
          setVariantPickerItemId(null);
        }
      }}>
        <DialogContent className="sm:max-w-sm p-0 overflow-hidden bg-white">
          {(() => {
            const pickerItem = variantPickerItemId ? parsedItems.find(it => it.id === variantPickerItemId) : null;
            const pickerProduct = pickerItem ? getItemProduct(pickerItem) : null;
            const pickerVariants = pickerProduct ? getActiveVariants(pickerProduct) : [];

            if (!pickerItem || !pickerProduct) {
              return (
                <div className="p-6 text-center text-gray-500">
                  <p>No product selected.</p>
                </div>
              );
            }

            return (
              <div>
                <div className="bg-purple-600 p-4 text-white">
                  <DialogTitle className="flex items-center gap-2 text-white">
                    <Package className="w-5 h-5" />
                    Select Variant
                  </DialogTitle>
                  <DialogDescription className="text-purple-100">
                    {pickerProduct.name} - {pickerItem.quantity} {pickerItem.unit}
                  </DialogDescription>
                </div>

                <div className="p-4 space-y-2 max-h-[350px] overflow-y-auto">
                  {pickerVariants.map(variant => {
                    const isSelected = pickerItem.variantId === variant.id;
                    const restockPreview = toBaseUnits(pickerItem.quantity, pickerItem.unit, variant.unitType);
                    return (
                      <button
                        key={variant.id}
                        onClick={() => handleSelectVariant(variant, pickerItem)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg border-2 transition-all",
                          isSelected
                            ? "border-purple-500 bg-purple-50 ring-1 ring-purple-300"
                            : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/50"
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 text-sm">{variant.variantName}</span>
                              {variant.isLoose && (
                                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">Loose</span>
                              )}
                              {isSelected && (
                                <Check className="w-4 h-4 text-purple-600" />
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              <span>Pack: {variant.packSizeInBaseUnit} {variant.displayUnit}</span>
                              <span>Cost: ₹{variant.costPrice}</span>
                              <span>Sell: ₹{variant.sellingPrice}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-100 text-xs">
                          <span className="text-gray-500">
                            Current stock: {formatBaseUnits(variant.stockInBaseUnit, variant.unitType)}
                          </span>
                          <span className="text-purple-600 font-medium">
                            Restock: +{formatBaseUnits(restockPreview, variant.unitType)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="p-3 bg-gray-50 border-t flex gap-2">
                  {pickerItem.variantId && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => {
                        clearVariantSelection(pickerItem.id);
                        setShowVariantPicker(false);
                        setVariantPickerItemId(null);
                      }}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Clear
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto text-xs"
                    onClick={() => {
                      setShowVariantPicker(false);
                      setVariantPickerItemId(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Quick Add Product Modal */}
      <QuickAddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        initialName={itemToCreate?.name || ''}
        onSuccess={handleProductCreated}
      />
    </div>
  );
}