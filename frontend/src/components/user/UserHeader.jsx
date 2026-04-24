import React, { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { API_BASE_URL } from "../../services/api";

const pageMeta = [
  {
    match: "/user/bookings/create",
    eyebrow: "Bookings",
    title: "Create Booking",
    description: "Reserve rooms, labs, equipment, and shared campus spaces.",
  },
  {
    match: "/user/bookings",
    eyebrow: "Bookings",
    title: "My Bookings",
    description: "Track reservations, approvals, QR check-ins, and schedule changes.",
  },
  {
    match: "/user/dashboard/tickets",
    eyebrow: "Support",
    title: "Tickets",
    description: "Raise support requests and follow their progress.",
  },
  {
    match: "/user/resources",
    eyebrow: "Resources",
    title: "Browse Resources",
    description: "Find active campus facilities and equipment ready for booking.",
  },
];

const UserHeader = ({ user, actions }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const meta =
    pageMeta.find((item) => location.pathname.startsWith(item.match)) || {
      eyebrow: "Overview",
      title: "Dashboard",
      description: "Plan your campus day, review requests, and jump back into your work.",
    };

  async function fetchNotifications() {
    try {
      const res = await fetch(`${API_BASE_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return;
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNotifications();
  };

  const deleteNotification = async (id) => {
    await fetch(`${API_BASE_URL}/notifications/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            {meta.eyebrow}
          </p>
          <h1 className="m-0 text-2xl font-bold tracking-normal text-slate-900 md:text-3xl">
            {meta.title}
          </h1>
          <p className="mt-1 max-w-3xl text-sm text-slate-500 md:text-base">{meta.description}</p>
        </div>

        <div className="relative flex flex-wrap items-center gap-3">
          {actions}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-xs font-bold leading-5 text-white">
                {unreadCount}
              </span>
            )}
          </button>

          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-900">{user?.name || "User"}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>

          {open && (
            <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="font-semibold text-slate-800">Notifications</p>
                <p className="text-xs text-slate-500">{unreadCount} unread update{unreadCount === 1 ? "" : "s"}</p>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-4 text-sm text-slate-500">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 border-b border-slate-100 p-4 transition hover:bg-slate-50 ${
                        !n.read ? "bg-emerald-50/70" : ""
                      }`}
                    >
                      <button
                        type="button"
                        className="min-w-0 flex-1 text-left"
                        onClick={() => markAsRead(n.id)}
                      >
                        <p className="text-sm text-slate-800">{n.message}</p>
                        {n.action && <p className="mt-1 text-xs text-slate-400">{n.action}</p>}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteNotification(n.id)}
                        className="rounded-lg p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                        aria-label="Delete notification"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
