import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { supabase } from './supabaseClient';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-29b58f9a`;

// Get fresh access token from Supabase session
async function getAccessToken(): Promise<string | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session for AI call:', error);
      return null;
    }
    
    if (!session) {
      console.warn('No active session found for AI call');
      return null;
    }
    
    return session.access_token;
  } catch (error) {
    console.error('Error retrieving access token:', error);
    return null;
  }
}

// AI Product Image Generation
export async function generateProductImage(productName: string, productDescription?: string, productCategory?: string): Promise<{ imageUrl: string; revisedPrompt: string; isFallback?: boolean }> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('No authentication token found. Please sign in.');
    }

    const response = await fetch(`${API_BASE}/ai/generate-product-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        productName,
        productDescription,
        productCategory
      }),
    });

    const data = await response.json();

    // Handle 401 by attempting token refresh
    if (response.status === 401) {
      console.log('AI image generation received 401, refreshing session...');
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error || !session) {
        throw new Error('Session expired. Please log in again.');
      }
      
      // Retry with fresh token
      const retryResponse = await fetch(`${API_BASE}/ai/generate-product-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          productName,
          productDescription,
          productCategory
        }),
      });
      
      const retryData = await retryResponse.json();
      
      if (!retryResponse.ok) {
        throw new Error(retryData.details || retryData.error || 'Failed to generate product image');
      }
      
      return {
        imageUrl: retryData.imageUrl,
        revisedPrompt: retryData.revisedPrompt
      };
    }

    if (!response.ok) {
      // Check if it's a fallback response despite 200 OK (some APIs might do this) or if it's our mocked response structure
      // Actually, my backend code returns 200 OK for fallback, so this block is for other errors.
      throw new Error(data.details || data.error || 'Failed to generate product image');
    }

    return {
      imageUrl: data.imageUrl,
      revisedPrompt: data.revisedPrompt,
      isFallback: data.isFallback
    };
  } catch (error) {
    console.error('Error generating product image:', error);
    throw error;
  }
}

// AI Product Description Enhancement
export async function enhanceProductDescription(productName: string, currentDescription?: string, productCategory?: string, price?: number): Promise<string> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('No authentication token found. Please sign in.');
    }

    const response = await fetch(`${API_BASE}/ai/enhance-description`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        productName,
        currentDescription,
        productCategory,
        price
      }),
    });

    const data = await response.json();

    // Handle 401 by attempting token refresh
    if (response.status === 401) {
      console.log('AI description enhancement received 401, refreshing session...');
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error || !session) {
        throw new Error('Session expired. Please log in again.');
      }
      
      // Retry with fresh token
      const retryResponse = await fetch(`${API_BASE}/ai/enhance-description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          productName,
          currentDescription,
          productCategory,
          price
        }),
      });
      
      const retryData = await retryResponse.json();
      
      if (!retryResponse.ok) {
        throw new Error(retryData.error || 'Failed to enhance description');
      }
      
      return retryData.enhancedDescription;
    }

    if (!response.ok) {
      throw new Error(data.error || 'Failed to enhance description');
    }

    return data.enhancedDescription;
  } catch (error) {
    console.error('Error enhancing description:', error);
    throw error;
  }
}

// AI Purchase Pattern Analysis
export interface AIAnalysis {
  insights: string[];
  recommendations: string[];
  predictions: string[];
  inventoryOptimization: string[];
  expiryActions?: string[];
}

export interface AnalyticsData {
  totalProducts: number;
  totalRevenue: number;
  totalSales: number;
  totalCustomers: number;
  totalOrders: number;
  lowStockCount: number;
  expiringCount?: number;
  topProducts: Array<{
    id: number;
    name: string;
    category: string;
    unitsSold: number;
    revenue: number;
    stock: number;
    imageUrl?: string;
  }>;
  expiringProducts?: Array<{
    id: number;
    name: string;
    expiryDate: string;
    stock: number;
    price: number;
    category: string;
    imageUrl?: string;
  }>;
  productsByCategory: Record<string, number>;
}

export async function analyzePurchasePatterns(): Promise<{ analysis: AIAnalysis; analyticsData: AnalyticsData }> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('No authentication token found. Please sign in.');
    }

    console.log('Calling AI pattern analysis endpoint...');

    const response = await fetch(`${API_BASE}/ai/analyze-patterns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    // Handle 401 by attempting token refresh
    if (response.status === 401) {
      console.log('AI pattern analysis received 401, refreshing session...');
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error || !session) {
        throw new Error('Session expired. Please log in again.');
      }
      
      // Retry with fresh token
      const retryResponse = await fetch(`${API_BASE}/ai/analyze-patterns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      
      const retryData = await retryResponse.json();
      
      if (!retryResponse.ok) {
        console.error('AI analysis retry error response:', retryData);
        const errorMessage = retryData.details || retryData.error || 'Failed to analyze patterns';
        throw new Error(errorMessage);
      }
      
      console.log('AI analysis retry successful:', {
        hasAnalysis: !!retryData.analysis,
        hasAnalyticsData: !!retryData.analyticsData
      });
      
      return {
        analysis: retryData.analysis,
        analyticsData: retryData.analyticsData
      };
    }

    if (!response.ok) {
      console.error('AI analysis error response:', data);
      const errorMessage = data.details || data.error || 'Failed to analyze patterns';
      throw new Error(errorMessage);
    }

    console.log('AI analysis response received:', {
      hasAnalysis: !!data.analysis,
      hasAnalyticsData: !!data.analyticsData
    });

    return {
      analysis: data.analysis,
      analyticsData: data.analyticsData
    };
  } catch (error) {
    console.error('Error analyzing patterns:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to analyze patterns');
  }
}