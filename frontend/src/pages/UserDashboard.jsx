import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import UserHeader from "../components/user/UserHeader";

const UserDashboard = () => {
  const userName = localStorage.getItem("userName");

  // ✅ ADD THIS
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col ml-64">

        {/* Header */}
        {/* ✅ CHANGE ONLY THIS LINE */}
        <UserHeader user={user} />

        {/* Content */}
        <div className="flex-1 px-6 py-10">
          <div className="max-w-5xl mx-auto">

            {/* Welcome */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-3">
                Welcome, {userName || "User"} 👋
              </h2>
              <p className="text-gray-600">
                Manage your campus bookings easily from here.
              </p>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">

              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Getting Started
              </h3>

              <p className="text-gray-600 mb-6">
                Use the sidebar to navigate through the system.
              </p>

              <div className="space-y-4">

                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </span>
                  <p>View your bookings</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </span>
                  <p>Create a new booking</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </span>
                  <p>Track your requests and tickets</p>
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;