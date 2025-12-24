import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardLayout({children}) {
  const [analytics, setAnalytics] = useState({
    totalSales: 0,
    totalExpenses: 0,
    profit: 0,
  });
   const fetchAnalytics = async () => {
  try {
    const res = await axios.get(
      "https://zee-server.vercel.app/api/analytics/monthly" // Use your Vercel URL
    );
    setAnalytics(res.data);
  } catch (err) {
    console.error("Failed to fetch analytics", err);
  }
};
  useEffect(() => {
    fetchAnalytics();
  }, []);
  return (
    <div className="h-screen flex flex-col">
      <Navbar analytics={analytics} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 bg-slate-100 p-6 overflow-y-auto">
          <Outlet context={{ fetchAnalytics }} />
        </main>
      </div>
    </div>
  );
}
