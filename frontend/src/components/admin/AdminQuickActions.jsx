import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, BarChart3, Settings } from "lucide-react";

const AdminQuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      
      {/* Booking */}
      <button
        onClick={() => navigate("/admin/bookings")}
        className="bg-white border border-gray-200 hover:border-green-300 p-6 rounded-xl transition-all shadow-sm hover:shadow-md group"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition">
            <Calendar size={22} className="text-green-600" />
          </div>
          <div className="text-left">
            <p className="text-gray-800 font-semibold text-lg">
              Booking Management
            </p>
            <p className="text-gray-500 text-sm">
              Approve / Reject bookings
            </p>
          </div>
        </div>
      </button>

      {/* Analytics */}
      <button
        onClick={() => navigate("/admin/resource-analytics")}
        className="bg-white border border-gray-200 hover:border-green-300 p-6 rounded-xl transition-all shadow-sm hover:shadow-md group"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition">
            <BarChart3 size={22} className="text-green-600" />
          </div>
          <div className="text-left">
            <p className="text-gray-800 font-semibold text-lg">
              Analytics
            </p>
            <p className="text-gray-500 text-sm">
              View system insights
            </p>
          </div>
        </div>
      </button>

      {/* Settings */}
      <button
        onClick={() => navigate("/login")}
        className="bg-white border border-gray-200 hover:border-green-300 p-6 rounded-xl transition-all shadow-sm hover:shadow-md group"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition">
            <Settings size={22} className="text-gray-600" />
          </div>
          <div className="text-left">
            <p className="text-gray-800 font-semibold text-lg">
              Settings
            </p>
            <p className="text-gray-500 text-sm">
              System settings (coming soon)
            </p>
          </div>
        </div>
      </button>

    </div>
  );
};

export default AdminQuickActions;