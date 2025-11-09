import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  setDoc,
  doc
} from 'firebase/firestore';
import { db } from './firebase.config';

const ANALYTICS_COLLECTION = 'library_analytics';

export interface DailyStats {
  id?: string;
  date: string; // YYYY-MM-DD
  totalViews: number;
  bookViews: number;
  thesisViews: number;
  journalCitations: number;
  activeUsers: number;
  hourlyViews?: { [hour: string]: number }; // Track views by hour (0-23)
  createdAt?: Date;
  updatedAt?: Date;
}

export const analyticsService = {
  // Record daily statistics
  async recordDailyStats(stats: Omit<DailyStats, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const docId = stats.date; // Use date as document ID (YYYY-MM-DD)
    const docRef = doc(db, ANALYTICS_COLLECTION, docId);

    console.log(`[Analytics Service] Recording stats for ${docId}:`, stats);

    await setDoc(docRef, {
      ...stats,
      updatedAt: Timestamp.now(),
      createdAt: Timestamp.now()
    }, { merge: true });

    console.log(`[Analytics Service] Successfully saved stats for ${docId}`);
  },

  // Get daily stats for a date range
  async getDailyStats(startDate: string, endDate: string): Promise<DailyStats[]> {
    console.log(`[Analytics Service] Querying stats from ${startDate} to ${endDate}`);

    const q = query(
      collection(db, ANALYTICS_COLLECTION),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'asc')
    );

    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as DailyStats));

    console.log(`[Analytics Service] Found ${results.length} records:`, results);
    return results;
  },

  // Get stats for current month
  async getCurrentMonthStats(): Promise<DailyStats[]> {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const startDate = firstDay.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];

    return this.getDailyStats(startDate, endDate);
  },

  // Get stats for previous month
  async getPreviousMonthStats(): Promise<DailyStats[]> {
    const today = new Date();
    const firstDayPrevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDayPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    const startDate = firstDayPrevMonth.toISOString().split('T')[0];
    const endDate = lastDayPrevMonth.toISOString().split('T')[0];

    return this.getDailyStats(startDate, endDate);
  },

  // Get year-to-date stats
  async getYearToDateStats(): Promise<DailyStats[]> {
    const today = new Date();
    const startDate = `${today.getFullYear()}-01-01`;
    const endDate = today.toISOString().split('T')[0];

    return this.getDailyStats(startDate, endDate);
  },

  // Get all stats since tracking started (Nov 5, 2025)
  async getAllStats(): Promise<DailyStats[]> {
    const startDate = '2025-11-05';
    const today = new Date();
    const endDate = today.toISOString().split('T')[0];

    return this.getDailyStats(startDate, endDate);
  },

  // Get stats for last 24 hours (hourly breakdown)
  async getLast24HoursStats(): Promise<DailyStats[]> {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const startDate = yesterday.toISOString().split('T')[0];
    const endDate = now.toISOString().split('T')[0];

    return this.getDailyStats(startDate, endDate);
  },

  // Get stats for last 7 days
  async getLast7DaysStats(): Promise<DailyStats[]> {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startDate = sevenDaysAgo.toISOString().split('T')[0];
    const endDate = now.toISOString().split('T')[0];

    return this.getDailyStats(startDate, endDate);
  },

  // Get stats for last 30 days
  async getLast30DaysStats(): Promise<DailyStats[]> {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const startDate = thirtyDaysAgo.toISOString().split('T')[0];
    const endDate = now.toISOString().split('T')[0];

    return this.getDailyStats(startDate, endDate);
  },

  // Record an hourly view increment
  async recordHourlyView(): Promise<void> {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const hour = now.getHours().toString();

    const docRef = doc(db, ANALYTICS_COLLECTION, dateStr);

    // Increment the hourly counter
    const currentDoc = await getDocs(query(collection(db, ANALYTICS_COLLECTION), where('date', '==', dateStr)));

    if (currentDoc.empty) {
      // Create new document with hourly view
      await setDoc(docRef, {
        date: dateStr,
        totalViews: 1,
        bookViews: 1,
        thesisViews: 0,
        journalCitations: 0,
        activeUsers: 0,
        hourlyViews: { [hour]: 1 },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    } else {
      // Update existing document
      const existing = currentDoc.docs[0].data();
      const hourlyViews = existing.hourlyViews || {};
      hourlyViews[hour] = (hourlyViews[hour] || 0) + 1;

      await setDoc(docRef, {
        ...existing,
        hourlyViews,
        updatedAt: Timestamp.now()
      }, { merge: true });
    }
  },

  // Backfill data for the past N days (for testing/initialization)
  async backfillData(days: number, baseViews: number): Promise<void> {
    console.log(`[Analytics Service] Backfilling ${days} days of data...`);

    const now = new Date();
    const promises: Promise<void>[] = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];

      // Create mock data with some variation
      const dayViews = baseViews + Math.floor(Math.random() * 100);
      const bookViews = Math.floor(dayViews * 0.6);
      const thesisViews = Math.floor(dayViews * 0.3);
      const journalCitations = Math.floor(dayViews * 0.1);

      // Generate mock hourly views that sum to dayViews
      const hourlyViews: { [hour: string]: number } = {};
      let remainingViews = dayViews;
      for (let hour = 0; hour < 24; hour++) {
        if (hour === 23) {
          hourlyViews[hour.toString()] = remainingViews;
        } else {
          // Distribute views somewhat realistically (more during day hours)
          const isBusinessHours = hour >= 8 && hour <= 18;
          const maxViews = isBusinessHours ? Math.floor(dayViews * 0.08) : Math.floor(dayViews * 0.02);
          const views = Math.min(remainingViews, Math.floor(Math.random() * maxViews));
          hourlyViews[hour.toString()] = views;
          remainingViews -= views;
        }
      }

      promises.push(
        this.recordDailyStats({
          date: dateStr,
          totalViews: dayViews,
          bookViews,
          thesisViews,
          journalCitations,
          activeUsers: Math.floor(dayViews * 0.15),
          hourlyViews
        })
      );
    }

    await Promise.all(promises);
    console.log(`[Analytics Service] Backfill complete!`);
  }
};
