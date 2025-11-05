// src/library/LibraryDashboard.tsx
import React, { useState, useEffect } from "react";
import { BookOpen, FileText, Globe, TrendingUp } from "lucide-react";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { bookService, type Book } from "../firebase/book.service";
import { thesisService, type Thesis } from "../firebase/thesis.service";

/* ---------- Types ---------- */
interface DashboardStats {
  totalCollection: number;
  totalBooks: number;
  totalTheses: number;
  physicalBooks: number;
  digitalBooks: number;
  activeUsers: number;
  offlineBorrows: number;
  onlineAccess: number;
  overdueItems: number;
  
  business: { physical: number; digital: number; offline: number; online: number };
  technology: { physical: number; digital: number; offline: number; online: number };
  nts: { physical: number; digital: number; offline: number; online: number };
  thesis: { physical: number; digital: number; offline: number; online: number };
}

interface UsageTrend {
  month: string;
  offline: number;
  online: number;
}

/* ---------- Main Component ---------- */
const LibraryDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sign in and load data
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) await signInAnonymously(auth);
        await loadDashboardData();
      } catch (e: any) {
        console.error("Dashboard init failed:", e);
        setError(e?.message ?? "Failed to load dashboard");
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch books and theses in parallel
      const [books, theses] = await Promise.all([
        bookService.getAllBooks(),
        thesisService.getAllTheses()
      ]);

      // Calculate stats
      const physicalBooks = books.filter(b => b.bookType === "printed").length;
      const digitalBooks = books.filter(b => b.bookType === "digital").length;
      const physicalTheses = theses.filter(t => !t.pdfUrl).length;
      const digitalTheses = theses.filter(t => t.pdfUrl).length;

      // Category breakdown
      const businessPhysical = books.filter(b => 
        ["Business", "Management", "Finance", "Marketing", "Economics", "Accounting", "Entrepreneurship"].includes(b.category) && b.bookType === "printed"
      ).length;
      const businessDigital = books.filter(b => 
        ["Business", "Management", "Finance", "Marketing", "Economics", "Accounting", "Entrepreneurship"].includes(b.category) && b.bookType === "digital"
      ).length;

      const technologyPhysical = books.filter(b => 
        ["Computer Science", "Cybersecurity", "Engineering", "Mathematics"].includes(b.category) && b.bookType === "printed"
      ).length;
      const technologyDigital = books.filter(b => 
        ["Computer Science", "Cybersecurity", "Engineering", "Mathematics"].includes(b.category) && b.bookType === "digital"
      ).length;

      const ntsPhysical = books.filter(b => 
        ["Social Sciences", "Humanities", "Language", "Medicine & Health", "Architecture", "Arts & Design"].includes(b.category) && b.bookType === "printed"
      ).length;
      const ntsDigital = books.filter(b => 
        ["Social Sciences", "Humanities", "Language", "Medicine & Health", "Architecture", "Arts & Design"].includes(b.category) && b.bookType === "digital"
      ).length;

      // Mock active usage data (replace with real metrics if available)
      const totalBorrowed = books.reduce((sum, b) => sum + (b.copies - b.availableCopies), 0);
      
      // Calculate active users as unique borrowers (mock: ~15% of total borrowed items = unique users)
      const estimatedActiveUsers = Math.floor(totalBorrowed * 1.5);
      
      setStats({
        totalCollection: books.length + theses.length,
        totalBooks: books.length,
        totalTheses: theses.length,
        physicalBooks: physicalBooks + physicalTheses,
        digitalBooks: digitalBooks + digitalTheses,
        activeUsers: estimatedActiveUsers,
        offlineBorrows: totalBorrowed,
        onlineAccess: digitalBooks * 1250 + digitalTheses * 150, // Mock calculation
        overdueItems: Math.floor(totalBorrowed * 0.027), // Mock ~2.7% overdue rate
        
        business: {
          physical: businessPhysical,
          digital: businessDigital,
          offline: Math.floor(businessPhysical * 0.042), // Mock: 4.2% monthly turnover
          online: businessDigital * 1475 // Mock: avg 1475 accesses/book/month
        },
        technology: {
          physical: technologyPhysical,
          digital: technologyDigital,
          offline: Math.floor(technologyPhysical * 0.038),
          online: technologyDigital * 1620
        },
        nts: {
          physical: ntsPhysical,
          digital: ntsDigital,
          offline: Math.floor(ntsPhysical * 0.028),
          online: ntsDigital * 890
        },
        thesis: {
          physical: physicalTheses,
          digital: digitalTheses,
          offline: Math.floor(physicalTheses * 0.032),
          online: digitalTheses * 3412
        }
      });

    } catch (error: any) {
      console.error("Error loading dashboard:", error);
      setError(error?.message ?? "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600 font-semibold mb-2">Error Loading Dashboard</p>
          <p className="text-sm text-gray-600">{error || "Unknown error"}</p>
          <button
            onClick={loadDashboardData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Mock usage trends (replace with real historical data)
  const usageTrends: UsageTrend[] = [
    { month: 'May', offline: Math.floor(stats.offlineBorrows * 0.74), online: Math.floor(stats.onlineAccess * 0.79) },
    { month: 'Jun', offline: Math.floor(stats.offlineBorrows * 0.84), online: Math.floor(stats.onlineAccess * 0.85) },
    { month: 'Jul', offline: Math.floor(stats.offlineBorrows * 0.79), online: Math.floor(stats.onlineAccess * 0.82) },
    { month: 'Aug', offline: Math.floor(stats.offlineBorrows * 0.90), online: Math.floor(stats.onlineAccess * 0.89) },
    { month: 'Sep', offline: Math.floor(stats.offlineBorrows * 0.95), online: Math.floor(stats.onlineAccess * 0.94) },
    { month: 'Oct', offline: stats.offlineBorrows, online: stats.onlineAccess },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Library Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Hybrid Online + Offline Library Management</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={loadDashboardData}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            Refresh Data
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
            Export Report
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Total Collection</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalCollection.toLocaleString()}</p>
          <div className="mt-2 space-y-0.5">
            <p className="text-xs text-gray-600">Books: {stats.totalBooks.toLocaleString()}</p>
            <p className="text-xs text-gray-600">Theses: {stats.totalTheses.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Active Users</p>
          <p className="text-2xl font-bold text-gray-900">{stats.activeUsers.toLocaleString()}</p>
          <div className="mt-2 space-y-0.5">
            <p className="text-xs text-gray-600">Monthly borrows</p>
            <p className="text-xs text-gray-600">Last 30 days</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Offline Borrows</p>
          <p className="text-2xl font-bold text-gray-900">{stats.offlineBorrows.toLocaleString()}</p>
          <div className="mt-2 space-y-0.5">
            <p className="text-xs text-gray-600">This month</p>
            <p className="text-xs text-green-600">↑ 12% vs last month</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Online Access</p>
          <p className="text-2xl font-bold text-gray-900">{stats.onlineAccess.toLocaleString()}</p>
          <div className="mt-2 space-y-0.5">
            <p className="text-xs text-gray-600">This month</p>
            <p className="text-xs text-green-600">↑ 18% vs last month</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Overdue Items</p>
          <p className="text-2xl font-bold text-red-600">{stats.overdueItems}</p>
          <div className="mt-2 space-y-0.5">
            <p className="text-xs text-gray-600">Requires follow-up</p>
            <p className="text-xs text-gray-600">Avg: 5 days late</p>
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <CategoryCard
          title="Business Books"
          icon={<BookOpen className="w-5 h-5 text-blue-600" />}
          total={stats.business.physical + stats.business.digital}
          physical={stats.business.physical}
          digital={stats.business.digital}
          offlineBorrows={stats.business.offline}
          onlineAccess={stats.business.online}
          color="blue"
        />

        <CategoryCard
          title="Technology Books"
          icon={<BookOpen className="w-5 h-5 text-green-600" />}
          total={stats.technology.physical + stats.technology.digital}
          physical={stats.technology.physical}
          digital={stats.technology.digital}
          offlineBorrows={stats.technology.offline}
          onlineAccess={stats.technology.online}
          color="green"
        />

        <CategoryCard
          title="NTS Books"
          icon={<BookOpen className="w-5 h-5 text-orange-600" />}
          total={stats.nts.physical + stats.nts.digital}
          physical={stats.nts.physical}
          digital={stats.nts.digital}
          offlineBorrows={stats.nts.offline}
          onlineAccess={stats.nts.online}
          color="orange"
        />

        <CategoryCard
          title="Thesis/Dissertations"
          icon={<FileText className="w-5 h-5 text-purple-600" />}
          total={stats.thesis.physical + stats.thesis.digital}
          physical={stats.thesis.physical}
          digital={stats.thesis.digital}
          offlineBorrows={stats.thesis.offline}
          onlineAccess={stats.thesis.online}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Usage Trends (Last 6 Months)
          </h3>

          <div className="h-64 flex items-end justify-between gap-3">
            {usageTrends.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full h-48 flex gap-1 items-end">
                  <div
                    className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 cursor-pointer transition-colors"
                    style={{ height: `${(data.offline / Math.max(...usageTrends.map(t => t.offline))) * 100}%` }}
                    title={`Offline: ${data.offline}`}
                  />
                  <div
                    className="flex-1 bg-green-500 rounded-t hover:bg-green-600 cursor-pointer transition-colors"
                    style={{ height: `${(data.online / Math.max(...usageTrends.map(t => t.online))) * 100}%` }}
                    title={`Online: ${data.online}`}
                  />
                </div>
                <span className="text-xs text-gray-500">{data.month}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">Offline Borrows</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Online Access</span>
            </div>
          </div>
        </div>

        <PopularResources />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-3">
        <RecentActivities />
        <LibraryStatistics stats={stats} />
      </div>
    </div>
  );
};

/* ---------- Sub-Components ---------- */
const CategoryCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  total: number;
  physical: number;
  digital: number;
  offlineBorrows: number;
  onlineAccess: number;
  color: string;
}> = ({ title, icon, total, physical, digital, offlineBorrows, onlineAccess, color }) => (
  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {icon}
    </div>
    <p className="text-2xl font-bold text-gray-900 mb-2">{total.toLocaleString()}</p>
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-gray-600">Physical</span>
        <span className="font-semibold">{physical.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-gray-600">Digital</span>
        <span className="font-semibold">{digital.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-xs pt-2 border-t border-gray-200">
        <span className="text-gray-600">Offline Borrows</span>
        <span className={`font-semibold text-${color}-600`}>{offlineBorrows}/month</span>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-gray-600">Online Access</span>
        <span className={`font-semibold text-green-600`}>{onlineAccess.toLocaleString()}/month</span>
      </div>
    </div>
  </div>
);

const PopularResources: React.FC = () => {
  const popularItems = [
    { title: 'Introduction to Algorithms', type: 'Textbook', accesses: 1247 },
    { title: 'Machine Learning Basics', type: 'Reference', accesses: 892 },
    { title: 'Deep Learning Research', type: 'Journal', accesses: 756 },
    { title: 'Business Fundamentals', type: 'Textbook', accesses: 643 },
    { title: 'AI Applications in Healthcare', type: 'Thesis', accesses: 521 }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Popular Resources</h3>
      <div className="space-y-4">
        {popularItems.map((item, i) => (
          <div key={i} className="pb-3 border-b last:border-b-0 border-gray-200">
            <div className="flex justify-between items-start mb-1">
              <p className="text-sm font-semibold text-gray-900 flex-1 pr-2">{item.title}</p>
              <span className="text-xs font-bold text-blue-600">{item.accesses}</span>
            </div>
            <p className="text-xs text-gray-500">{item.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const RecentActivities: React.FC = () => {
  const activities = [
    { action: 'New textbook added', item: 'Advanced Database Systems', time: '2 hours ago', type: 'add' },
    { action: 'Offline borrow', item: 'Machine Learning by Tom Mitchell', time: '3 hours ago', type: 'borrow' },
    { action: 'Digital access', item: 'IEEE Journal - AI Research', time: '5 hours ago', type: 'access' },
    { action: 'Item returned', item: 'Introduction to Algorithms', time: '6 hours ago', type: 'return' },
    { action: 'Overdue reminder sent', item: 'Data Structures Book', time: '1 day ago', type: 'alert' }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activities</h3>
      <div className="space-y-3">
        {activities.map((activity, i) => (
          <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-b-0 border-gray-200">
            <div className={`w-2 h-2 rounded-full mt-1.5 ${
              activity.type === 'add' ? 'bg-green-500' :
              activity.type === 'borrow' ? 'bg-blue-500' :
              activity.type === 'access' ? 'bg-purple-500' :
              activity.type === 'return' ? 'bg-gray-500' :
              'bg-red-500'
            }`}></div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
              <p className="text-xs text-gray-600">{activity.item}</p>
              <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LibraryStatistics: React.FC<{ stats: DashboardStats }> = ({ stats }) => {
  const capacityUtilization = Math.round((stats.offlineBorrows / (stats.physicalBooks * 0.3)) * 100);
  const digitalUsageRatio = Math.round((stats.digitalBooks / stats.totalCollection) * 100);
  const physicalUsageRatio = 100 - digitalUsageRatio;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Library Statistics</h3>
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Capacity Utilization</span>
            <span className="text-lg font-bold text-gray-900">{capacityUtilization}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${capacityUtilization}%` }}></div>
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Digital vs Physical Usage</span>
            <span className="text-lg font-bold text-gray-900">{digitalUsageRatio}:{physicalUsageRatio}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 flex overflow-hidden">
            <div className="bg-green-600 h-2" style={{ width: `${digitalUsageRatio}%` }}></div>
            <div className="bg-blue-600 h-2" style={{ width: `${physicalUsageRatio}%` }}></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Avg. Borrow Duration</p>
            <p className="text-lg font-bold text-gray-900">14 days</p>
          </div>
          <div className="p-3 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Return Rate</p>
            <p className="text-lg font-bold text-green-600">96%</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">New Additions (Month)</p>
            <p className="text-lg font-bold text-gray-900">142</p>
          </div>
          <div className="p-3 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Database Subscriptions</p>
            <p className="text-lg font-bold text-gray-900">28</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryDashboard;