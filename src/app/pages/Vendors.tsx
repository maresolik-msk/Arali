import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Truck, Plus, Search, Edit2, Star, Phone, Mail, MapPin, Building2, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { vendorsApi } from '../services/api';
import type { Vendor } from '../data/dashboardData';

export function Vendors() {
  const [searchQuery, setSearchQuery] = useState('');
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<{ id: number; name: string } | null>(null);
  const [newVendor, setNewVendor] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    category: '',
    totalProducts: '0',
    totalPurchases: '0',
    rating: '5',
    status: 'Active' as 'Active' | 'Inactive',
    paymentTerms: '',
    notes: '',
  });
  const [editingVendor, setEditingVendor] = useState<{
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    company: string;
    category: string;
    totalProducts: string;
    totalPurchases: string;
    rating: string;
    status: 'Active' | 'Inactive';
    paymentTerms: string;
    notes: string;
  } | null>(null);

  // Load vendors from backend on mount
  useEffect(() => {
    const loadVendors = async () => {
      try {
        setIsLoading(true);
        const vendorsData = await vendorsApi.getAll();
        setVendors(vendorsData || []);
      } catch (error) {
        console.error('Error loading vendors:', error);
        toast.error('Failed to load vendors');
        setVendors([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadVendors();
  }, []);

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-700' 
      : 'bg-gray-100 text-gray-700';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleAddVendor = async () => {
    // Validate form
    if (!newVendor.name || !newVendor.email || !newVendor.phone || !newVendor.company || !newVendor.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newVendor.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate rating
    const rating = parseInt(newVendor.rating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      toast.error('Rating must be between 1 and 5');
      return;
    }

    try {
      // Create new vendor
      const vendor: Vendor = {
        id: Date.now(),
        name: newVendor.name,
        email: newVendor.email,
        phone: newVendor.phone,
        address: newVendor.address,
        company: newVendor.company,
        category: newVendor.category,
        totalProducts: parseInt(newVendor.totalProducts) || 0,
        totalPurchases: parseFloat(newVendor.totalPurchases) || 0,
        rating,
        status: newVendor.status,
        paymentTerms: newVendor.paymentTerms,
        notes: newVendor.notes,
        joinedDate: new Date(),
        lastOrderDate: new Date(),
      };

      // Add to backend
      await vendorsApi.add(vendor);

      // Add to local state
      setVendors([...vendors, vendor]);

      // Reset form
      setNewVendor({
        name: '',
        email: '',
        phone: '',
        address: '',
        company: '',
        category: '',
        totalProducts: '0',
        totalPurchases: '0',
        rating: '5',
        status: 'Active',
        paymentTerms: '',
        notes: '',
      });

      // Close dialog
      setIsAddDialogOpen(false);

      // Show success message
      toast.success('Vendor added successfully!');
    } catch (error) {
      console.error('Error adding vendor:', error);
      toast.error('Failed to add vendor');
    }
  };

  const handleEditClick = (vendor: Vendor) => {
    setEditingVendor({
      id: vendor.id,
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address || '',
      company: vendor.company,
      category: vendor.category,
      totalProducts: vendor.totalProducts.toString(),
      totalPurchases: vendor.totalPurchases.toString(),
      rating: vendor.rating.toString(),
      status: vendor.status,
      paymentTerms: vendor.paymentTerms || '',
      notes: vendor.notes || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateVendor = async () => {
    if (!editingVendor) return;

    // Validate form
    if (!editingVendor.name || !editingVendor.email || !editingVendor.phone || !editingVendor.company || !editingVendor.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editingVendor.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate rating
    const rating = parseInt(editingVendor.rating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      toast.error('Rating must be between 1 and 5');
      return;
    }

    try {
      // Update in backend
      await vendorsApi.update(editingVendor.id, {
        name: editingVendor.name,
        email: editingVendor.email,
        phone: editingVendor.phone,
        address: editingVendor.address,
        company: editingVendor.company,
        category: editingVendor.category,
        totalProducts: parseInt(editingVendor.totalProducts) || 0,
        totalPurchases: parseFloat(editingVendor.totalPurchases) || 0,
        rating,
        status: editingVendor.status,
        paymentTerms: editingVendor.paymentTerms,
        notes: editingVendor.notes,
      });

      // Update local state
      setVendors(vendors.map(v => 
        v.id === editingVendor.id 
          ? {
              ...v,
              name: editingVendor.name,
              email: editingVendor.email,
              phone: editingVendor.phone,
              address: editingVendor.address,
              company: editingVendor.company,
              category: editingVendor.category,
              totalProducts: parseInt(editingVendor.totalProducts) || 0,
              totalPurchases: parseFloat(editingVendor.totalPurchases) || 0,
              rating,
              status: editingVendor.status,
              paymentTerms: editingVendor.paymentTerms,
              notes: editingVendor.notes,
            }
          : v
      ));

      // Close dialog and reset
      setIsEditDialogOpen(false);
      setEditingVendor(null);

      // Show success message
      toast.success('Vendor updated successfully!');
    } catch (error) {
      console.error('Error updating vendor:', error);
      toast.error('Failed to update vendor');
    }
  };

  const handleDeleteClick = (vendor: Vendor) => {
    setVendorToDelete({ id: vendor.id, name: vendor.name });
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteVendor = async () => {
    if (!vendorToDelete) return;

    try {
      // Delete from backend
      await vendorsApi.delete(vendorToDelete.id);

      // Delete from local state
      setVendors(vendors.filter(v => v.id !== vendorToDelete.id));

      // Close dialog and reset
      setIsDeleteDialogOpen(false);
      setVendorToDelete(null);

      // Show success message
      toast.success('Vendor deleted successfully!');
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast.error('Failed to delete vendor');
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
            <h1 className="text-foreground">Vendor Management</h1>
            <p className="text-muted-foreground">Manage your suppliers and vendors</p>
          </div>
          <Button 
            className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-full shadow-lg shadow-[#0F4C81]/20" 
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Vendor
          </Button>
        </div>

        {/* Search */}
        <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg">
          <div className="p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F4C81]/40" />
              <input
                type="text"
                placeholder="Search by vendor name, company, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-[#0F4C81]/5 border border-[#0F4C81]/10 focus:border-[#0F4C81]/30 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>
        </Card>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0F4C81]/20 border-t-[#0F4C81]" />
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center h-64">
              <Truck className="w-16 h-16 text-[#0F4C81]/20 mb-4" />
              <p className="text-muted-foreground">No vendors found</p>
            </div>
          ) : (
            filteredVendors.map((vendor) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#0F4C81]/10 flex items-center justify-center">
                          <Truck className="w-6 h-6 text-[#0F4C81]" />
                        </div>
                        <div>
                          <h3 className="text-foreground">{vendor.name}</h3>
                          <p className="text-sm text-muted-foreground">{vendor.company}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(vendor.status)}`}>
                        {vendor.status}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      {renderStars(vendor.rating)}
                    </div>

                    {/* Category */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="w-4 h-4" />
                      <span>{vendor.category}</span>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{vendor.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{vendor.phone}</span>
                      </div>
                      {vendor.address && (
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mt-0.5" />
                          <span className="line-clamp-2">{vendor.address}</span>
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#0F4C81]/10">
                      <div>
                        <p className="text-xs text-muted-foreground">Products</p>
                        <p className="text-lg text-foreground">{vendor.totalProducts}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total Purchases</p>
                        <p className="text-lg text-foreground">₹{vendor.totalPurchases.toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    {/* Payment Terms */}
                    {vendor.paymentTerms && (
                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground">Payment Terms</p>
                        <p className="text-sm text-foreground">{vendor.paymentTerms}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-[#0F4C81]/20 text-[#0F4C81] hover:bg-[#0F4C81]/5"
                      onClick={() => handleEditClick(vendor)}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Vendor
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-[#0F4C81]/20 text-[#0F4C81] hover:bg-[#0F4C81]/5"
                      onClick={() => handleDeleteClick(vendor)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Vendor
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Add Vendor Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border border-[#0F4C81]/20 shadow-2xl" aria-describedby="add-vendor-description">
          <DialogHeader>
            <DialogTitle className="text-[#0F4C81] flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Add New Vendor
            </DialogTitle>
            <DialogDescription id="add-vendor-description">
              Enter vendor details to add a new supplier to your list.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#0F4C81]">Contact Name *</Label>
                <Input 
                  id="name" 
                  placeholder="e.g., Rajesh Kumar"
                  value={newVendor.name} 
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-[#0F4C81]">Company Name *</Label>
                <Input 
                  id="company" 
                  placeholder="e.g., Karnataka Coffee Co."
                  value={newVendor.company} 
                  onChange={(e) => setNewVendor({ ...newVendor, company: e.target.value })} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#0F4C81]">Email *</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="vendor@example.com"
                  value={newVendor.email} 
                  onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#0F4C81]">Phone *</Label>
                <Input 
                  id="phone" 
                  placeholder="+91 98765 43210"
                  value={newVendor.phone} 
                  onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-[#0F4C81]">Address</Label>
              <Input 
                id="address" 
                placeholder="Full address"
                value={newVendor.address} 
                onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })} 
                className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-[#0F4C81]">Category *</Label>
                <Input 
                  id="category" 
                  placeholder="e.g., Beverages, Dairy"
                  value={newVendor.category} 
                  onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentTerms" className="text-[#0F4C81]">Payment Terms</Label>
                <Input 
                  id="paymentTerms" 
                  placeholder="e.g., Net 30, COD"
                  value={newVendor.paymentTerms} 
                  onChange={(e) => setNewVendor({ ...newVendor, paymentTerms: e.target.value })} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalProducts" className="text-[#0F4C81]">Total Products</Label>
                <Input 
                  id="totalProducts" 
                  type="number"
                  placeholder="0"
                  value={newVendor.totalProducts} 
                  onChange={(e) => setNewVendor({ ...newVendor, totalProducts: e.target.value })} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalPurchases" className="text-[#0F4C81]">Total Purchases (₹)</Label>
                <Input 
                  id="totalPurchases" 
                  type="number"
                  placeholder="0"
                  value={newVendor.totalPurchases} 
                  onChange={(e) => setNewVendor({ ...newVendor, totalPurchases: e.target.value })} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating" className="text-[#0F4C81]">Rating (1-5)</Label>
                <Input 
                  id="rating" 
                  type="number"
                  min="1"
                  max="5"
                  placeholder="5"
                  value={newVendor.rating} 
                  onChange={(e) => setNewVendor({ ...newVendor, rating: e.target.value })} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-[#0F4C81]">Notes</Label>
              <textarea 
                id="notes" 
                rows={3}
                placeholder="Additional notes about the vendor"
                value={newVendor.notes} 
                onChange={(e) => setNewVendor({ ...newVendor, notes: e.target.value })} 
                className="w-full p-3 rounded-xl bg-[#0F4C81]/5 border border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20 outline-none resize-none"
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
              onClick={handleAddVendor}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Vendor
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Vendor Dialog - Similar structure to Add Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border border-[#0F4C81]/20 shadow-2xl" aria-describedby="edit-vendor-description">
          <DialogHeader>
            <DialogTitle className="text-[#0F4C81] flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Edit Vendor
            </DialogTitle>
            <DialogDescription id="edit-vendor-description">
              Update the details for this vendor.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-[#0F4C81]">Contact Name *</Label>
                <Input 
                  id="edit-name" 
                  placeholder="e.g., Rajesh Kumar"
                  value={editingVendor?.name || ''} 
                  onChange={(e) => setEditingVendor({ ...editingVendor!, name: e.target.value })} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-company" className="text-[#0F4C81]">Company Name *</Label>
                <Input 
                  id="edit-company" 
                  placeholder="e.g., Karnataka Coffee Co."
                  value={editingVendor?.company || ''} 
                  onChange={(e) => setEditingVendor({ ...editingVendor!, company: e.target.value })} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email" className="text-[#0F4C81]">Email *</Label>
                <Input 
                  id="edit-email" 
                  type="email"
                  placeholder="vendor@example.com"
                  value={editingVendor?.email || ''} 
                  onChange={(e) => setEditingVendor({ ...editingVendor!, email: e.target.value })} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone" className="text-[#0F4C81]">Phone *</Label>
                <Input 
                  id="edit-phone" 
                  placeholder="+91 98765 43210"
                  value={editingVendor?.phone || ''} 
                  onChange={(e) => setEditingVendor({ ...editingVendor!, phone: e.target.value })} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-address" className="text-[#0F4C81]">Address</Label>
              <Input 
                id="edit-address" 
                placeholder="Full address"
                value={editingVendor?.address || ''} 
                onChange={(e) => setEditingVendor({ ...editingVendor!, address: e.target.value })} 
                className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category" className="text-[#0F4C81]">Category *</Label>
                <Input 
                  id="edit-category" 
                  placeholder="e.g., Beverages, Dairy"
                  value={editingVendor?.category || ''} 
                  onChange={(e) => setEditingVendor({ ...editingVendor!, category: e.target.value })} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-paymentTerms" className="text-[#0F4C81]">Payment Terms</Label>
                <Input 
                  id="edit-paymentTerms" 
                  placeholder="e.g., Net 30, COD"
                  value={editingVendor?.paymentTerms || ''} 
                  onChange={(e) => setEditingVendor({ ...editingVendor!, paymentTerms: e.target.value })} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-totalProducts" className="text-[#0F4C81]">Total Products</Label>
                <Input 
                  id="edit-totalProducts" 
                  type="number"
                  placeholder="0"
                  value={editingVendor?.totalProducts || ''} 
                  onChange={(e) => setEditingVendor({ ...editingVendor!, totalProducts: e.target.value })} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-totalPurchases" className="text-[#0F4C81]">Total Purchases (₹)</Label>
                <Input 
                  id="edit-totalPurchases" 
                  type="number"
                  placeholder="0"
                  value={editingVendor?.totalPurchases || ''} 
                  onChange={(e) => setEditingVendor({ ...editingVendor!, totalPurchases: e.target.value })} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-rating" className="text-[#0F4C81]">Rating (1-5)</Label>
                <Input 
                  id="edit-rating" 
                  type="number"
                  min="1"
                  max="5"
                  placeholder="5"
                  value={editingVendor?.rating || ''} 
                  onChange={(e) => setEditingVendor({ ...editingVendor!, rating: e.target.value })} 
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status" className="text-[#0F4C81]">Status</Label>
              <select 
                id="edit-status"
                value={editingVendor?.status || 'Active'}
                onChange={(e) => setEditingVendor({ ...editingVendor!, status: e.target.value as 'Active' | 'Inactive' })}
                className="w-full h-11 px-4 rounded-xl bg-[#0F4C81]/5 border border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20 outline-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes" className="text-[#0F4C81]">Notes</Label>
              <textarea 
                id="edit-notes" 
                rows={3}
                placeholder="Additional notes about the vendor"
                value={editingVendor?.notes || ''} 
                onChange={(e) => setEditingVendor({ ...editingVendor!, notes: e.target.value })} 
                className="w-full p-3 rounded-xl bg-[#0F4C81]/5 border border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20 outline-none resize-none"
              />
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
              onClick={handleUpdateVendor}
            >
              Update Vendor
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Vendor Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border border-[#0F4C81]/20 shadow-2xl" aria-describedby="delete-vendor-description">
          <DialogHeader>
            <DialogTitle className="text-[#0F4C81] flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Delete Vendor
            </DialogTitle>
            <DialogDescription id="delete-vendor-description">
              Confirm vendor deletion. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <p className="text-sm text-muted-foreground">Are you sure you want to delete the vendor <strong className="text-foreground">{vendorToDelete?.name}</strong>?</p>
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
              className="flex-1 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-full shadow-lg shadow-[#0F4C81]/30"
              onClick={handleDeleteVendor}
            >
              Delete Vendor
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}