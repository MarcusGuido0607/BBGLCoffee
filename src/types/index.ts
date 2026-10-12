export type SurfaceType = 'kiosk' | 'pos' | 'admin' | 'design_tokens';

export type ProductCategory = 'coffee' | 'milktea' | 'pastries_meals';

export type DrinkSize = 'tall' | 'grande' | 'venti';

export type Temperature = 'iced' | 'hot';

export type SugarLevel = '0%' | '25%' | '50%' | '75%' | '100%';

export interface ProductAddon {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  basePrice: number;
  description: string;
  isDrink: boolean;
  availableSizes?: DrinkSize[];
  defaultSize?: DrinkSize;
  allowTemperature?: boolean;
  allowSugar?: boolean;
  availableAddons: ProductAddon[];
  calories?: number;
  allergens?: string[];
  imageArtKey: string;
  badge?: string;
}

export interface CartCustomization {
  size: DrinkSize;
  sizePriceDelta: number;
  temperature: Temperature;
  sugarLevel: SugarLevel;
  selectedAddons: ProductAddon[];
  specialInstructions: string;
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  customization: CartCustomization;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderType = 'kiosk_cash' | 'kiosk_gcash' | 'pos_walkin';

export type OrderStatus = 
  | 'pending_cash' 
  | 'gcash_verification' 
  | 'kitchen_queue' 
  | 'preparing' 
  | 'ready' 
  | 'completed' 
  | 'cancelled';

export interface Order {
  id: string;
  ticketNumber: string; // e.g. "C-042" or "B-108"
  orderType: OrderType;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  discountType?: 'student' | 'pwd_senior' | 'custom' | null;
  discountPercent?: number;
  discountAmount: number;
  discountCustomerRef?: string;
  netTotal: number;
  paymentMethod: 'cash' | 'gcash';
  gcashRefNumber?: string;
  cashReceived?: number;
  changeDue?: number;
  customerEmail?: string;
  createdAt: string;
  completedAt?: string;
  placedVia: 'Kiosk' | 'POS Counter';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  minStockAlert: number;
  supplier: string;
  lastRestocked: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Cashier' | 'Manager' | 'Admin' | 'Barista';
  contact: string;
  shiftSchedule: string;
  status: 'Active' | 'Inactive';
  permissions: {
    allowManualDiscounts: boolean;
    allowOrderCancellation: boolean;
    exportFinancialReports: boolean;
    editMenuPrices: boolean;
  };
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  event: string;
  user: string;
  details: string;
  flaggedReview: boolean;
  severity: 'info' | 'warning' | 'alert';
}

export interface HourlySalesData {
  hour: string;
  orders: number;
  sales: number;
}
