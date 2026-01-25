import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Edit2
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useNavigate } from 'react-router';
import { aiApi, productsApi, ordersApi } from '../services/api';
import type { Product } from '../data/dashboardData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Card } from '../components/ui/card';

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
  const [note, setNote] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [mode, setMode] = useState<NoteMode>('sales');
  
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

  const handleParse = async () => {
    if (!note.trim()) return;
    
    setIsProcessing(true);
    setOwnerResponse(null);
    setAmbiguityQuestion(null);

    try {
      if (mode === 'owner') {
        // Mock Owner Mode for now
        setTimeout(() => {
            setOwnerResponse("Sales today are ₹12,500 (up 15%). 3 items are low on stock. Recommendation: Reorder Rice.");
            setIsProcessing(false);
        }, 1000);
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
      <div className="bg-white border-b px-4 py-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </Button>
            <h1 className="text-lg font-bold text-gray-900">Smart Notepad</h1>
          </div>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setMode('sales')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'sales' ? 'bg-white shadow text-[#0F4C81]' : 'text-gray-500'}`}
            >
              Sales
            </button>
            <button 
              onClick={() => navigate('/dashboard/purchase-notepad')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'purchase' ? 'bg-white shadow text-[#0F4C81]' : 'text-gray-500'}`}
            >
              Purchase
            </button>
            <button 
              onClick={() => setMode('owner')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'owner' ? 'bg-white shadow text-[#0F4C81]' : 'text-gray-500'}`}
            >
              Owner
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* Input Area */}
        <div className="bg-white rounded-2xl shadow-sm border p-4">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
            {mode === 'sales' ? 'What is the customer buying?' : 
             mode === 'owner' ? 'Ask a question about your store' : 'Enter details'}
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
              placeholder={
                mode === 'sales' ? "Type '2kg rice, 1 sugar'..." : 
                mode === 'owner' ? "How are sales today?" : "..."
              }
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
                  {mode === 'owner' ? 'Ask AI' : 'Process'}
                </>
              )}
            </Button>
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
                    <div>
                    <p className="font-medium text-gray-900">{item.productName}</p>
                    <p className="text-xs text-gray-500">"{item.originalText}"</p>
                    {item.confidence < 80 && (
                        <p className="text-xs text-amber-600 font-medium mt-1">Low confidence match</p>
                    )}
                    </div>
                    <div className="text-right">
                    <span className="font-bold text-lg">{item.quantity} <span className="text-sm font-normal text-gray-600">{item.unit}</span></span>
                    <p className="text-sm text-gray-600">₹{(item.price * item.quantity).toFixed(2)}</p>
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
            <Button onClick={handleConfirmSale} className="flex-[2] bg-[#0F4C81] hover:bg-[#0d3f6a]">
              Confirm Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
