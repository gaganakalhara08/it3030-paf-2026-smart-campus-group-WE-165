import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminStats from "../components/admin/AdminStats";
import AdminQuickActions from "../components/admin/AdminQuickActions";
import { API_BASE_URL } from "../services/api";
import heroBg from "../assets/Green.jpg";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUserData();
    fetchStats();
  }, []);

  // 🔹 Fetch user
  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch user");

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("❌ Error fetching user:", error);
      toast.error("Failed to load user data");
    }
  };

  // 🔹 Fetch stats
  const fetchStats = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/bookings/admin/all?page=0&size=1000`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch stats");

      const data = await response.json();
      const content = data.content || [];

      setStats({
        totalBookings: data.totalElements || 0,
        pendingBookings: content.filter((b) => b.status === "PENDING").length,
        approvedBookings: content.filter((b) => b.status === "APPROVED").length,
        totalUsers: new Set(content.map((b) => b.userId)).size,
      });
    } catch (error) {
      console.error("❌ Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

return (
  <div className="flex min-h-screen bg-gray-50">

    {/* 🔥 SIDEBAR */}
    <AdminSidebar onLogout={handleLogout} />

    {/* 🔥 MAIN */}
    <div className="ml-64 flex flex-col flex-1">

      {/* 🌿 HERO HEADER */}
      <div
        className="relative px-6 py-6 border-b border-gray-200"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>

        <div className="relative flex justify-between items-center">
          
          {/* LEFT */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
            </h1>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-6">
            
            <button className="text-gray-600 hover:text-green-600 transition text-lg">
              🔔
            </button>

            <div className="text-right">
              <p className="text-gray-900 font-semibold">
                {user?.name || "Admin"}
              </p>
              <p className="text-sm text-gray-500">
                {user?.email}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 📦 CONTENT */}
      <div className="flex-1 px-6 py-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full">

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <>
              {/* 📊 Stats */}
              <AdminStats stats={stats} />

              {/* ⚡ Quick Actions */}
              <AdminQuickActions />

              {/* 🧠 Info Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mt-6 hover:shadow-md transition">
                
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  👋 Welcome, {user?.name || "Admin"}!
                </h2>

                <p className="text-gray-600 mb-4">
                  Manage all aspects of the Smart Campus system using the sidebar.
                </p>

                <ul className="text-gray-600 space-y-2 ml-2">
                  <li>✅ <span className="font-semibold text-gray-800">Booking Management:</span> Approve or reject bookings</li>
                  <li>✅ <span className="font-semibold text-gray-800">Notification Management:</span> Send notifications</li>
                  <li>✅ <span className="font-semibold text-gray-800">Ticket Management:</span> Handle support tickets</li>
                  <li>✅ <span className="font-semibold text-gray-800">User Management:</span> Manage roles</li>
                  <li>✅ <span className="font-semibold text-gray-800">Facilities:</span> Manage resources</li>
                </ul>

                <p className="text-gray-600 mt-6">
                  📋 Pending bookings:{" "}
                  <span className="text-green-600 font-semibold">
                    {stats.pendingBookings}
                  </span>
                </p>

              </div>
            </>
          )}

        </div>
      </div>

    </div>
  </div>
);};

export default AdminDashboard;