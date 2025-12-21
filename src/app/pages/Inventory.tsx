import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Package, Plus, Search, CircleAlert, Edit2, PackagePlus } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export function Inventory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [inventoryItems, setInventoryItems] = useState([
    { id: 1, name: 'Organic Coffee Beans', sku: 'COF-001', stock: 145, price: '$24.99', category: 'Beverages', status: 'In Stock' },
    { id: 2, name: 'Almond Milk', sku: 'MLK-002', stock: 8, price: '$5.99', category: 'Dairy', status: 'Low Stock' },
    { id: 3, name: 'Whole Wheat Bread', sku: 'BRD-003', stock: 5, price: '$3.99', category: 'Bakery', status: 'Low Stock' },
    { id: 4, name: 'Fresh Spinach', sku: 'VEG-004', stock: 15, price: '$2.99', category: 'Vegetables', status: 'Low Stock' },
    { id: 5, name: 'Greek Yogurt', sku: 'YOG-005', stock: 67, price: '$4.99', category: 'Dairy', status: 'In Stock' },
    { id: 6, name: 'Organic Honey', sku: 'HON-006', stock: 0, price: '$12.99', category: 'Condiments', status: 'Out of Stock' },
    { id: 7, name: 'Brown Rice', sku: 'RIC-007', stock: 89, price: '$8.99', category: 'Grains', status: 'In Stock' },
    { id: 8, name: 'Olive Oil', sku: 'OIL-008', stock: 34, price: '$15.99', category: 'Condiments', status: 'In Stock' },
  ]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRestockDialogOpen, setIsRestockDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    category: '',
    stock: '',
    price: '',
  });
  const [editingProduct, setEditingProduct] = useState<{
    id: number;
    name: string;
    sku: string;
    category: string;
    stock: string;
    price: string;
  } | null>(null);
  const [restockingProduct, setRestockingProduct] = useState<{
    id: number;
    name: string;
    currentStock: number;
    quantity: string;
  } | null>(null);

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleAddProduct = () => {
    // Validate form
    if (!newProduct.name || !newProduct.sku || !newProduct.category || !newProduct.stock || !newProduct.price) {
      toast.error('Please fill in all fields');
      return;
    }

    // Validate stock is a valid number
    const stockNum = parseInt(newProduct.stock);
    if (isNaN(stockNum) || stockNum < 0) {
      toast.error('Please enter a valid stock quantity');
      return;
    }

    // Validate price is a valid number
    const priceNum = parseFloat(newProduct.price.replace('$', ''));
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    const priceValue = newProduct.price.startsWith('$') ? newProduct.price : `$${newProduct.price}`;

    // Determine status based on stock
    let status = 'In Stock';
    if (stockNum === 0) {
      status = 'Out of Stock';
    } else if (stockNum < 10) {
      status = 'Low Stock';
    }

    // Create new product
    const product = {
      id: inventoryItems.length + 1,
      name: newProduct.name,
      sku: newProduct.sku.toUpperCase(),
      stock: stockNum,
      price: priceValue,
      category: newProduct.category,
      status: status,
    };

    // Add to inventory
    setInventoryItems([...inventoryItems, product]);

    // Reset form
    setNewProduct({
      name: '',
      sku: '',
      category: '',
      stock: '',
      price: '',
    });

    // Close dialog
    setIsAddDialogOpen(false);

    // Show success message
    toast.success('Product added successfully!');
  };

  const handleEditClick = (item: any) => {
    setEditingProduct({
      id: item.id,
      name: item.name,
      sku: item.sku,
      category: item.category,
      stock: item.stock.toString(),
      price: item.price.replace('$', ''),
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    // Validate form
    if (!editingProduct.name || !editingProduct.sku || !editingProduct.category || !editingProduct.stock || !editingProduct.price) {
      toast.error('Please fill in all fields');
      return;
    }

    // Validate stock is a valid number
    const stockNum = parseInt(editingProduct.stock);
    if (isNaN(stockNum) || stockNum < 0) {
      toast.error('Please enter a valid stock quantity');
      return;
    }

    // Validate price is a valid number
    const priceNum = parseFloat(editingProduct.price.replace('$', ''));
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    const priceValue = editingProduct.price.startsWith('$') ? editingProduct.price : `$${editingProduct.price}`;

    // Determine status based on stock
    let status = 'In Stock';
    if (stockNum === 0) {
      status = 'Out of Stock';
    } else if (stockNum < 10) {
      status = 'Low Stock';
    }

    // Update inventory
    setInventoryItems(inventoryItems.map(item => 
      item.id === editingProduct.id 
        ? {
            ...item,
            name: editingProduct.name,
            sku: editingProduct.sku.toUpperCase(),
            stock: stockNum,
            price: priceValue,
            category: editingProduct.category,
            status: status,
          }
        : item
    ));

    // Close dialog and reset
    setIsEditDialogOpen(false);
    setEditingProduct(null);

    // Show success message
    toast.success('Product updated successfully!');
  };

  const handleRestockClick = (item: any) => {
    setRestockingProduct({
      id: item.id,
      name: item.name,
      currentStock: item.stock,
      quantity: '',
    });
    setIsRestockDialogOpen(true);
  };

  const handleRestockProduct = () => {
    if (!restockingProduct) return;

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

    // Update inventory
    setInventoryItems(inventoryItems.map(item => {
      if (item.id === restockingProduct.id) {
        const newStock = item.stock + stockNum;
        
        // Determine new status based on new stock
        let status = 'In Stock';
        if (newStock === 0) {
          status = 'Out of Stock';
        } else if (newStock < 10) {
          status = 'Low Stock';
        }

        return {
          ...item,
          stock: newStock,
          status: status,
        };
      }
      return item;
    }));

    // Close dialog and reset
    setIsRestockDialogOpen(false);
    setRestockingProduct(null);

    // Show success message
    toast.success(`Successfully restocked ${stockNum} units!`);
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
          <Button className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-full shadow-lg shadow-[#0F4C81]/20" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
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
                  <th className="text-left py-4 px-6 text-foreground">Status</th>
                  <th className="text-left py-4 px-6 text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr 
                    key={item.id}
                    className="border-b border-[#0F4C81]/5 hover:bg-[#0F4C81]/5 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#0F4C81]/10 flex items-center justify-center">
                          <Package className="w-5 h-5 text-[#0F4C81]" />
                        </div>
                        <span className="text-foreground">{item.name}</span>
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
                    <td className="py-4 px-6 text-foreground">{item.price}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getStatusColor(item.status)}`}>
                        {item.status}
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border border-[#0F4C81]/20 shadow-2xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-[#0F4C81] flex items-center gap-2">
              <Package className="w-5 h-5" />
              Add New Product
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#0F4C81]">Product Name</Label>
              <Input 
                id="name" 
                placeholder="e.g., Organic Coffee Beans"
                value={newProduct.name} 
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} 
                className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
              />
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
                placeholder="e.g., Beverages"
                value={newProduct.category} 
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} 
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
                <Label htmlFor="price" className="text-[#0F4C81]">Price ($)</Label>
                <Input 
                  id="price" 
                  type="text"
                  placeholder="24.99"
                  value={newProduct.price} 
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
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
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border border-[#0F4C81]/20 shadow-2xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-[#0F4C81] flex items-center gap-2">
              <Package className="w-5 h-5" />
              Edit Product
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#0F4C81]">Product Name</Label>
              <Input 
                id="name" 
                placeholder="e.g., Organic Coffee Beans"
                value={editingProduct?.name || ''} 
                onChange={(e) => setEditingProduct({ ...editingProduct!, name: e.target.value })} 
                className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku" className="text-[#0F4C81]">SKU</Label>
              <Input 
                id="sku" 
                placeholder="e.g., COF-001"
                value={editingProduct?.sku || ''} 
                onChange={(e) => setEditingProduct({ ...editingProduct!, sku: e.target.value })} 
                className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-[#0F4C81]">Category</Label>
              <Input 
                id="category" 
                placeholder="e.g., Beverages"
                value={editingProduct?.category || ''} 
                onChange={(e) => setEditingProduct({ ...editingProduct!, category: e.target.value })} 
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
                  onChange={(e) => setEditingProduct({ ...editingProduct!, stock: e.target.value })} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className="text-[#0F4C81]">Price ($)</Label>
                <Input 
                  id="price" 
                  type="text"
                  placeholder="24.99"
                  value={editingProduct?.price || ''} 
                  onChange={(e) => setEditingProduct({ ...editingProduct!, price: e.target.value })} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
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
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border border-[#0F4C81]/20 shadow-2xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-[#0F4C81] flex items-center gap-2">
              <PackagePlus className="w-5 h-5" />
              Restock Product
            </DialogTitle>
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
              <Input 
                id="quantity" 
                type="number"
                placeholder="0"
                value={restockingProduct?.quantity || ''} 
                onChange={(e) => setRestockingProduct({ ...restockingProduct!, quantity: e.target.value })} 
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
    </div>
  );
}