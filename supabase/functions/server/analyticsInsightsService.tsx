import * as kv from "./kv_store.tsx";

// Helper to get user-specific key
function getUserKey(userId: string, key: string): string {
  return `user:${userId}:${key}`;
}

export interface DailyMetrics {
    salesToday: number;
    estimatedProfit: number;
    lowStockCount: number;
    expiringSoonCount: number;
    date: string;
}

export const analyticsInsightsService = {
  getAggregatedMetrics: async (userId: string): Promise<DailyMetrics> => {
    // Fetch data
    const [products, movements, losses] = await Promise.all([
        kv.get(getUserKey(userId, 'products')),
        kv.get(getUserKey(userId, 'inventory_movements')),
        kv.get(getUserKey(userId, 'losses'))
    ]);

    const productsList = Array.isArray(products) ? products : [];
    const movementsList = Array.isArray(movements) ? movements : [];
    
    // Calculate Today's Sales
    const today = new Date();
    today.setHours(0,0,0,0);
    const todayISO = today.toISOString().split('T')[0];

    // Filter movements for today's sales
    const todaysMovements = movementsList.filter((m: any) => {
        if (!m.date) return false;
        const d = new Date(m.date);
        d.setHours(0,0,0,0);
        return d.getTime() === today.getTime() && m.type === 'sale';
    });

    // Revenue & Profit
    // Profit = Revenue - (Cost of Goods Sold)
    let revenue = 0;
    let costOfGoodsSold = 0;

    todaysMovements.forEach((m: any) => {
        const product = productsList.find((p: any) => p.id === m.productId);
        if (product) {
            // Note: quantity is negative for sales in movements, assume abs for calc
            const qty = Math.abs(m.quantity); 
            // Prefer price/cost from movement snapshot if available, else product current
            revenue += qty * (product.price || 0); 
            costOfGoodsSold += qty * (product.costPrice || 0);
        }
    });

    const estimatedProfit = revenue - costOfGoodsSold;

    // Low Stock
    const lowStockCount = productsList.filter((p: any) => p.stock <= (p.reorderPoint || 5)).length;

    // Expiring Soon (Next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    nextWeek.setHours(23,59,59,999);
    
    let expiringSoonCount = 0;
    productsList.forEach((p: any) => {
        // Product level expiry
        if (p.expiryDate) {
            const exp = new Date(p.expiryDate);
            if (exp >= today && exp <= nextWeek) expiringSoonCount++;
        }
        // Batch level expiry
        if (p.batches) {
            p.batches.forEach((b: any) => {
                if (b.expiryDate && b.quantity > 0) {
                    const exp = new Date(b.expiryDate);
                    if (exp >= today && exp <= nextWeek) expiringSoonCount++;
                }
            });
        }
    });

    return {
        salesToday: revenue,
        estimatedProfit,
        lowStockCount,
        expiringSoonCount,
        date: todayISO
    };
  }
};
