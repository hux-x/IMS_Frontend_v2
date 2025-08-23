import dashboardService from "@/apis/services/dashboardService";
import { useState, useEffect } from "react";

const useDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        setLoading(true);
        setError(null); 
        const response = await dashboardService.getUserDashboard();
        setDashboard(response.data.data);
      } catch (error) {
        console.error("Dashboard data fetch failed:", error);
        setError(error.message || "Failed to fetch dashboard data");
        setDashboard(null); 
      } finally {
        setLoading(false);
      }
    };

    getDashboardData();
  }, []);

  return { dashboard, loading, error };
};

export default useDashboard;