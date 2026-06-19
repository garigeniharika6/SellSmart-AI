export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  businessName?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  reorderLevel: number;
  sku: string;
  description: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  profit: number;
  date: string;
  channel: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  rating: number;
  text: string;
  customerName: string;
  date: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface InventoryAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  reorderLevel: number;
  alertType: 'low_stock' | 'critical_stock' | 'overstock';
  recommendation: string;
  createdAt: string;
}

export interface DemandForecast {
  productId: string;
  productName: string;
  historicalSales: number[];
  predictedDemand: number;
  confidence: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  month: string;
}

export interface PricingRecommendation {
  productId: string;
  productName: string;
  costPrice: number;
  competitorPrice: number;
  demandLevel: 'low' | 'medium' | 'high';
  recommendedPrice: number;
  profitMargin: number;
  strategy: string;
}

export interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topComplaints: string[];
  topPraises: string[];
  summary: string;
}

export interface TrendingProduct {
  id: string;
  name: string;
  category: string;
  demandScore: number;
  opportunityScore: number;
  growthRate: number;
  avgPrice: number;
  trend: 'rising' | 'stable' | 'declining';
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  inventoryHealth: number;
  customerSatisfaction: number;
  revenueChange: number;
  ordersChange: number;
  satisfactionChange: number;
}

export interface ChartData {
  name: string;
  value: number;
  revenue?: number;
  orders?: number;
  date?: string;
}

export interface Activity {
  id: string;
  type: 'sale' | 'review' | 'alert' | 'forecast' | 'pricing';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

export interface SalesData {
  month: string;
  revenue: number;
  orders: number;
  profit: number;
}

export interface ProductDescriptionInput {
  productName: string;
  category: string;
  features: string[];
  targetAudience: string;
}

export interface GeneratedDescription {
  fullDescription: string;
  shortDescription: string;
  seoKeywords: string[];
}

export type Theme = 'light' | 'dark';

export interface AppState {
  user: User | null;
  theme: Theme;
  isLoading: boolean;
}
