// src/shop/HSBShop.tsx - Firebase Connected
import React, { useMemo, useState, useEffect } from "react";
import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  CheckCircle,
  Edit,
  Home,
  Kanban,
  List,
  Package,
  Plus,
  RotateCcw,
  Search,
  ShoppingCart,
  Trash2,
  TrendingUp,
  X,
  XCircle,
  Loader,
  Upload as UploadIcon,
} from "lucide-react";
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';
import { shopService, ShopProduct } from '../firebase/shop.service';
import {
  ActiveView,
  CATEGORIES,
  Category,
  InventoryViewMode,
  NewProductForm,
  NotificationState,
  Product,
  StockStatus,
  emptyNewProduct,
  formatCurrency,
} from "./inventory";

const HSBShop: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<"all" | Category>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [inventoryViewMode, setInventoryViewMode] =
    useState<InventoryViewMode>("grid");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState<NewProductForm>(emptyNewProduct);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Load products from Firebase with real-time listener
  useEffect(() => {
    const q = query(
      collection(db, 'shop_products'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          lastRestocked: doc.data().lastRestocked?.toDate(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        })) as Product[];

        setProducts(productsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading products:', error);
        showNotification('Failed to load products', 'error');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Stats
  const stats = useMemo(() => {
    const totalRevenue = products.reduce((s, p) => s + p.price * p.sold, 0);
    const totalProducts = products.length;
    const totalStock = products.reduce((s, p) => s + p.stock, 0);
    const totalSold = products.reduce((s, p) => s + p.sold, 0);
    const lowStockCount = products.filter((p) => p.status === "low-stock").length;
    const outOfStockCount = products.filter((p) => p.status === "out-of-stock").length;
    return { totalRevenue, totalProducts, totalStock, totalSold, lowStockCount, outOfStockCount };
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.itemCode.toLowerCase().includes(q);
      const matchesCategory = filterCategory === "all" || p.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, filterCategory]);

  const showNotification = (message: string, type: NotificationState["type"] = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        showNotification('Please upload a JPG or PNG image', 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showNotification('Image size must be less than 5MB', 'error');
        return;
      }
      setImageFile(file);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.hsbPoints || !newProduct.stock || !newProduct.sku) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    try {
      setUploading(true);
      let imageUrl = newProduct.image;

      // Upload image if file selected
      if (imageFile) {
        const { url } = await shopService.uploadProductImage(imageFile);
        imageUrl = url;
      }

      const parsedStock = parseInt(newProduct.stock, 10);
      const parsedReorder = parseInt(newProduct.reorderLevel || "20", 10);

      const productData = {
        name: newProduct.name,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        hsbPoints: parseInt(newProduct.hsbPoints, 10),
        stock: parsedStock,
        image: imageUrl,
        sku: newProduct.sku,
        reorderLevel: parsedReorder,
        supplier: newProduct.supplier,
        sizes: newProduct.sizes,
        sold: 0,
        lastRestocked: new Date(),
      };

      await shopService.createProduct(productData);

      setNewProduct(emptyNewProduct);
      setImageFile(null);
      setActiveView("inventory");
      showNotification("Product added successfully!");
    } catch (error) {
      console.error('Error adding product:', error);
      showNotification("Failed to add product", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateStock = async (productId: string, newStock: number) => {
    try {
      await shopService.updateStock(productId, newStock);
      showNotification("Stock updated successfully!");
    } catch (error) {
      console.error('Error updating stock:', error);
      showNotification("Failed to update stock", "error");
    }
  };

  const handleSaveProduct = async () => {
    if (!selectedProduct) return;

    try {
      await shopService.updateProduct(selectedProduct.id, {
        name: selectedProduct.name,
        category: selectedProduct.category,
        sku: selectedProduct.sku,
        supplier: selectedProduct.supplier,
        stock: selectedProduct.stock,
        price: selectedProduct.price,
        hsbPoints: selectedProduct.hsbPoints,
        reorderLevel: selectedProduct.reorderLevel,
      });

      setShowModal(false);
      showNotification("Product updated successfully!");
    } catch (error) {
      console.error('Error updating product:', error);
      showNotification("Failed to update product", "error");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await shopService.deleteProduct(productId);
      setShowModal(false);
      showNotification("Product deleted successfully!");
    } catch (error) {
      console.error('Error deleting product:', error);
      showNotification("Failed to delete product", "error");
    }
  };

  const getStatusColor = (status: StockStatus) => {
    switch (status) {
      case "in-stock":
        return "text-green-600 bg-green-50";
      case "low-stock":
        return "text-orange-600 bg-orange-50";
      case "out-of-stock":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status: StockStatus) => {
    switch (status) {
      case "in-stock":
        return <CheckCircle className="w-4 h-4" />;
      case "low-stock":
        return <AlertTriangle className="w-4 h-4" />;
      case "out-of-stock":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // ---------- VIEWS ----------
  const renderDashboard = () => (
    <div className="space-y-3">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3" /> +15.7% vs last year
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> +8% vs last month
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
              <Boxes className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Total Stock</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStock}</p>
              <p className="text-xs text-gray-600 mt-1">Across all items</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Items Sold</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSold}</p>
              <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3" /> +12% vs last month
              </p>
            </div>
          </div>
        </div>
      </div>

      {(stats.lowStockCount > 0 || stats.outOfStockCount > 0) && (
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-orange-600" />
            Stock Alerts
          </h3>
          <div className="space-y-3">
            {stats.outOfStockCount > 0 && (
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-900">Out of Stock</p>
                    <p className="text-sm text-red-700">{stats.outOfStockCount} product(s) need immediate restocking</p>
                  </div>
                </div>
                <button onClick={() => setActiveView("inventory")}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                  View Items
                </button>
              </div>
            )}
            {stats.lowStockCount > 0 && (
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-semibold text-orange-900">Low Stock</p>
                    <p className="text-sm text-orange-700">{stats.lowStockCount} product(s) running low</p>
                  </div>
                </div>
                <button onClick={() => setActiveView("inventory")}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
                  Review
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top selling */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Top Selling Products</h3>
          <button onClick={() => setActiveView("sales")}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          {[...products].sort((a, b) => b.sold - a.sold).slice(0, 5).map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="w-12 h-12 rounded-full">
                <img src={p.image} alt={p.name} className="w-12 h-12 rounded-full border-4 border-white shadow-md object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{p.name}</p>
                <p className="text-sm text-gray-600">{p.sold} units sold • {p.itemCode}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{formatCurrency(p.price * p.sold)}</p>
                <p className="text-xs text-blue-600">{p.hsbPoints * p.sold} HSB Points</p>
                <p className="text-sm text-gray-600">${p.price} / {p.hsbPoints} pts</p>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No products yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, SKU, or item code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 items-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${
                  filterCategory === cat ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {typeof cat === "string" ? cat.charAt(0).toUpperCase() + cat.slice(1) : cat}
              </button>
            ))}
            <div className="h-8 w-px bg-gray-300 mx-2" />
            <button
              onClick={() => setInventoryViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                inventoryViewMode === "grid" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              title="Grid View"
            >
              <Kanban className="w-5 h-5" />
            </button>
            <button
              onClick={() => setInventoryViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                inventoryViewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              title="List View"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* GRID */}
      {inventoryViewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 rounded-full">
                    <img src={p.image} alt={p.name} className="w-16 h-16 rounded-full border-4 border-white shadow-md object-cover" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(p.status)}`}>
                    {getStatusIcon(p.status)}
                    {p.status.split("-").join(" ").toUpperCase()}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{p.name}</h4>
                <p className="text-sm text-gray-600 mb-1">SKU: {p.sku}</p>
                <p className="text-xs text-blue-600 mb-3">Item Code: {p.itemCode}</p>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <div className="text-right">
                      <span className="font-bold text-gray-900">${p.price}</span>
                      <span className="text-xs text-blue-600 ml-2">/ {p.hsbPoints} pts</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock:</span>
                    <span className={`font-bold ${p.stock === 0 ? "text-red-600" : p.stock < p.reorderLevel ? "text-orange-600" : "text-green-600"}`}>
                      {p.stock} units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sold:</span>
                    <span className="font-semibold text-gray-900">{p.sold} units</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelectedProduct(p); setShowModal(true); }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleUpdateStock(p.id, p.stock + 10)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIST */}
      {inventoryViewMode === "list" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-semibold text-sm text-gray-700">
            <div className="col-span-3">Product</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-1 text-center">Stock</div>
            <div className="col-span-1 text-center">Sold</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredProducts.map((p) => (
              <div key={p.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors items-center">
                <div className="col-span-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full">
                    <img src={p.image} alt={p.name} className="w-12 h-12 rounded-full border-4 border-white shadow-md object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">SKU: {p.sku}</p>
                    <p className="text-xs text-blue-600">{p.itemCode}</p>
                  </div>
                </div>

                <div className="col-span-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {p.category}
                  </span>
                </div>

                <div className="col-span-2">
                  <p className="font-bold text-gray-900">${p.price}</p>
                  <p className="text-xs text-blue-600">{p.hsbPoints} pts</p>
                </div>

                <div className="col-span-1 text-center">
                  <p className={`font-bold ${p.stock === 0 ? "text-red-600" : p.stock < p.reorderLevel ? "text-orange-600" : "text-green-600"}`}>{p.stock}</p>
                  <p className="text-xs text-gray-500">units</p>
                </div>

                <div className="col-span-1 text-center">
                  <p className="font-semibold text-gray-900">{p.sold}</p>
                  <p className="text-xs text-gray-500">units</p>
                </div>

                <div className="col-span-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${getStatusColor(p.status)}`}>
                    {getStatusIcon(p.status)}
                    {p.status.split("-").join(" ").toUpperCase()}
                  </span>
                </div>

                <div className="col-span-1 flex justify-end gap-2">
                  <button
                    onClick={() => { setSelectedProduct(p); setShowModal(true); }}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleUpdateStock(p.id, p.stock + 10)}
                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    title="Restock +10"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredProducts.length === 0 && !loading && (
        <div className="bg-white rounded-2xl shadow-sm p-12 border border-gray-100 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Products Found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );

  const renderAddProduct = () => (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
                disabled={uploading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as Category })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={uploading}
              >
                <option value="Apparel">Apparel</option>
                <option value="Stationery">Stationery</option>
                <option value="Accessories">Accessories</option>
                <option value="Vouchers">Vouchers</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">SKU *</label>
              <input
                type="text"
                value={newProduct.sku}
                onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="HSB-XXX-000"
                disabled={uploading}
              />
              <p className="text-xs text-gray-500 mt-1">Item code will be auto-generated</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Supplier</label>
              <input
                type="text"
                value={newProduct.supplier}
                onChange={(e) => setNewProduct({ ...newProduct, supplier: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter supplier name"
                disabled={uploading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                disabled={uploading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">HSB Points *</label>
              <input
                type="number"
                value={newProduct.hsbPoints}
                onChange={(e) => setNewProduct({ ...newProduct, hsbPoints: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                disabled={uploading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Initial Stock *</label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                disabled={uploading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Reorder Level</label>
              <input
                type="number"
                value={newProduct.reorderLevel}
                onChange={(e) => setNewProduct({ ...newProduct, reorderLevel: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="20"
                disabled={uploading}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                {!imageFile ? (
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={uploading}
                    />
                    <UploadIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload image (JPG, PNG, max 5MB)
                    </p>
                  </label>
                ) : (
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
                      <div className="text-left">
                        <p className="font-medium text-gray-800">{imageFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    {!uploading && (
                      <button
                        onClick={() => setImageFile(null)}
                        className="p-2 hover:bg-gray-200 rounded-full transition"
                      >
                        <X className="w-5 h-5 text-gray-600" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {uploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Uploading...</span>
                <span className="text-sm text-gray-600">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-6">
            <button
              onClick={handleAddProduct}
              disabled={uploading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:bg-gray-400"
            >
              {uploading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Add Product
                </>
              )}
            </button>
            <button
              onClick={() => setActiveView("inventory")}
              disabled={uploading}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold disabled:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSales = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Sales Performance</h3>
        <div className="space-y-3">
          {[...products]
            .sort((a, b) => b.price * b.sold - a.price * a.sold)
            .map((p, i, arr) => (
              <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center font-bold text-blue-600">
                  {i + 1}
                </div>
                <div className="w-12 h-12 rounded-full">
                  <img src={p.image} alt={p.name} className="w-12 h-12 rounded-full border-4 border-white shadow-md object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{p.name}</p>
                  <p className="text-sm text-gray-600">{p.category} • {p.itemCode}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatCurrency(p.price * p.sold)}</p>
                  <p className="text-xs text-blue-600">{p.hsbPoints * p.sold} HSB Points</p>
                  <p className="text-sm text-gray-600">
                    {p.sold} units × ${p.price} / {p.hsbPoints} pts
                  </p>
                </div>
                <div className="w-24">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (p.sold / Math.max(...arr.map((x) => x.sold))) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          {products.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No sales data yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderModal = () => {
    if (!showModal || !selectedProduct) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Edit Product</h3>
                <p className="text-sm text-gray-500 mt-1">Item Code: {selectedProduct.itemCode}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  value={selectedProduct.name}
                  onChange={(e) =>
                    setSelectedProduct({ ...selectedProduct, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={selectedProduct.category}
                  onChange={(e) =>
                    setSelectedProduct({ ...selectedProduct, category: e.target.value as Category })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Apparel">Apparel</option>
                  <option value="Stationery">Stationery</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Vouchers">Vouchers</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">SKU</label>
                <input
                  type="text"
                  value={selectedProduct.sku}
                  onChange={(e) =>
                    setSelectedProduct({ ...selectedProduct, sku: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Supplier</label>
                <input
                  type="text"
                  value={selectedProduct.supplier}
                  onChange={(e) =>
                    setSelectedProduct({ ...selectedProduct, supplier: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={selectedProduct.price}
                  onChange={(e) =>
                    setSelectedProduct({ ...selectedProduct, price: parseFloat(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">HSB Points</label>
                <input
                  type="number"
                  value={selectedProduct.hsbPoints}
                  onChange={(e) =>
                    setSelectedProduct({ ...selectedProduct, hsbPoints: parseInt(e.target.value, 10) })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity</label>
                <input
                  type="number"
                  value={selectedProduct.stock}
                  onChange={(e) =>
                    setSelectedProduct({ ...selectedProduct, stock: parseInt(e.target.value, 10) })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reorder Level</label>
                <input
                  type="number"
                  value={selectedProduct.reorderLevel}
                  onChange={(e) =>
                    setSelectedProduct({ ...selectedProduct, reorderLevel: parseInt(e.target.value, 10) })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSaveProduct}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
              >
                Save Changes
              </button>
              <button
                onClick={() => handleDeleteProduct(selectedProduct.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading shop data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w mx-auto p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">HSB Shop</h1>
                <p className="text-sm text-gray-600">Merchandise Management System</p>
              </div>
            </div>

            <button
              onClick={() => setActiveView("add-product")}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w mx-auto p-3">
          <div className="flex gap-8">
            {[
              { id: "dashboard", label: "Dashboard", icon: Home },
              { id: "inventory", label: "Inventory", icon: Package },
              { id: "sales", label: "Sales", icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as ActiveView)}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors font-medium ${
                  activeView === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w mx-auto p-3">
        {activeView === "dashboard" && renderDashboard()}
        {activeView === "inventory" && renderInventory()}
        {activeView === "add-product" && renderAddProduct()}
        {activeView === "sales" && renderSales()}
      </div>

      {/* Modal & Toast */}
      {renderModal()}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 z-50 ${
            notification.type === "success" ? "bg-green-600" : "bg-red-600"
          } text-white`}
        >
          {notification.type === "success" ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}
    </div>
  );
};

export default HSBShop;
