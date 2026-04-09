import React from "react";
import "../App.css";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="dashboard-container">
      
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo-text">CampusOps</h2>

        <ul>
          <li>Dashboard</li>
          <li>Bookings</li>
          <li>Notifications</li>
          <li>Profile</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Welcome, {user?.name}</h1>
        <p>Email: {user?.email}</p>

        <div className="cards">
          <div className="card">My Bookings</div>
          <div className="card">Notifications</div>
          <div className="card">Quick Actions</div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;