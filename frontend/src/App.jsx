import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ============== PAGE IMPORTS ==============
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

// ============== COMPONENT IMPORTS ==============
// Route Guards
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";

// Layout Components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Card from "./components/Card";

// Ticket Components
import TicketDetailsModal from "./components/TicketDetailsModal";
import TicketCommentSection from "./components/TicketCommentSection";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import TicketStudentView from "./pages/TicketStudentView";
import TicketAllView from "./pages/TicketAllView";
import CreateTicketModal from "./components/CreateTicketModal";

// ============== CONTEXT IMPORTS ==============
// AuthContext is wrapped in main.jsx via AuthProvider

function App() {
  return (
    <Router>
      <Routes>

        <Toaster position="top-right" />
      < AppRoutes />
        {/* ========== PUBLIC ROUTES ========== */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ========== PROTECTED ROUTES ========== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ========== USER ROUTES ========== */}
        <Route
          path="/user-dashboard"
          element={
            //<ProtectedRoute>
              <UserDashboard />
            //</ProtectedRoute>
          }
        />

        <Route
          path="/user-dashboard/tickets"
          element={
           // <ProtectedRoute>
              <TicketStudentView />
            //</ProtectedRoute>
          }
        />

        <Route
          path="/user-dashboard/create"
          element={
            //<ProtectedRoute>
              <CreateTicketModal />
            //</ProtectedRoute>
          }
        />

        <Route
          path="/user-dashboard/commnet"
          element={
            //<ProtectedRoute>
              <TicketCommentSection />
            //</ProtectedRoute>
          }
        />

        {/* ========== ADMIN ROUTES ========== */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <RoleBasedRoute requiredRoles={["ROLE_ADMIN"]}>
                <AdminDashboard />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard/tickets"
          element={
            //<ProtectedRoute>
              //<RoleBasedRoute requiredRoles={["ROLE_ADMIN"]}>
                <TicketAllView />
              //</Routes></RoleBasedRoute>
            //</ProtectedRoute>
          }
        />

        {/* ========== TECHNICIAN ROUTES ========== */}
        <Route
          path="/technician-dashboard"
          element={
            <ProtectedRoute>
              <RoleBasedRoute requiredRoles={["ROLE_TECHNICIAN"]}>
                <TechnicianDashboard />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

       
      </Routes>
    </Router>
  )
};

export default App;
