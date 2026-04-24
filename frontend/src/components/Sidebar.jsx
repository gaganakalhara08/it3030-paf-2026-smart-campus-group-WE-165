import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Building2,
  LayoutDashboard,
  Calendar,
  LogOut,
  ChevronRight,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Browse Resources",
      description: "Explore available facilities",
      icon: Building2,
      path: "/user/resources",
    },
    {
      label: "Tickets",
      description: "Track support requests",
      icon: LayoutDashboard,
      path: "/user/dashboard/tickets",
    },
    {
      label: "My Bookings",
      description: "View and manage bookings",
      icon: Calendar,
      path: "/user/bookings/dashboard",
    },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-50">

      {/* 🔝 LOGO SECTION */}
      <div
        onClick={() => navigate("/user/dashboard")}
        className="px-6 py-6 text-center cursor-pointer hover:bg-green-50 transition border-b border-gray-100"
      >
        {/* LOGO TEXT */}
        <h1 className="text-sm font-bold tracking-wide text-gray-700 mb-2">
          CAMPUS OPS
        </h1>

        {/* NAME */}
        <h2 className="text-lg font-semibold text-gray-800">
          Campus Ops
        </h2>

        {/* SUBTEXT */}
        <p className="text-xs text-gray-400 mt-1">
          Student Portal
        </p>
      </div>

      {/* 📚 MENU */}
      <nav className="flex-1 flex flex-col justify-center px-3 py-6 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                active
                  ? "bg-green-100 text-green-700 font-semibold border-l-4 border-green-600"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-600"
              }`}
            >
              <Icon
                size={20}
                className={`${
                  active ? "text-green-600" : "text-gray-400"
                }`}
              />

              <div className="flex-1 text-left">
                <p className="text-sm">{item.label}</p>
                <p className="text-xs text-gray-500">
                  {item.description}
                </p>
              </div>

              {active && (
                <ChevronRight size={16} className="text-green-600" />
              )}
            </button>
          );
        })}
      </nav>

      {/* 🔻 LOGOUT */}
      <div className="px-3 py-5 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;