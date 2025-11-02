// src/shop/inventory.ts

export type Category = "Apparel" | "Stationery" | "Accessories" | "Vouchers";
export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";
export type ActiveView = "dashboard" | "inventory" | "sales" | "add-product";
export type InventoryViewMode = "grid" | "list";
export type NoticeType = "success" | "error";

export interface Product {
  id: number;
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
  lastRestocked: string; // YYYY-MM-DD
  sizes: string[];
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

export const sampleProducts: Product[] = [
  {
    id: 1,
    name: "HSB University T-Shirt",
    category: "Apparel",
    price: 25.99,
    hsbPoints: 250,
    stock: 150,
    sold: 89,
    image: "https://i.postimg.cc/tgHhXHK4/hsb-capibara.jpg",
    sku: "HSB-TS-001",
    status: "in-stock",
    reorderLevel: 50,
    supplier: "UniWear Co.",
    lastRestocked: "2025-10-15",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 2,
    name: "HSB Hoodie Navy",
    category: "Apparel",
    price: 45.99,
    hsbPoints: 450,
    stock: 12,
    sold: 134,
    image: "https://i.postimg.cc/tgHhXHK4/hsb-capibara.jpg",
    sku: "HSB-HD-002",
    status: "low-stock",
    reorderLevel: 30,
    supplier: "UniWear Co.",
    lastRestocked: "2025-10-01",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 3,
    name: "University Notebook Set",
    category: "Stationery",
    price: 12.99,
    hsbPoints: 130,
    stock: 0,
    sold: 245,
    image: "https://i.postimg.cc/tgHhXHK4/hsb-capibara.jpg",
    sku: "HSB-NB-003",
    status: "out-of-stock",
    reorderLevel: 100,
    supplier: "StudySupplies Inc.",
    lastRestocked: "2025-09-20",
    sizes: [],
  },
  {
    id: 4,
    name: "HSB Baseball Cap",
    category: "Accessories",
    price: 18.99,
    hsbPoints: 190,
    stock: 85,
    sold: 67,
    image: "https://i.postimg.cc/tgHhXHK4/hsb-capibara.jpg",
    sku: "HSB-CAP-004",
    status: "in-stock",
    reorderLevel: 40,
    supplier: "HeadGear Pro",
    lastRestocked: "2025-10-10",
    sizes: ["One Size"],
  },
  {
    id: 5,
    name: "University Backpack",
    category: "Accessories",
    price: 59.99,
    hsbPoints: 600,
    stock: 34,
    sold: 112,
    image: "https://i.postimg.cc/tgHhXHK4/hsb-capibara.jpg",
    sku: "HSB-BP-005",
    status: "in-stock",
    reorderLevel: 25,
    supplier: "BagMasters Ltd.",
    lastRestocked: "2025-10-12",
    sizes: [],
  },
  {
    id: 6,
    name: "HSB Water Bottle",
    category: "Accessories",
    price: 15.99,
    hsbPoints: 160,
    stock: 8,
    sold: 178,
    image: "https://i.postimg.cc/tgHhXHK4/hsb-capibara.jpg",
    sku: "HSB-WB-006",
    status: "low-stock",
    reorderLevel: 60,
    supplier: "HydroGoods",
    lastRestocked: "2025-09-28",
    sizes: [],
  },
  {
    id: 7,
    name: "Premium Pen Set",
    category: "Stationery",
    price: 8.99,
    hsbPoints: 90,
    stock: 156,
    sold: 203,
    image: "https://i.postimg.cc/tgHhXHK4/hsb-capibara.jpg",
    sku: "HSB-PS-007",
    status: "in-stock",
    reorderLevel: 80,
    supplier: "StudySupplies Inc.",
    lastRestocked: "2025-10-18",
    sizes: [],
  },
  {
    id: 8,
    name: "HSB Sweatpants",
    category: "Apparel",
    price: 38.99,
    hsbPoints: 390,
    stock: 45,
    sold: 91,
    image: "https://i.postimg.cc/tgHhXHK4/hsb-capibara.jpg",
    sku: "HSB-SP-008",
    status: "in-stock",
    reorderLevel: 35,
    supplier: "UniWear Co.",
    lastRestocked: "2025-10-05",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 9,
    name: "HSB-CLC Voucher",
    category: "Vouchers",
    price: 50.0,
    hsbPoints: 500,
    stock: 200,
    sold: 45,
    image: "https://i.postimg.cc/tgHhXHK4/hsb-capibara.jpg",
    sku: "HSB-CLC-009",
    status: "in-stock",
    reorderLevel: 50,
    supplier: "HSB Administration",
    lastRestocked: "2025-10-20",
    sizes: [],
  },
];

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
