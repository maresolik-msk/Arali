
import * as kv from "./kv_store.tsx";

// Types
export interface DailyMission {
  id: string;
  type: 'LOW_STOCK' | 'EXPIRY' | 'VENDOR_PAYMENT' | 'SALES_GOAL';
  title: string;
  description: string;
  action: 'REORDER' | 'DISCOUNT' | 'PAY' | 'REVIEW';
  targetId?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  completed: boolean;
}

export interface StoreHealth {
  score: number;
  status: 'HEALTHY' | 'NEEDS_ATTENTION' | 'RISK';
  metrics: {
    lowStock: number;
    expiring: number;
    salesTrend: number;
  };
}

export interface EndOfDaySummary {
  sales: number;
  profit_estimate: number;
  wastage: number;
  best_seller: string;
  missed_sales: string[];
}

// Helpers
function getUserKey(userId: string, key: string): string {
  return `user:${userId}:${key}`;
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const dashboardService = {
  getDailyMissions: async (userId: string): Promise<DailyMission[]> => {
    // 1. Fetch necessary data
    const products = (await kv.get(getUserKey(userId, 'products'))) || [];
    const vendors = (await kv.get(getUserKey(userId, 'vendors'))) || [];
    
    const missions: DailyMission[] = [];

    // 2. Generate Low Stock Missions
    const lowStockProducts = products.filter((p: any) => p.stock <= (p.minStockLevel || 5));
    if (lowStockProducts.length > 0) {
      // Group them or take top 2
      lowStockProducts.slice(0, 2).forEach((p: any) => {
        missions.push({
          id: `mission_stock_${p.id}_${new Date().toDateString()}`,
          type: 'LOW_STOCK',
          title: `Restock ${p.name}`,
          description: `Stock is critical (${p.stock} left). Reorder now to avoid missed sales.`,
          action: 'REORDER',
          targetId: String(p.id),
          priority: 'HIGH',
          completed: false
        });
      });
    }

    // 3. Generate Expiry Missions
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * ONE_DAY_MS);
    
    // Check batches if available, or product expiryDate
    const expiringProducts = products.filter((p: any) => {
        if (p.expiryDate) {
            const exp = new Date(p.expiryDate);
            return exp > now && exp <= sevenDaysFromNow;
        }
        return false;
    });

    if (expiringProducts.length > 0) {
        expiringProducts.slice(0, 1).forEach((p: any) => {
            missions.push({
                id: `mission_expiry_${p.id}`,
                type: 'EXPIRY',
                title: `Clear ${p.name}`,
                description: `Expires in ${Math.ceil((new Date(p.expiryDate).getTime() - now.getTime()) / ONE_DAY_MS)} days. Apply discount?`,
                action: 'DISCOUNT',
                targetId: String(p.id),
                priority: 'MEDIUM',
                completed: false
            });
        });
    }

    // 4. Generate Vendor Payment Missions (Mock logic as we don't have full payment tracking yet)
    // If we had payment due dates, we would check them here.
    // For now, randomly pick a vendor to "Follow up" if list is not empty
    if (vendors.length > 0 && Math.random() > 0.7) {
        const vendor = vendors[0];
        missions.push({
            id: `mission_vendor_${vendor.id}`,
            type: 'VENDOR_PAYMENT',
            title: `Contact ${vendor.name}`,
            description: `Check for new arrivals or pending invoices.`,
            action: 'REVIEW',
            targetId: String(vendor.id),
            priority: 'LOW',
            completed: false
        });
    }

    // Limit to 3 missions
    return missions.slice(0, 3);
  },

  getStoreHealth: async (userId: string): Promise<StoreHealth> => {
    const products = (await kv.get(getUserKey(userId, 'products'))) || [];
    const orders = (await kv.get(getUserKey(userId, 'orders'))) || [];
    
    const totalProducts = products.length;
    if (totalProducts === 0) {
        return { score: 100, status: 'HEALTHY', metrics: { lowStock: 0, expiring: 0, salesTrend: 0 } };
    }

    const lowStockCount = products.filter((p: any) => p.stock <= (p.minStockLevel || 5)).length;
    const expiringCount = products.filter((p: any) => p.expiryDate && new Date(p.expiryDate) < new Date(Date.now() + 7 * ONE_DAY_MS)).length;

    // Calculate score
    // Start at 100
    // -10 per low stock item (capped at -40)
    // -15 per expiring item (capped at -30)
    // +10 if sales today > 0
    
    let score = 100;
    score -= Math.min(40, lowStockCount * 10);
    score -= Math.min(30, expiringCount * 15);
    
    // Check sales today
    const today = new Date().toDateString();
    const todaySales = orders.filter((o: any) => new Date(o.date).toDateString() === today);
    if (todaySales.length > 0) score += 5; // Bonus for activity

    score = Math.max(0, Math.min(100, score));

    let status: StoreHealth['status'] = 'HEALTHY';
    if (score < 50) status = 'RISK';
    else if (score < 80) status = 'NEEDS_ATTENTION';

    return {
        score,
        status,
        metrics: {
            lowStock: lowStockCount,
            expiring: expiringCount,
            salesTrend: 0 // Placeholder
        }
    };
  },

  getEndOfDaySummary: async (userId: string): Promise<EndOfDaySummary> => {
    const orders = (await kv.get(getUserKey(userId, 'orders'))) || [];
    const losses = (await kv.get(getUserKey(userId, 'losses'))) || [];
    
    const today = new Date().toDateString();
    
    // Filter for today
    const todayOrders = orders.filter((o: any) => new Date(o.date).toDateString() === today);
    const todayLosses = losses.filter((l: any) => new Date(l.date).toDateString() === today);

    const totalSales = todayOrders.reduce((sum: number, o: any) => sum + o.total, 0);
    
    // Estimate profit (Assuming 20% margin if cost not available, or calculate real margin)
    // For simplicity, let's assume margin is (Sales - Cost). 
    // If cost is in items, we sum it up.
    let totalCost = 0;
    todayOrders.forEach((o: any) => {
        o.items.forEach((item: any) => {
            // If we stored costPrice in order items, use it. Otherwise estimate.
            // Since we might not have costPrice in historical order items, we estimate 70% cost (30% margin)
            totalCost += (item.price * item.quantity) * 0.7; 
        });
    });
    
    const profit = Math.round(totalSales - totalCost);
    const wastage = todayLosses.reduce((sum: number, l: any) => sum + l.lossAmount, 0);

    // Find best seller
    const productSales: Record<string, number> = {};
    todayOrders.forEach((o: any) => {
        o.items.forEach((item: any) => {
            productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
        });
    });
    
    let bestSeller = 'None';
    let maxSold = 0;
    Object.entries(productSales).forEach(([name, qty]) => {
        if (qty > maxSold) {
            maxSold = qty;
            bestSeller = name;
        }
    });

    return {
        sales: totalSales,
        profit_estimate: profit,
        wastage,
        best_seller: bestSeller,
        missed_sales: [] // Requires "Stockout events" tracking which we might not have fully yet
    };
  }
};
