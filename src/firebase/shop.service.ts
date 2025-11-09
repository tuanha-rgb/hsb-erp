// src/firebase/shop.service.ts
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, UploadTask } from 'firebase/storage';
import { db, storage } from './firebase.config';
import { Category, StockStatus } from '../shop/inventory';

// Collection name
const PRODUCTS_COLLECTION = 'shop_products';

/* ---------- TypeScript Interfaces ---------- */

export interface ShopProduct {
  id?: string;
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

/* ---------- Helper Functions ---------- */

// Generate item code based on category and sequence
const generateItemCode = async (category: Category): Promise<string> => {
  const categoryPrefixes: Record<Category, string> = {
    'Apparel': 'APP',
    'Stationery': 'STA',
    'Accessories': 'ACC',
    'Vouchers': 'VOU'
  };

  const prefix = categoryPrefixes[category];

  // Get existing products in this category
  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    where('category', '==', category),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  const sequence = snapshot.size + 1;

  // Format: HSB-APP-0001, HSB-STA-0002, etc.
  return `HSB-${prefix}-${sequence.toString().padStart(4, '0')}`;
};

// Calculate stock status based on current stock and reorder level
const calculateStockStatus = (stock: number, reorderLevel: number): StockStatus => {
  if (stock === 0) return 'out-of-stock';
  if (stock <= reorderLevel) return 'low-stock';
  return 'in-stock';
};

/* ---------- Shop Service ---------- */

export const shopService = {
  /* ---------- Products CRUD ---------- */

  // Create a new product
  async createProduct(product: Omit<ShopProduct, 'id' | 'itemCode' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> {
    try {
      // Generate item code
      const itemCode = await generateItemCode(product.category);

      // Calculate status
      const status = calculateStockStatus(product.stock, product.reorderLevel);

      const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
        ...product,
        itemCode,
        status,
        lastRestocked: Timestamp.fromDate(product.lastRestocked),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log('[Shop Service] Created product:', docRef.id, itemCode);
      return docRef.id;
    } catch (error) {
      console.error('[Shop Service] Error creating product:', error);
      throw error;
    }
  },

  // Get a single product by ID
  async getProduct(productId: string): Promise<ShopProduct | null> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, productId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          lastRestocked: docSnap.data().lastRestocked?.toDate(),
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate()
        } as ShopProduct;
      }
      return null;
    } catch (error) {
      console.error('[Shop Service] Error getting product:', error);
      throw error;
    }
  },

  // Get all products
  async getAllProducts(): Promise<ShopProduct[]> {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastRestocked: doc.data().lastRestocked?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      } as ShopProduct));
    } catch (error) {
      console.error('[Shop Service] Error getting products:', error);
      throw error;
    }
  },

  // Get products by category
  async getProductsByCategory(category: Category): Promise<ShopProduct[]> {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastRestocked: doc.data().lastRestocked?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      } as ShopProduct));
    } catch (error) {
      console.error('[Shop Service] Error getting products by category:', error);
      throw error;
    }
  },

  // Get products by status
  async getProductsByStatus(status: StockStatus): Promise<ShopProduct[]> {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastRestocked: doc.data().lastRestocked?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      } as ShopProduct));
    } catch (error) {
      console.error('[Shop Service] Error getting products by status:', error);
      throw error;
    }
  },

  // Update a product
  async updateProduct(productId: string, updates: Partial<Omit<ShopProduct, 'id' | 'itemCode' | 'createdAt'>>): Promise<void> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, productId);
      const updateData: any = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      // Convert Date to Timestamp if lastRestocked is being updated
      if (updates.lastRestocked) {
        updateData.lastRestocked = Timestamp.fromDate(updates.lastRestocked);
      }

      // Recalculate status if stock or reorderLevel changed
      if (updates.stock !== undefined || updates.reorderLevel !== undefined) {
        const currentDoc = await this.getProduct(productId);
        if (currentDoc) {
          const newStock = updates.stock !== undefined ? updates.stock : currentDoc.stock;
          const newReorderLevel = updates.reorderLevel !== undefined ? updates.reorderLevel : currentDoc.reorderLevel;
          updateData.status = calculateStockStatus(newStock, newReorderLevel);
        }
      }

      await updateDoc(docRef, updateData);
      console.log('[Shop Service] Updated product:', productId);
    } catch (error) {
      console.error('[Shop Service] Error updating product:', error);
      throw error;
    }
  },

  // Update stock quantity
  async updateStock(productId: string, newStock: number): Promise<void> {
    try {
      const product = await this.getProduct(productId);
      if (!product) throw new Error('Product not found');

      const status = calculateStockStatus(newStock, product.reorderLevel);

      await updateDoc(doc(db, PRODUCTS_COLLECTION, productId), {
        stock: newStock,
        status,
        lastRestocked: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log('[Shop Service] Updated stock:', productId, newStock);
    } catch (error) {
      console.error('[Shop Service] Error updating stock:', error);
      throw error;
    }
  },

  // Increment sold count (for purchases)
  async incrementSold(productId: string, quantity: number = 1): Promise<void> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, productId);
      await updateDoc(docRef, {
        sold: increment(quantity),
        stock: increment(-quantity),
        updatedAt: serverTimestamp()
      });

      // Update status after stock change
      const product = await this.getProduct(productId);
      if (product) {
        const status = calculateStockStatus(product.stock, product.reorderLevel);
        await updateDoc(docRef, { status });
      }

      console.log('[Shop Service] Incremented sold:', productId, quantity);
    } catch (error) {
      console.error('[Shop Service] Error incrementing sold:', error);
      throw error;
    }
  },

  // Delete a product
  async deleteProduct(productId: string): Promise<void> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, productId);
      await deleteDoc(docRef);
      console.log('[Shop Service] Deleted product:', productId);
    } catch (error) {
      console.error('[Shop Service] Error deleting product:', error);
      throw error;
    }
  },

  /* ---------- Image Upload ---------- */

  // Upload product image to Firebase Storage
  async uploadProductImage(file: File, productId?: string): Promise<{ url: string; task: UploadTask }> {
    try {
      const timestamp = Date.now();
      const fileName = productId
        ? `products/${productId}/${timestamp}_${file.name}`
        : `products/temp/${timestamp}_${file.name}`;

      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          null,
          (error) => {
            console.error('[Shop Service] Upload error:', error);
            reject(error);
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('[Shop Service] Image uploaded:', url);
            resolve({ url, task: uploadTask });
          }
        );
      });
    } catch (error) {
      console.error('[Shop Service] Error uploading image:', error);
      throw error;
    }
  },

  /* ---------- Statistics ---------- */

  // Get shop statistics
  async getShopStats(): Promise<{
    totalRevenue: number;
    totalProducts: number;
    totalStock: number;
    totalSold: number;
    lowStockCount: number;
    outOfStockCount: number;
  }> {
    try {
      const products = await this.getAllProducts();

      const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.sold), 0);
      const totalProducts = products.length;
      const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
      const totalSold = products.reduce((sum, p) => sum + p.sold, 0);
      const lowStockCount = products.filter(p => p.status === 'low-stock').length;
      const outOfStockCount = products.filter(p => p.status === 'out-of-stock').length;

      return {
        totalRevenue,
        totalProducts,
        totalStock,
        totalSold,
        lowStockCount,
        outOfStockCount
      };
    } catch (error) {
      console.error('[Shop Service] Error getting stats:', error);
      throw error;
    }
  },

  // Search products
  async searchProducts(searchTerm: string): Promise<ShopProduct[]> {
    try {
      const products = await this.getAllProducts();
      const term = searchTerm.toLowerCase();

      return products.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        p.itemCode.toLowerCase().includes(term)
      );
    } catch (error) {
      console.error('[Shop Service] Error searching products:', error);
      throw error;
    }
  }
};
