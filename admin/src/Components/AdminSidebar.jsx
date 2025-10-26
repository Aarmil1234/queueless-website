import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Hospital, UserPlus } from "lucide-react";

const AdminSidebar = ({ collapsed }) => {
  const location = useLocation();

  const menuItems = [
    { path: "/admin-dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/hosregistration", icon: Hospital, label: "Add Hospital" },
    { path: "/add-doctor", icon: UserPlus, label: "Add Doctor" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        width: collapsed ? "80px" : "280px",
        background: "linear-gradient(180deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div style={{ padding: "30px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <h3 style={{ margin: 0, fontSize: "1.4rem" }}>Admin Panel</h3>
        </div>

        <nav style={{ flex: 1, padding: "20px 0" }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  color: isActive ? "#667eea" : "white",
                  padding: "12px 20px",
                  textDecoration: "none",
                  background: isActive ? "white" : "transparent",
                  borderRadius: "10px",
                  margin: "4px 12px",
                  fontWeight: "500",
                }}
              >
                <Icon size={20} />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div
        style={{
          padding: "20px",
          fontSize: "0.8rem",
          color: "rgba(255,255,255,0.7)",
          textAlign: "center",
        }}
      >
        Queueless Admin
      </div>
    </div>
  );
};

export default AdminSidebar;
