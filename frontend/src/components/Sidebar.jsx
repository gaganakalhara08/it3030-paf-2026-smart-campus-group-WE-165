import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import headerBg from "../../assets/Green.png"; // 👈 background image

const UserHeader = () => {
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName") || "User";

  return (
    <div
      className="relative shadow-md"
      style={{
        backgroundImage: `url(${headerBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 🔥 Overlay for readability */}
      <div className="absolute inset-0 bg-green-900/60 backdrop-blur-[1px]" />

      {/* 🔥 CONTENT */}
      <div className="relative flex justify-between items-center px-6 py-4">

        {/* RIGHT — USER */}
        <div className="flex items-center gap-6">

          {/* Notification */}
          <button className="text-white hover:text-green-200 transition">
            <Bell size={20} />
          </button>

          {/* User */}
          <p className="text-white font-medium">
            {userName}
          </p>

        </div>
      </div>
    </div>
  );
};

export default UserHeader;