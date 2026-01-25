import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Edit2
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useNavigate } from 'react-router';
import { aiApi, productsApi, purchasesApi, vendorsApi } from '../services/api';
import type { Product, Vendor, PurchaseItem } from '../data/dashboardData';
import { QuickAddProductModal } from '../components/QuickAddProductModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';

interface PurchaseItemUI extends PurchaseItem {
  id: string; // temp id for UI
  confidence: number;
  originalText?: string;
  isNew?: boolean;
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

  // Quick Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [itemToCreate, setItemToCreate] = useState<{ id: string, name: string } | null>(null);

  // Suggestions State
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
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
           matchedProduct = products.find(p => p.id === item.productId);
        } else {
           matchedProduct = products.find(p => p.name.toLowerCase().includes(item.productName.toLowerCase()));
        }

        return {
          id: Math.random().toString(36).substr(2, 9),
          productId: matchedProduct?.id || null,
          productName: matchedProduct ? matchedProduct.name : item.productName,
          quantity: item.quantity,
          unit: item.unit || 'pcs',
          costPrice: item.costPrice || matchedProduct?.costPrice || 0,
          totalCost: item.totalCost || (item.quantity * (item.costPrice || matchedProduct?.costPrice || 0)),
          confidence: item.confidence || 0.8,
          originalText: item.originalText,
          isNew: !matchedProduct
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

    try {
      const selectedVendor = vendors.find(v => v.id.toString() === selectedVendorId);

      // 1. Create Purchase Record
      const purchase = {
          id: `PUR-${Date.now()}`,
          vendorId: selectedVendor ? selectedVendor.id : undefined,
          vendorName: selectedVendor ? selectedVendor.name : 'Unknown Vendor',
          items: parsedItems.map(({ id, isNew, confidence, originalText, ...rest }) => rest),
          totalAmount: calculateTotal(),
          createdAt: new Date(),
          notes: 'Added via Smart Purchase Notepad'
      };

      await purchasesApi.add(purchase);

      const msg = detectedLanguage === 'te' ? "కొనుగోలు విజయవంతంగా నమోదైంది" : "Purchase recorded! Stock updated.";
      toast.success(msg);
      
      setParsedItems([]);
      setShowConfirmation(false);
      navigate('/dashboard/inventory');
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to record purchase.');
    }
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
      <div className="bg-white border-b px-4 py-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/inventory')}>
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">Purchase Notepad</h1>
          </div>
          
          <div className="relative">
             <Button 
                variant="outline" 
                size="sm" 
                className={`gap-2 ${selectedVendorId ? 'border-[#0F4C81] text-[#0F4C81]' : 'text-gray-500'}`}
                onClick={() => setShowVendorSelect(!showVendorSelect)}
             >
                <Store className="w-4 h-4" />
                {selectedVendorId ? vendors.find(v => v.id.toString() === selectedVendorId)?.name : 'Select Vendor'}
             </Button>
             
             {showVendorSelect && (
                 <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border p-2 z-50 max-h-64 overflow-y-auto">
                     {vendors.length === 0 && <div className="p-2 text-sm text-gray-500">No vendors found</div>}
                     {vendors.map(v => (
                         <div 
                            key={v.id} 
                            className="p-2 hover:bg-gray-100 rounded cursor-pointer text-sm font-medium"
                            onClick={() => {
                                setSelectedVendorId(v.id.toString());
                                setShowVendorSelect(false);
                            }}
                         >
                             {v.name}
                         </div>
                     ))}
                     <div 
                        className="p-2 hover:bg-gray-100 rounded cursor-pointer text-sm text-gray-500 border-t mt-1"
                        onClick={() => {
                            setSelectedVendorId('');
                            setShowVendorSelect(false);
                        }}
                     >
                         Unknown Vendor
                     </div>
                 </div>
             )}
          </div>
        </div>
      </div>

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
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {parsedItems.map((item, idx) => (
                <div key={idx} className={`flex flex-col gap-2 p-3 rounded-lg border ${item.isNew ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-medium text-gray-900">{item.productName}</p>
                            {item.isNew && <span className="text-[10px] text-amber-600 bg-amber-100 px-1 rounded">New Product</span>}
                        </div>
                        <div className="text-right">
                            <span className="font-bold">{item.quantity} {item.unit}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500 border-t border-dashed border-gray-200 pt-2">
                        <span>Cost: ₹{item.costPrice}/unit</span>
                        <span className="font-semibold text-gray-700">Total: ₹{item.totalCost}</span>
                    </div>
                </div>
                ))}
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-semibold text-gray-600">Total Amount</span>
                <span className="text-xl font-bold text-[#0F4C81]">₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <DialogFooter className="p-4 bg-gray-50 flex-row gap-3">
            <Button variant="outline" onClick={() => setShowConfirmation(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="secondary" onClick={() => setShowConfirmation(false)} className="flex-1">
              <Edit2 className="w-4 h-4 mr-2" /> Edit
            </Button>
            <Button onClick={handleConfirmPurchase} className="flex-[2] bg-[#0F4C81] hover:bg-[#0d3f6a]">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <QuickAddProductModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        initialName={itemToCreate?.name}
        onSuccess={handleProductCreated}
      />
    </div>
  );
}
