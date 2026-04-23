import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Building2,
  LayoutDashboard,
  Calendar,
  Plus,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Browse Resources",
      icon: Building2,
      path: "/user/resources",
    },
    {
      label: "Tickets",
      icon: LayoutDashboard,
      path: "/user/dashboard/tickets",
    },
    {
      label: "My Bookings",
      icon: Calendar,
      path: "/user/bookings/dashboard",
    }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50">

      {/* 🔥 LOGO (CLICKABLE → DASHBOARD) */}
      <div
        onClick={() => navigate("/user/dashboard")}
        className="py-6 text-center border-b cursor-pointer hover:bg-green-50 transition"
      >
        <h1 className="text-xl font-bold text-gray-800">Campus Ops</h1>
        <p className="text-xs text-gray-500">User Portal</p>
      </div>

      {/* Menu */}
      <div className="flex-1 flex flex-col justify-center px-4 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                active
                  ? "bg-green-100 text-green-700 font-semibold"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-600"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg w-full"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;