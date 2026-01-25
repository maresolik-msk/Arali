import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import { Package, Plus, Search, CircleAlert, Edit2, PackagePlus, ShoppingCart, Bell, Trash2, Sparkles, Loader2, Image as ImageIcon, ScanLine, Download } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { toast } from 'sonner';
import { productsApi, notificationsApi, vendorsApi } from '../services/api';
import { generateProductImage } from '../services/ai';
import { lookupProductByBarcode } from '../services/productLookup';
import { parseVoiceCommand, generateVoiceSummary } from '../services/voiceParser';
import { BarcodeScanner } from '../components/BarcodeScanner';
import { VoiceInput } from '../components/VoiceInput';
import { usePlan } from '../hooks/usePlan';
import { UpgradeModal } from '../components/UpgradeModal';
import type { Product, Vendor, Loss } from '../data/dashboardData';

// Milk product image from Unsplash
const MILK_IMAGE_URL = "https://images.unsplash.com/photo-1635436338433-89747d0ca0ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWxrJTIwYm90dGxlJTIwZGFpcnl8ZW58MXx8fHwxNzY4MDYyNzY2fDA&ixlib=rb-4.1.0&q=80&w=1080";

export function Inventory() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Handle URL actions
  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      setIsAddDialogOpen(true);
    }
  }, [searchParams]);

  const [searchQuery, setSearchQuery] = useState('');
  const [inventoryItems, setInventoryItems] = useState<Product[]>([]);
  const [losses, setLosses] = useState<Loss[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRestockDialogOpen, setIsRestockDialogOpen] = useState(false);
  const [isRecordSalesDialogOpen, setIsRecordSalesDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLossesDialogOpen, setIsLossesDialogOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: number; name: string } | null>(null);
  const [lowStockNotified, setLowStockNotified] = useState<Set<number>>(new Set());
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    category: '',
    stock: '',
    costPrice: '',
    sellingPrice: '',
    vendorType: '',
    expiryDate: '',
    batchNumber: '',
    alertEnabled: true,
    threshold: '10',
    imageUrl: '',
  });
  const [editingProduct, setEditingProduct] = useState<{
    id: number;
    name: string;
    sku: string;
    category: string;
    stock: string;
    costPrice: string;
    sellingPrice: string;
    vendorType: string;
    expiryDate: string;
    alertEnabled: boolean;
    threshold: string;
    imageUrl: string;
  } | null>(null);
  const [restockingProduct, setRestockingProduct] = useState<{
    id: number;
    name: string;
    currentStock: number;
    quantity: string;
    batchNumber: string;
    expiryDate: string;
  } | null>(null);
  const [recordingSalesProduct, setRecordingSalesProduct] = useState<{
    id: number;
    name: string;
    currentStock: number;
    price: number;
    quantitySold: string;
  } | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  
  // Pricing Plan Integration
  const { checkLimit, isFree, isStarter, limits } = usePlan();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState('');

  // Load products from backend on mount
  useEffect(() => {
    let isMounted = true; // Cleanup flag to prevent state updates after unmount
    
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const products = await productsApi.getAll();
        if (isMounted) {
          setInventoryItems(products || []);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        if (isMounted) {
          toast.error('Failed to load products');
          setInventoryItems([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false; // Cleanup on unmount
    };
  }, []);

  // Load vendors from backend on mount
  useEffect(() => {
    let isMounted = true; // Cleanup flag to prevent state updates after unmount
    
    const loadVendors = async () => {
      try {
        const vendorList = await vendorsApi.getAll();
        if (isMounted) {
          setVendors(vendorList || []);
        }
      } catch (error) {
        console.error('Error loading vendors:', error);
        if (isMounted) {
          toast.error('Failed to load vendors');
          setVendors([]);
        }
      }
    };

    loadVendors();

    return () => {
      isMounted = false; // Cleanup on unmount
    };
  }, []);

  // Automatic expiry processing on mount
  useEffect(() => {
    let isMounted = true;

    const runExpiryCheck = async () => {
      try {
        // Run check silently in background
        const { processedCount, totalLoss } = await productsApi.processExpiry();
        
        if (processedCount > 0 && isMounted) {
          toast.info(`Inventory Update: Automatically removed ${processedCount} expired items.`, {
            description: `Recorded loss of ₹${totalLoss}. Check Losses history for details.`,
            duration: 6000,
          });
          
          // Refresh products to show updated stock
          const products = await productsApi.getAll();
          if (isMounted) {
            setInventoryItems(products || []);
          }
        }
      } catch (error) {
        console.error('Background expiry check failed:', error);
      }
    };

    runExpiryCheck();

    return () => {
      isMounted = false;
    };
  }, []);

  // Helper function to sync vendor when product is added/updated - MEMOIZED
  const syncVendor = useCallback(async (vendorName: string, productCostPrice: number, isNew: boolean = true) => {
    if (!vendorName) return;

    try {
      // Check if vendor already exists (case-insensitive)
      const existingVendor = vendors.find(
        v => v.company.toLowerCase() === vendorName.toLowerCase() || v.name.toLowerCase() === vendorName.toLowerCase()
      );

      if (existingVendor) {
        // Update existing vendor
        const updatedVendor = {
          ...existingVendor,
          totalProducts: isNew ? existingVendor.totalProducts + 1 : existingVendor.totalProducts,
          totalPurchases: existingVendor.totalPurchases + productCostPrice,
          lastOrderDate: new Date(),
        };

        await vendorsApi.update(existingVendor.id, {
          totalProducts: updatedVendor.totalProducts,
          totalPurchases: updatedVendor.totalPurchases,
          lastOrderDate: updatedVendor.lastOrderDate,
        });

        // Update local state
        setVendors(vendors.map(v => v.id === existingVendor.id ? updatedVendor : v));
        
        console.log(`Updated vendor: ${vendorName}`);
      } else {
        // Create new vendor
        const newVendor: Vendor = {
          id: Date.now(),
          name: vendorName,
          email: '', // Can be filled later
          phone: '', // Can be filled later
          address: '',
          company: vendorName,
          category: 'General Supplier',
          totalProducts: 1,
          totalPurchases: productCostPrice,
          joinedDate: new Date(),
          lastOrderDate: new Date(),
          rating: 3, // Default rating
          status: 'Active',
          paymentTerms: '',
          notes: 'Auto-created from product inventory',
        };

        await vendorsApi.add(newVendor);

        // Update local state
        setVendors([...vendors, newVendor]);
        
        console.log(`Created new vendor: ${vendorName}`);
        toast.success(`New vendor "${vendorName}" added to vendor management!`, {
          duration: 4000,
        });
      }
    } catch (error) {
      console.error('Error syncing vendor:', error);
      // Don't show error toast as this is a background operation
    }
  }, [vendors]); // Add vendors dependency for useCallback

  // Check for low stock and show notifications - OPTIMIZED with cleanup
  useEffect(() => {
    if (inventoryItems.length === 0 || isLoading) return;
    
    let isMounted = true; // Cleanup flag
    
    // Find products with alerts enabled that are at or below threshold
    const lowStockProducts = inventoryItems.filter(
      item => item.alertEnabled && item.stock > 0 && item.stock <= item.threshold && !lowStockNotified.has(item.id)
    );
    
    const outOfStockProducts = inventoryItems.filter(
      item => item.alertEnabled && item.stock === 0 && !lowStockNotified.has(item.id)
    );
    
    // Show notifications for low stock products (only once per product)
    if (lowStockProducts.length > 0 && isMounted) {
      const productNames = lowStockProducts.map(p => p.name).join(', ');
      const toastId = `low-stock-${lowStockProducts.map(p => p.id).join('-')}`;
      
      toast.warning(`Low Stock Alert: ${lowStockProducts.length} product${lowStockProducts.length > 1 ? 's' : ''} running low`, {
        id: toastId,
        description: productNames,
        duration: 5000,
      });

      // Create app notifications for low stock products
      if (limits.canUseSmartAlerts) {
        lowStockProducts.forEach((product) => {
          notificationsApi.create({
            userId: '', // Will be set by backend
            type: 'low_stock',
            title: 'Low Stock Alert',
            message: `${product.name} is running low. Only ${product.stock} units remaining (threshold: ${product.threshold}).`,
            read: false,
            relatedTo: {
              type: 'product',
              id: product.id,
              name: product.name,
            },
          })
          .then(() => {
            if (isMounted) {
              setLowStockNotified(prev => new Set([...prev, product.id]));
            }
          })
          .catch(error => {
            console.error('Failed to create notification:', error);
          });
        });
      } else {
        // Just mark as notified to avoid repeated checks, but don't send API call
        if (isMounted) {
          lowStockProducts.forEach(p => setLowStockNotified(prev => new Set([...prev, p.id])));
        }
      }
    }
    
    // Show notifications for out of stock products (only once per product)
    if (outOfStockProducts.length > 0 && isMounted) {
      const productNames = outOfStockProducts.map(p => p.name).join(', ');
      const toastId = `out-stock-${outOfStockProducts.map(p => p.id).join('-')}`;
      
      toast.error(`Out of Stock: ${outOfStockProducts.length} product${outOfStockProducts.length > 1 ? 's' : ''}`, {
        id: toastId,
        description: productNames,
        duration: 5000,
      });

      // Create app notifications for out of stock products
      outOfStockProducts.forEach((product) => {
        notificationsApi.create({
          userId: '', // Will be set by backend
          type: 'out_of_stock',
          title: 'Out of Stock',
          message: `${product.name} is out of stock. Please restock immediately.`,
          read: false,
          relatedTo: {
            type: 'product',
            id: product.id,
            name: product.name,
          },
        })
        .then(() => {
          if (isMounted) {
            setLowStockNotified(prev => new Set([...prev, product.id]));
          }
        })
        .catch(error => {
          console.error('Failed to create notification:', error);
        });
      });
    }

    return () => {
      isMounted = false; // Cleanup on unmount to prevent state updates
    };
  }, [inventoryItems, isLoading, lowStockNotified]); // Added lowStockNotified dependency

  // Get unique categories from existing products - OPTIMIZED with useMemo
  const uniqueCategories = useMemo(() => {
    const categories = inventoryItems.map(item => item.category);
    return Array.from(new Set(categories)).filter(Boolean).sort();
  }, [inventoryItems]);

  // Get unique vendor names from vendors list - OPTIMIZED with useMemo
  const vendorNames = useMemo(() => {
    return vendors.map(v => v.company).filter(Boolean).sort();
  }, [vendors]);

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatus = (stock: number, threshold: number): string => {
    if (stock === 0) return 'Out of Stock';
    if (stock <= threshold) return 'Low Stock';
    return 'In Stock';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-700';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-700';
      case 'Out of Stock':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleGenerateImage = async (isEditing: boolean) => {
    const product = isEditing ? editingProduct : newProduct;
    if (!product?.name) {
      toast.error('Please enter a product name first');
      return;
    }

    try {
      setIsGeneratingImage(true);
      
      let imageUrl: string;
      let isFallback = false;

      // Special case for "milk" to use the specific provided asset
      if (product.name.trim().toLowerCase() === 'milk') {
        imageUrl = MILK_IMAGE_URL;
        isFallback = false; // It's a specific asset, not a generic fallback
      } else {
        const result = await generateProductImage(product.name, undefined, product.category);
        imageUrl = result.imageUrl;
        isFallback = result.isFallback;
      }
      
      if (isEditing && editingProduct) {
        setEditingProduct({ ...editingProduct, imageUrl });
      } else {
        setNewProduct({ ...newProduct, imageUrl });
      }
      
      if (isFallback) {
        toast.warning('Using placeholder image due to AI service limits.');
      } else {
        toast.success('Product image generated successfully!');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate image');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleAddProduct = async () => {
    // Check Plan Limits
    if (!checkLimit('maxSkus', inventoryItems.length)) {
      setUpgradeMessage(`You have reached the maximum of ${inventoryItems.length} products allowed on your plan.`);
      setIsUpgradeModalOpen(true);
      return;
    }

    // Validate form
    if (!newProduct.name || !newProduct.sku || !newProduct.category || !newProduct.stock || !newProduct.costPrice || !newProduct.sellingPrice || !newProduct.vendorType) {
      toast.error('Please fill in all fields');
      return;
    }

    // Validate stock is a valid number
    const stockNum = parseInt(newProduct.stock);
    if (isNaN(stockNum) || stockNum < 0) {
      toast.error('Please enter a valid stock quantity');
      return;
    }

    // Validate cost price is a valid number
    const costPriceNum = parseFloat(newProduct.costPrice.replace('$', ''));
    if (isNaN(costPriceNum) || costPriceNum <= 0) {
      toast.error('Please enter a valid cost price');
      return;
    }

    // Validate selling price is a valid number
    const sellingPriceNum = parseFloat(newProduct.sellingPrice.replace('$', ''));
    if (isNaN(sellingPriceNum) || sellingPriceNum <= 0) {
      toast.error('Please enter a valid selling price');
      return;
    }

    // Validate threshold if alerts are enabled
    const thresholdNum = newProduct.alertEnabled ? parseInt(newProduct.threshold) : 10;
    if (newProduct.alertEnabled && (isNaN(thresholdNum) || thresholdNum < 0)) {
      toast.error('Please enter a valid alert threshold');
      return;
    }

    // Determine status based on stock
    let status = getStatus(stockNum, thresholdNum);

    try {
      // Create new product
      const product: Product = {
        id: Date.now(), // Generate unique ID
        name: newProduct.name,
        sku: newProduct.sku.toUpperCase(),
        stock: stockNum,
        price: sellingPriceNum, // Keep for backwards compatibility
        costPrice: costPriceNum, // Price from vendor
        sellingPrice: sellingPriceNum, // Price to customers
        category: newProduct.category,
        threshold: thresholdNum, // Alert threshold
        alertEnabled: newProduct.alertEnabled, // Alert enabled/disabled
        vendorType: newProduct.vendorType, // Vendor information
        unitsSold: 0, // Initialize with 0
        revenue: 0, // Initialize with 0
        expiryDate: newProduct.expiryDate || undefined, // Optional expiry date
        batches: newProduct.batchNumber ? [{
          id: `batch-${Date.now()}`,
          batchNumber: newProduct.batchNumber,
          expiryDate: newProduct.expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 30 days if not set but batch exists
          quantity: stockNum,
          receivedDate: new Date().toISOString(),
        }] : undefined,
        imageUrl: newProduct.imageUrl || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Add to backend
      await productsApi.add(product);

      // Add to local state
      setInventoryItems([...inventoryItems, product]);

      // Reset form
      setNewProduct({
        name: '',
        sku: '',
        category: '',
        stock: '',
        costPrice: '',
        sellingPrice: '',
        vendorType: '',
        expiryDate: '',
        batchNumber: '',
        alertEnabled: true,
        threshold: '10',
        imageUrl: '',
      });

      // Close dialog
      setIsAddDialogOpen(false);

      // Show success message
      toast.success('Product added successfully!');

      // Sync vendor
      await syncVendor(newProduct.vendorType, costPriceNum);
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    }
  };

  const handleEditClick = (item: any) => {
    setEditingProduct({
      id: item.id,
      name: item.name || '',
      sku: item.sku || '',
      category: item.category || '',
      stock: (item.stock ?? 0).toString(),
      costPrice: (item.costPrice ? item.costPrice : (typeof item.price === 'number' ? item.price : parseFloat(item.price.replace('₹', '')))).toString(),
      sellingPrice: (item.sellingPrice ? item.sellingPrice : (typeof item.price === 'number' ? item.price : parseFloat(item.price.replace('₹', '')))).toString(),
      vendorType: item.vendorType || '',
      expiryDate: item.expiryDate || '',
      alertEnabled: item.alertEnabled || true,
      threshold: (item.threshold ?? 10).toString(),
      imageUrl: item.imageUrl || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    if (!editingProduct.id) {
        toast.error("Product ID is missing. Cannot update.");
        return;
    }

    // Validate form
    if (!editingProduct.name || !editingProduct.sku || !editingProduct.category || !editingProduct.stock || !editingProduct.costPrice || !editingProduct.sellingPrice || !editingProduct.vendorType) {
      toast.error('Please fill in all fields');
      return;
    }

    // Validate stock is a valid number
    const stockNum = parseInt(editingProduct.stock);
    if (isNaN(stockNum) || stockNum < 0) {
      toast.error('Please enter a valid stock quantity');
      return;
    }

    // Validate cost price is a valid number
    const costPriceNum = parseFloat(editingProduct.costPrice.replace('$', ''));
    if (isNaN(costPriceNum) || costPriceNum <= 0) {
      toast.error('Please enter a valid cost price');
      return;
    }

    // Validate selling price is a valid number
    const sellingPriceNum = parseFloat(editingProduct.sellingPrice.replace('$', ''));
    if (isNaN(sellingPriceNum) || sellingPriceNum <= 0) {
      toast.error('Please enter a valid selling price');
      return;
    }

    // Validate threshold if alerts are enabled
    const thresholdNum = editingProduct.alertEnabled ? parseInt(editingProduct.threshold) : 10;
    if (editingProduct.alertEnabled && (isNaN(thresholdNum) || thresholdNum < 0)) {
      toast.error('Please enter a valid alert threshold');
      return;
    }

    // Determine status based on stock
    let status = getStatus(stockNum, thresholdNum);

    try {
      // Update in backend
      await productsApi.update(editingProduct.id, {
        name: editingProduct.name,
        sku: editingProduct.sku.toUpperCase(),
        stock: stockNum,
        price: sellingPriceNum, // Store as number, not string
        costPrice: costPriceNum, // Store cost price
        sellingPrice: sellingPriceNum, // Store selling price
        vendorType: editingProduct.vendorType, // Store vendor type
        category: editingProduct.category,
        expiryDate: editingProduct.expiryDate || undefined, // Optional expiry date
        alertEnabled: editingProduct.alertEnabled, // Store alert enabled flag
        threshold: thresholdNum, // Store alert threshold
        status: status,
        imageUrl: editingProduct.imageUrl || undefined,
      });

      // Update local state
      setInventoryItems(inventoryItems.map(item => 
        item.id === editingProduct.id 
          ? {
              ...item,
              name: editingProduct.name,
              sku: editingProduct.sku.toUpperCase(),
              stock: stockNum,
              price: sellingPriceNum, // Store as number, not string
              costPrice: costPriceNum, // Update cost price
              sellingPrice: sellingPriceNum, // Update selling price
              vendorType: editingProduct.vendorType, // Update vendor type
              category: editingProduct.category,
              expiryDate: editingProduct.expiryDate || undefined, // Optional expiry date
              alertEnabled: editingProduct.alertEnabled, // Update alert enabled flag
              threshold: thresholdNum, // Update alert threshold
              status: status,
              imageUrl: editingProduct.imageUrl || undefined,
            }
          : item
      ));

      // Close dialog and reset
      setIsEditDialogOpen(false);
      // Don't clear state immediately to prevent controlled/uncontrolled error during exit animation
      // setEditingProduct(null);

      // Show success message
      toast.success('Product updated successfully!');

      // Sync vendor
      await syncVendor(editingProduct.vendorType, costPriceNum, false);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleRestockClick = (item: any) => {
    setRestockingProduct({
      id: item.id,
      name: item.name,
      currentStock: item.stock,
      quantity: '',
      batchNumber: '',
      expiryDate: '',
    });
    setIsRestockDialogOpen(true);
  };

  const handleRestockProduct = async () => {
    if (!restockingProduct) return;
    if (!restockingProduct.id) {
        toast.error("Product ID is missing.");
        return;
    }

    // Validate form
    if (!restockingProduct.quantity) {
      toast.error('Please enter a valid restock quantity');
      return;
    }

    // Validate stock is a valid number
    const stockNum = parseInt(restockingProduct.quantity);
    if (isNaN(stockNum) || stockNum <= 0) {
      toast.error('Please enter a valid restock quantity');
      return;
    }

    try {
      // Restock in backend
      // @ts-ignore - API signature will be updated
      const updatedProduct = await productsApi.restock(restockingProduct.id, stockNum, restockingProduct.batchNumber, restockingProduct.expiryDate);

      // Update local state
      setInventoryItems(inventoryItems.map(item => 
        item.id === restockingProduct.id ? updatedProduct : item
      ));

      // Close dialog and reset
      setIsRestockDialogOpen(false);
      // setRestockingProduct(null);

      // Show success message
      toast.success(`Successfully restocked ${stockNum} units!`);
    } catch (error) {
      console.error('Error restocking product:', error);
      toast.error('Failed to restock product');
    }
  };

  const handleRecordSalesClick = (item: any) => {
    setRecordingSalesProduct({
      id: item.id,
      name: item.name,
      currentStock: item.stock,
      price: typeof item.price === 'number' ? item.price : parseFloat(item.price.replace('₹', '')),
      quantitySold: '',
    });
    setIsRecordSalesDialogOpen(true);
  };

  const handleRecordSales = async () => {
    if (!recordingSalesProduct) return;
    if (!recordingSalesProduct.id) {
        toast.error("Product ID is missing.");
        return;
    }

    // Validate form
    if (!recordingSalesProduct.quantitySold) {
      toast.error('Please enter quantity sold');
      return;
    }

    // Validate quantity sold is a valid number
    const quantitySold = parseInt(recordingSalesProduct.quantitySold);
    if (isNaN(quantitySold) || quantitySold <= 0) {
      toast.error('Please enter a valid quantity sold');
      return;
    }

    // Check if there's enough stock
    if (quantitySold > recordingSalesProduct.currentStock) {
      toast.error(`Insufficient stock! Only ${recordingSalesProduct.currentStock} units available.`);
      return;
    }

    try {
      // Record sales in backend
      const updatedProduct = await productsApi.recordSales(recordingSalesProduct.id, quantitySold);

      // Update local state
      setInventoryItems(inventoryItems.map(item => 
        item.id === recordingSalesProduct.id ? updatedProduct : item
      ));

      // Close dialog and reset
      setIsRecordSalesDialogOpen(false);
      // setRecordingSalesProduct(null);

      // Calculate revenue for this sale
      const revenue = quantitySold * recordingSalesProduct.price;

      // Show success message
      toast.success(`Recorded ${quantitySold} units sold! Revenue: ₹${revenue.toFixed(2)}`);
    } catch (error: any) {
      console.error('Error recording sales:', error);
      
      // Check if it's an authentication error
      if (error.message && error.message.includes('Authentication required')) {
        toast.error('Session expired. Please sign in again.', {
          duration: 5000,
          action: {
            label: 'Sign In',
            onClick: () => window.location.href = '/login'
          }
        });
      } else {
        toast.error(error.message || 'Failed to record sales');
      }
    }
  };

  const handleDeleteClick = (item: any) => {
    setProductToDelete({ id: item.id, name: item.name });
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    if (!productToDelete.id) {
        toast.error("Product ID is missing.");
        return;
    }

    try {
      // Delete in backend
      await productsApi.delete(productToDelete.id);

      // Update local state
      setInventoryItems(inventoryItems.filter(item => item.id !== productToDelete.id));

      // Close dialog and reset
      setIsDeleteDialogOpen(false);
      // setProductToDelete(null);

      // Show success message
      toast.success(`Product "${productToDelete.name}" deleted successfully!`);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleBarcodeScan = async (barcode: string) => {
    setIsScannerOpen(false);
    
    const toastId = 'barcode-lookup-' + Date.now();
    toast.loading('Looking up product...', { id: toastId });

    try {
      // Look up product information from barcode
      const productInfo = await lookupProductByBarcode(barcode);

      if (productInfo) {
        // Pre-fill the form with product info
        setNewProduct({
          name: productInfo.name || '',
          sku: barcode,
          category: productInfo.category || '',
          stock: '',
          costPrice: '',
          sellingPrice: '',
          vendorType: productInfo.brand || '',
          expiryDate: '',
          batchNumber: '',
          alertEnabled: true,
          threshold: '10',
          imageUrl: productInfo.imageUrl || '',
        });

        toast.success(`Product found: ${productInfo.name}`, { id: toastId });
        setIsAddDialogOpen(true);
      } else {
        // Product not found - still open dialog with barcode as SKU
        setNewProduct(prev => ({
          ...prev,
          sku: barcode,
        }));

        toast.info('Product not found in database. Please enter details manually.', { 
          id: toastId,
          duration: 5000,
        });
        setIsAddDialogOpen(true);
      }
    } catch (error) {
      console.error('Error looking up product:', error);
      toast.error('Failed to lookup product', { id: toastId });
      
      // Still open the dialog with just the barcode
      setNewProduct(prev => ({
        ...prev,
        sku: barcode,
      }));
      setIsAddDialogOpen(true);
    }
  };

  const handleAutoGenerateImages = async () => {
    // Find products without images
    const productsWithoutImages = inventoryItems.filter(p => !p.imageUrl);
    
    if (productsWithoutImages.length === 0) {
      toast.info('All products already have images!');
      return;
    }

    setIsGeneratingImage(true);
    const toastId = 'auto-gen-images';
    toast.loading(`Generating images for ${productsWithoutImages.length} products... (This may take a moment)`, { id: toastId });
    
    let successCount = 0;
    
    // Process sequentially to avoid rate limits
    for (const product of productsWithoutImages) {
      if (!product.id) continue;
      try {
        // Update toast to show progress
        toast.loading(`Generating image for: ${product.name} (${successCount + 1}/${productsWithoutImages.length})`, { id: toastId });
        
        const result = await generateProductImage(product.name, undefined, product.category);
        
        // Update product in backend
        await productsApi.update(product.id, {
          imageUrl: result.imageUrl
        });
        
        // Update local state immediately so user sees progress
        setInventoryItems(prev => prev.map(p => 
          p.id === product.id ? { ...p, imageUrl: result.imageUrl } : p
        ));
        
        successCount++;
      } catch (error) {
        console.error(`Failed to generate image for ${product.name}:`, error);
      }
    }
    
    setIsGeneratingImage(false);
    toast.dismiss(toastId);
    if (successCount > 0) {
      toast.success(`Successfully generated images for ${successCount} products!`);
    } else {
      toast.error('Failed to generate images. Please try again.');
    }
  };

  const handleVoiceInput = (transcript: string) => {
    const parsed = parseVoiceCommand(transcript);
    const summary = generateVoiceSummary(parsed);

    // Update form with parsed data
    if (parsed.name) {
      setNewProduct(prev => ({ ...prev, name: parsed.name || prev.name }));
    }
    if (parsed.quantity) {
      setNewProduct(prev => ({ ...prev, stock: parsed.quantity?.toString() || prev.stock }));
    }
    if (parsed.price) {
      setNewProduct(prev => ({ ...prev, sellingPrice: parsed.price?.toString() || prev.sellingPrice }));
    }
    if (parsed.expiryDate) {
      setNewProduct(prev => ({ ...prev, expiryDate: parsed.expiryDate || prev.expiryDate }));
    }

    // Show what was understood
    if (summary !== 'No data extracted') {
      toast.success(`Understood: ${summary}`, { duration: 4000 });
    }
  };

  const handleRestockVoiceInput = (transcript: string) => {
    const parsed = parseVoiceCommand(transcript);
    
    if (parsed.quantity && restockingProduct) {
      setRestockingProduct(prev => prev ? { ...prev, quantity: parsed.quantity?.toString() || prev.quantity } : null);
      toast.success(`Quantity set to: ${parsed.quantity} units`);
    }
  };

  const handleSalesVoiceInput = (transcript: string) => {
    const parsed = parseVoiceCommand(transcript);
    
    if (parsed.quantity && recordingSalesProduct) {
      setRecordingSalesProduct(prev => prev ? { ...prev, quantitySold: parsed.quantity?.toString() || prev.quantitySold } : null);
      toast.success(`Quantity sold set to: ${parsed.quantity} units`);
    }
  };

  const handleProcessExpiry = async () => {
    try {
      const { processedCount, totalLoss } = await productsApi.processExpiry();
      
      if (processedCount > 0) {
        toast.success(`Processed expiry: ${processedCount} items removed (Loss: ₹${totalLoss})`);
        // Refresh products
        setIsLoading(true);
        const products = await productsApi.getAll();
        setInventoryItems(products || []);
        setIsLoading(false);
      } else {
        toast.info('No expired items found.');
      }
    } catch (error) {
      console.error('Error processing expiry:', error);
      toast.error('Failed to process expiry');
    }
  };

  const handleViewLosses = async () => {
    try {
      setIsLoading(true);
      const lossesData = await productsApi.getLosses();
      setLosses(lossesData || []);
      setIsLossesDialogOpen(true);
    } catch (error) {
      console.error('Error fetching losses:', error);
      toast.error('Failed to load losses history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportLosses = () => {
    if (losses.length === 0) {
      toast.error('No data to export');
      return;
    }
    
    try {
      const headers = ['Date', 'Product Name', 'Batch Number', 'Quantity', 'Loss Amount', 'Reason'];
      const csvContent = [
        headers.join(','),
        ...losses.map(loss => [
          new Date(loss.date).toLocaleDateString(),
          `"${loss.productName.replace(/"/g, '""')}"`,
          loss.batchNumber || '',
          loss.quantity,
          loss.lossAmount,
          loss.reason
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `losses_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Loss report exported successfully');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export report');
    }
  };

  const handleAddDialogChange = (open: boolean) => {
    setIsAddDialogOpen(open);
    // Reset form when dialog closes
    if (!open) {
      if (searchParams.get('action') === 'add') {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('action');
        navigate({ search: newParams.toString() }, { replace: true });
      }

      setNewProduct({
        name: '',
        sku: '',
        category: '',
        stock: '',
        costPrice: '',
        sellingPrice: '',
        vendorType: '',
        expiryDate: '',
        alertEnabled: true,
        threshold: '10',
        imageUrl: '',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F9FC] via-[#EBF4FA] to-[#F5F9FC]">
      <motion.div
        className="p-6 md:p-8 space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-foreground">Inventory Management</h1>
            <p className="text-muted-foreground">Manage your products and stock levels</p>
          </div>
          <div className="flex gap-2">
            {/* Temporarily hidden - Scan Barcode button
            <Button 
              variant="outline"
              className="border-[#0F4C81] text-[#0F4C81] hover:bg-[#0F4C81]/10 rounded-full shadow-lg"
              onClick={() => setIsScannerOpen(true)}
            >
              <ScanLine className="w-4 h-4 mr-2" />
              Scan Barcode
            </Button>
            */}
            <Button 
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50 rounded-full shadow-lg flex"
              onClick={handleViewLosses}
            >
              <CircleAlert className="w-4 h-4 mr-2" />
              Losses
            </Button>
            <Button 
              variant="outline"
              className="border-[#0F4C81] text-[#0F4C81] hover:bg-[#0F4C81]/10 rounded-full shadow-lg hidden md:flex"
              onClick={handleAutoGenerateImages}
              disabled={isGeneratingImage}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Auto-fill Images
            </Button>
            <Button 
              className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-full shadow-lg shadow-[#0F4C81]/20" 
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg">
          <div className="p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F4C81]/40" />
              <input
                type="text"
                placeholder="Search by product name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-[#0F4C81]/5 border border-[#0F4C81]/10 focus:border-[#0F4C81]/30 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>
        </Card>

        {/* Inventory Table */}
        <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
          <div className="relative overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0F4C81]/5">
                <tr className="border-b border-[#0F4C81]/10">
                  <th className="text-left py-4 px-6 text-foreground">Product Name</th>
                  <th className="text-left py-4 px-6 text-foreground">SKU</th>
                  <th className="text-left py-4 px-6 text-foreground">Category</th>
                  <th className="text-left py-4 px-6 text-foreground">Stock</th>
                  <th className="text-left py-4 px-6 text-foreground">Price</th>
                  <th className="text-left py-4 px-6 text-foreground">Margin</th>
                  <th className="text-left py-4 px-6 text-foreground">Status</th>
                  <th className="text-left py-4 px-6 text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => {
                  const sellingPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price.replace(/[^0-9.]/g, '') || '0');
                  const costPrice = item.costPrice || 0;
                  const margin = sellingPrice > 0 ? ((sellingPrice - costPrice) / sellingPrice * 100).toFixed(0) : '0';
                  const marginVal = parseFloat(margin);
                  let marginColor = 'bg-gray-100 text-gray-600';
                  if (marginVal >= 40) marginColor = 'bg-green-100 text-green-700';
                  else if (marginVal >= 20) marginColor = 'bg-yellow-100 text-yellow-700';
                  else marginColor = 'bg-red-100 text-red-700';

                  return (
                  <tr 
                    key={`${item.id}-${index}`}
                    className="border-b border-[#0F4C81]/5 hover:bg-[#0F4C81]/5 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#0F4C81]/10 flex items-center justify-center overflow-hidden">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-[#0F4C81]" />
                          )}
                        </div>
                        <button
                          onClick={() => navigate(`/dashboard/inventory/${item.id}`)}
                          className="text-foreground hover:text-[#0F4C81] hover:underline transition-colors text-left"
                        >
                          {item.name}
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">{item.sku}</td>
                    <td className="py-4 px-6 text-muted-foreground">{item.category}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {item.stock < 10 && item.stock > 0 && (
                          <CircleAlert className="w-4 h-4 text-yellow-600" />
                        )}
                        {item.stock === 0 && (
                          <CircleAlert className="w-4 h-4 text-red-600" />
                        )}
                        <span className="text-foreground">{item.stock}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-foreground">₹{sellingPrice.toFixed(2)}</td>
                    <td className="py-4 px-6">
                       {costPrice > 0 ? (
                           <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${marginColor}`}>
                               {margin}%
                           </span>
                       ) : (
                           <span className="text-muted-foreground text-xs">-</span>
                       )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getStatusColor(getStatus(item.stock, item.threshold))}`}>
                        {getStatus(item.stock, item.threshold)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm"
                          variant="outline"
                          className="border-[#0F4C81]/20 text-[#0F4C81] hover:bg-[#0F4C81]/5"
                          onClick={() => handleEditClick(item)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white"
                          onClick={() => handleRestockClick(item)}
                        >
                          Restock
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white"
                          onClick={() => handleRecordSalesClick(item)}
                        >
                          Record Sales
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => handleDeleteClick(item)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={handleAddDialogChange}>
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border border-[#0F4C81]/20 shadow-2xl" aria-describedby="add-product-description">
          <DialogHeader>
            <DialogTitle className="text-[#0F4C81] flex items-center gap-2">
              <Package className="w-5 h-5" />
              Add New Product
            </DialogTitle>
            <DialogDescription id="add-product-description">
              Enter product details below to add a new item to your inventory.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {/* Image Upload/Generation Section */}
            <div className="flex flex-col gap-3">
              <Label className="text-[#0F4C81]">Product Image</Label>
              <div className="flex gap-4 items-start">
                <div className="w-24 h-24 rounded-lg bg-[#0F4C81]/5 border border-[#0F4C81]/10 flex items-center justify-center overflow-hidden">
                  {newProduct.imageUrl ? (
                    <img src={newProduct.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-[#0F4C81]/40" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Input 
                    placeholder="Image URL"
                    value={newProduct.imageUrl}
                    onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                    className="h-9 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81]"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleGenerateImage(false)}
                    disabled={isGeneratingImage || !newProduct.name}
                    className="w-full border-[#0F4C81]/20 text-[#0F4C81] hover:bg-[#0F4C81]/5"
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 mr-2" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#0F4C81]">Product Name</Label>
              <div className="flex gap-2 items-center">
                <Input 
                  id="name" 
                  placeholder="e.g., Organic Coffee Beans"
                  value={newProduct.name} 
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
                <VoiceInput onTranscript={handleVoiceInput} />
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Try: "Add 10 units of milk, expiring January 30th, price 50 rupees"
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku" className="text-[#0F4C81]">SKU</Label>
              <Input 
                id="sku" 
                placeholder="e.g., COF-001"
                value={newProduct.sku} 
                onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} 
                className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-[#0F4C81]">Category</Label>
              <Input 
                id="category" 
                list="categoryList"
                placeholder="e.g., Beverages"
                value={newProduct.category} 
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} 
                className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
              />
              <datalist id="categoryList">
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
            <div className="space-y-2">
              <Label htmlFor="batchNumber" className="text-[#0F4C81]">Batch Number (Optional)</Label>
              <Input 
                id="batchNumber" 
                placeholder="e.g., BATCH-001"
                value={newProduct.batchNumber} 
                onChange={(e) => setNewProduct({ ...newProduct, batchNumber: e.target.value })} 
                className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate" className="text-[#0F4C81]">Expiry Date (Optional)</Label>
              <Input 
                id="expiryDate" 
                type="date"
                value={newProduct.expiryDate} 
                onChange={(e) => setNewProduct({ ...newProduct, expiryDate: e.target.value })} 
                className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock" className="text-[#0F4C81]">Stock Quantity</Label>
                <Input 
                  id="stock" 
                  type="number"
                  placeholder="0"
                  value={newProduct.stock} 
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="costPrice" className="text-[#0F4C81]">Cost Price ($)</Label>
                <Input 
                  id="costPrice" 
                  type="text"
                  placeholder="24.99"
                  value={newProduct.costPrice} 
                  onChange={(e) => setNewProduct({ ...newProduct, costPrice: e.target.value })} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sellingPrice" className="text-[#0F4C81]">Selling Price ($)</Label>
                <Input 
                  id="sellingPrice" 
                  type="text"
                  placeholder="24.99"
                  value={newProduct.sellingPrice} 
                  onChange={(e) => setNewProduct({ ...newProduct, sellingPrice: e.target.value })} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendorType" className="text-[#0F4C81]">Vendor Type</Label>
                <Input 
                  id="vendorType" 
                  list="vendorList"
                  placeholder="Select or type vendor name"
                  value={newProduct.vendorType} 
                  onChange={(e) => setNewProduct({ ...newProduct, vendorType: e.target.value })} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
                <datalist id="vendorList">
                  {vendorNames.map(vendor => (
                    <option key={vendor} value={vendor} />
                  ))}
                </datalist>
              </div>
            </div>
            
            {/* Stock Alert Settings */}
            <div className="space-y-4 p-4 rounded-lg bg-[#0F4C81]/5 border border-[#0F4C81]/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#0F4C81]" />
                  <Label htmlFor="alertEnabled" className="text-[#0F4C81] cursor-pointer">
                    Low Stock Alerts
                  </Label>
                </div>
                <Switch 
                  id="alertEnabled"
                  checked={newProduct.alertEnabled}
                  onCheckedChange={(checked) => setNewProduct({ ...newProduct, alertEnabled: checked })}
                />
              </div>
              {newProduct.alertEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="threshold" className="text-[#0F4C81]">Alert Threshold (units)</Label>
                  <Input 
                    id="threshold" 
                    type="number"
                    placeholder="10"
                    value={newProduct.threshold} 
                    onChange={(e) => setNewProduct({ ...newProduct, threshold: e.target.value })} 
                    className="h-11 bg-white border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                  />
                  <p className="text-xs text-muted-foreground">
                    You'll be notified when stock falls to or below this level
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline"
              className="flex-1 border-[#0F4C81]/20 text-[#0F4C81] hover:bg-[#0F4C81]/5"
              onClick={() => setIsAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-full shadow-lg shadow-[#0F4C81]/30"
              onClick={handleAddProduct}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] bg-white/95 backdrop-blur-xl border border-[#0F4C81]/20 shadow-2xl overflow-y-auto custom-scrollbar" aria-describedby="edit-product-description">
          <DialogHeader>
            <DialogTitle className="text-[#0F4C81] flex items-center gap-2">
              <Package className="w-5 h-5" />
              Edit Product
            </DialogTitle>
            <DialogDescription id="edit-product-description">
              Modify the product details below. Click update to save changes.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
             {/* Image Upload/Generation Section */}
             <div className="flex flex-col gap-3">
              <Label className="text-[#0F4C81]">Product Image</Label>
              <div className="flex gap-4 items-start">
                <div className="w-24 h-24 rounded-lg bg-[#0F4C81]/5 border border-[#0F4C81]/10 flex items-center justify-center overflow-hidden">
                  {editingProduct?.imageUrl ? (
                    <img src={editingProduct.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-[#0F4C81]/40" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Input 
                    placeholder="Image URL"
                    value={editingProduct?.imageUrl || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct!, imageUrl: e.target.value })}
                    className="h-9 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81]"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleGenerateImage(true)}
                    disabled={isGeneratingImage || !editingProduct?.name}
                    className="w-full border-[#0F4C81]/20 text-[#0F4C81] hover:bg-[#0F4C81]/5"
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 mr-2" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#0F4C81]">Product Name</Label>
              <Input 
                id="name" 
                placeholder="e.g., Organic Coffee Beans"
                value={editingProduct?.name || ''} 
                onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, name: e.target.value }) : null)} 
                className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku" className="text-[#0F4C81]">SKU</Label>
              <Input 
                id="sku" 
                placeholder="e.g., COF-001"
                value={editingProduct?.sku || ''} 
                onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, sku: e.target.value }) : null)} 
                className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-[#0F4C81]">Category</Label>
              <Input 
                id="category" 
                list="editCategoryList"
                placeholder="e.g., Beverages"
                value={editingProduct?.category || ''} 
                onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, category: e.target.value }) : null)} 
                className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
              />
              <datalist id="editCategoryList">
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editExpiryDate" className="text-[#0F4C81]">Expiry Date (Optional)</Label>
              <Input 
                id="editExpiryDate" 
                type="date"
                value={editingProduct?.expiryDate || ''} 
                onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, expiryDate: e.target.value }) : null)} 
                className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock" className="text-[#0F4C81]">Stock Quantity</Label>
                <Input 
                  id="stock" 
                  type="number"
                  placeholder="0"
                  value={editingProduct?.stock || ''} 
                  onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, stock: e.target.value }) : null)} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="costPrice" className="text-[#0F4C81]">Cost Price ($)</Label>
                <Input 
                  id="costPrice" 
                  type="text"
                  placeholder="24.99"
                  value={editingProduct?.costPrice || ''} 
                  onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, costPrice: e.target.value }) : null)} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sellingPrice" className="text-[#0F4C81]">Selling Price ($)</Label>
                <Input 
                  id="sellingPrice" 
                  type="text"
                  placeholder="24.99"
                  value={editingProduct?.sellingPrice || ''} 
                  onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, sellingPrice: e.target.value }) : null)} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendorType" className="text-[#0F4C81]">Vendor Type</Label>
                <Input 
                  id="vendorType" 
                  list="editVendorList"
                  placeholder="Select or type vendor name"
                  value={editingProduct?.vendorType || ''} 
                  onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, vendorType: e.target.value }) : null)} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
                <datalist id="editVendorList">
                  {vendorNames.map(vendor => (
                    <option key={vendor} value={vendor} />
                  ))}
                </datalist>
              </div>
            </div>
            
            {/* Stock Alert Settings */}
            <div className="space-y-4 p-4 rounded-lg bg-[#0F4C81]/5 border border-[#0F4C81]/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#0F4C81]" />
                  <Label htmlFor="editAlertEnabled" className="text-[#0F4C81] cursor-pointer">
                    Low Stock Alerts
                  </Label>
                </div>
                <Switch 
                  id="editAlertEnabled"
                  checked={editingProduct?.alertEnabled || false}
                  onCheckedChange={(checked) => setEditingProduct({ ...editingProduct!, alertEnabled: checked })}
                />
              </div>
              {editingProduct?.alertEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="editThreshold" className="text-[#0F4C81]">Alert Threshold (units)</Label>
                  <Input 
                    id="editThreshold" 
                    type="number"
                    placeholder="10"
                    value={editingProduct?.threshold || ''} 
                    onChange={(e) => setEditingProduct({ ...editingProduct!, threshold: e.target.value })} 
                    className="h-11 bg-white border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                  />
                  <p className="text-xs text-muted-foreground">
                    You'll be notified when stock falls to or below this level
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline"
              className="flex-1 border-[#0F4C81]/20 text-[#0F4C81] hover:bg-[#0F4C81]/5"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-full shadow-lg shadow-[#0F4C81]/30"
              onClick={handleUpdateProduct}
            >
              <Plus className="w-4 h-4 mr-2" />
              Update Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Restock Product Dialog */}
      <Dialog open={isRestockDialogOpen} onOpenChange={setIsRestockDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border border-[#0F4C81]/20 shadow-2xl" aria-describedby="restock-product-description">
          <DialogHeader>
            <DialogTitle className="text-[#0F4C81] flex items-center gap-2">
              <PackagePlus className="w-5 h-5" />
              Restock Product
            </DialogTitle>
            <DialogDescription id="restock-product-description">
              Add stock to your inventory. This will increase the current stock level.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#0F4C81]">Product Name</Label>
              <Input 
                id="name" 
                placeholder="e.g., Organic Coffee Beans"
                value={restockingProduct?.name || ''} 
                readOnly
                className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentStock" className="text-[#0F4C81]">Current Stock</Label>
              <Input 
                id="currentStock" 
                placeholder="0"
                value={restockingProduct?.currentStock.toString() || ''} 
                readOnly
                className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-[#0F4C81]">Restock Quantity</Label>
              <div className="flex gap-2 items-center">
                <Input 
                  id="quantity" 
                  type="number"
                  placeholder="0"
                  value={restockingProduct?.quantity || ''} 
                  onChange={(e) => setRestockingProduct(prev => prev ? ({ ...prev, quantity: e.target.value }) : null)} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
                <VoiceInput onTranscript={handleRestockVoiceInput} />
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Say: "50 units" or "add 20 pieces"
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="restockBatchNumber" className="text-[#0F4C81]">Batch Number (Optional)</Label>
              <Input 
                id="restockBatchNumber" 
                placeholder="e.g., BATCH-002"
                value={restockingProduct?.batchNumber || ''} 
                onChange={(e) => setRestockingProduct(prev => prev ? ({ ...prev, batchNumber: e.target.value }) : null)} 
                className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restockExpiryDate" className="text-[#0F4C81]">Expiry Date (Optional)</Label>
              <Input 
                id="restockExpiryDate" 
                type="date"
                value={restockingProduct?.expiryDate || ''} 
                onChange={(e) => setRestockingProduct(prev => prev ? ({ ...prev, expiryDate: e.target.value }) : null)} 
                className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline"
              className="flex-1 border-[#0F4C81]/20 text-[#0F4C81] hover:bg-[#0F4C81]/5"
              onClick={() => setIsRestockDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-full shadow-lg shadow-[#0F4C81]/30"
              onClick={handleRestockProduct}
            >
              <Plus className="w-4 h-4 mr-2" />
              Restock Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Record Sales Dialog */}
      <Dialog open={isRecordSalesDialogOpen} onOpenChange={setIsRecordSalesDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border border-[#0F4C81]/20 shadow-2xl" aria-describedby="record-sales-description">
          <DialogHeader>
            <DialogTitle className="text-[#0F4C81] flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Record Sales
            </DialogTitle>
            <DialogDescription id="record-sales-description">
              Record a sale for this product to update stock and revenue.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#0F4C81]">Product Name</Label>
              <Input 
                id="name" 
                placeholder="e.g., Organic Coffee Beans"
                value={recordingSalesProduct?.name || ''} 
                readOnly
                className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentStock" className="text-[#0F4C81]">Current Stock</Label>
              <Input 
                id="currentStock" 
                placeholder="0"
                value={recordingSalesProduct?.currentStock.toString() || ''} 
                readOnly
                className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="text-[#0F4C81]">Price (₹)</Label>
              <Input 
                id="price" 
                placeholder="0"
                value={recordingSalesProduct?.price.toString() || ''} 
                readOnly
                className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantitySold" className="text-[#0F4C81]">Quantity Sold</Label>
              <div className="flex gap-2 items-center">
                <Input 
                  id="quantitySold" 
                  type="number"
                  placeholder="0"
                  value={recordingSalesProduct?.quantitySold || ''} 
                  onChange={(e) => setRecordingSalesProduct(prev => prev ? ({ ...prev, quantitySold: e.target.value }) : null)} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
                <VoiceInput onTranscript={handleSalesVoiceInput} />
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Say: "sold 15 units" or "5 pieces"
              </p>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline"
              className="flex-1 border-[#0F4C81]/20 text-[#0F4C81] hover:bg-[#0F4C81]/5"
              onClick={() => setIsRecordSalesDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-full shadow-lg shadow-[#0F4C81]/30"
              onClick={handleRecordSales}
            >
              <Plus className="w-4 h-4 mr-2" />
              Record Sales
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border border-[#0F4C81]/20 shadow-2xl" aria-describedby="delete-product-description">
          <DialogHeader>
            <DialogTitle className="text-[#0F4C81] flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Delete Product
            </DialogTitle>
            <DialogDescription id="delete-product-description">
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#0F4C81]">Product Name</Label>
              <Input 
                id="name" 
                placeholder="e.g., Organic Coffee Beans"
                value={productToDelete?.name || ''} 
                readOnly
                className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline"
              className="flex-1 border-[#0F4C81]/20 text-[#0F4C81] hover:bg-[#0F4C81]/5"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg shadow-[#0F4C81]/30"
              onClick={handleDeleteProduct}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Losses Dialog */}
      <Dialog open={isLossesDialogOpen} onOpenChange={setIsLossesDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <DialogTitle>Recorded Losses</DialogTitle>
              <DialogDescription>
                History of expired items removed from stock.
              </DialogDescription>
            </div>
            {losses.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportLosses}
                className="h-8 gap-2"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Export CSV</span>
              </Button>
            )}
          </DialogHeader>
          <div className="mt-4">
             {losses.length === 0 ? (
               <div className="text-center py-8 text-muted-foreground">
                 <CircleAlert className="w-12 h-12 mx-auto mb-3 opacity-20" />
                 <p>No losses recorded yet.</p>
               </div>
             ) : (
               <div className="relative overflow-x-auto rounded-xl border border-border">
                 <table className="w-full text-sm text-left">
                   <thead className="text-xs uppercase bg-muted text-muted-foreground">
                     <tr>
                       <th className="px-4 py-3">Date</th>
                       <th className="px-4 py-3">Product</th>
                       <th className="px-4 py-3 text-right">Qty</th>
                       <th className="px-4 py-3 text-right">Loss Value</th>
                       <th className="px-4 py-3">Reason</th>
                     </tr>
                   </thead>
                   <tbody>
                     {losses.slice().reverse().map((loss) => (
                       <tr key={loss.id} className="bg-card border-b border-border last:border-0">
                         <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                           {new Date(loss.date).toLocaleDateString()}
                         </td>
                         <td className="px-4 py-3 font-medium text-foreground">
                           {loss.productName}
                           {loss.batchNumber && <span className="block text-xs text-muted-foreground">Batch: {loss.batchNumber}</span>}
                         </td>
                         <td className="px-4 py-3 text-right font-medium text-red-600">
                           -{loss.quantity}
                         </td>
                         <td className="px-4 py-3 text-right font-medium text-red-600">
                           ₹{loss.lossAmount.toLocaleString()}
                         </td>
                         <td className="px-4 py-3 text-muted-foreground">
                           <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                             {loss.reason}
                           </span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Barcode Scanner - Temporarily hidden
      {isScannerOpen && (
        <BarcodeScanner
          onScanSuccess={handleBarcodeScan}
          onClose={() => setIsScannerOpen(false)}
        />
      )}
      */}
      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        description={upgradeMessage}
      />
    </div>
  );
}