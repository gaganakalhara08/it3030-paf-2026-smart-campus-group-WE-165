import React from "react";
import { Calendar, BarChart3, Users } from "lucide-react";

const AdminStats = ({ stats }) => {

  const StatBox = ({ icon: Icon, title, value }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
      
      <div className="flex items-center justify-between">
        
        {/* LEFT */}
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {value}
          </p>
        </div>

        {/* RIGHT ICON */}
        <div className="p-3 bg-green-100 rounded-lg">
          <Icon size={24} className="text-green-600" />
        </div>

      </div>

    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      
      <StatBox
        icon={Calendar}
        title="Total Bookings"
        value={stats.totalBookings}
      />

      <StatBox
        icon={BarChart3}
        title="Pending Approvals"
        value={stats.pendingBookings}
      />

      <StatBox
        icon={Calendar}
        title="Approved Bookings"
        value={stats.approvedBookings}
      />

      <StatBox
        icon={Users}
        title="Total Users"
        value={stats.totalUsers}
      />

    </div>
  );
};

export default AdminStats;