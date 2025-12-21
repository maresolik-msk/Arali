import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Plus } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { ordersApi, customersApi, productsApi } from '../services/api';
import type { Order, Customer, Product } from '../data/dashboardData';

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customerId: '',
    items: [{ productId: '', quantity: '' }],
  });

  // Load orders, customers, and products from backend on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [ordersData, customersData, productsData] = await Promise.all([
          ordersApi.getAll(),
          customersApi.getAll(),
          productsApi.getAll(),
        ]);
        setOrders(ordersData || []);
        setCustomers(customersData || []);
        setProducts(productsData || []);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
        setOrders([]);
        setCustomers([]);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'Processing':
        return 'bg-blue-100 text-blue-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAddOrder = async () => {
    // Validate
    if (!newOrder.customerId || !newOrder.items[0].productId || !newOrder.items[0].quantity) {
      toast.error('Please fill in all fields');
      return;
    }

    const selectedCustomer = customers.find(c => c.id === parseInt(newOrder.customerId));
    const selectedProduct = products.find(p => p.id === parseInt(newOrder.items[0].productId));
    const quantity = parseInt(newOrder.items[0].quantity);

    if (!selectedCustomer || !selectedProduct) {
      toast.error('Invalid customer or product');
      return;
    }

    if (isNaN(quantity) || quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    try {
      const orderItems = [{
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity: quantity,
        price: typeof selectedProduct.price === 'number' ? selectedProduct.price : parseFloat(selectedProduct.price.replace('$', '')),
        subtotal: quantity * (typeof selectedProduct.price === 'number' ? selectedProduct.price : parseFloat(selectedProduct.price.replace('$', ''))),
      }];

      const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

      const order: Order = {
        id: `#ORD-${Date.now()}`,
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        items: orderItems,
        totalAmount: totalAmount,
        status: 'Pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Add to backend
      const addedOrder = await ordersApi.add(order);

      // Add to local state
      setOrders([...orders, addedOrder]);

      // Reset form
      setNewOrder({
        customerId: '',
        items: [{ productId: '', quantity: '' }],
      });

      // Close dialog
      setIsAddDialogOpen(false);

      // Show success message
      toast.success('Order added successfully!');
    } catch (error) {
      console.error('Error adding order:', error);
      toast.error('Failed to add order');
    }
  };

  const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
  };

  const getTotalItems = (items: any[]): number => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
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
        <div>
          <h1 className="text-foreground">Orders</h1>
          <p className="text-muted-foreground">Manage and track all your orders</p>
        </div>

        {/* Add Order Button */}
        <Button
          className="bg-[#0F4C81] text-white hover:bg-[#0F4C81]/90"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Order
        </Button>

        {/* Add Order Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border border-[#0F4C81]/20 shadow-2xl" aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle className="text-[#0F4C81] flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Add New Order
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="customer" className="text-[#0F4C81]">Customer</Label>
                <select
                  id="customer"
                  value={newOrder.customerId}
                  onChange={(e) => setNewOrder({ ...newOrder, customerId: e.target.value })}
                  className="w-full h-11 px-3 rounded-xl bg-[#0F4C81]/5 border border-[#0F4C81]/20 focus:border-[#0F4C81] focus:bg-white transition-all outline-none"
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="product" className="text-[#0F4C81]">Product</Label>
                <select
                  id="product"
                  value={newOrder.items[0].productId}
                  onChange={(e) => setNewOrder({ ...newOrder, items: [{ ...newOrder.items[0], productId: e.target.value }] })}
                  className="w-full h-11 px-3 rounded-xl bg-[#0F4C81]/5 border border-[#0F4C81]/20 focus:border-[#0F4C81] focus:bg-white transition-all outline-none"
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-[#0F4C81]">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="0"
                  value={newOrder.items[0].quantity}
                  onChange={(e) => setNewOrder({ ...newOrder, items: [{ ...newOrder.items[0], quantity: e.target.value }] })}
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
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
                onClick={handleAddOrder}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Order
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Orders Table */}
        <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
          <div className="relative overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0F4C81]/5">
                <tr className="border-b border-[#0F4C81]/10">
                  <th className="text-left py-4 px-6 text-foreground">Order ID</th>
                  <th className="text-left py-4 px-6 text-foreground">Customer</th>
                  <th className="text-left py-4 px-6 text-foreground">Date</th>
                  <th className="text-left py-4 px-6 text-foreground">Items</th>
                  <th className="text-left py-4 px-6 text-foreground">Amount</th>
                  <th className="text-left py-4 px-6 text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr 
                    key={order.id}
                    className="border-b border-[#0F4C81]/5 hover:bg-[#0F4C81]/5 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#0F4C81]/10 flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 text-[#0F4C81]" />
                        </div>
                        <span className="text-foreground">{order.id}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-foreground">{order.customerName}</td>
                    <td className="py-4 px-6 text-muted-foreground">{formatDate(order.createdAt)}</td>
                    <td className="py-4 px-6 text-muted-foreground">{getTotalItems(order.items)} items</td>
                    <td className="py-4 px-6 text-foreground">{formatCurrency(order.totalAmount)}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}