import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Package, TrendingUp, AlertCircle, Calendar, DollarSign, Edit2, Trash2, ShoppingCart, PackagePlus } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
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

  useEffect(() => {
    loadProduct();
  }, [productId]);

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
      name: product.name,
      sku: product.sku,
      category: product.category,
      stock: product.stock.toString(),
      costPrice: product.costPrice.toString(),
      sellingPrice: product.sellingPrice.toString(),
      vendorType: product.vendorType || '',
      expiryDate: product.expiryDate || '',
      alertEnabled: product.alertEnabled,
      threshold: product.threshold.toString(),
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
    if (!product || !restockQuantity) return;

    try {
      const quantity = parseInt(restockQuantity);
      const updatedProduct = await productsApi.restock(product.id, quantity);
      setProduct(updatedProduct);
      setIsRestockDialogOpen(false);
      setRestockQuantity('');
      toast.success(`Added ${quantity} units to stock!`);
    } catch (error) {
      console.error('Error restocking product:', error);
      toast.error('Failed to restock product');
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
              <Button onClick={handleEdit} variant="outline" className="text-white border-white/20">
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
                  <p className="text-white">{profitMargin}%</p>
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
          </motion.div>
        </div>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-[#0F4C81] border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Product</DialogTitle>
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
                <div>
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
        <DialogContent className="bg-[#0F4C81] border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Restock Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-white/80">Current Stock: {product.stock} units</p>
            <div>
              <Label htmlFor="restock-quantity" className="text-white">Quantity to Add</Label>
              <Input
                id="restock-quantity"
                type="number"
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Enter quantity"
              />
            </div>
            <p className="text-white/60 text-sm">
              New Stock: {product.stock + (parseInt(restockQuantity) || 0)} units
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

      {/* Record Sale Dialog */}
      <Dialog open={isRecordSalesDialogOpen} onOpenChange={setIsRecordSalesDialogOpen}>
        <DialogContent className="bg-[#0F4C81] border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Record Sale</DialogTitle>
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
        <DialogContent className="bg-[#0F4C81] border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Product</DialogTitle>
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