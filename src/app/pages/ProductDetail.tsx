import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Package, TrendingUp, AlertCircle, Calendar, DollarSign, Edit2, Trash2, ShoppingCart, PackagePlus } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner';
import { productsApi } from '../services/api';
import type { Product } from '../data/dashboardData';
import { AIProductHelper } from '../components/ai/AIProductHelper';

export function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRestockDialogOpen, setIsRestockDialogOpen] = useState(false);
  const [isRecordSalesDialogOpen, setIsRecordSalesDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
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
    description: string;
    imageUrl: string;
  } | null>(null);

  const [restockQuantity, setRestockQuantity] = useState('');
  const [salesQuantity, setSalesQuantity] = useState('');

  const [movements, setMovements] = useState<any[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAdjustStockDialogOpen, setIsAdjustStockDialogOpen] = useState(false);
  
  // Restock Form State
  const [restockForm, setRestockForm] = useState({
    quantity: '',
    costPrice: '',
    batchNumber: '',
    expiryDate: ''
  });

  // Adjust Stock Form State
  const [adjustForm, setAdjustForm] = useState({
    quantity: '',
    type: 'damaged', // expired, damaged, missing, correction
    reason: ''
  });

  useEffect(() => {
    loadProduct();
  }, [productId]);

  useEffect(() => {
    if (product) {
      loadMovements();
    }
  }, [product]);

  const loadMovements = async () => {
    if (!product) return;
    try {
      const history = await productsApi.getMovements(product.id);
      setMovements(history);
    } catch (e) {
      console.error("Failed to load history", e);
    }
  };

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      const products = await productsApi.getAll();
      const foundProduct = products.find(p => p.id === Number(productId));
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        toast.error('Product not found');
        navigate('/dashboard/inventory');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product');
      navigate('/dashboard/inventory');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (!product) return;
    setEditingProduct({
      id: product.id,
      name: product.name || '',
      sku: product.sku || '',
      category: product.category || '',
      stock: (product.stock ?? 0).toString(),
      costPrice: (product.costPrice ?? 0).toString(),
      sellingPrice: (product.sellingPrice ?? 0).toString(),
      vendorType: product.vendorType || '',
      expiryDate: product.expiryDate || '',
      alertEnabled: product.alertEnabled,
      threshold: (product.threshold ?? 0).toString(),
      description: product.description || '',
      imageUrl: product.imageUrl || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;

    try {
      const updatedProduct = await productsApi.update(editingProduct.id, {
        name: editingProduct.name,
        sku: editingProduct.sku,
        category: editingProduct.category,
        stock: parseInt(editingProduct.stock),
        costPrice: parseFloat(editingProduct.costPrice),
        sellingPrice: parseFloat(editingProduct.sellingPrice),
        price: parseFloat(editingProduct.sellingPrice),
        vendorType: editingProduct.vendorType,
        expiryDate: editingProduct.expiryDate,
        alertEnabled: editingProduct.alertEnabled,
        threshold: parseInt(editingProduct.threshold),
        description: editingProduct.description,
        imageUrl: editingProduct.imageUrl,
      });

      setProduct(updatedProduct);
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      toast.success('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleRestock = async () => {
    if (!product || !restockForm.quantity) return;

    try {
      const quantity = parseInt(restockForm.quantity);
      // Backend supports batchNumber and expiryDate
      const updatedProduct = await productsApi.restock(
          product.id, 
          quantity, 
          restockForm.batchNumber, 
          restockForm.expiryDate
      );
      setProduct(updatedProduct);
      setIsRestockDialogOpen(false);
      setRestockForm({ quantity: '', costPrice: '', batchNumber: '', expiryDate: '' });
      toast.success(`Added ${quantity} units to stock!`);
      loadMovements();
    } catch (error) {
      console.error('Error restocking product:', error);
      toast.error('Failed to restock product');
    }
  };

  const handleAdjustStock = async () => {
      if (!product || !adjustForm.quantity) return;
      
      try {
          const qty = parseInt(adjustForm.quantity);
          // Negative quantity for deduction
          const adjustmentQty = -Math.abs(qty);
          
          const updatedProduct = await productsApi.adjustStock(
              product.id,
              adjustmentQty,
              adjustForm.type,
              adjustForm.reason
          );
          setProduct(updatedProduct);
          setIsAdjustStockDialogOpen(false);
          setAdjustForm({ quantity: '', type: 'damaged', reason: '' });
          toast.success(`Stock adjusted by ${adjustmentQty} units.`);
          loadMovements();
      } catch (error) {
          console.error('Error adjusting stock:', error);
          toast.error('Failed to adjust stock');
      }
  };

  const handleRecordSale = async () => {
    if (!product || !salesQuantity) return;

    try {
      const quantity = parseInt(salesQuantity);
      if (quantity > product.stock) {
        toast.error('Insufficient stock');
        return;
      }

      const updatedProduct = await productsApi.recordSale(product.id, quantity);
      setProduct(updatedProduct);
      setIsRecordSalesDialogOpen(false);
      setSalesQuantity('');
      toast.success(`Recorded sale of ${quantity} units!`);
    } catch (error) {
      console.error('Error recording sale:', error);
      toast.error('Failed to record sale');
    }
  };

  const handleDelete = async () => {
    if (!product) return;

    try {
      await productsApi.delete(product.id);
      toast.success('Product deleted successfully!');
      navigate('/dashboard/inventory');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const getStockStatus = (stock: number, threshold: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-500/20 text-red-300' };
    if (stock <= threshold) return { label: 'Low Stock', color: 'bg-yellow-500/20 text-yellow-300' };
    return { label: 'In Stock', color: 'bg-green-500/20 text-green-300' };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A1828] via-[#0F4C81] to-[#1B365D] p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const stockStatus = getStockStatus(product.stock, product.threshold);
  const profitMargin = ((product.sellingPrice - product.costPrice) / product.sellingPrice * 100).toFixed(1);
  const marginValue = parseFloat(profitMargin);
  let marginColor = 'text-white';
  let marginLabel = '';
  if (marginValue >= 40) { marginColor = 'text-green-400'; marginLabel = '(High)'; }
  else if (marginValue >= 20) { marginColor = 'text-yellow-400'; marginLabel = '(Medium)'; }
  else { marginColor = 'text-red-400'; marginLabel = '(Low)'; }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1828] via-[#0F4C81] to-[#1B365D] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            onClick={() => navigate('/dashboard/inventory')}
            variant="ghost"
            className="text-white mb-4 -ml-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inventory
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-white mb-2">{product.name}</h1>
              <p className="text-white/60">SKU: {product.sku}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleEdit} variant="outline" className="text-white border-white/20 bg-[rgb(3,18,30)]">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button 
                onClick={() => setIsDeleteDialogOpen(true)}
                variant="outline" 
                className="text-red-300 border-red-500/20 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Image & Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
              {/* Product Image */}
              <div className="aspect-square rounded-lg overflow-hidden bg-white/5 mb-6">
                {product.imageUrl ? (
                  <ImageWithFallback
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-24 h-24 text-white/20" />
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <Button
                  onClick={() => setIsRestockDialogOpen(true)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <PackagePlus className="w-4 h-4 mr-2" />
                  Restock
                </Button>
                <Button
                  onClick={() => setIsRecordSalesDialogOpen(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Record Sale
                </Button>
                <Button
                  onClick={() => setIsAdjustStockDialogOpen(true)}
                  variant="outline"
                  className="w-full text-white border-white/20 hover:bg-white/10"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Adjust Stock
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Overview Card */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
              <h2 className="text-white mb-4">Product Overview</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-white/60 text-sm mb-1">Category</p>
                  <Badge className="bg-white/10 text-white">{product.category}</Badge>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Status</p>
                  <Badge className={stockStatus.color}>{stockStatus.label}</Badge>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Current Stock</p>
                  <p className="text-white">{product.stock} units</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Threshold</p>
                  <p className="text-white">{product.threshold} units</p>
                </div>
              </div>

              {product.description && (
                <div className="mb-6">
                  <p className="text-white/60 text-sm mb-2">Description</p>
                  <p className="text-white">{product.description}</p>
                </div>
              )}

              {product.vendorType && (
                <div>
                  <p className="text-white/60 text-sm mb-1">Vendor</p>
                  <p className="text-white">{product.vendorType}</p>
                </div>
              )}
            </Card>

            {/* Pricing Card */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
              <h2 className="text-white mb-4">Pricing & Revenue</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <p className="text-white/60 text-sm">Selling Price</p>
                  </div>
                  <p className="text-white">₹{product.sellingPrice}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-orange-400" />
                    <p className="text-white/60 text-sm">Cost Price</p>
                  </div>
                  <p className="text-white">₹{product.costPrice}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    <p className="text-white/60 text-sm">Profit Margin</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className={`text-xl font-bold ${marginColor}`}>{profitMargin}%</p>
                    <span className={`text-xs ${marginColor}`}>{marginLabel}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <p className="text-white/60 text-sm">Total Revenue</p>
                  </div>
                  <p className="text-white">₹{product.revenue.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </Card>

            {/* Sales Performance Card */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
              <h2 className="text-white mb-4">Sales Performance</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-white/60 text-sm mb-1">Units Sold</p>
                  <p className="text-white">{product.unitsSold} units</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Average Price</p>
                  <p className="text-white">₹{product.unitsSold > 0 ? (product.revenue / product.unitsSold).toFixed(2) : '0.00'}</p>
                </div>
              </div>
            </Card>

            {/* Additional Info Card */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
              <h2 className="text-white mb-4">Additional Information</h2>
              
              <div className="space-y-4">
                {product.expiryDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-white/60" />
                    <div>
                      <p className="text-white/60 text-sm">Expiry Date</p>
                      <p className="text-white">{new Date(product.expiryDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-white/60" />
                  <div>
                    <p className="text-white/60 text-sm">Low Stock Alerts</p>
                    <p className="text-white">{product.alertEnabled ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-white/60" />
                  <div>
                    <p className="text-white/60 text-sm">Last Updated</p>
                    <p className="text-white">{new Date(product.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Batches & Expiry Intelligence */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
              <h2 className="text-white mb-4">Stock Batches & Expiry</h2>
              {!product.batches || product.batches.length === 0 ? (
                <p className="text-white/60">No batch information available.</p>
              ) : (
                <div className="space-y-4">
                  {product.batches.map((batch: any) => {
                     const expiryDate = new Date(batch.expiryDate);
                     const now = new Date();
                     const timeDiff = expiryDate.getTime() - now.getTime();
                     const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
                     
                     let statusColor = 'text-green-400';
                     let suggestion = '';
                     if (daysLeft < 0) { statusColor = 'text-red-500'; suggestion = 'Mark as Wastage'; }
                     else if (daysLeft < 7) { statusColor = 'text-red-400'; suggestion = 'Apply Discount'; }
                     else if (daysLeft < 30) { statusColor = 'text-yellow-400'; suggestion = 'Monitor'; }

                     return (
                       <div key={batch.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                         <div className="flex justify-between items-start mb-2">
                           <div>
                             <p className="text-white font-medium">{batch.batchNumber}</p>
                             <p className="text-white/60 text-xs">Rec: {new Date(batch.receivedDate).toLocaleDateString()}</p>
                           </div>
                           <div className="text-right">
                             <p className="text-white font-bold">{batch.quantity} units</p>
                             <Badge className={`mt-1 ${daysLeft < 7 ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                                {daysLeft < 0 ? 'Expired' : `${daysLeft} days left`}
                             </Badge>
                           </div>
                         </div>
                         {suggestion && (
                           <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                              <p className={`text-xs ${statusColor} flex items-center gap-1`}>
                                <AlertCircle size={12} /> Suggestion: {suggestion}
                              </p>
                           </div>
                         )}
                       </div>
                     );
                  })}
                </div>
              )}
            </Card>

            {/* Inventory History */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
               <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setIsHistoryOpen(!isHistoryOpen)}>
                 <h2 className="text-white">Inventory History</h2>
                 <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
                    {isHistoryOpen ? 'Hide' : 'Show'}
                 </Button>
               </div>
               
               {isHistoryOpen && (
                 <div className="space-y-3">
                    {movements.length === 0 ? (
                        <p className="text-white/60">No history available.</p>
                    ) : (
                        movements.map((mov) => (
                           <div key={mov.id} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                              <div>
                                 <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-0.5 rounded uppercase font-bold ${
                                        mov.type === 'sale' ? 'bg-blue-500/20 text-blue-300' :
                                        mov.type === 'restock' ? 'bg-green-500/20 text-green-300' :
                                        'bg-red-500/20 text-red-300'
                                    }`}>
                                        {mov.type}
                                    </span>
                                    <span className="text-white/80 text-sm">{mov.reason}</span>
                                 </div>
                                 <p className="text-white/40 text-xs mt-1">{new Date(mov.date).toLocaleString()}</p>
                              </div>
                              <div className={`font-mono font-bold ${mov.quantity > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                 {mov.quantity > 0 ? '+' : ''}{mov.quantity}
                              </div>
                           </div>
                        ))
                    )}
                 </div>
               )}
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-[#0F4C81] border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="edit-product-description">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Product</DialogTitle>
            <DialogDescription id="edit-product-description" className="text-white/60">
              Make changes to the product details below.
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name" className="text-white">Product Name</Label>
                  <Input
                    id="edit-name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-sku" className="text-white">SKU</Label>
                  <Input
                    id="edit-sku"
                    value={editingProduct.sku}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-description" className="text-white">Description</Label>
                <Input
                  id="edit-description"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div>
                <Label htmlFor="edit-imageUrl" className="text-white">Image URL</Label>
                <Input
                  id="edit-imageUrl"
                  value={editingProduct.imageUrl}
                  onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* AI Product Helper */}
              <AIProductHelper
                productName={editingProduct.name}
                productCategory={editingProduct.category}
                price={parseFloat(editingProduct.sellingPrice) || 0}
                productDescription={editingProduct.description}
                onDescriptionEnhanced={(description) => 
                  setEditingProduct({ ...editingProduct, description })
                }
                onImageGenerated={(imageUrl) => 
                  setEditingProduct({ ...editingProduct, imageUrl })
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-category" className="text-white">Category</Label>
                  <Input
                    id="edit-category"
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-vendor" className="text-white">Vendor</Label>
                  <Input
                    id="edit-vendor"
                    value={editingProduct.vendorType}
                    onChange={(e) => setEditingProduct({ ...editingProduct, vendorType: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-stock" className="text-white">Stock</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-cost" className="text-white">Cost Price (₹)</Label>
                  <Input
                    id="edit-cost"
                    type="number"
                    value={editingProduct.costPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, costPrice: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-selling" className="text-white">Selling Price (₹)</Label>
                  <Input
                    id="edit-selling"
                    type="number"
                    value={editingProduct.sellingPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sellingPrice: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-threshold" className="text-white">Alert Threshold</Label>
                  <Input
                    id="edit-threshold"
                    type="number"
                    value={editingProduct.threshold}
                    onChange={(e) => setEditingProduct({ ...editingProduct, threshold: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="px-[0px] py-[2px] mx-[0px] my-[2px]">
                  <Label htmlFor="edit-expiry" className="text-white">Expiry Date</Label>
                  <Input
                    id="edit-expiry"
                    type="date"
                    value={editingProduct.expiryDate}
                    onChange={(e) => setEditingProduct({ ...editingProduct, expiryDate: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-alert"
                  checked={editingProduct.alertEnabled}
                  onCheckedChange={(checked) => setEditingProduct({ ...editingProduct, alertEnabled: checked })}
                />
                <Label htmlFor="edit-alert" className="text-white">Enable Low Stock Alerts</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveEdit} className="flex-1 bg-green-600 hover:bg-green-700">
                  Save Changes
                </Button>
                <Button onClick={() => setIsEditDialogOpen(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Restock Dialog */}
      <Dialog open={isRestockDialogOpen} onOpenChange={setIsRestockDialogOpen}>
        <DialogContent className="bg-[#0F4C81] border-white/20 text-white" aria-describedby="restock-product-description">
          <DialogHeader>
            <DialogTitle className="text-white">Restock Product</DialogTitle>
            <DialogDescription id="restock-product-description" className="text-white/60">
              Add inventory to the current stock count.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-white/80">Current Stock: {product.stock} units</p>
            <div>
              <Label htmlFor="restock-quantity" className="text-white">Quantity to Add</Label>
              <Input
                id="restock-quantity"
                type="number"
                value={restockForm.quantity}
                onChange={(e) => setRestockForm({...restockForm, quantity: e.target.value})}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Enter quantity"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="restock-batch" className="text-white">Batch Number</Label>
                  <Input
                    id="restock-batch"
                    value={restockForm.batchNumber}
                    onChange={(e) => setRestockForm({...restockForm, batchNumber: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <Label htmlFor="restock-expiry" className="text-white">Expiry Date</Label>
                  <Input
                    id="restock-expiry"
                    type="date"
                    value={restockForm.expiryDate}
                    onChange={(e) => setRestockForm({...restockForm, expiryDate: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
            </div>

            <p className="text-white/60 text-sm">
              New Stock: {product.stock + (parseInt(restockForm.quantity) || 0)} units
            </p>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleRestock} className="flex-1 bg-green-600 hover:bg-green-700">
                Confirm Restock
              </Button>
              <Button onClick={() => setIsRestockDialogOpen(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Adjust Stock Dialog */}
      <Dialog open={isAdjustStockDialogOpen} onOpenChange={setIsAdjustStockDialogOpen}>
        <DialogContent className="bg-[#0F4C81] border-white/20 text-white" aria-describedby="adjust-stock-description">
          <DialogHeader>
            <DialogTitle className="text-white">Adjust Stock (Reduction)</DialogTitle>
            <DialogDescription id="adjust-stock-description" className="text-white/60">
              Record wastage, damage, or inventory corrections.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-white/80">Current Stock: {product.stock} units</p>
            
            <div>
              <Label htmlFor="adjust-quantity" className="text-white">Quantity to Remove</Label>
              <Input
                id="adjust-quantity"
                type="number"
                value={adjustForm.quantity}
                onChange={(e) => setAdjustForm({...adjustForm, quantity: e.target.value})}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Enter quantity"
              />
            </div>

            <div>
              <Label htmlFor="adjust-type" className="text-white">Reason</Label>
              <select 
                id="adjust-type"
                value={adjustForm.type}
                onChange={(e) => setAdjustForm({...adjustForm, type: e.target.value})}
                className="w-full bg-white/10 border border-white/20 text-white rounded-md p-2"
              >
                  <option value="expired">Expired</option>
                  <option value="damaged">Damaged</option>
                  <option value="missing">Missing / Theft</option>
                  <option value="correction">Inventory Correction</option>
              </select>
            </div>
            
            <div>
               <Label htmlFor="adjust-notes" className="text-white">Notes (Optional)</Label>
               <Input
                  id="adjust-notes"
                  value={adjustForm.reason}
                  onChange={(e) => setAdjustForm({...adjustForm, reason: e.target.value})}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Additional details..."
               />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleAdjustStock} className="flex-1 bg-red-600 hover:bg-red-700">
                Confirm Reduction
              </Button>
              <Button onClick={() => setIsAdjustStockDialogOpen(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Record Sale Dialog */}
      <Dialog open={isRecordSalesDialogOpen} onOpenChange={setIsRecordSalesDialogOpen}>
        <DialogContent className="bg-[#0F4C81] border-white/20 text-white" aria-describedby="record-sale-description">
          <DialogHeader>
            <DialogTitle className="text-white">Record Sale</DialogTitle>
            <DialogDescription id="record-sale-description" className="text-white/60">
              Deduct items from stock and record a sale.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-white/80">Current Stock: {product.stock} units</p>
            <p className="text-white/80">Price: ₹{product.sellingPrice} per unit</p>
            <div>
              <Label htmlFor="sale-quantity" className="text-white">Quantity Sold</Label>
              <Input
                id="sale-quantity"
                type="number"
                value={salesQuantity}
                onChange={(e) => setSalesQuantity(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Enter quantity"
                max={product.stock}
              />
            </div>
            <p className="text-white/60 text-sm">
              Total Amount: ₹{(product.sellingPrice * (parseInt(salesQuantity) || 0)).toFixed(2)}
            </p>
            <p className="text-white/60 text-sm">
              Remaining Stock: {product.stock - (parseInt(salesQuantity) || 0)} units
            </p>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleRecordSale} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Confirm Sale
              </Button>
              <Button onClick={() => setIsRecordSalesDialogOpen(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-[#0F4C81] border-white/20 text-white" aria-describedby="delete-product-description">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Product</DialogTitle>
            <DialogDescription id="delete-product-description" className="text-white/60">
              Confirm deletion of this product. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-white">Are you sure you want to delete <strong>{product.name}</strong>?</p>
            <p className="text-white/60 text-sm">This action cannot be undone.</p>
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleDelete} 
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
              <Button 
                onClick={() => setIsDeleteDialogOpen(false)} 
                variant="outline" 
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}