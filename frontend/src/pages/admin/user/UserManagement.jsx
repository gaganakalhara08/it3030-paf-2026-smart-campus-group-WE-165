import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { API_BASE_URL } from "../../../services/api";
import heroBg from "../../../assets/Green.jpg";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("Role updated");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    // 🔥 ROOT FIX (THIS PREVENTS BLACK BACKGROUND)
    <div className="min-h-screen bg-gray-50">

      <div className="flex">

        {/* SIDEBAR */}
        <AdminSidebar onLogout={handleLogout} />

        {/* MAIN */}
        <div className="ml-64 flex flex-col flex-1 min-h-screen bg-gray-50">

          {/* 🌿 HERO HEADER */}
          <div
            className="relative px-6 py-6 border-b border-gray-200"
            style={{
              backgroundImage: `url(${heroBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>

            <div className="relative">
              <h1 className="text-2xl font-semibold text-gray-900">
                👥 User Management
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage users and assign roles
              </p>
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex-1 px-6 py-8 bg-gray-50">
            <div className="max-w-7xl mx-auto w-full">

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin h-12 w-12 border-b-2 border-green-500 rounded-full"></div>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

                  <table className="w-full text-left">

                    {/* HEADER */}
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr className="text-gray-600 text-sm">
                        <th className="py-4 px-4">Name</th>
                        <th className="px-4">Email</th>
                        <th className="px-4">Current Role</th>
                        <th className="px-4">Change Role</th>
                      </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>
                      {users.map((user) => {
                        const currentRole = Array.from(user.roles)[0];

                        return (
                          <tr
                            key={user.id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition"
                          >
                            <td className="py-4 px-4 font-medium text-gray-900">
                              {user.name}
                            </td>

                            <td className="px-4 text-gray-500">
                              {user.email}
                            </td>

                            <td className="px-4">
                              <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                                {currentRole.replace("ROLE_", "")}
                              </span>
                            </td>

                            <td className="px-4">
                              <select
                                value={currentRole}
                                onChange={(e) =>
                                  handleRoleChange(user.id, e.target.value)
                                }
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                              >
                                <option value="ROLE_USER">USER</option>
                                <option value="ROLE_ADMIN">ADMIN</option>
                                <option value="ROLE_TECHNICIAN">TECHNICIAN</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>

                  </table>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserManagement;