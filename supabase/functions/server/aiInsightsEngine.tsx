import { createClient } from "npm:@supabase/supabase-js@2";
import { analyticsInsightsService } from "./analyticsInsightsService.tsx";
import * as kv from "./kv_store.tsx";

// Helper to get user-specific key
function getUserKey(userId: string, key: string): string {
  return `user:${userId}:${key}`;
}

export interface Insight {
  id: string;
  type: "inventory" | "sales" | "vendor" | "profit" | "expiry";
  severity: "info" | "warning" | "critical";
  title: string;
  summary: string;
  explanation: {
    what: string;
    why: string;
    fix: string;
  };
  recommended_action: {
    label: string;
    action_type: "navigate" | "api_call" | "suggestion";
    payload: any;
  };
  confidence: number;
}

export const aiInsightsEngine = {
  generateInsights: async (userId: string): Promise<{
    storeStatus: { status: 'healthy'|'attention'|'risk', message: string };
    metrics: any;
    insights: Insight[];
  }> => {
    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    
    // Get Data
    const metrics = await analyticsInsightsService.getAggregatedMetrics(userId);
    const products = await kv.get(getUserKey(userId, 'products')) || [];
    
    // Filter ignored insights
    const feedbackList = await kv.get(getUserKey(userId, 'insight_feedback')) || [];
    const ignoredIds = new Set(feedbackList.filter((f: any) => f.status === 'ignored').map((f: any) => f.insightId));

    const insights: Insight[] = [];
    
    // 1. Low Stock Rule
    if (metrics.lowStockCount > 0) {
        const id = `ins-stock-${metrics.date}`;
        if (!ignoredIds.has(id)) {
            insights.push({
                id,
                type: 'inventory',
                severity: metrics.lowStockCount > 5 ? 'critical' : 'warning',
                title: `${metrics.lowStockCount} Items Low on Stock`,
                summary: `You have ${metrics.lowStockCount} products running low.`,
                explanation: {
                    what: `${metrics.lowStockCount} products are below their reorder point.`,
                    why: "Recent sales have depleted the inventory.",
                    fix: "Reorder these items to avoid missing potential sales."
                },
                recommended_action: {
                    label: "View Low Stock",
                    action_type: "navigate",
                    payload: { path: "/dashboard/inventory?filter=low_stock" }
                },
                confidence: 1.0
            });
        }
    }

    // 2. Expiry Rule
    if (metrics.expiringSoonCount > 0) {
         const id = `ins-exp-${metrics.date}`;
         if (!ignoredIds.has(id)) {
            insights.push({
                id,
                type: 'expiry',
                severity: 'warning',
                title: `${metrics.expiringSoonCount} Batches Expiring Soon`,
                summary: `Action needed for items expiring this week.`,
                explanation: {
                    what: "Some batches are nearing their expiry date.",
                    why: "Inventory aging.",
                    fix: "Run a promotion or clear stock to minimize loss."
                },
                recommended_action: {
                    label: "Check Expiry",
                    action_type: "navigate",
                    payload: { path: "/dashboard/inventory" }
                },
                confidence: 1.0
            });
         }
    }

    // 3. Sales/Profit Insight (Simple)
    if (metrics.salesToday > 0 && metrics.estimatedProfit < 0) {
        const id = `ins-prof-${metrics.date}`;
        if (!ignoredIds.has(id)) {
            insights.push({
                id,
                type: 'profit',
                severity: 'warning',
                title: "Negative Profit Today",
                summary: "Sales are below cost today.",
                explanation: {
                    what: "Your estimated profit for today is negative.",
                    why: "Likely selling items below cost or high wastage.",
                    fix: "Check your pricing and recent adjustments."
                },
                recommended_action: {
                    label: "Review Sales",
                    action_type: "navigate",
                    payload: { path: "/dashboard/analytics" }
                },
                confidence: 0.9
            });
        }
    }

    // 4. AI Generative Insight (Optional/Advanced)
    // If we had more history, we could ask LLM for trends.
    // Keeping it lightweight for now as per instructions (Backend Aggregation Service).

    // Determine Store Status
    let status: 'healthy'|'attention'|'risk' = 'healthy';
    let message = "Business is running smoothly.";

    if (metrics.lowStockCount > 10 || metrics.expiringSoonCount > 5) {
        status = 'risk';
        message = "Inventory levels critically low.";
    } else if (metrics.lowStockCount > 0 || metrics.expiringSoonCount > 0 || metrics.estimatedProfit < 0) {
        status = 'attention';
        message = "Some items need attention.";
    } else if (metrics.salesToday > 1000) {
        status = 'healthy';
        message = "Great sales performance today!";
    }

    return {
        storeStatus: { status, message },
        metrics,
        insights: insights.slice(0, 5) // Limit to 5
    };
  },

  recordFeedback: async (userId: string, insightId: string, status: 'seen' | 'ignored' | 'acted') => {
      const key = getUserKey(userId, 'insight_feedback');
      const list = await kv.get(key) || [];
      // Remove existing for this insight if any
      const filtered = list.filter((f: any) => f.insightId !== insightId);
      filtered.push({ insightId, status, timestamp: new Date().toISOString() });
      await kv.set(key, filtered);
  }
};
