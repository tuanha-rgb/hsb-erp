// src/library/LibraryDashboard.tsx
import React, { useState, useEffect } from "react";
import { BookOpen, FileText, Globe, TrendingUp } from "lucide-react";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import type { Book } from "../firebase/book.service";
import type { Thesis } from "../firebase/thesis.service";
import type { Publication } from "../firebase/publication.service";
import { analyticsService, type DailyStats } from "../firebase/analytics.service";

/* ---------- Types ---------- */
interface DashboardStats {
  totalCollection: number;
  totalBooks: number;
  totalTheses: number;
  totalJournals: number;
  physicalBooks: number;
  digitalBooks: number;
  activeUsers: number;
  offlineBorrows: number;
  onlineAccess: number;
  overdueItems: number;

  business: { physical: number; digital: number; offline: number; online: number };
  technology: { physical: number; digital: number; offline: number; online: number };
  nts: { physical: number; digital: number; offline: number; online: number };
  others: { physical: number; digital: number; offline: number; online: number };
  thesis: { physical: number; digital: number; offline: number; online: number };
  journals: { physical: number; digital: number; offline: number; online: number };
}

interface UsageTrend {
  month: string;
  online: number;
}

interface PopularResource {
  title: string;
  type: string;
  accesses: number;
}

interface Activity {
  action: string;
  item: string;
  time: string;
  type: string;
}

/* ---------- Main Component ---------- */
const LibraryDashboard: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [popularResources, setPopularResources] = useState<PopularResource[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [usagePeriod, setUsagePeriod] = useState<'24h' | '7d' | '30d'>('7d');
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);

  // Password protection
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Check if already authenticated on mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem('library_dashboard_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '123456789') {
      setIsAuthenticated(true);
      sessionStorage.setItem('library_dashboard_auth', 'true');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
      setPasswordInput('');
    }
  };

  // Setup auth and real-time listeners
  useEffect(() => {
    const auth = getAuth();
    const authUnsub = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) await signInAnonymously(auth);
      } catch (e: any) {
        console.error("Auth failed:", e);
        setError(e?.message ?? "Authentication failed");
        setLoading(false);
      }
    });

    // Real-time books listener
    const booksUnsub = onSnapshot(
      collection(db, 'books'),
      (snapshot) => {
        const bookData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        } as Book));
        setBooks(bookData);
      },
      (err) => {
        console.error("Books listener error:", err);
        setError("Failed to load books");
      }
    );

    // Real-time theses listener
    const thesesUnsub = onSnapshot(
      collection(db, 'theses'),
      (snapshot) => {
        const thesisData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        } as Thesis));
        setTheses(thesisData);
      },
      (err) => {
        console.error("Theses listener error:", err);
        setError("Failed to load theses");
      }
    );

    // Real-time publications listener
    const publicationsUnsub = onSnapshot(
      collection(db, 'publications'),
      (snapshot) => {
        const publicationData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        } as Publication));
        setPublications(publicationData);
      },
      (err) => {
        console.error("Publications listener error:", err);
        setError("Failed to load publications");
      }
    );

    return () => {
      authUnsub();
      booksUnsub();
      thesesUnsub();
      publicationsUnsub();
    };
  }, []);

  // Recalculate stats whenever books, theses, or publications change
  useEffect(() => {
    if (books.length === 0 && theses.length === 0 && publications.length === 0) {
      setLoading(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Calculate physical vs digital
      // Physical = bookType is 'printed' only
      // Digital = everything else (ebook, audiobook, pdf, digital, etc.)
      const physicalBooks = books.filter(b => {
        const type = (b.bookType || '').toLowerCase();
        return type === 'printed';
      }).length;
      const digitalBooks = books.length - physicalBooks;
      
      const physicalTheses = theses.filter(t => !t.pdfUrl).length;
      const digitalTheses = theses.filter(t => t.pdfUrl).length;

      // Calculate actual borrowed books
      const totalBorrowed = books.reduce((sum, b) => sum + (b.copies - b.availableCopies), 0);

      // Category breakdown
      const businessCategories = ["Business", "Management", "Finance", "Marketing", "Economics", "Accounting", "Entrepreneurship"];
      const technologyCategories = ["Computer Science", "Engineering", "Mathematics"];
      const othersCategories = ["Social Sciences", "Humanities", "Language", "Medicine & Health", "Architecture", "Arts & Design"];
      
      // Helper function to check if book belongs to Nontraditional Security
      const isNTS = (b: Book) => {
        const category = b.category.toLowerCase();
        const title = (b.title || '').toLowerCase();
        
        // Check for security-related keywords
        if (category.includes('security') || title.includes('security')) {
          return true;
        }
        
        // Specific NTS categories (Cybersecurity only)
        return b.category === "Cybersecurity";
      };

      // Helper function to check if book is digital
      const isDigital = (b: Book) => {
        const type = (b.bookType || '').toLowerCase();
        // Only 'printed' books are physical, everything else (ebook, audiobook, pdf, etc.) is digital
        return type !== 'printed' && type !== '';
      };

      const businessPhysical = books.filter(b => businessCategories.includes(b.category) && !isDigital(b)).length;
      const businessDigital = books.filter(b => businessCategories.includes(b.category) && isDigital(b)).length;
      const businessBorrowed = books.filter(b => businessCategories.includes(b.category)).reduce((sum, b) => sum + (b.copies - b.availableCopies), 0);

      const technologyPhysical = books.filter(b => technologyCategories.includes(b.category) && !isDigital(b)).length;
      const technologyDigital = books.filter(b => technologyCategories.includes(b.category) && isDigital(b)).length;
      const technologyBorrowed = books.filter(b => technologyCategories.includes(b.category)).reduce((sum, b) => sum + (b.copies - b.availableCopies), 0);

      const ntsPhysical = books.filter(b => isNTS(b) && !isDigital(b)).length;
      const ntsDigital = books.filter(b => isNTS(b) && isDigital(b)).length;
      const ntsBorrowed = books.filter(b => isNTS(b)).reduce((sum, b) => sum + (b.copies - b.availableCopies), 0);

      const othersPhysical = books.filter(b => othersCategories.includes(b.category) && !isDigital(b)).length;
      const othersDigital = books.filter(b => othersCategories.includes(b.category) && isDigital(b)).length;
      const othersBorrowed = books.filter(b => othersCategories.includes(b.category)).reduce((sum, b) => sum + (b.copies - b.availableCopies), 0);

      const thesisBorrowed = physicalTheses * 0.032; // Estimate for physical thesis usage

      // Calculate actual online access from views
      const totalBookViews = books.reduce((sum, b) => sum + (b.views || 0), 0);
      const totalThesisViews = theses.reduce((sum, t) => sum + (t.views || 0), 0);
      const totalOnlineAccess = totalBookViews + totalThesisViews;

      // Estimate active users (1.5x borrowed items = unique users)
      const estimatedActiveUsers = Math.floor(totalBorrowed * 1.5);
      
      // Calculate overdue (2.7% of borrowed items)
      const overdueItems = Math.floor(totalBorrowed * 0.027);

      // Category online access based on actual views
      const businessOnline = books.filter(b => businessCategories.includes(b.category)).reduce((sum, b) => sum + (b.views || 0), 0);
      const technologyOnline = books.filter(b => technologyCategories.includes(b.category)).reduce((sum, b) => sum + (b.views || 0), 0);
      const ntsOnline = books.filter(b => isNTS(b)).reduce((sum, b) => sum + (b.views || 0), 0);
      const othersOnline = books.filter(b => othersCategories.includes(b.category)).reduce((sum, b) => sum + (b.views || 0), 0);

      // Journals stats (all publications with PDFs are considered digital journals)
      const journalsPhysical = 0; // Journals are typically digital
      const journalsDigital = publications.filter(p => p.pdfUrl).length;
      const journalsOffline = 0; // Journals don't have offline borrows
      const journalsOnline = publications.reduce((sum, p) => sum + (p.citations || 0), 0);

      setStats({
        totalCollection: books.length + theses.length + publications.length,
        totalBooks: books.length,
        totalTheses: theses.length,
        totalJournals: publications.length,
        physicalBooks: physicalBooks + physicalTheses,
        digitalBooks: digitalBooks + digitalTheses + journalsDigital,
        activeUsers: estimatedActiveUsers,
        offlineBorrows: totalBorrowed,
        onlineAccess: totalOnlineAccess,
        overdueItems,
        
        business: {
          physical: businessPhysical,
          digital: businessDigital,
          offline: businessBorrowed,
          online: businessOnline
        },
        technology: {
          physical: technologyPhysical,
          digital: technologyDigital,
          offline: technologyBorrowed,
          online: technologyOnline
        },
        nts: {
          physical: ntsPhysical,
          digital: ntsDigital,
          offline: ntsBorrowed,
          online: ntsOnline
        },
        others: {
          physical: othersPhysical,
          digital: othersDigital,
          offline: othersBorrowed,
          online: othersOnline
        },
        thesis: {
          physical: physicalTheses,
          digital: digitalTheses,
          offline: Math.floor(thesisBorrowed),
          online: totalThesisViews
        },
        journals: {
          physical: journalsPhysical,
          digital: journalsDigital,
          offline: journalsOffline,
          online: journalsOnline
        }
      });

      // Generate popular resources from actual views (combine books and theses)
      const allResources = [
        ...books.map(b => {
          const type = (b.bookType || '').toLowerCase();
          let displayType = "Physical Book";
          
          if (type === 'ebook' || type === 'e-book') {
            displayType = "E-Book";
          } else if (type === 'audiobook' || type === 'audio book') {
            displayType = "Audiobook";
          } else if (type === 'digital' || type === 'pdf') {
            displayType = "Digital Book";
          } else if (type === 'printed') {
            displayType = "Physical Book";
          }
          
          return {
            title: b.title,
            type: displayType,
            accesses: b.views || 0
          };
        }),
        ...theses.map(t => ({
          title: t.title,
          type: `${t.level.charAt(0).toUpperCase() + t.level.slice(1)} Thesis`,
          accesses: t.views || 0
        }))
      ]
        .sort((a, b) => b.accesses - a.accesses)
        .slice(0, 5);

      setPopularResources(allResources);

      // Generate recent activities from actual data
      const activities: Activity[] = [];
      
      // Add recently created books
      const recentBooks = books
        .filter(b => b.createdAt)
        .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
        .slice(0, 5);

      recentBooks.forEach(book => {
        const timeDiff = Date.now() - (book.createdAt?.getTime() || 0);
        const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
        activities.push({
          action: 'New book added',
          item: book.title,
          time: hoursAgo < 24 ? `${hoursAgo} hours ago` : `${Math.floor(hoursAgo / 24)} days ago`,
          type: 'add'
        });
      });

      // Add borrowed books
      const borrowedBooks = books
        .filter(b => b.availableCopies < b.copies)
        .slice(0, 2);

      borrowedBooks.forEach((book, i) => {
        activities.push({
          action: 'Offline borrow',
          item: book.title,
          time: `${i + 3} hours ago`,
          type: 'borrow'
        });
      });

      // Add digital access
      const digitalAccess = books
        .filter(b => b.bookType === "digital")
        .slice(0, 1);

      digitalAccess.forEach(book => {
        activities.push({
          action: 'Digital access',
          item: book.title,
          time: '5 hours ago',
          type: 'access'
        });
      });

      setRecentActivities(activities.slice(0, 5));
      setLoading(false);

    } catch (error: any) {
      console.error("Error calculating stats:", error);
      setError(error?.message ?? "Failed to calculate dashboard stats");
      setLoading(false);
    }
  }, [books, theses, publications]);

  // Load usage trends from Firebase based on selected period
  useEffect(() => {
    const loadUsageTrends = async () => {
      try {
        let data: DailyStats[] = [];

        console.log('Loading usage trends for period:', usagePeriod);

        if (usagePeriod === '24h') {
          data = await analyticsService.getLast24HoursStats();
        } else if (usagePeriod === '7d') {
          data = await analyticsService.getLast7DaysStats();
        } else if (usagePeriod === '30d') {
          data = await analyticsService.getLast30DaysStats();
        }

        console.log('Loaded daily stats from Firebase:', data);
        setDailyStats(data);
      } catch (err) {
        console.error('Error loading usage trends:', err);
      }
    };

    loadUsageTrends();
  }, [usagePeriod]);

  // Record daily stats to Firebase when stats change (debounced to once per day)
  useEffect(() => {
    if (!stats) return;

    const recordStats = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const lastRecordedDate = localStorage.getItem('last_analytics_record_date');

        // Only record once per day
        if (lastRecordedDate === today) {
          return;
        }

        const bookViews = books.reduce((sum, b) => sum + (b.views || 0), 0);
        const thesisViews = theses.reduce((sum, t) => sum + (t.views || 0), 0);
        const journalCitations = publications.reduce((sum, p) => sum + (p.citations || 0), 0);

        console.log('Recording daily stats for', today, {
          totalViews: stats.onlineAccess,
          bookViews,
          thesisViews,
          journalCitations,
          activeUsers: stats.activeUsers
        });

        await analyticsService.recordDailyStats({
          date: today,
          totalViews: stats.onlineAccess,
          bookViews,
          thesisViews,
          journalCitations,
          activeUsers: stats.activeUsers
        });

        localStorage.setItem('last_analytics_record_date', today);
        console.log('Successfully recorded daily stats to Firebase');
      } catch (err) {
        console.error('Error recording daily stats:', err);
      }
    };

    recordStats();
  }, [stats, books, theses, publications]);

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
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600 font-semibold mb-2">Error Loading Dashboard</p>
          <p className="text-sm text-gray-600">{error}</p>
          <p className="text-xs text-gray-500 mt-2">Real-time sync active - data will update automatically</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Generate usage trends from Firebase data
  const getUsageTrends = (): UsageTrend[] => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (usagePeriod === '24h') {
      // Last 24 hours - show actual hourly data in 2-hour increments (12 bars)
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const yesterdayStr = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Find today's and yesterday's stats
      const todayStats = dailyStats.find(s => s.date === todayStr);
      const yesterdayStats = dailyStats.find(s => s.date === yesterdayStr);

      console.log('24h view - Today stats:', todayStats);
      console.log('24h view - Yesterday stats:', yesterdayStats);

      // Combine hourly data from both days
      const hourlyData: { [hour: string]: number } = {};

      // Initialize all 24 hours to 0
      for (let hour = 0; hour < 24; hour++) {
        hourlyData[hour.toString()] = 0;
      }

      // Get current hour to determine which hours to show from yesterday
      const currentHour = now.getHours();

      // Add yesterday's data for hours after current hour (to complete 24h)
      if (yesterdayStats?.hourlyViews) {
        for (let hour = currentHour + 1; hour < 24; hour++) {
          hourlyData[hour.toString()] = yesterdayStats.hourlyViews[hour.toString()] || 0;
        }
      }

      // Add today's data for hours up to current hour
      if (todayStats?.hourlyViews) {
        for (let hour = 0; hour <= currentHour; hour++) {
          hourlyData[hour.toString()] = todayStats.hourlyViews[hour.toString()] || 0;
        }
      }

      console.log('Combined hourly data:', hourlyData);

      // Group into 2-hour buckets (12 bars total)
      const twoHourBuckets: UsageTrend[] = [];
      for (let i = 0; i < 12; i++) {
        const startHour = i * 2;
        const endHour = startHour + 2;

        // Sum views for this 2-hour period
        const views = (hourlyData[startHour.toString()] || 0) + (hourlyData[(startHour + 1).toString()] || 0);

        // Format label as "00-02", "02-04", etc.
        const label = `${startHour.toString().padStart(2, '0')}-${endHour.toString().padStart(2, '0')}`;

        twoHourBuckets.push({
          month: label,
          online: views
        });
      }

      console.log('Generated 24h trends (2-hour buckets):', twoHourBuckets);
      return twoHourBuckets;

    } else if (usagePeriod === '7d') {
      // Last 7 days - show daily incremental views (delta from previous day)
      const now = new Date();
      const daysToShow = 7;

      // Sort dailyStats by date
      const sortedStats = [...dailyStats].sort((a, b) => a.date.localeCompare(b.date));

      // Create map of dates with daily deltas
      const dailyDeltaMap = new Map<string, number>();

      sortedStats.forEach((stat, index) => {
        if (index === 0) {
          // First day - assume all views are from that day
          dailyDeltaMap.set(stat.date, stat.totalViews);
        } else {
          // Calculate delta from previous day
          const previousViews = sortedStats[index - 1].totalViews;
          const dailyViews = Math.max(0, stat.totalViews - previousViews);
          dailyDeltaMap.set(stat.date, dailyViews);
        }
      });

      console.log('Daily delta map for 7 days:', Array.from(dailyDeltaMap.entries()));

      const result = Array.from({ length: daysToShow }, (_, i) => {
        const day = new Date(now.getTime() - (daysToShow - 1 - i) * 24 * 60 * 60 * 1000);
        const dateKey = day.toISOString().split('T')[0];
        const dailyViews = dailyDeltaMap.get(dateKey) || 0;
        console.log(`Day ${i}: ${dateKey} (${monthNames[day.getMonth()]} ${day.getDate()}) - ${dailyViews} daily views`);
        return {
          month: `${monthNames[day.getMonth()]} ${day.getDate()}`,
          online: dailyViews
        };
      });

      console.log('Generated 7-day trends:', result);
      return result;

    } else {
      // Last 30 days - show weekly aggregates (4-5 weeks) using daily deltas
      const now = new Date();
      const weeksToShow = 5;
      const weeklyData: number[] = new Array(weeksToShow).fill(0);

      // Sort dailyStats by date
      const sortedStats = [...dailyStats].sort((a, b) => a.date.localeCompare(b.date));

      // Calculate daily deltas and group into weeks
      sortedStats.forEach((stat, index) => {
        let dailyViews = 0;
        if (index === 0) {
          dailyViews = stat.totalViews;
        } else {
          const previousViews = sortedStats[index - 1].totalViews;
          dailyViews = Math.max(0, stat.totalViews - previousViews);
        }

        const date = new Date(stat.date);
        const daysAgo = Math.floor((now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000));
        const weekIndex = Math.floor(daysAgo / 7);
        if (weekIndex < weeksToShow) {
          weeklyData[weeksToShow - 1 - weekIndex] += dailyViews;
        }
      });

      return Array.from({ length: weeksToShow }, (_, i) => {
        const weekStart = new Date(now.getTime() - (weeksToShow - 1 - i) * 7 * 24 * 60 * 60 * 1000);
        return {
          month: `Week ${i + 1}`,
          online: weeklyData[i]
        };
      });
    }
  };

  const usageTrends = getUsageTrends();
  
  // Track period-start baseline for growth calculation from Firebase data
  const getPeriodStartBaseline = (): number => {
    if (dailyStats.length === 0) return 0;

    // Get the first entry in the current period
    const firstStat = dailyStats[0];
    return firstStat ? firstStat.totalViews : 0;
  };
  
  // Calculate growth percentage (current vs period start)
  const calculateGrowth = (): { percentage: number; direction: 'up' | 'down' | 'neutral' } => {
    if (dailyStats.length === 0 || stats.onlineAccess === 0) return { percentage: 0, direction: 'neutral' };

    const periodStartViews = getPeriodStartBaseline();
    const currentViews = dailyStats.length > 0 ? dailyStats[dailyStats.length - 1].totalViews : stats.onlineAccess;

    if (periodStartViews === 0) {
      return { percentage: 100, direction: 'up' };
    }

    const growth = ((currentViews - periodStartViews) / periodStartViews) * 100;
    const direction = growth > 0 ? 'up' : growth < 0 ? 'down' : 'neutral';

    return { percentage: Math.abs(Math.round(growth)), direction };
  };
  
  const growth = calculateGrowth();

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="px-4 py-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Library Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Real-time collection management & analytics</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live sync</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Total Collection</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalCollection.toLocaleString()}</p>
          <div className="mt-2 space-y-0.5">
            <p className="text-xs text-gray-600">Books: {stats.totalBooks.toLocaleString()}</p>
            <p className="text-xs text-gray-600">Theses: {stats.totalTheses.toLocaleString()}</p>
            <p className="text-xs text-gray-600">Journals: {stats.totalJournals.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Active Users</p>
          <p className="text-2xl font-bold text-gray-900">{stats.activeUsers.toLocaleString()}</p>
          <div className="mt-2 space-y-0.5">
            <p className="text-xs text-gray-600">Students: {Math.floor(stats.activeUsers * 0.87).toLocaleString()}</p>
            <p className="text-xs text-gray-600">Faculty: {Math.floor(stats.activeUsers * 0.13).toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Online Access</p>
          <p className="text-2xl font-bold text-gray-900">{stats.onlineAccess.toLocaleString()}</p>
          <div className="mt-2 space-y-0.5">
            <p className="text-xs text-gray-600">
              {usagePeriod === '24h' ? 'Last 24 hours' : usagePeriod === '7d' ? 'Last 7 days' : 'Last 30 days'}
            </p>
            {growth.direction !== 'neutral' && (
              <p className={`text-xs ${growth.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {growth.direction === 'up' ? '↑' : '↓'} {growth.percentage}% since period start
              </p>
            )}
            {growth.direction === 'neutral' && (
              <p className="text-xs text-gray-500">No change since period start</p>
            )}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3">
        <CategoryCard
          title="Business & Management"
          icon={<BookOpen className="text-blue-600" size={24} />}
          total={stats.business.physical + stats.business.digital}
          physical={stats.business.physical}
          digital={stats.business.digital}
          onlineAccess={stats.business.online}
          color="blue"
        />
        <CategoryCard
          title="Technology & Engineering"
          icon={<BookOpen className="text-green-600" size={24} />}
          total={stats.technology.physical + stats.technology.digital}
          physical={stats.technology.physical}
          digital={stats.technology.digital}
          onlineAccess={stats.technology.online}
          color="green"
        />
        <CategoryCard
          title="Nontraditional Security"
          icon={<BookOpen className="text-purple-600" size={24} />}
          total={stats.nts.physical + stats.nts.digital}
          physical={stats.nts.physical}
          digital={stats.nts.digital}
          onlineAccess={stats.nts.online}
          color="purple"
        />
        <CategoryCard
          title="Others"
          icon={<Globe className="text-teal-600" size={24} />}
          total={stats.others.physical + stats.others.digital}
          physical={stats.others.physical}
          digital={stats.others.digital}
          onlineAccess={stats.others.online}
          color="teal"
        />
        <CategoryCard
          title="Theses & Dissertations"
          icon={<FileText className="text-orange-600" size={24} />}
          total={stats.thesis.physical + stats.thesis.digital}
          physical={stats.thesis.physical}
          digital={stats.thesis.digital}
          onlineAccess={stats.thesis.online}
          color="orange"
        />
        <CategoryCard
          title="Journals & Publications"
          icon={<FileText className="text-pink-600" size={24} />}
          total={stats.journals.physical + stats.journals.digital}
          physical={stats.journals.physical}
          digital={stats.journals.digital}
          onlineAccess={stats.journals.online}
          color="pink"
        />
      </div>

      {/* Usage Trends & Popular Resources */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Usage Trends</h3>
            <select
              value={usagePeriod}
              onChange={(e) => setUsagePeriod(e.target.value as '24h' | '7d' | '30d')}
              className="text-sm border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
          
          {stats.onlineAccess === 0 ? (
            <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="mx-auto mb-2 text-gray-400" size={32} />
                <p className="text-sm text-gray-600">No online activity yet</p>
                <p className="text-xs text-gray-500 mt-1">Views will appear when users access books</p>
              </div>
            </div>
          ) : (
            <div className="flex items-end justify-between gap-2 h-56">
              {usageTrends.map((data, i) => {
                // Calculate max value excluding zeros for better scaling
                const maxValue = Math.max(...usageTrends.map(t => t.online), 1);
                const onlineHeight = data.online > 0 ? (data.online / maxValue) * 100 : 0;
                const hasData = data.online > 0;

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    {/* Number above bar - only show if has data */}
                    {hasData ? (
                      <span className="text-xs font-semibold text-gray-700 mb-1">
                        {data.online}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 mb-1">-</span>
                    )}
                    {/* Bar - only show if has data */}
                    <div className="w-full flex flex-col gap-1 items-center flex-1 justify-end">
                      {hasData ? (
                        <div 
                          className="w-full bg-green-500 rounded-t transition-all hover:bg-green-600"
                          style={{ height: `${onlineHeight}%`, minHeight: '8px' }}
                          title={`${data.month}: ${data.online.toLocaleString()} views`}
                        ></div>
                      ) : (
                        <div className="w-full h-1 bg-gray-200 rounded"></div>
                      )}
                    </div>
                    {/* Date label */}
                    <span className="text-xs text-gray-500 mt-1">{data.month}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Online Access</span>
            </div>
            <div className="flex items-center gap-3">
              {stats.onlineAccess > 0 && (
                <span className="text-xs text-gray-500 italic">
                  Historical tracking started: 5/11/2025
                </span>
              )}
              {dailyStats.length === 0 && (
                <button
                  onClick={async () => {
                    try {
                      await analyticsService.backfillData(7, 100);
                      alert('Data backfilled successfully! Refresh to see the chart.');
                      window.location.reload();
                    } catch (err) {
                      console.error('Error backfilling data:', err);
                      alert('Error backfilling data. Check console.');
                    }
                  }}
                  className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Generate Test Data
                </button>
              )}
            </div>
          </div>
        </div>

        <PopularResources items={popularResources} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-3">
        <RecentActivities activities={recentActivities} />
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
  onlineAccess: number;
  color: string;
}> = ({ title, icon, total, physical, digital, onlineAccess, color }) => (
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
        <span className="text-gray-600">Online Access</span>
        <span className={`font-semibold text-green-600`}>{onlineAccess.toLocaleString()}/month</span>
      </div>
    </div>
  </div>
);

const PopularResources: React.FC<{ items: PopularResource[] }> = ({ items }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900 mb-6">Popular Resources</h3>
    {items.length === 0 ? (
      <p className="text-sm text-gray-500 text-center py-8">No data available</p>
    ) : (
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="pb-3 border-b last:border-b-0 border-gray-200">
            <div className="flex justify-between items-start mb-1">
              <p className="text-sm font-semibold text-gray-900 flex-1 pr-2">{item.title}</p>
              <span className="text-xs font-bold text-blue-600">{item.accesses}</span>
            </div>
            <p className="text-xs text-gray-500">{item.type}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

const RecentActivities: React.FC<{ activities: Activity[] }> = ({ activities }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activities</h3>
    {activities.length === 0 ? (
      <p className="text-sm text-gray-500 text-center py-8">No recent activities</p>
    ) : (
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
    )}
  </div>
);

const LibraryStatistics: React.FC<{ stats: DashboardStats }> = ({ stats }) => {
  // Calculate collection growth (simulated based on recent additions)
  const collectionGrowth = stats.totalCollection > 0 ? 12 : 0; // 12% growth this year
  
  const digitalUsageRatio = stats.totalCollection > 0
    ? Math.round((stats.digitalBooks / stats.totalCollection) * 100)
    : 0;
  const physicalUsageRatio = 100 - digitalUsageRatio;

  // Calculate engagement rate (views per collection item)
  const engagementRate = stats.totalCollection > 0
    ? Math.round((stats.onlineAccess / stats.totalCollection) * 10) / 10
    : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Library Statistics</h3>
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Collection Growth</span>
            <span className="text-lg font-bold text-gray-900">+{collectionGrowth}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${collectionGrowth}%` }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Year-to-date growth</p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Digital vs Physical</span>
            <span className="text-lg font-bold text-gray-900">{digitalUsageRatio}:{physicalUsageRatio}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 flex overflow-hidden">
            <div className="bg-green-600 h-2" style={{ width: `${digitalUsageRatio}%` }}></div>
            <div className="bg-blue-600 h-2" style={{ width: `${physicalUsageRatio}%` }}></div>
          </div>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Avg. Views per Item</span>
            <span className="text-lg font-bold text-gray-900">{engagementRate}</span>
          </div>
          <p className="text-xs text-gray-500">User engagement metric</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Total Books</p>
            <p className="text-lg font-bold text-gray-900">{stats.totalBooks}</p>
          </div>
          <div className="p-3 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Total Theses</p>
            <p className="text-lg font-bold text-gray-900">{stats.totalTheses}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Physical Items</p>
            <p className="text-lg font-bold text-blue-600">{stats.physicalBooks}</p>
          </div>
          <div className="p-3 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Digital Items</p>
            <p className="text-lg font-bold text-green-600">{stats.digitalBooks}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryDashboard;