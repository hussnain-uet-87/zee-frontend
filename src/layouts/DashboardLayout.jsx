import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function DashboardLayout() {
  const [analytics, setAnalytics] = useState({
    totalSales: 0,
    totalExpenses: 0,
    profit: 0,
  });

  const fetchAnalytics = useCallback(async () => {
    try {
      // Use the full Vercel URL
      const res = await axios.get(
        `https://zee-server.vercel.app/api/analytics/monthly?t=${Date.now()}`
      );
      setAnalytics(res.data);
    } catch (err) {
      console.error("Failed to fetch analytics", err);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar gets the analytics state */}
      <Navbar analytics={analytics} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 bg-slate-100 p-6 overflow-y-auto">
          {/* We pass fetchAnalytics so Sale.jsx can trigger a refresh after adding/deleting */}
          <Outlet context={{ fetchAnalytics }} />
        </main>
      </div>
    </div>
  );
}