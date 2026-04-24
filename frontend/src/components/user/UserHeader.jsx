import React, { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import headerBg from "../../assets/Green.jpg";

const UserHeader = ({ user }) => {
  const location = useLocation();

  
  const token = localStorage.getItem("token");


  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  // 🔹 PAGE TITLE LOGIC
  const getPageTitle = () => {
    if (location.pathname.includes("bookings")) return "My Bookings";
    if (location.pathname.includes("tickets")) return "Tickets";
    if (location.pathname.includes("resources")) return "Browse Resources";
    return "Dashboard";
  };

  // 🔹 FETCH NOTIFICATIONS
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id) => {
    await fetch(`http://localhost:8080/api/notifications/${id}/read`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNotifications();
  };

  const deleteNotification = async (id) => {
    await fetch(`http://localhost:8080/api/notifications/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      className="relative px-6 py-3 border-b border-gray-200"
      style={{
        backgroundImage: `url(${headerBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 🔥 LIGHT OVERLAY */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />

      {/* 🔥 CONTENT */}
      <div className="relative flex justify-between items-center">

        {/* 🔹 LEFT — PAGE TITLE */}
        <h1 className="text-lg font-semibold text-gray-800">
          {getPageTitle()}
        </h1>

        {/* 🔹 RIGHT */}
        <div className="flex items-center gap-6 relative">

          {/* 🔔 NOTIFICATION */}
          <button
            onClick={() => setOpen(!open)}
            className="relative text-gray-700 hover:text-green-600 transition"
          >
            <Bell size={20} />

            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1.5 rounded-full text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* 👤 USER */}
          

        <div className="text-right">
        <p className="text-gray-900 font-semibold">
          {user?.name || "User"}
        </p>
        <p className="text-sm text-gray-500">
          {user?.email}
        </p>
      </div>

          {/* 🔽 DROPDOWN */}
          {open && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">

              <div className="p-3 border-b font-semibold text-gray-700">
                Notifications
              </div>

              {notifications.length === 0 ? (
                <p className="p-4 text-gray-500 text-sm">
                  No notifications
                </p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex justify-between items-start p-4 border-b hover:bg-gray-50 ${
                      !n.read ? "bg-green-50" : ""
                    }`}
                  >
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => markAsRead(n.id)}
                    >
                      <p className="text-sm text-gray-800">
                        {n.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {n.action}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteNotification(n.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserHeader;