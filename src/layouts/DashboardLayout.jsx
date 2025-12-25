import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardLayout() {
  const [analytics, setAnalytics] = useState({
    totalSales: 0,
    totalExpenses: 0,
    profit: 0,
  });

  // 🔥 FETCH ONLY ONCE (PAGE LOAD)
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(
          "https://zee-server.vercel.app/api/analytics/monthly"
        );
        setAnalytics(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Navbar analytics={analytics} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 bg-slate-100 p-6 overflow-y-auto">
          {/* 🔥 Pass analytics + setter, NOT fetch */}
          <Outlet context={{ analytics, setAnalytics }} />
        </main>
      </div>
    </div>
  );
}
