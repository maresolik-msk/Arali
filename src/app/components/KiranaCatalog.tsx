import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Plus,
  Check,
  Package,
  Loader2,
  ShoppingBasket,
  Calendar,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { toast } from 'sonner';
import { productsApi } from '../services/api';
import type { Product } from '../data/dashboardData';

// ──────────────────────────────────────────────
// Top 20 Kirana Catalog — realistic Indian MRP
// ──────────────────────────────────────────────

export interface CatalogItem {
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  unit: string;           // e.g. "kg", "litre", "packet", "piece"
  threshold: number;      // low-stock alert
  hasExpiry: boolean;      // whether the product typically expires
  vendorType: string;
  description: string;
  imageUrl: string;
  sku: string;
}

const KIRANA_CATALOG: CatalogItem[] = [
  {
    name: 'Basmati Rice (5 kg)',
    category: 'Grains & Staples',
    costPrice: 280,
    sellingPrice: 340,
    unit: 'bag',
    threshold: 10,
    hasExpiry: false,
    vendorType: 'Grain Wholesaler',
    description: 'Premium long-grain Basmati rice, 5 kg pack',
    imageUrl: 'https://images.unsplash.com/photo-1630409346824-4f0e7b080087?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjByaWNlJTIwYmFzbWF0aSUyMHNhY2t8ZW58MXx8fHwxNzcxMTM1NjEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    sku: 'GRN-RIC-001',
  },
  {
    name: 'Wheat Flour / Atta (10 kg)',
    category: 'Grains & Staples',
    costPrice: 350,
    sellingPrice: 420,
    unit: 'bag',
    threshold: 8,
    hasExpiry: true,
    vendorType: 'Grain Wholesaler',
    description: 'Whole wheat chakki atta, 10 kg sack',
    imageUrl: 'https://images.unsplash.com/photo-1646722391295-0bfc1035fb99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGZsb3VyJTIwYXR0YSUyMGJhZ3xlbnwxfHx8fDE3NzEwNDgwNjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    sku: 'GRN-ATT-002',
  },
  {
    name: 'Sugar (1 kg)',
    category: 'Grains & Staples',
    costPrice: 42,
    sellingPrice: 50,
    unit: 'kg',
    threshold: 15,
    hasExpiry: false,
    vendorType: 'Grocery Distributor',
    description: 'White refined sugar, 1 kg loose / packed',
    imageUrl: 'https://images.unsplash.com/photo-1685967836908-7d3b4921a670?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWdhciUyMHdoaXRlJTIwZ3JhbnVsYXRlZHxlbnwxfHx8fDE3NzEwODE5Njd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    sku: 'GRN-SUG-003',
  },
  {
    name: 'Toor Dal (1 kg)',
    category: 'Pulses & Lentils',
    costPrice: 130,
    sellingPrice: 160,
    unit: 'kg',
    threshold: 10,
    hasExpiry: false,
    vendorType: 'Dal Wholesaler',
    description: 'Yellow pigeon pea split dal, staple in Indian cooking',
    imageUrl: 'https://images.unsplash.com/photo-1648889095694-c597b314356e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5ZWxsb3clMjBsZW50aWxzJTIwZGFsJTIwYm93bHxlbnwxfHx8fDE3NzExMzU2MjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    sku: 'PLS-TDL-004',
  },
  {
    name: 'Chana Dal (1 kg)',
    category: 'Pulses & Lentils',
    costPrice: 90,
    sellingPrice: 110,
    unit: 'kg',
    threshold: 10,
    hasExpiry: false,
    vendorType: 'Dal Wholesaler',
    description: 'Bengal gram split, used in sambar and snacks',
    imageUrl: 'https://images.unsplash.com/photo-1623667358338-d756856e74cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdW1pbiUyMHNlZWRzJTIwamVlcmF8ZW58MXx8fHwxNzcxMDQ5MzYzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    sku: 'PLS-CDL-005',
  },
  {
    name: 'Sunflower Oil (1 L)',
    category: 'Cooking Oil',
    costPrice: 120,
    sellingPrice: 150,
    unit: 'bottle',
    threshold: 8,
    hasExpiry: true,
    vendorType: 'Oil Distributor',
    description: 'Refined sunflower cooking oil, 1 litre pouch / bottle',
    imageUrl: 'https://images.unsplash.com/photo-1662058595162-10e024b1a907?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwb2lsJTIwYm90dGxlJTIwc3VuZmxvd2VyfGVufDF8fHx8MTc3MTEzNTYxNXww&ixlib=rb-4.1.0&q=80&w=1080',
    sku: 'OIL-SUN-006',
  },
  {
    name: 'Milk (500 ml)',
    category: 'Dairy',
    costPrice: 27,
    sellingPrice: 30,
    unit: 'packet',
    threshold: 20,
    hasExpiry: true,
    vendorType: 'Dairy Agent',
    description: 'Fresh toned milk, 500 ml packet (daily delivery)',
    imageUrl: 'https://images.unsplash.com/photo-1768850418251-17480117ac9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWxrJTIwcGFja2V0JTIwZGFpcnklMjBmcmVzaHxlbnwxfHx8fDE3NzExMzU2MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    sku: 'DRY-MLK-007',
  },
  {
    name: 'Tea Leaves (250 g)',
    category: 'Beverages',
    costPrice: 80,
    sellingPrice: 110,
    unit: 'packet',
    threshold: 10,
    hasExpiry: true,
    vendorType: 'FMCG Distributor',
    description: 'CTC premium leaf tea, 250 g pack',
    imageUrl: 'https://images.unsplash.com/photo-1732519970445-8f2d6998961f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFpJTIwdGVhJTIwbGVhdmVzJTIwaW5kaWFufGVufDF8fHx8MTc3MTEzNTYyMHww&ixlib=rb-4.1.0&q=80&w=1080',
    sku: 'BEV-TEA-008',
  },
  {
    name: 'Salt (1 kg)',
    category: 'Grains & Staples',
    costPrice: 18,
    sellingPrice: 22,
    unit: 'kg',
    threshold: 15,
    hasExpiry: false,
    vendorType: 'Grocery Distributor',
    description: 'Iodized table salt, 1 kg pack',
    imageUrl: 'https://images.unsplash.com/photo-1646722391295-0bfc1035fb99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWx0JTIwdGFibGUlMjBpb2RpemVkfGVufDF8fHx8MTc3MTEzNTYxNnww&ixlib=rb-4.1.0&q=80&w=1080',
    sku: 'GRN-SLT-009',
  },
  {
    name: 'Turmeric Powder (100 g)',
    category: 'Spices & Masala',
    costPrice: 30,
    sellingPrice: 42,
    unit: 'packet',
    threshold: 12,
    hasExpiry: true,
    vendorType: 'Spice Trader',
    description: 'Pure haldi powder, 100 g pack',
    imageUrl: 'https://images.unsplash.com/photo-1698556735172-1b5b3cd9d2ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dXJtZXJpYyUyMHBvd2RlciUyMHNwaWNlfGVufDF8fHx8MTc3MTEzNTYxNnww&ixlib=rb-4.1.0&q=80&w=1080',
    sku: 'SPC-TRM-010',
  },
  {
    name: 'Red Chilli Powder (100 g)',
    category: 'Spices & Masala',
    costPrice: 35,
    sellingPrice: 48,
    unit: 'packet',
    threshold: 12,
    hasExpiry: true,
    vendorType: 'Spice Trader',
    description: 'Kashmiri / Guntur chilli powder, 100 g',
    imageUrl: 'https://images.unsplash.com/photo-1741521311974-85002911c1c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBjaGlsbklMjBwb3dkZXIlMjBzcGljZXxlbnwxfHx8fDE3NzExMzU2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    sku: 'SPC-CHL-011',
  },
  {
    name: 'Coriander Powder (100 g)',
    category: 'Spices & Masala',
    costPrice: 28,
    sellingPrice: 38,
    unit: 'packet',
    threshold: 12,
    hasExpiry: true,
    vendorType: 'Spice Trader',
    description: 'Dhaniya powder for everyday cooking',
    imageUrl: 'https://images.unsplash.com/photo-1636001402266-e6f7e3c9450d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3JpYW5kZXIlMjBwb3dkZXIlMjBzcGljZXxlbnwxfHx8fDE3NzExMzU2MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    sku: 'SPC-COR-012',
  },
  {
    name: 'Cumin Seeds / Jeera (100 g)',
    category: 'Spices & Masala',
    costPrice: 40,
    sellingPrice: 55,
    unit: 'packet',
    threshold: 10,
    hasExpiry: false,
    vendorType: 'Spice Trader',
    description: 'Whole cumin seeds for tadka and seasoning',
    imageUrl: 'https://images.unsplash.com/photo-1623667358338-d756856e74cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdW1pbiUyMHNlZWRzJTIwamVlcmF8ZW58MXx8fHwxNzcxMDQ5MzYzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    sku: 'SPC-JRA-013',
  },
  {
    name: 'Mustard Seeds (100 g)',
    category: 'Spices & Masala',
    costPrice: 20,
    sellingPrice: 28,
    unit: 'packet',
    threshold: 10,
    hasExpiry: false,
    vendorType: 'Spice Trader',
    description: 'Black mustard seeds (rai) for tempering',
    imageUrl: 'https://images.unsplash.com/photo-1619385003903-5df9413b8c04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXN0YXJkJTIwc2VlZHMlMjBibGFjayUyMHNwaWNlfGVufDF8fHx8MTc3MTEzNTYyMnww&ixlib=rb-4.1.0&q=80&w=1080',
    sku: 'SPC-MST-014',
  },
  {
    name: 'Detergent Soap Bar',
    category: 'Household',
    costPrice: 18,
    sellingPrice: 25,
    unit: 'piece',
    threshold: 20,
    hasExpiry: false,
    vendorType: 'FMCG Distributor',
    description: 'Laundry detergent bar, single unit',
    imageUrl: 'https://images.unsplash.com/photo-1750271336429-8b0a507785c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2FwJTIwYmFyJTIwZGV0ZXJnZW50fGVufDF8fHx8MTc3MTEzNTYyMXww&ixlib=rb-4.1.0&q=80&w=1080',
    sku: 'HHL-SOA-015',
  },
  {
    name: 'Biscuits / Cookies',
    category: 'Snacks',
    costPrice: 10,
    sellingPrice: 15,
    unit: 'packet',
    threshold: 25,
    hasExpiry: true,
    vendorType: 'FMCG Distributor',
    description: 'Popular glucose / cream biscuit small packet',
    imageUrl: 'https://images.unsplash.com/photo-1634834217066-4cc530278c31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXNjdWl0JTIwY29va2llcyUyMHBhY2tldHxlbnwxfHx8fDE3NzExMzU2MjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    sku: 'SNK-BIS-016',
  },
  {
    name: 'Instant Noodles',
    category: 'Snacks',
    costPrice: 12,
    sellingPrice: 15,
    unit: 'packet',
    threshold: 30,
    hasExpiry: true,
    vendorType: 'FMCG Distributor',
    description: 'Masala instant noodles, single serve',
    imageUrl: 'https://images.unsplash.com/photo-1603033172872-c2525115c7b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWdnaSUyMG5vb2RsZXMlMjBpbnN0YW50fGVufDF8fHx8MTc3MTA1MTQzM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    sku: 'SNK-NDL-017',
  },
  {
    name: 'Jaggery / Gur (500 g)',
    category: 'Grains & Staples',
    costPrice: 40,
    sellingPrice: 55,
    unit: 'piece',
    threshold: 8,
    hasExpiry: false,
    vendorType: 'Grocery Distributor',
    description: 'Organic jaggery block, 500 g',
    imageUrl: 'https://images.unsplash.com/photo-1633299258059-66b1111f4ea3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYWdnZXJ5JTIwZ3VyJTIwYnJvd24lMjBzdWdhcnxlbnwxfHx8fDE3NzExMzU2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    sku: 'GRN-JGR-018',
  },
  {
    name: 'Moong Dal (1 kg)',
    category: 'Pulses & Lentils',
    costPrice: 110,
    sellingPrice: 140,
    unit: 'kg',
    threshold: 10,
    hasExpiry: false,
    vendorType: 'Dal Wholesaler',
    description: 'Green gram split, yellow moong dal',
    imageUrl: 'https://images.unsplash.com/photo-1648889095694-c597b314356e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5ZWxsb3clMjBsZW50aWxzJTIwZGFsJTIwYm93bHxlbnwxfHx8fDE3NzExMzU2MjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    sku: 'PLS-MNG-019',
  },
  {
    name: 'Mustard Oil (1 L)',
    category: 'Cooking Oil',
    costPrice: 140,
    sellingPrice: 175,
    unit: 'bottle',
    threshold: 8,
    hasExpiry: true,
    vendorType: 'Oil Distributor',
    description: 'Cold-pressed kachi ghani mustard oil, 1 L',
    imageUrl: 'https://images.unsplash.com/photo-1662058595162-10e024b1a907?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwb2lsJTIwYm90dGxlJTIwc3VuZmxvd2VyfGVufDF8fHx8MTc3MTEzNTYxNXww&ixlib=rb-4.1.0&q=80&w=1080',
    sku: 'OIL-MST-020',
  },
];

const CATEGORIES = ['All', ...Array.from(new Set(KIRANA_CATALOG.map(i => i.category)))];

interface KiranaCatalogProps {
  isOpen: boolean;
  onClose: () => void;
  existingProducts: Product[];
  onProductsAdded: (products: Product[]) => void;
}

export function KiranaCatalog({ isOpen, onClose, existingProducts, onProductsAdded }: KiranaCatalogProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selected, setSelected] = useState<Map<number, { stock: string; expiryDate: string }>>(new Map());
  const [isAdding, setIsAdding] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  // Filter out products that already exist in inventory (by name similarity)
  const existingNames = useMemo(() => {
    return new Set(existingProducts.map(p => p.name.toLowerCase().trim()));
  }, [existingProducts]);

  const filteredCatalog = useMemo(() => {
    return KIRANA_CATALOG.map((item, idx) => ({ ...item, _idx: idx })).filter(item => {
      const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const alreadyInInventory = (name: string) => {
    const lower = name.toLowerCase().trim();
    return existingProducts.some(p => {
      const pLower = p.name.toLowerCase().trim();
      return pLower === lower || pLower.includes(lower) || lower.includes(pLower);
    });
  };

  const toggleSelect = (idx: number) => {
    setSelected(prev => {
      const next = new Map(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.set(idx, { stock: '', expiryDate: '' });
      }
      return next;
    });
  };

  const updateSelected = (idx: number, field: 'stock' | 'expiryDate', value: string) => {
    setSelected(prev => {
      const next = new Map(prev);
      const current = next.get(idx) || { stock: '', expiryDate: '' };
      next.set(idx, { ...current, [field]: value });
      return next;
    });
  };

  const handleAddSelected = async () => {
    if (selected.size === 0) {
      toast.error('Please select at least one product');
      return;
    }

    // Validate stock for all selected items
    for (const [idx, data] of selected) {
      const item = KIRANA_CATALOG[idx];
      if (!data.stock || isNaN(Number(data.stock)) || Number(data.stock) <= 0) {
        toast.error(`Please enter quantity for "${item.name}"`);
        setExpandedIdx(idx);
        return;
      }
      if (item.hasExpiry && !data.expiryDate) {
        toast.error(`Please enter expiry date for "${item.name}"`);
        setExpandedIdx(idx);
        return;
      }
    }

    setIsAdding(true);
    const addedProducts: Product[] = [];
    let failCount = 0;

    for (const [idx, data] of selected) {
      const item = KIRANA_CATALOG[idx];
      const stockNum = Number(data.stock) || 0;

      const product: Product = {
        id: Date.now() + idx + Math.floor(Math.random() * 100),
        name: item.name,
        sku: item.sku,
        category: item.category,
        stock: stockNum,
        price: item.sellingPrice,
        costPrice: item.costPrice,
        sellingPrice: item.sellingPrice,
        threshold: item.threshold,
        alertEnabled: true,
        vendorType: item.vendorType,
        description: item.description,
        imageUrl: item.imageUrl,
        unitsSold: 0,
        revenue: 0,
        expiryDate: item.hasExpiry && data.expiryDate ? data.expiryDate : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      try {
        const created = await productsApi.add(product);
        addedProducts.push(created);
      } catch (err: any) {
        console.error(`Failed to add ${item.name}:`, err);
        failCount++;
      }

      // Small delay between adds to avoid overwhelming the server
      await new Promise(r => setTimeout(r, 120));
    }

    setIsAdding(false);

    if (addedProducts.length > 0) {
      onProductsAdded(addedProducts);
      toast.success(`Added ${addedProducts.length} product${addedProducts.length > 1 ? 's' : ''} to inventory!`);
    }
    if (failCount > 0) {
      toast.error(`${failCount} product${failCount > 1 ? 's' : ''} failed to add. Try again.`);
    }
    if (addedProducts.length > 0) {
      setSelected(new Map());
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 overflow-hidden bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F4C81] to-[#1a6bb5] px-3 py-3 sm:p-5 text-white overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
              <ShoppingBasket className="w-5 h-5 flex-shrink-0" />
              Kirana Product Catalog
            </DialogTitle>
            <DialogDescription className="text-blue-100 text-xs sm:text-sm leading-snug">
              Select products to add to your inventory. Just enter quantity{' '}
              & expiry for perishables.
            </DialogDescription>
          </DialogHeader>

          {/* Search */}
          <div className="mt-2.5 sm:mt-3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-200" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/15 text-white placeholder:text-blue-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
            />
          </div>

          {/* Category pills */}
          <div className="mt-2.5 sm:mt-3 flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-white text-[#0F4C81]'
                    : 'bg-white/15 text-blue-100 hover:bg-white/25'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product List */}
        <div className="overflow-y-auto max-h-[45vh] p-3 space-y-2">
          <AnimatePresence mode="popLayout">
            {filteredCatalog.map((item) => {
              const idx = item._idx;
              const isSelected = selected.has(idx);
              const isExpanded = expandedIdx === idx || isSelected;
              const inInventory = alreadyInInventory(item.name);
              const selData = selected.get(idx);

              return (
                <motion.div
                  key={idx}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`rounded-xl border transition-all ${
                    isSelected
                      ? 'border-[#0F4C81] bg-[#0F4C81]/5 shadow-md'
                      : inInventory
                        ? 'border-gray-200 bg-gray-50 opacity-60'
                        : 'border-gray-200 bg-white hover:border-[#0F4C81]/30 hover:shadow-sm'
                  }`}
                >
                  {/* Main row */}
                  <div
                    className={`flex items-center gap-3 p-3 cursor-pointer ${inInventory ? 'cursor-not-allowed' : ''}`}
                    onClick={() => {
                      if (inInventory) return;
                      if (isSelected) {
                        setExpandedIdx(expandedIdx === idx ? null : idx);
                      } else {
                        toggleSelect(idx);
                        setExpandedIdx(idx);
                      }
                    }}
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm text-gray-900 truncate">{item.name}</p>
                        {inInventory && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-medium whitespace-nowrap">
                            In Stock
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-2">
                        <span>{item.category}</span>
                        <span className="text-gray-300">|</span>
                        <span className="font-medium text-gray-700">Cost: ₹{item.costPrice}</span>
                        <span className="text-gray-300">|</span>
                        <span className="font-medium text-green-600">Sell: ₹{item.sellingPrice}</span>
                      </p>
                    </div>

                    {/* Toggle */}
                    {!inInventory && (
                      <div className="flex items-center gap-1">
                        {isSelected ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSelect(idx);
                              if (expandedIdx === idx) setExpandedIdx(null);
                            }}
                            className="w-7 h-7 rounded-full bg-[#0F4C81] text-white flex items-center justify-center"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        ) : (
                          <div className="w-7 h-7 rounded-full border-2 border-gray-300 flex items-center justify-center">
                            <Plus className="w-3.5 h-3.5 text-gray-400" />
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedIdx(expandedIdx === idx ? null : idx);
                          }}
                          className="w-6 h-6 flex items-center justify-center text-gray-400"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Expanded: qty & expiry input */}
                  <AnimatePresence>
                    {isExpanded && !inInventory && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 pt-1 flex flex-wrap gap-3 border-t border-dashed border-gray-200 mt-0">
                          <div className="flex-1 min-w-[120px]">
                            <Label className="text-xs text-gray-500 mb-1 block">
                              Quantity ({item.unit})
                            </Label>
                            <Input
                              type="number"
                              min="1"
                              placeholder={`e.g. 10 ${item.unit}`}
                              value={selData?.stock || ''}
                              onChange={(e) => {
                                if (!isSelected) toggleSelect(idx);
                                updateSelected(idx, 'stock', e.target.value);
                              }}
                              className="h-9 text-sm bg-white"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          {item.hasExpiry && (
                            <div className="flex-1 min-w-[140px]">
                              <Label className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Expiry Date
                              </Label>
                              <Input
                                type="date"
                                value={selData?.expiryDate || ''}
                                onChange={(e) => {
                                  if (!isSelected) toggleSelect(idx);
                                  updateSelected(idx, 'expiryDate', e.target.value);
                                }}
                                className="h-9 text-sm bg-white"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          )}
                          <div className="w-full">
                            <p className="text-[11px] text-gray-400 mt-1">
                              SKU: {item.sku} &bull; Vendor: {item.vendorType} &bull; Low-stock alert at {item.threshold} units
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredCatalog.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Package className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No products match your search</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-4">
          {selected.size > 0 && (
            <div className="mb-3 text-sm text-gray-600 flex items-center justify-between">
              <span className="font-medium">{selected.size} product{selected.size > 1 ? 's' : ''} selected</span>
              <button
                onClick={() => setSelected(new Map())}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            </div>
          )}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isAdding}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSelected}
              disabled={selected.size === 0 || isAdding}
              className="flex-[2] bg-[#0F4C81] hover:bg-[#0d3f6a] text-white"
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding {selected.size} product{selected.size > 1 ? 's' : ''}...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add {selected.size || ''} to Inventory
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}