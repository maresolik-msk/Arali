import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Trash2,
  Package,
  Scale,
  Droplets,
  Hash,
  ChevronDown,
  ChevronUp,
  Edit2,
  Check,
  X,
  Loader2,
  PackagePlus,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { toast } from 'sonner';
import { variantsApi } from '../services/api';
import type { Product, ProductVariant, UnitType, BaseUnit } from '../data/dashboardData';

// ── Unit Configuration ──
const UNIT_OPTIONS: Record<UnitType, { label: string; units: { value: string; label: string; baseMultiplier: number }[] }> = {
  weight: {
    label: 'Weight',
    units: [
      { value: 'g', label: 'Grams (g)', baseMultiplier: 1 },
      { value: 'kg', label: 'Kilograms (kg)', baseMultiplier: 1000 },
    ],
  },
  volume: {
    label: 'Volume',
    units: [
      { value: 'ml', label: 'Millilitres (ml)', baseMultiplier: 1 },
      { value: 'L', label: 'Litres (L)', baseMultiplier: 1000 },
    ],
  },
  count: {
    label: 'Count',
    units: [
      { value: 'pcs', label: 'Pieces (pcs)', baseMultiplier: 1 },
      { value: 'dozen', label: 'Dozen', baseMultiplier: 12 },
    ],
  },
};

const UNIT_TYPE_ICONS: Record<UnitType, React.ReactNode> = {
  weight: <Scale className="w-4 h-4" />,
  volume: <Droplets className="w-4 h-4" />,
  count: <Hash className="w-4 h-4" />,
};

const BASE_UNIT_MAP: Record<UnitType, BaseUnit> = {
  weight: 'g',
  volume: 'ml',
  count: 'pcs',
};

// Helper to format stock display
function formatStock(stockInBaseUnit: number, unitType: UnitType, displayUnit: string): string {
  if (unitType === 'weight') {
    if (stockInBaseUnit >= 1000) return `${(stockInBaseUnit / 1000).toFixed(2)} kg`;
    return `${stockInBaseUnit} g`;
  }
  if (unitType === 'volume') {
    if (stockInBaseUnit >= 1000) return `${(stockInBaseUnit / 1000).toFixed(2)} L`;
    return `${stockInBaseUnit} ml`;
  }
  return `${stockInBaseUnit} pcs`;
}

interface VariantFormData {
  variantName: string;
  unitType: UnitType;
  packSize: string;
  displayUnit: string;
  sellingPrice: string;
  mrp: string;
  costPrice: string;
  barcode: string;
  isLoose: boolean;
  initialStock: string;
  stockUnit: string;
}

const emptyForm: VariantFormData = {
  variantName: '',
  unitType: 'weight',
  packSize: '',
  displayUnit: 'kg',
  sellingPrice: '',
  mrp: '',
  costPrice: '',
  barcode: '',
  isLoose: false,
  initialStock: '',
  stockUnit: 'kg',
};

interface VariantManagerProps {
  product: Product;
  onProductUpdated: (product: Product) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function VariantManager({ product, onProductUpdated, isOpen, onClose }: VariantManagerProps) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState<VariantFormData>({ ...emptyForm });
  const [baseUnit, setBaseUnit] = useState<BaseUnit>('pcs');

  // Load variants
  useEffect(() => {
    if (isOpen && product.id) {
      loadVariants();
    }
  }, [isOpen, product.id]);

  const loadVariants = async () => {
    setIsLoading(true);
    try {
      const data = await variantsApi.getAll(product.id);
      setVariants(data.variants || []);
      setBaseUnit((data.baseUnit as BaseUnit) || 'pcs');
    } catch (error) {
      console.error('Error loading variants:', error);
      // If no variants exist yet, that's fine
      setVariants([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getPackSizeInBaseUnit = (): number => {
    if (form.isLoose) return 1;
    const size = parseFloat(form.packSize);
    if (isNaN(size) || size <= 0) return 0;
    const unitConfig = UNIT_OPTIONS[form.unitType].units.find(u => u.value === form.displayUnit);
    return size * (unitConfig?.baseMultiplier || 1);
  };

  const handleAddVariant = async () => {
    // Validate
    if (!form.variantName.trim()) {
      toast.error('Please enter a variant name');
      return;
    }
    if (!form.isLoose && (!form.packSize || parseFloat(form.packSize) <= 0)) {
      toast.error('Please enter a valid pack size');
      return;
    }
    if (!form.sellingPrice || parseFloat(form.sellingPrice) <= 0) {
      toast.error('Please enter a selling price');
      return;
    }

    const packSizeInBaseUnit = getPackSizeInBaseUnit();

    setIsSaving(true);
    try {
      const result = await variantsApi.add(product.id, {
        variantName: form.variantName.trim(),
        unitType: form.unitType,
        packSizeInBaseUnit,
        displayUnit: form.displayUnit,
        sellingPrice: parseFloat(form.sellingPrice),
        mrp: parseFloat(form.mrp || form.sellingPrice),
        costPrice: parseFloat(form.costPrice || '0'),
        barcode: form.barcode || undefined,
        isLoose: form.isLoose,
        isActive: true,
        stockInBaseUnit: form.initialStock ? (() => {
          const qty = parseFloat(form.initialStock);
          const unitConfig = UNIT_OPTIONS[form.unitType].units.find(u => u.value === form.stockUnit);
          return qty * (unitConfig?.baseMultiplier || 1);
        })() : 0,
        baseUnit: BASE_UNIT_MAP[form.unitType],
      } as any);

      setVariants(prev => [...prev, result.variant]);
      onProductUpdated(result.product);
      setForm({ ...emptyForm });
      setIsAdding(false);
      toast.success(`Variant "${result.variant.variantName}" added!`);
    } catch (error: any) {
      console.error('Error adding variant:', error);
      toast.error(error.message || 'Failed to add variant');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    try {
      const result = await variantsApi.delete(product.id, variantId);
      setVariants(prev => prev.filter(v => v.id !== variantId));
      onProductUpdated(result.product);
      toast.success('Variant removed');
    } catch (error: any) {
      console.error('Error deleting variant:', error);
      toast.error(error.message || 'Failed to remove variant');
    }
  };

  const handleUpdateVariant = async (variantId: string, updates: Partial<ProductVariant>) => {
    try {
      const result = await variantsApi.update(product.id, variantId, updates);
      setVariants(prev => prev.map(v => v.id === variantId ? result.variant : v));
      onProductUpdated(result.product);
      setEditingId(null);
      toast.success('Variant updated');
    } catch (error: any) {
      console.error('Error updating variant:', error);
      toast.error(error.message || 'Failed to update variant');
    }
  };

  const activeVariants = variants.filter(v => v.isActive !== false);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] p-0 overflow-hidden bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F4C81] to-[#1a6bb5] px-5 py-4 text-white">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2 text-lg">
              <Package className="w-5 h-5" />
              Manage Variants
            </DialogTitle>
            <DialogDescription className="text-blue-100 text-sm">
              {product.name} — Add pack sizes, loose options, and variant pricing
            </DialogDescription>
          </DialogHeader>

          {/* Quick Stats */}
          <div className="flex gap-3 mt-3">
            <div className="bg-white/15 rounded-lg px-3 py-1.5 text-sm">
              <span className="text-blue-200">Variants:</span>{' '}
              <span className="font-semibold">{activeVariants.length}</span>
            </div>
            <div className="bg-white/15 rounded-lg px-3 py-1.5 text-sm">
              <span className="text-blue-200">Base Unit:</span>{' '}
              <span className="font-semibold">{baseUnit}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[55vh] p-4 space-y-3">
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#0F4C81]" />
              <p className="text-sm text-gray-500 mt-2">Loading variants...</p>
            </div>
          ) : (
            <>
              {/* Existing Variants */}
              <AnimatePresence mode="popLayout">
                {activeVariants.map((variant) => (
                  <VariantCard
                    key={variant.id}
                    variant={variant}
                    isExpanded={expandedId === variant.id}
                    isEditing={editingId === variant.id}
                    onToggleExpand={() => setExpandedId(expandedId === variant.id ? null : variant.id)}
                    onEdit={() => setEditingId(variant.id)}
                    onCancelEdit={() => setEditingId(null)}
                    onSave={(updates) => handleUpdateVariant(variant.id, updates)}
                    onDelete={() => handleDeleteVariant(variant.id)}
                  />
                ))}
              </AnimatePresence>

              {activeVariants.length === 0 && !isAdding && (
                <div className="text-center py-6">
                  <Package className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No variants yet. Add one to enable multi-quantity selling.</p>
                </div>
              )}

              {/* Add Variant Form */}
              <AnimatePresence>
                {isAdding && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="border-2 border-dashed border-[#0F4C81]/30 rounded-xl p-4 bg-[#0F4C81]/5 space-y-4"
                  >
                    <h4 className="font-medium text-[#0F4C81] text-sm flex items-center gap-2">
                      <Plus className="w-4 h-4" /> New Variant
                    </h4>

                    {/* Variant Name */}
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600">Variant Name</Label>
                      <Input
                        placeholder="e.g., 1kg Pack, 500ml Bottle, Loose"
                        value={form.variantName}
                        onChange={e => setForm({ ...form, variantName: e.target.value })}
                        className="h-9 text-sm"
                      />
                    </div>

                    {/* Unit Type */}
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600">Unit Type</Label>
                      <div className="flex gap-2">
                        {(Object.keys(UNIT_OPTIONS) as UnitType[]).map(type => (
                          <button
                            key={type}
                            onClick={() => {
                              const newDisplayUnit = UNIT_OPTIONS[type].units[0].value;
                              setForm({
                                ...form,
                                unitType: type,
                                displayUnit: newDisplayUnit,
                                stockUnit: newDisplayUnit,
                              });
                            }}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                              form.unitType === type
                                ? 'bg-[#0F4C81] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {UNIT_TYPE_ICONS[type]}
                            {UNIT_OPTIONS[type].label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Loose Toggle */}
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-gray-200">
                      <div className="flex items-center gap-2">
                        {form.isLoose ? <ToggleRight className="w-4 h-4 text-green-600" /> : <ToggleLeft className="w-4 h-4 text-gray-400" />}
                        <span className="text-sm text-gray-700">Loose selling</span>
                        <span className="text-[10px] text-gray-400">(customer picks any quantity)</span>
                      </div>
                      <Switch
                        checked={form.isLoose}
                        onCheckedChange={checked => setForm({ ...form, isLoose: checked, packSize: checked ? '' : form.packSize })}
                      />
                    </div>

                    {/* Pack Size (only for non-loose) */}
                    {!form.isLoose && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Pack Size</Label>
                          <Input
                            type="number"
                            placeholder="e.g., 1, 5, 500"
                            value={form.packSize}
                            onChange={e => setForm({ ...form, packSize: e.target.value })}
                            className="h-9 text-sm"
                            min="0.01"
                            step="any"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Unit</Label>
                          <select
                            value={form.displayUnit}
                            onChange={e => setForm({ ...form, displayUnit: e.target.value })}
                            className="w-full h-9 rounded-md border border-gray-200 bg-white px-3 text-sm"
                          >
                            {UNIT_OPTIONS[form.unitType].units.map(u => (
                              <option key={u.value} value={u.value}>{u.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Pricing */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-600">Cost Price</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={form.costPrice}
                          onChange={e => setForm({ ...form, costPrice: e.target.value })}
                          className="h-9 text-sm"
                          min="0"
                          step="any"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-600">Selling Price *</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={form.sellingPrice}
                          onChange={e => setForm({ ...form, sellingPrice: e.target.value })}
                          className="h-9 text-sm"
                          min="0"
                          step="any"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-600">MRP</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={form.mrp}
                          onChange={e => setForm({ ...form, mrp: e.target.value })}
                          className="h-9 text-sm"
                          min="0"
                          step="any"
                        />
                      </div>
                    </div>

                    {/* Initial Stock */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-600">Initial Stock</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={form.initialStock}
                          onChange={e => setForm({ ...form, initialStock: e.target.value })}
                          className="h-9 text-sm"
                          min="0"
                          step="any"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-600">Stock Unit</Label>
                        <select
                          value={form.stockUnit}
                          onChange={e => setForm({ ...form, stockUnit: e.target.value })}
                          className="w-full h-9 rounded-md border border-gray-200 bg-white px-3 text-sm"
                        >
                          {UNIT_OPTIONS[form.unitType].units.map(u => (
                            <option key={u.value} value={u.value}>{u.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Barcode */}
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600">Barcode (optional)</Label>
                      <Input
                        placeholder="e.g., 8901234567890"
                        value={form.barcode}
                        onChange={e => setForm({ ...form, barcode: e.target.value })}
                        className="h-9 text-sm"
                      />
                    </div>

                    {/* Pack size preview */}
                    {!form.isLoose && form.packSize && (
                      <div className="text-xs text-gray-500 bg-white rounded-lg px-3 py-2 border border-gray-200 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-blue-500" />
                        Stored as: <strong>{getPackSizeInBaseUnit()} {BASE_UNIT_MAP[form.unitType]}</strong> per pack
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => { setIsAdding(false); setForm({ ...emptyForm }); }}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-[#0F4C81] hover:bg-[#0d3f6a] text-white"
                        onClick={handleAddVariant}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Saving...</>
                        ) : (
                          <><Plus className="w-3.5 h-3.5 mr-1.5" /> Add Variant</>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-4 flex gap-3">
          {!isAdding && (
            <Button
              variant="outline"
              className="flex-1 border-[#0F4C81]/20 text-[#0F4C81] hover:bg-[#0F4C81]/5"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Variant
            </Button>
          )}
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Variant Card Sub-component ──

interface VariantCardProps {
  variant: ProductVariant;
  isExpanded: boolean;
  isEditing: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: (updates: Partial<ProductVariant>) => void;
  onDelete: () => void;
}

const VariantCard = React.forwardRef<HTMLDivElement, VariantCardProps>(function VariantCard({ variant, isExpanded, isEditing, onToggleExpand, onEdit, onCancelEdit, onSave, onDelete }, ref) {
  const [editForm, setEditForm] = useState({
    sellingPrice: variant.sellingPrice.toString(),
    mrp: variant.mrp.toString(),
    costPrice: variant.costPrice.toString(),
    variantName: variant.variantName,
  });

  const unitType = variant.unitType as UnitType;
  const stockDisplay = formatStock(variant.stockInBaseUnit || 0, unitType, variant.displayUnit);

  const packLabel = variant.isLoose
    ? 'Loose'
    : `${variant.packSizeInBaseUnit >= 1000 && unitType === 'weight'
        ? `${variant.packSizeInBaseUnit / 1000} kg`
        : variant.packSizeInBaseUnit >= 1000 && unitType === 'volume'
          ? `${variant.packSizeInBaseUnit / 1000} L`
          : `${variant.packSizeInBaseUnit} ${variant.displayUnit || BASE_UNIT_MAP[unitType]}`
      }`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-shadow"
      ref={ref}
    >
      {/* Main Row */}
      <div
        className="flex items-center gap-3 p-3 cursor-pointer"
        onClick={onToggleExpand}
      >
        {/* Icon */}
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
          variant.isLoose ? 'bg-green-100 text-green-700' : 'bg-[#0F4C81]/10 text-[#0F4C81]'
        }`}>
          {UNIT_TYPE_ICONS[unitType] || <Package className="w-4 h-4" />}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-gray-900 truncate">{variant.variantName}</p>
          <p className="text-xs text-gray-500">
            {packLabel} &middot; Stock: <span className="font-medium text-gray-700">{stockDisplay}</span>
          </p>
        </div>

        {/* Price + Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm font-semibold text-green-700">₹{variant.sellingPrice}</span>
          {variant.isLoose && (
            <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
              Loose
            </span>
          )}
          <button className="w-6 h-6 flex items-center justify-center text-gray-400">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-1 border-t border-dashed border-gray-200 space-y-3">
              {isEditing ? (
                /* Edit mode */
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Variant Name</Label>
                    <Input
                      value={editForm.variantName}
                      onChange={e => setEditForm({ ...editForm, variantName: e.target.value })}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Cost</Label>
                      <Input
                        type="number"
                        value={editForm.costPrice}
                        onChange={e => setEditForm({ ...editForm, costPrice: e.target.value })}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Sell</Label>
                      <Input
                        type="number"
                        value={editForm.sellingPrice}
                        onChange={e => setEditForm({ ...editForm, sellingPrice: e.target.value })}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">MRP</Label>
                      <Input
                        type="number"
                        value={editForm.mrp}
                        onChange={e => setEditForm({ ...editForm, mrp: e.target.value })}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 h-7 text-xs" onClick={onCancelEdit}>
                      <X className="w-3 h-3 mr-1" /> Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 h-7 text-xs bg-[#0F4C81] hover:bg-[#0d3f6a] text-white"
                      onClick={() => onSave({
                        variantName: editForm.variantName,
                        sellingPrice: parseFloat(editForm.sellingPrice),
                        mrp: parseFloat(editForm.mrp),
                        costPrice: parseFloat(editForm.costPrice),
                      })}
                    >
                      <Check className="w-3 h-3 mr-1" /> Save
                    </Button>
                  </div>
                </div>
              ) : (
                /* View mode */
                <>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-gray-400">Cost Price</span>
                      <p className="font-medium text-gray-700">₹{variant.costPrice}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Selling Price</span>
                      <p className="font-medium text-green-700">₹{variant.sellingPrice}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">MRP</span>
                      <p className="font-medium text-gray-700">₹{variant.mrp}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    Pack: {variant.packSizeInBaseUnit} {BASE_UNIT_MAP[unitType]}
                    {variant.barcode && <> &middot; Barcode: {variant.barcode}</>}
                    &middot; Stock: {variant.stockInBaseUnit} {BASE_UNIT_MAP[unitType]}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-7 text-xs flex-1" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                      <Edit2 className="w-3 h-3 mr-1" /> Edit Pricing
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs text-red-500 border-red-200 hover:bg-red-50"
                      onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});