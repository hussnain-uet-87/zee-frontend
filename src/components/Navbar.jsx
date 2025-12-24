import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar({analytics}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    navigate("/login");
  };


  return (
    <header className="h-40 bg-white border-b flex flex-col justify-between px-6 pb-10 shadow-sm">
      {/* Top Row: Brand + Logout */}
      <div className="flex justify-between items-center py-2">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
          Zee Mobile Shop
        </h2>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
        >
          <LogOut size={20} className="animate-pulse-slow" />
          Logout
        </button>
      </div>

      {/* Bottom Row: Monthly Analytics */}
      <div className="flex gap-4 py-2">
        {/* Monthly Sale */}
        <div className="flex-1 bg-gradient-to-r from-blue-100 to-blue-200 p-3 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
          <h4 className="text-sm font-medium text-blue-800">Monthly Sale</h4>
          <p className="text-xl font-bold text-blue-900">{analytics.totalSales} PKR</p>
        </div>

        {/* Monthly Expense */}
        <div className="flex-1 bg-gradient-to-r from-red-100 to-red-200 p-3 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
          <h4 className="text-sm font-medium text-red-800">Monthly Expense</h4>
          <p className="text-xl font-bold text-red-900">{analytics.totalExpenses} PKR</p>
        </div>

        {/* Monthly Profit */}
        <div className="flex-1 bg-gradient-to-r from-green-100 to-green-200 p-3 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
          <h4 className="text-sm font-medium text-green-800">Monthly Profit</h4>
          <p className="text-xl font-bold text-green-900">{analytics.profit} PKR</p>
        </div>
      </div>
    </header>
  );
}
