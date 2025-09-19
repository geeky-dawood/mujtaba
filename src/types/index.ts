export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  minStock: number;
  price: number;
  cost: number;
  description: string;
  supplier: string;
  dateAdded: string;
  lastUpdated: string;
  image?: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'in' | 'out';
  quantity: number;
  date: string;
  reason: string;
  reference?: string;
}

export interface AnalyticsData {
  totalProducts: number;
  totalValue: number;
  lowStock: number;
  topSellingProducts: Product[];
  recentMovements: StockMovement[];
  stockTrends: { date: string; value: number }[];
}