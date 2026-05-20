// Product Types
export interface Product {
  id: string;
  name: string;
  category_id?: number| string;
  supplier_id?: number| string;
  barcode?: string;
  price: number;
  cost: number;
  stock_quantity: number;
  min_stock_level?: number;
  max_stock_level?: number;
  expiry_date?: string;
  description?: string;
  branch_id?: number;
  category_name?: string;
  supplier_name?: string;
  branch_name?: string;
  dailySales?: number;
  lowStockThreshold?: number;
}

export interface BranchStock {
  branchId: number;
  stock: number;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  description?: string;
}

// Supplier Types
export interface Supplier {
  id: number;
  name: string;
  contact?: string;
  email?: string;
  address?: string;
  items_supplied_last_month?: Array<{
    product_id: string;
    product_name: string;
    quantity: number;
  }>;
}

// Branch Types
export interface Branch {
  id: number;
  name: string;
  location?: string;
}

// Inventory History
export interface InventoryHistoryEntry {
  id: string;
  product_id: string;
  action: string;
  quantity: number;
  previous_stock?: number;
  new_stock?: number;
  timestamp: string;
  notes?: string;
  product_name?: string;
}

// Supplier Order Types
export interface SupplierOrder {
  id: string;
  supplier_id: number;
  product_id: string;
  quantity: number;
  order_date: string;
  expected_date?: string;
  status: string;
  supplier_name?: string;
  product_name?: string;
  total_amount?: number;
}

// POS Transaction Types
export interface POSTransaction {
  id: string;
  product_id: string;
  quantity: number;
  total_amount: number;
  transaction_date: string;
  branch_id?: number;
  product_name?: string;
  branch_name?: string;
  items?: any[];
  payment_method?: string;
  status?: string;
}

// POS Configuration
export interface POSConfig {
  type: 'square' | 'clover' | 'shopify' | 'custom';
  endpoint: string;
  apiKey: string;
  syncFrequency: number;
  autoSync: boolean;
}

// Notification Types
export interface Notification {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  icon: string;
}

// Forecast Types
export interface ForecastData {
  period: string;
  actual: number;
  forecast: number;
}

export interface ForecastSummary {
  period: string;
  demand: number;
  suggestedOrder: number;
  projectedStock: number;
}

// Report Types
export interface ReportData {
  type: string;
  range: string;
  startDate: string;
  endDate: string;
  headers: string[];
  rows: Record<string, unknown>[];
}

// Trend Types
export interface InventoryTrend {
  products: number;
  lowStock: number;
  outOfStock: number;
  value: number;
  stockDays: number;
  turnover: number;
}

// Filter Types
export interface PriceRange {
  min: number | null;
  max: number | null;
}

export interface StockRange {
  min: number | null;
  max: number | null;
}

// Import/Export Types
export interface ImportPreview {
  [key: string]: string | number;
}
