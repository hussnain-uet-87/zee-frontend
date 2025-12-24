import { NavLink } from "react-router-dom";
import { ShoppingCart, Wallet, HandCoins, BarChart3 } from "lucide-react";

const linkBase =
  "flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform";

const links = [
  {
    to: "/dashboard/sales",
    name: "Sales Management",
    icon: ShoppingCart,
    activeClass: "bg-gradient-to-r from-blue-200 to-blue-400 text-gray-800 shadow-md",
    hoverClass: "hover:scale-105 hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-300",
  },
  {
    to: "/dashboard/loans",
    name: "Loans",
    icon: HandCoins,
    activeClass: "bg-gradient-to-r from-green-200 to-green-400 text-gray-800 shadow-md",
    hoverClass: "hover:scale-105 hover:bg-gradient-to-r hover:from-green-100 hover:to-green-300",
  },
  // {
  //   to: "/dashboard/reports",
  //   name: "Reports",
  //   icon: BarChart3,
  //   activeClass: "bg-gradient-to-r from-purple-200 to-purple-400 text-gray-800 shadow-md",
  //   hoverClass: "hover:scale-105 hover:bg-gradient-to-r hover:from-purple-100 hover:to-purple-300",
  // },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-50 border-r p-4 space-y-3">
      {links.map(({ to, name, icon: Icon, activeClass, hoverClass }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `${linkBase} ${
              isActive ? activeClass : `text-gray-800 ${hoverClass}`
            }`
          }
        >
          <Icon size={20} className="flex-shrink-0" />
          {name}
        </NavLink>
      ))}
    </aside>
  );
}
