import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE = window.location.hostname === "localhost" 
  ? "http://localhost:5000/api" 
  : "https://zee-server.vercel.app/api";

export default function DashboardLayout() {
  const [analytics, setAnalytics] = useState({
    totalSales: 0,     // Kul Kamayi
    totalExpenses: 0,  // Saman ki Qeemat
    shopExpenses: 0,   // Dukan ka Kharcha
    profit: 0,         // Asli Bachat
  });

  // Define fetchAnalytics as a reusable function
  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/analytics/monthly`);
      setAnalytics(res.data);
    } catch (err) {
      console.error("Failed to fetch analytics", err);
    }
  }, []);

  // Fetch on initial page load / refresh
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="h-screen flex flex-col">
      <Navbar analytics={analytics} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 bg-slate-100 p-6 overflow-y-auto">
          {/* Pass analytics, setter, and fetch function to all child routes */}
          <Outlet context={{ analytics, setAnalytics, fetchAnalytics }} />
        </main>
      </div>
    </div>
  );
}