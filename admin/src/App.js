import React, { useLayoutEffect, useState } from "react";
import Sidebar from "./Components/Sidebar";
import AdminSidebar from "./Components/AdminSidebar";
import Navbar from "./Components/Navbar";
import Dashboard from "./Components/Dashboard";
import Setting from "./Components/Setting";
import Reports from "./Components/Reports";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { ReportsProvider } from "./context/ReportContext.jsx";
import "./Scss/Style.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import Appointments from "./Components/Appointment";
import ClientList from "./Components/ClientLIst";
import QueuelessRegistrationForm from "./Login/RegistrationForm";
import AddDoctor from "./Components/AddDoctor";
import Login from "./Login/Login";
import AdminLogin from "./Login/AdminLogin";
import AdminDashboard from "./Components/AdminDashboard";
import UnknownPage from "./UnknownPage.jsx";

const AppRoutes = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [hospitalId, setHospitalId] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // ✅ Hide Navbar + Sidebar for login, admin-login, or any 404 route
  const hideSidebarAndNavbar =
    location.pathname === "/login" ||
    location.pathname === "/admin-login" ||
    location.pathname === "/404";

  useLayoutEffect(() => {
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
      const [key, value] = cookie.split("=");
      acc[key] = value;
      return acc;
    }, {});
    setHospitalId(cookies.hospitalId || null);
    setRole(cookies.role || null);
    setLoading(false);
  }, [location.pathname]);

  if (loading) return null;

  const isAdmin = role === "admin";

  return (
    <div className="admin-panel">
      {/* ✅ Show Sidebar only if not hidden */}
      {!hideSidebarAndNavbar &&
        (isAdmin ? (
          <AdminSidebar collapsed={collapsed} />
        ) : (
          <Sidebar collapsed={collapsed} />
        ))}

      <div className={`main-content ${collapsed ? "collapsed" : ""}`}>
        {!hideSidebarAndNavbar && <Navbar collapsed={collapsed} />}
        <ReportsProvider>
        <Routes>
          <Route
            path="/"
            element={
              hospitalId || isAdmin ? <Dashboard /> : <Navigate to="/login" />
            }
          />
          <Route path="/appointment" element={<Appointments />} />
          <Route path="/patients" element={<ClientList />} />
          <Route path="/settings" element={<Setting />} />
          <Route path="/reports" element={<Reports />} />


          {isAdmin && (
            <>
              <Route
                path="/hosregistration"
                element={<QueuelessRegistrationForm />}
              />
              <Route path="/add-doctor" element={<AddDoctor />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </>
          )}

          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* ✅ Redirect all unknown routes to /404 */}
          <Route path="/404" element={<UnknownPage />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
        </ReportsProvider>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;
