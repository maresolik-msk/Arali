export enum PricingPlan {
  FREE = 'FREE',
  STARTER = 'STARTER',
  GROWTH = 'GROWTH',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export interface PlanLimits {
  maxStores: number;
  maxSkus: number;
  dataHistoryDays: number;
  canForecast: boolean;
  forecastDays: number; // 0 if disabled
  canAutomate: boolean; // Auto reorder
  canExport: boolean; // CSV/Excel
  canUseAPI: boolean;
  canViewReports: boolean;
  canUseSmartAlerts: boolean;
  canUseWhatsAppAlerts: boolean;
  canViewAuditLogs: boolean;
  canManageRoles: boolean;
}

export const PRICING_PLANS: Record<PricingPlan, PlanLimits> = {
  [PricingPlan.FREE]: {
    maxStores: 1,
    maxSkus: 100,
    dataHistoryDays: 7,
    canForecast: false,
    forecastDays: 0,
    canAutomate: false,
    canExport: false,
    canUseAPI: false,
    canViewReports: false,
    canUseSmartAlerts: false,
    canUseWhatsAppAlerts: false,
    canViewAuditLogs: false,
    canManageRoles: false,
  },
  [PricingPlan.STARTER]: {
    maxStores: 1,
    maxSkus: 500,
    dataHistoryDays: 90,
    canForecast: true,
    forecastDays: 7,
    canAutomate: false,
    canExport: false,
    canUseAPI: false,
    canViewReports: true, // "Reports: PDF only" -> implies enabled but restricted format. For now true.
    canUseSmartAlerts: false, // "Email alerts" enabled, but "Smart alerts" are Growth+
    canUseWhatsAppAlerts: false,
    canViewAuditLogs: false,
    canManageRoles: false,
  },
  [PricingPlan.GROWTH]: {
    maxStores: 5,
    maxSkus: 2000,
    dataHistoryDays: 365,
    canForecast: true,
    forecastDays: 30,
    canAutomate: true,
    canExport: true,
    canUseAPI: false,
    canViewReports: true,
    canUseSmartAlerts: true,
    canUseWhatsAppAlerts: false,
    canViewAuditLogs: false,
    canManageRoles: true,
  },
  [PricingPlan.PRO]: {
    maxStores: Infinity,
    maxSkus: Infinity,
    dataHistoryDays: Infinity,
    canForecast: true,
    forecastDays: 90, // "Advanced"
    canAutomate: true,
    canExport: true,
    canUseAPI: true,
    canViewReports: true,
    canUseSmartAlerts: true,
    canUseWhatsAppAlerts: true,
    canViewAuditLogs: true,
    canManageRoles: true,
  },
  [PricingPlan.ENTERPRISE]: {
    maxStores: Infinity,
    maxSkus: Infinity,
    dataHistoryDays: Infinity,
    canForecast: true,
    forecastDays: 365,
    canAutomate: true,
    canExport: true,
    canUseAPI: true,
    canViewReports: true,
    canUseSmartAlerts: true,
    canUseWhatsAppAlerts: true,
    canViewAuditLogs: true,
    canManageRoles: true,
  },
};

export interface PlanDetails {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
}

export const PLAN_DETAILS: Record<PricingPlan, PlanDetails> = {
  [PricingPlan.FREE]: {
    title: 'Free',
    price: '₹0',
    description: 'Perfect for small shops just getting started.',
    features: [
      '1 Store',
      '100 SKUs',
      '7 Days History',
      'Basic Inventory Tracking',
      'Mobile App Access',
    ],
    buttonText: 'Start for Free',
  },
  [PricingPlan.STARTER]: {
    title: 'Starter',
    price: '₹499',
    description: 'For growing shops needing more insights.',
    features: [
      '1 Store',
      '500 SKUs',
      '90 Days History',
      'Basic Reports',
      'Basic Forecasting (7 days)',
    ],
    buttonText: 'Get Starter',
  },
  [PricingPlan.GROWTH]: {
    title: 'Growth',
    price: '₹1,499',
    description: 'Advanced tools for serious retailers.',
    features: [
      '5 Stores',
      '2,000 SKUs',
      '1 Year History',
      'Smart Alerts',
      'Export Data (CSV/Excel)',
      'Automated Reordering',
    ],
    buttonText: 'Get Growth',
    popular: true,
  },
  [PricingPlan.PRO]: {
    title: 'Pro',
    price: '₹3,999',
    description: 'Complete control for scaling businesses.',
    features: [
      'Unlimited Stores',
      'Unlimited SKUs',
      'Unlimited History',
      'WhatsApp Alerts',
      'API Access',
      'Audit Logs',
      'Role Management',
    ],
    buttonText: 'Get Pro',
  },
  [PricingPlan.ENTERPRISE]: {
    title: 'Enterprise',
    price: 'Custom',
    description: 'Tailored solutions for large networks.',
    features: [
      'Everything in Pro',
      'Dedicated Support',
      'Custom Integrations',
      'SLA Guarantees',
      'On-premise Options',
    ],
    buttonText: 'Contact Sales',
  },
};

export const DEFAULT_PLAN = PricingPlan.FREE;
