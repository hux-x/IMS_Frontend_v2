// src/hooks/useDashboard.js
import dashboardService from "@/apis/services/dashboardService";
import { useState, useEffect } from "react";

// Simple cache outside the hook - persists across component remounts
let dashboardCache = {
  data: null,
  timestamp: null,
  loading: false
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const useDashboard = () => {
  const [dashboard, setDashboard] = useState(dashboardCache.data);
  const [loading, setLoading] = useState(dashboardCache.loading || !dashboardCache.data);
  const [error, setError] = useState(null);

  const fetchDashboard = async (forceRefresh = false) => {
    const now = Date.now();
    const isStale = !dashboardCache.timestamp || 
                   (now - dashboardCache.timestamp) > CACHE_DURATION;

    // Skip if we have fresh data and not forcing refresh
    if (!forceRefresh && dashboardCache.data && !isStale) {
      setDashboard(dashboardCache.data);
      setLoading(false);
      return;
    }

    // Prevent multiple simultaneous requests
    if (dashboardCache.loading) {
      return;
    }

    try {
      dashboardCache.loading = true;
      setLoading(true);
      setError(null);

      const response = await dashboardService.getUserDashboard();
      const data = response.data.data;
      
      // Update cache
      dashboardCache.data = data;
      dashboardCache.timestamp = now;
      dashboardCache.loading = false;
      
      setDashboard(data);
    } catch (error) {
      console.error("Dashboard data fetch failed:", error);
      setError(error.message || "Failed to fetch dashboard data");
      dashboardCache.loading = false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const refreshDashboard = () => {
    fetchDashboard(true);
  };

  return { dashboard, loading, error, refreshDashboard };
};

export default useDashboard;