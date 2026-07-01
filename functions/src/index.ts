import { onSchedule } from "firebase-functions/v2/scheduler";
import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

/**
 * Helper function to run aggregation for a specific date
 */
async function runAggregationForDate(targetDate: Date) {
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);
  
  const startTimestamp = Timestamp.fromDate(startOfDay);
  const endTimestamp = Timestamp.fromDate(endOfDay);
  
  const dateStr = startOfDay.toISOString().split("T")[0]; // YYYY-MM-DD
  
  // 1. Query raw page views in the target window
  const pageViewsSnapshot = await db.collection("page_views")
    .where("timestamp", ">=", startTimestamp)
    .where("timestamp", "<=", endTimestamp)
    .get();
      
  const uniqueSessions = new Set<string>();
  let totalPageViews = 0;
  
  pageViewsSnapshot.forEach(doc => {
    totalPageViews++;
    const data = doc.data();
    if (data.session_id) {
      uniqueSessions.add(data.session_id);
    }
  });
  
  const uniqueVisitors = uniqueSessions.size;
  
  // 2. Query raw events in the target window
  const rawEventsSnapshot = await db.collection("raw_events")
    .where("timestamp", ">=", startTimestamp)
    .where("timestamp", "<=", endTimestamp)
    .get();
      
  const componentCounts: Record<string, { copy_code: number; copy_install: number; total: number }> = {};
  let totalCopies = 0;
  let totalCopyCode = 0;
  let totalCopyInstall = 0;
  
  rawEventsSnapshot.forEach(doc => {
    const data = doc.data();
    const compId = data.component_id || "unknown";
    const type = data.interaction_type; // "copy_code" or "copy_install"
    
    if (!componentCounts[compId]) {
      componentCounts[compId] = { copy_code: 0, copy_install: 0, total: 0 };
    }
    
    if (type === "copy_code") {
      componentCounts[compId].copy_code++;
      totalCopyCode++;
      totalCopies++;
    } else if (type === "copy_install") {
      componentCounts[compId].copy_install++;
      totalCopyInstall++;
      totalCopies++;
    }
    componentCounts[compId].total++;
  });
  
  // 3. Write aggregated record to daily_stats collection
  const statPayload = {
    date: dateStr,
    timestamp: startTimestamp,
    unique_visitors: uniqueVisitors,
    total_page_views: totalPageViews,
    total_copies: totalCopies,
    total_copy_code: totalCopyCode,
    total_copy_install: totalCopyInstall,
    components: componentCounts
  };

  await db.collection("daily_stats").doc(dateStr).set(statPayload);
  
  return statPayload;
}

/**
 * Scheduled Cloud Function running every night at midnight to aggregate stats for the previous day.
 */
export const aggregateDailyStats = onSchedule("0 0 * * *", async (event) => {
  logger.info("Starting scheduled daily stats aggregation...");
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  try {
    const result = await runAggregationForDate(yesterday);
    logger.info(`Scheduled aggregation complete for ${result.date}. Visitors: ${result.unique_visitors}, Copies: ${result.total_copies}`);
    
    // Cleanup raw events older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cleanupTimestamp = Timestamp.fromDate(thirtyDaysAgo);
    
    const batch = db.batch();
    
    const oldEvents = await db.collection("raw_events").where("timestamp", "<", cleanupTimestamp).limit(500).get();
    oldEvents.forEach(doc => batch.delete(doc.ref));
    
    const oldViews = await db.collection("page_views").where("timestamp", "<", cleanupTimestamp).limit(500).get();
    oldViews.forEach(doc => batch.delete(doc.ref));
    
    await batch.commit();
    logger.info("Completed cleaning up logs older than 30 days.");
  } catch (error) {
    logger.error("Scheduled aggregation failed:", error);
  }
});

/**
 * HTTPS Cloud Function for triggering manual aggregation of daily stats.
 * Expects a query parameter `date` (format: YYYY-MM-DD), defaulting to today.
 */
export const triggerStatsAggregation = onRequest({ cors: true }, async (req, res) => {
  try {
    const targetDateParam = req.query.date as string;
    const targetDate = targetDateParam ? new Date(targetDateParam) : new Date();
    
    const result = await runAggregationForDate(targetDate);
    res.json({ success: true, result });
  } catch (error: any) {
    logger.error("Manual aggregation failed:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
