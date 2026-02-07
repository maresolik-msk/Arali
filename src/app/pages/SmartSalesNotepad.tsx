import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { 
  Mic, 
  Send, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  ArrowRight, 
  Loader2, 
  Sparkles,
  ArrowLeft,
  Search,
  Check,
  AlertTriangle,
  Info,
  X,
  Undo2,
  Edit2,
  Save
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { useNavigate, useSearchParams } from 'react-router';
import { aiApi, productsApi, ordersApi, purchasesApi } from '../services/api';
import type { Product, Order, Purchase } from '../data/dashboardData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Card } from '../components/ui/card';
import { ExpressMode } from '../components/sales/ExpressMode';

interface SaleItem {
  id: string; // temp id for UI
  productId: number | null;
  productName: string;
  quantity: number;
  unit: string;
  price: number;
  confidence: number;
  originalText?: string;
}

type NoteMode = 'sales' | 'purchase' | 'owner';

export function SmartSalesNotepad() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [note, setNote] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Initialize mode from URL
  const [mode, setMode] = useState<NoteMode>(() => {
    return searchParams.get('mode') === 'owner' ? 'owner' : 'sales';
  });

  // Sync mode with URL
  useEffect(() => {
    const currentMode = searchParams.get('mode');
    if (currentMode === 'owner') {
      setMode('owner');
    } else {
      setMode('sales');
    }
  }, [searchParams]);
  
  // Parsed State
  const [parsedItems, setParsedItems] = useState<SaleItem[]>([]);
  const [detectedLanguage, setDetectedLanguage] = useState<'en' | 'te' | 'mixed'>('en');
  const [ambiguityQuestion, setAmbiguityQuestion] = useState<string | null>(null);
  
  // Confirmation State
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastTransactionId, setLastTransactionId] = useState<string | null>(null);

  // Suggestions State
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Owner Mode State
  const [ownerResponse, setOwnerResponse] = useState<string | null>(null);

  // Edit Item State
  const [editingItem, setEditingItem] = useState<SaleItem | null>(null);
  const [editForm, setEditForm] = useState({
    productName: '',
    quantity: '',
    unit: 'pcs',
    price: '',
    // New product specific
    category: 'General',
    costPrice: '',
    sku: '',
    addToInventory: true,
    stock: ''
  });

  // Load products for context
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await productsApi.getAll();
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products', err);
      }
    }
    loadProducts();
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

  const openEditDialog = (item: SaleItem) => {
    setEditingItem(item);
    setEditForm({
      productName: item.productName,
      quantity: item.quantity.toString(),
      unit: item.unit,
      price: item.price.toString(),
      category: 'General',
      costPrice: (item.price * 0.7).toFixed(2), // Rough estimate default
      sku: '',
      addToInventory: !item.productId, // Default to true if new
      stock: item.quantity.toString() // Default stock to sales qty
    });
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      let finalProductId = editingItem.productId;
      const finalPrice = parseFloat(editForm.price) || 0;
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
            stock: parseInt(editForm.stock) || finalQty,
            price: finalPrice,
            costPrice: parseFloat(editForm.costPrice) || (finalPrice * 0.7),
            sellingPrice: finalPrice,
            alertEnabled: true,
            threshold: 5,
            vendorType: 'Unknown',
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

      // Update parsedItems
      setParsedItems(prev => prev.map(item => 
        item.id === editingItem.id ? {
            ...item,
            productId: finalProductId,
            productName: editForm.productName,
            quantity: finalQty,
            unit: editForm.unit,
            price: finalPrice
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
      recognitionRef.current.lang = 'en-IN'; // Optimized for Indian English

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

  const handleOwnerQuery = async () => {
    setIsProcessing(true);
    try {
        // Fetch data in parallel
        const [orders, purchases, products] = await Promise.all([
            ordersApi.getAll(),
            purchasesApi.getAll(),
            productsApi.getAll()
        ]);

        const lowerNote = note.toLowerCase();
        let response = "";
        
        const today = new Date();
        today.setHours(0,0,0,0);

        // Helper to parse dates safely
        const getDate = (d: any) => d instanceof Date ? d : new Date(d);

        const todayOrders = orders.filter(o => getDate(o.createdAt) >= today);
        const todayPurchases = purchases.filter(p => getDate(p.createdAt) >= today);
        
        const salesTotal = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
        const purchasesTotal = todayPurchases.reduce((sum, p) => sum + p.totalAmount, 0);

        // Sales Intent
        if (lowerNote.includes('sale') || lowerNote.includes('revenue') || lowerNote.includes('earning')) {
             response += `Sales today: ₹${salesTotal.toLocaleString('en-IN')} (${todayOrders.length} orders). `;
             
             const itemCounts: Record<string, number> = {};
             todayOrders.forEach(o => {
                 o.items.forEach(i => {
                     itemCounts[i.productName] = (itemCounts[i.productName] || 0) + i.quantity;
                 });
             });
             const topItem = Object.entries(itemCounts).sort((a,b) => b[1] - a[1])[0];
             if (topItem) {
                 response += `Top selling: ${topItem[0]} (${topItem[1]} units). `;
             }
        }
        
        // Purchase Intent
        if (lowerNote.includes('purchase') || lowerNote.includes('buy') || lowerNote.includes('bought') || lowerNote.includes('expense')) {
             response += `Purchases today: ₹${purchasesTotal.toLocaleString('en-IN')}. `;
        }
        
        // Stock Intent
        if (lowerNote.includes('stock') || lowerNote.includes('inventory') || lowerNote.includes('low')) {
             const lowStock = products.filter(p => p.stock <= p.threshold);
             response += `Low stock items: ${lowStock.length}. `;
             if (lowStock.length > 0) {
                 response += `Critical: ${lowStock.slice(0, 3).map(p => p.name).join(', ')}. `;
             }
        }

        // Default: General Summary
        if (!response) {
             response = `Today's Summary: Sales ₹${salesTotal.toLocaleString('en-IN')}, Purchases ₹${purchasesTotal.toLocaleString('en-IN')}. Low Stock: ${products.filter(p => p.stock <= p.threshold).length} items.`;
        }

        setOwnerResponse(response);
        setNote('');

    } catch (e) {
        console.error("Owner query failed", e);
        toast.error("Failed to fetch insights");
    } finally {
        setIsProcessing(false);
    }
  };

  const handleParse = async () => {
    if (!note.trim()) return;
    
    setIsProcessing(true);
    setOwnerResponse(null);
    setAmbiguityQuestion(null);

    try {
      if (mode === 'owner') {
        await handleOwnerQuery();
        return;
      }

      if (mode === 'purchase') {
        navigate('/dashboard/purchase-notepad');
        return;
      }

      // Sales Mode
      // Check for simple undo commands locally first
      const lowerNote = note.toLowerCase();
      if (lowerNote.includes('undo') || lowerNote.includes('cancel') || lowerNote.includes('mistake')) {
          if (lastTransactionId) {
              await handleUndo();
              setNote('');
              setIsProcessing(false);
              return;
          } else {
              toast.info("Nothing to undo.");
              setNote('');
              setIsProcessing(false);
              return;
          }
      }

      const result = await aiApi.parseSalesNote(note, products);
      
      setDetectedLanguage(result.language || 'en');
      
      if (result.ambiguity_detected && result.clarification_question) {
          setAmbiguityQuestion(result.clarification_question);
          setIsProcessing(false);
          return;
      }

      const newItems: SaleItem[] = result.items.map((item: any) => {
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
          price: matchedProduct?.sellingPrice || matchedProduct?.price || 0,
          confidence: item.confidence || 0.8,
          originalText: item.originalText
        };
      });

      setParsedItems(newItems);
      setShowConfirmation(true); // Always show confirmation

    } catch (error) {
      console.error('Parsing error:', error);
      toast.error('Failed to process note. Try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmSale = async () => {
    if (parsedItems.length === 0) return;

    try {
      const itemsToRecord = parsedItems
        .filter(item => item.productId)
        .map(item => ({ productId: item.productId!, quantity: item.quantity }));

      if (itemsToRecord.length === 0) {
          toast.error("No valid products matched.");
          return;
      }

      const result = await productsApi.batchSales(itemsToRecord);
      
      if (result.success) {
          setLastTransactionId(result.transactionId);
          
          // Language-aware feedback
          const msg = detectedLanguage === 'te' ? "విక్రయం విజయవంతంగా నమోదైంది" : "Sale recorded successfully";
          toast.success(msg, {
              action: {
                  label: 'Undo',
                  onClick: () => handleUndo(result.transactionId)
              }
          });
          
          setParsedItems([]);
          setShowConfirmation(false);
          setNote('');
      }
    } catch (error) {
      console.error('Sale error:', error);
      toast.error('Failed to record sale.');
    }
  };

  const handleUndo = async (txId?: string) => {
      const id = txId || lastTransactionId;
      if (!id) return;

      try {
          await productsApi.undoSales(id);
          toast.success('Transaction reversed.');
          setLastTransactionId(null);
      } catch (error) {
          toast.error("Failed to undo.");
      }
  };

  const calculateTotal = () => {
    return parsedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      

      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* Input Area */}
        <div className="bg-white border-[0.7px] border-[#0F4C81]/70 rounded-[16px] p-4 relative shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)]">
          {/* Label */}
          <div className="mb-3 pl-1">
            <p className="font-['M_PLUS_1p',sans-serif] font-medium text-[#3c464f] text-[12px] tracking-[0.6px] uppercase leading-[16px]">
              {mode === 'sales' ? 'What is the customer buying?' : 
               mode === 'owner' ? 'Ask a question about your store' : 'Enter details'}
            </p>
          </div>
          
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

          <div className="relative bg-[#f9fafb] rounded-[14px] p-1">
            <textarea
              ref={textareaRef}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                mode === 'sales' ? "Type '2kg rice, 1 sugar'..." : 
                mode === 'owner' ? "How are sales today?" : "..."
              }
              className="w-full min-h-[86px] p-3 pr-14 text-[18px] bg-transparent border-0 focus:ring-0 resize-none text-[#3c464f] placeholder:text-[#99a1af] font-['M_PLUS_1p',sans-serif] tracking-[-0.44px] leading-[28px]"
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
            
            {/* Mic Button */}
            <button
              onClick={toggleListening}
              className={`absolute right-3 top-[38px] size-[36px] bg-white rounded-full flex items-center justify-center shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] transition-all ${
                isListening ? 'bg-red-50 ring-2 ring-red-100' : 'hover:bg-gray-50'
              }`}
            >
              <div className="relative size-[20px]">
                 {/* Mic Icon Components from Design */}
                 <div className="absolute inset-[8.33%_37.5%_37.5%_37.5%]">
                    <svg className="block size-full" fill="none" viewBox="0 0 7 13">
                      <path d="M3.33218 0.833046C2.66937 0.833046 2.03371 1.09635 1.56503 1.56503C1.09635 2.03371 0.833046 2.66937 0.833046 3.33218V9.1635C0.833046 9.82632 1.09635 10.462 1.56503 10.9307C2.03371 11.3993 2.66937 11.6626 3.33218 11.6626C3.995 11.6626 4.63066 11.3993 5.09934 10.9307C5.56802 10.462 5.83132 9.82632 5.83132 9.1635V3.33218C5.83132 2.66937 5.56802 2.03371 5.09934 1.56503C4.63066 1.09635 3.995 0.833046 3.33218 0.833046Z" stroke={isListening ? "#ef4444" : "#99A1AF"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66609" />
                    </svg>
                 </div>
                 <div className="absolute inset-[41.67%_20.83%_20.83%_20.83%]">
                    <svg className="block size-full" fill="none" viewBox="0 0 14 10">
                      <path d="M12.4957 0.833046V2.49914C12.4957 4.0457 11.8813 5.52892 10.7877 6.6225C9.69415 7.71609 8.21093 8.33046 6.66437 8.33046C5.1178 8.33046 3.63459 7.71609 2.541 6.6225C1.44742 5.52892 0.833046 4.0457 0.833046 2.49914V0.833046" stroke={isListening ? "#ef4444" : "#99A1AF"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66609" />
                    </svg>
                 </div>
                 <div className="absolute bottom-[8.33%] left-1/2 -translate-x-1/2 w-[2px]">
                    <svg className="block w-[2px] h-[5px]" fill="none" viewBox="0 0 2 5">
                      <path d="M0.833046 0.833046V3.33218" stroke={isListening ? "#ef4444" : "#99A1AF"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66609" />
                    </svg>
                 </div>
              </div>
            </button>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && mode === 'sales' && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                    {suggestions.map((product, idx) => (
                        <div 
                            key={`${product.id}-${idx}`}
                            className={`p-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center ${idx === activeSuggestionIndex ? 'bg-blue-50' : ''}`}
                            onClick={() => insertSuggestion(product)}
                            onMouseEnter={() => setActiveSuggestionIndex(idx)}
                        >
                            <span className="font-medium text-sm text-gray-800">{product.name}</span>
                            <span className="text-xs text-gray-500">₹{product.price}</span>
                        </div>
                    ))}
                </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-end">
            <button 
              onClick={handleParse} 
              disabled={!note.trim() || isProcessing}
              className="bg-[#0f4c81] rounded-full h-[36px] min-w-[98px] px-4 flex items-center justify-center gap-2 hover:bg-[#0d3f6a] transition-colors disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                  <span className="font-['Inter:Medium',sans-serif] font-medium text-[14px] text-white">Processing</span>
                </>
              ) : (
                <>
                  <div className="size-[20px] relative">
                    <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                      <g>
                        <path clipRule="evenodd" d="M23.0003 0.557063C22.4673 0.154738 21.8065 -0.0406712 21.1403 0.00706311C20.9003 0.0330631 20.6633 0.0970631 20.4413 0.197063C20.1471 0.362106 19.875 0.563707 19.6313 0.797063C19.5819 0.844771 19.5481 0.906327 19.5344 0.973623C19.5206 1.04092 19.5276 1.1108 19.5543 1.17406C19.5723 1.21673 19.598 1.25406 19.6313 1.28606C19.6622 1.31875 19.6994 1.34479 19.7407 1.36259C19.7819 1.38039 19.8264 1.38957 19.8713 1.38957C19.9163 1.38957 19.9608 1.38039 20.002 1.36259C20.0433 1.34479 20.0805 1.31875 20.1113 1.28606C20.2767 1.13473 20.4533 0.998063 20.6413 0.876063C20.82 0.777842 21.0179 0.719824 21.2213 0.706063C21.6886 0.70515 22.1415 0.867901 22.5013 1.16606C22.6835 1.28131 22.8368 1.43679 22.9495 1.62054C23.0622 1.8043 23.1312 2.01145 23.1513 2.22606C23.1543 2.57306 23.0753 2.91606 22.9213 3.22606C22.7593 3.54306 22.5543 3.83606 22.3113 4.09606L21.1003 5.45506C20.8003 5.13506 20.4903 4.81506 20.1603 4.51506C20.0003 4.36506 19.8303 4.23506 19.6703 4.09506L19.3403 3.87506L18.5003 3.38506L18.3403 3.26506L18.6103 2.87506L19.2903 2.02606C19.3137 1.99308 19.3302 1.9557 19.3388 1.91617C19.3474 1.87665 19.3479 1.83579 19.3403 1.79606C19.3403 1.64606 19.1903 1.41606 18.8903 1.59606C18.6003 1.37606 18.3503 1.11606 18.0703 0.896063C17.9006 0.768158 17.7163 0.660748 17.5213 0.576063C17.3629 0.51005 17.193 0.476063 17.0213 0.476063C16.8497 0.476063 16.6798 0.51005 16.5213 0.576063C16.2143 0.727063 15.9313 0.923063 15.6813 1.15606C15.3513 1.4494 15.0413 1.76273 14.7513 2.09606C14.3513 2.6014 13.9817 3.12806 13.6423 3.67606C13.5782 3.74149 13.5423 3.82945 13.5423 3.92106C13.5423 4.01268 13.5782 4.10064 13.6423 4.16606C13.7061 4.22957 13.7924 4.26523 13.8823 4.26523C13.9723 4.26523 14.0586 4.22957 14.1223 4.16606C14.4223 3.85606 14.7323 3.57606 15.0323 3.29606C15.4797 2.87273 15.9497 2.47606 16.4423 2.10606C16.5823 1.98606 16.7523 1.83606 16.9323 1.70606C17.1123 1.57606 17.0923 1.54606 17.2023 1.56606C17.3317 1.58606 17.458 1.6194 17.5813 1.66606C17.8613 1.79606 18.1313 1.96606 18.4113 2.10606L18.0613 2.51606C16.6713 4.14606 13.6223 7.71406 12.3723 9.33406C12.089 9.66073 11.8686 10.0371 11.7223 10.4441C11.7223 10.7241 11.5923 12.7331 11.6123 13.5531C11.601 13.6531 11.601 13.7531 11.6123 13.8531C11.459 13.9464 11.3123 14.0497 11.1723 14.1631C11.0857 14.2384 11.006 14.3217 10.9333 14.4131C10.864 14.5017 10.8007 14.5951 10.7433 14.6931C10.1933 15.5921 10.3133 15.6921 10.3233 15.6921C10.3372 15.7686 10.3802 15.8367 10.4433 15.8821C10.5009 15.9354 10.5751 15.9672 10.6533 15.9721C10.6533 15.9721 10.8033 16.0621 11.5933 15.3621C11.6833 15.2921 11.7633 15.2121 11.8333 15.1221C11.9093 15.0394 11.976 14.9494 12.0333 14.8521C12.11 14.7207 12.1767 14.5841 12.2333 14.4421C12.4543 14.4831 12.6813 14.4831 12.9033 14.4421C13.7673 14.2421 14.6137 13.9821 15.4423 13.6621C15.6073 13.5977 15.7523 13.4908 15.8623 13.3521C16.1123 13.0821 16.6023 12.5121 17.2123 11.7631C18.9703 9.60306 21.7803 5.99506 22.9103 4.68506C23.2013 4.35506 23.4443 3.98506 23.6303 3.58506C23.8501 3.17151 23.9764 2.71476 24.0003 2.24706C23.9687 1.90902 23.8627 1.58217 23.6898 1.28998C23.5169 0.997782 23.2814 0.747488 23.0003 0.557063ZM15.2433 12.4031L15.0533 12.6031C14.3213 12.9064 13.568 13.1431 12.7933 13.3131V10.5831C12.8833 10.5831 12.1733 11.0731 17.8823 3.79606L18.0123 3.92606L18.5523 4.57606C18.8143 4.89406 19.111 5.17706 19.4423 5.42506C19.801 5.66306 20.174 5.8764 20.5613 6.06506C19.7113 7.06506 18.7313 8.20506 17.8313 9.28406C16.7323 10.6341 15.7333 11.8741 15.2433 12.4031Z" fill="white" fillRule="evenodd" />
                        <path clipRule="evenodd" d="M18.6323 17.4011L17.9323 15.8011C17.9239 15.7574 17.9062 15.7161 17.8804 15.6799C17.8546 15.6437 17.8213 15.6135 17.7828 15.5913C17.7443 15.5692 17.7014 15.5555 17.6572 15.5513C17.613 15.5471 17.5683 15.5525 17.5263 15.5671C17.4632 15.589 17.4089 15.6307 17.3714 15.686C17.3339 15.7414 17.3153 15.8073 17.3183 15.8741C17.32 15.9187 17.3316 15.9625 17.3523 16.0021L18.0423 17.7021C18.5823 18.7811 19.0423 19.3311 19.2623 19.7711C19.4037 19.9901 19.4539 20.2556 19.4023 20.5111C19.4023 20.5611 19.3023 20.5711 19.2023 20.6311C18.8517 20.8157 18.485 20.9591 18.1023 21.0611C15.7752 21.6719 13.4008 22.0864 11.0043 22.3001C8.63434 22.6001 6.24134 22.6801 3.85634 22.5401C3.5188 22.5117 3.18427 22.4549 2.85634 22.3701C2.75979 22.334 2.66618 22.2905 2.57634 22.2401C2.46008 22.0298 2.35656 21.8127 2.26634 21.5901C2.16838 21.3825 2.09457 21.1644 2.04634 20.9401C1.56313 18.1801 1.25618 15.3921 1.12734 12.5931C0.920269 9.90438 0.920269 7.20375 1.12734 4.51506C2.05734 4.29506 3.31734 4.08506 4.72634 3.90506C6.61634 3.66506 8.72534 3.49506 10.7243 3.42506C10.7698 3.42508 10.8149 3.41597 10.8568 3.39826C10.8987 3.38055 10.9367 3.35461 10.9684 3.32197C11.0001 3.28933 11.0249 3.25066 11.0414 3.20825C11.0579 3.16584 11.0657 3.12055 11.0643 3.07506C11.0617 2.98398 11.0237 2.89751 10.9584 2.83402C10.893 2.77053 10.8055 2.73503 10.7143 2.73506C8.71434 2.73506 6.58534 2.89506 4.66634 3.08506C3.32269 3.21113 1.98746 3.4148 0.667337 3.69506C0.580888 3.71712 0.502719 3.76384 0.442351 3.82954C0.381984 3.89523 0.342023 3.97706 0.327337 4.06506C-0.00968173 6.91483 -0.0866658 9.78935 0.0973369 12.6531C0.2071 15.5094 0.511136 18.355 1.00734 21.1701C1.06734 21.4147 1.14067 21.6547 1.22734 21.8901C1.36267 22.2121 1.516 22.5254 1.68734 22.8301C1.90513 23.0794 2.17215 23.2809 2.47159 23.422C2.77104 23.5631 3.09644 23.6408 3.42734 23.6501C5.40534 23.8191 7.39534 23.7751 9.36434 23.5201C12.6811 23.242 15.9531 22.5706 19.1113 21.5201C19.7913 21.2301 20.1113 20.8801 20.1813 20.6101C20.2427 20.3227 20.2184 20.0237 20.1113 19.7501C19.8713 19.2601 19.3423 18.7511 18.6323 17.4011Z" fill="white" fillRule="evenodd" />
                        <path clipRule="evenodd" d="M9.67434 11.5031C9.64419 11.4073 9.57911 11.3263 9.49204 11.2763C9.40497 11.2263 9.30227 11.2109 9.20434 11.2331C9.12434 11.2331 9.20434 11.1531 8.85434 11.2331C8.08434 11.3231 6.85534 11.5331 5.79534 11.6831C5.47534 11.7331 5.16534 11.7731 4.88534 11.8331C4.23634 11.9531 3.74634 12.0931 3.55634 12.1131C3.49238 12.1253 3.43469 12.1595 3.3932 12.2097C3.35171 12.2599 3.32902 12.3229 3.32902 12.3881C3.32902 12.4532 3.35171 12.5163 3.3932 12.5665C3.43469 12.6167 3.49238 12.6508 3.55634 12.6631C4.057 12.7417 4.56034 12.7751 5.06634 12.7631C5.51634 12.7631 6.06634 12.7031 6.53634 12.6531C7.3235 12.5779 8.10486 12.451 8.87534 12.2731C9.60534 12.0331 9.73534 11.7231 9.67534 11.5031M5.45634 7.64506C4.77834 7.7944 4.11167 7.9844 3.45634 8.21506C3.38441 8.234 3.32251 8.27984 3.28342 8.34312C3.24434 8.4064 3.23106 8.48227 3.24634 8.55506C3.26515 8.62652 3.31145 8.68764 3.37514 8.7251C3.43883 8.76256 3.51474 8.77333 3.58634 8.75506C4.47634 8.61506 5.33634 8.58506 6.23634 8.51506C7.5718 8.39909 8.90475 8.25572 10.2343 8.08506C10.6143 8.03506 11.0143 8.00506 11.4143 7.91506C11.543 7.9184 11.6697 7.90506 11.7943 7.87506C11.8543 7.87506 11.8743 7.80506 11.9343 7.76506C12.0318 7.7479 12.1188 7.69335 12.1767 7.61304C12.2346 7.53273 12.2589 7.433 12.2443 7.33506C12.1843 6.87506 11.3843 6.87506 11.3043 6.87506C9.59434 6.99506 8.14434 7.20506 6.79534 7.38506C6.33534 7.48506 5.89634 7.54506 5.45634 7.64506ZM8.81534 15.7121C8.68534 15.7121 8.52534 15.7121 8.34534 15.7621L7.04534 15.9621C6.36534 16.0721 5.64534 16.1821 5.09534 16.3221C4.79134 16.3987 4.49167 16.4921 4.19634 16.6021H4.13634C4.08742 16.5873 4.03525 16.5873 3.98634 16.6021C3.98634 16.6021 3.85634 17.0921 4.26634 17.1321C4.43634 17.1321 4.76634 17.1921 5.26634 17.1921C5.93553 17.1707 6.60313 17.1139 7.26634 17.0221C7.75534 16.9621 8.26534 16.8921 8.59534 16.8221C8.73734 16.7987 8.87734 16.7654 9.01534 16.7221C9.18599 16.6501 9.34452 16.5523 9.48534 16.4321C9.57695 16.3831 9.64591 16.3004 9.67764 16.2015C9.70936 16.1026 9.70137 15.9952 9.65534 15.9021C9.56534 15.8721 9.52534 15.7321 8.81534 15.7121Z" fill="white" fillRule="evenodd" />
                      </g>
                    </svg>
                  </div>
                  <span className="font-['Inter:Medium',sans-serif] font-medium text-[14px] text-white tracking-[-0.15px]">
                    {mode === 'owner' ? 'Ask AI' : 'Note'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Owner Mode Response */}
        {mode === 'owner' && ownerResponse && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border p-6 border-[#0F4C81]/20 bg-gradient-to-br from-white to-blue-50/50"
            >
                <div className="flex items-start gap-3">
                    <div className="bg-[#0F4C81]/10 p-2 rounded-lg">
                        <Sparkles className="w-5 h-5 text-[#0F4C81]" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-[#0F4C81] mb-1">AI Insight</h3>
                        <p className="text-gray-700 leading-relaxed">{ownerResponse}</p>
                    </div>
                </div>
            </motion.div>
        )}
      </div>

      {/* Express Mode Instant Selling */}
      {mode === 'sales' && (
        <div className="max-w-4xl mx-auto px-4 pb-4 mt-2">
           <ExpressMode embedded />
        </div>
      )}

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Item Details</DialogTitle>
            <DialogDescription>
              {editingItem?.productId ? 'Update sale details.' : 'Add new product details to inventory.'}
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
                disabled={!!editingItem?.productId} // Disable name edit if existing product
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
              <Label htmlFor="price" className="text-right">
                Price (₹)
              </Label>
              <Input
                id="price"
                type="number"
                value={editForm.price}
                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                className="col-span-3"
              />
            </div>

            {/* New Product Fields */}
            {!editingItem?.productId && (
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
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="cost" className="text-right">
                                    Cost Price
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

      {/* Confirmation Modal */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white">
          <div className="bg-[#0F4C81] p-4 text-white">
              <DialogTitle className="flex items-center gap-2 text-white">
                  <Check className="w-5 h-5" />
                  Confirm Transaction
              </DialogTitle>
              <DialogDescription className="text-blue-100">
                  Please verify the items below before committing.
              </DialogDescription>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {parsedItems.map((item, idx) => (
                <div key={idx} className={`flex justify-between items-start p-3 rounded-lg border ${item.confidence < 80 ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        {!item.productId && (
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-full font-medium">New</span>
                        )}
                    </div>
                    <p className="text-xs text-gray-500">"{item.originalText}"</p>
                    {item.confidence < 80 && (
                        <p className="text-xs text-amber-600 font-medium mt-1">Low confidence match</p>
                    )}
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                    <div>
                        <span className="font-bold text-lg">{item.quantity} <span className="text-sm font-normal text-gray-600">{item.unit}</span></span>
                        <p className="text-sm text-gray-600">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
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
            <Button onClick={handleConfirmSale} className="flex-[2] bg-[#0F4C81] hover:bg-[#0d3f6a]">
              Confirm Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
