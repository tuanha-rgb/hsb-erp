// src/shop/inventory.ts

export type Category = "Apparel" | "Stationery" | "Accessories" | "Vouchers";
export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";
export type ActiveView = "dashboard" | "inventory" | "sales" | "add-product";
export type InventoryViewMode = "grid" | "list";
export type NoticeType = "success" | "error";

export interface Product {
  id: string; // Firebase document ID
  itemCode: string; // Auto-generated: HSB-XXX-NNNN
  name: string;
  category: Category;
  price: number;
  hsbPoints: number;
  stock: number;
  sold: number;
  image: string;
  sku: string;
  status: StockStatus;
  reorderLevel: number;
  supplier: string;
  lastRestocked: Date;
  sizes: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewProductForm {
  name: string;
  category: Category;
  price: string;        // form value
  hsbPoints: string;    // form value
  stock: string;        // form value
  image: string;
  sku: string;
  reorderLevel: string; // form value
  supplier: string;
  sizes: string[];
}

export interface NotificationState {
  message: string;
  type: NoticeType;
}

export const CATEGORIES: Array<"all" | Category> = [
  "all",
  "Apparel",
  "Stationery",
  "Accessories",
  "Vouchers",
];

// Sample products removed - now using Firebase
export const sampleProducts: Product[] = [];

export const emptyNewProduct: NewProductForm = {
  name: "",
  category: "Apparel",
  price: "",
  hsbPoints: "",
  stock: "",
  image: "https://i.postimg.cc/tgHhXHK4/hsb-capibara.jpg",
  sku: "",
  reorderLevel: "",
  supplier: "",
  sizes: [],
};

export const formatCurrency = (n: number) =>
  `$${n.toFixed(2)}`;
