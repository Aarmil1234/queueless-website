import React, { useLayoutEffect, useState } from "react";
import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/Navbar";
import Dashboard from "./Components/Dashboard";
import Setting from "./Components/Setting";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import './Scss/Style.scss';
import "bootstrap/dist/css/bootstrap.min.css";
import Appointments from "./Components/Appointment";
import ClientList from "./Components/ClientLIst";
import QueuelessRegistrationForm from "./Login/RegistrationForm";
import AddDoctor from "./Components/AddDoctor";
import Login from "./Login/Login";

const AppRoutes = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [hospitalId, setHospitalId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const hideSidebarAndNavbar =
    location.pathname === "/login" || location.pathname === "/registration" || location.pathname === "/doctors";

  useLayoutEffect(() => {
    const hospitalCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hospitalId="))
      ?.split("=")[1];

    setHospitalId(hospitalCookie);

    // if (
    //   !hospitalCookie &&
    //   location.pathname !== "/Registration" &&
    //   location.pathname !== "/login"
    // ) {
    //   navigate("/Registration");
    // }

    setLoading(false);
  }, [location.pathname]);

  if (loading) return null;

  return (
    <div className="admin-panel">
      {!hideSidebarAndNavbar && <Sidebar collapsed={collapsed} />}
      <div className={`main-content ${collapsed ? "collapsed" : ""}`}>
        {!hideSidebarAndNavbar && <Navbar collapsed={collapsed} />}
        <Routes>
          <Route
            path="/"
            element={
              hospitalId ? <Dashboard /> : <Navigate to="/registration" />
            }
          />
          <Route path="/appointment" element={<Appointments />} />
          <Route path="/patients" element={<ClientList />} />
          <Route path="/settings" element={<Setting />} />
          <Route path="/doctors" element={<AddDoctor />} />
          <Route path="/registration" element={<QueuelessRegistrationForm />} />
          <Route path="/login" element={<Login />} />
        </Routes>
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