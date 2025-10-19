import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, Users, Settings, Hospital } from "lucide-react";
import { apiRequest } from "../reusable"; // make sure you have your apiRequest helper

const Sidebar = ({ collapsed }) => {
  const location = useLocation();
  const [hospitalName, setHospitalName] = useState("Hospital"); // fallback

  useEffect(() => {
    const fetchHospitalName = async () => {
      try {
        // Get hospitalId from cookie
        const hospitalId = document.cookie
          .split("; ")
          .find(row => row.startsWith("hospitalId="))
          ?.split("=")[1];
        if (!hospitalId) return;

        // Call your backend API to get hospital info
        const response = await apiRequest("post", "admin/gethospitalbyid", { hospitalId }, false);
        if (response?.data?.name) {
          setHospitalName(response.data.name);
        }
      } catch (error) {
        console.error("Failed to fetch hospital name:", error);
      }
    };

    fetchHospitalName();
  }, []);

  const menuItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/appointment", icon: Calendar, label: "Appointments" },
    { path: "/patients", icon: Users, label: "Patients" },
    { path: "/settings", icon: Settings, label: "Settings" }
  ];

  const sidebarStyle = {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    width: collapsed ? '80px' : '280px',
    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    transition: 'all 0.3s ease',
    zIndex: 1000,
    boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  };

  const headerStyle = { padding: '30px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' };
  const logoContainerStyle = { display: 'flex', alignItems: 'center', gap: '15px' };
  const logoIconStyle = {
    width: '48px',
    height: '48px',
    background: 'white',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#667eea',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  };
  const menuStyle = { flex: 1, padding: '20px 0', overflowY: 'auto' };
  const footerStyle = {
    padding: '20px',
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.8)',
    textAlign: collapsed ? 'center' : 'left',
    borderTop: '1px solid rgba(255,255,255,0.1)'
  };

  return (
    <div style={sidebarStyle}>
      <div>
        <div style={headerStyle}>
          <div style={logoContainerStyle}>
            <div style={logoIconStyle}>
              <Hospital size={24} />
            </div>
            {!collapsed && (
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', margin: 0, color: 'white' }}>
                  {hospitalName}
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>Admin Panel</span>
              </div>
            )}
          </div>
        </div>

        <nav style={menuStyle}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '14px 20px',
                  color: isActive ? '#667eea' : 'rgba(255,255,255,0.85)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  margin: '4px 12px',
                  borderRadius: '10px',
                  fontWeight: '500',
                  background: isActive ? 'white' : 'transparent',
                  boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                  justifyContent: collapsed ? 'center' : 'flex-start'
                }}
              >
                <Icon size={20} style={{ flexShrink: 0 }} />
                {!collapsed && <span style={{ fontSize: '0.95rem', whiteSpace: 'nowrap' }}>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div style={footerStyle}>
        {!collapsed && "Handled by Queueless"}
        {collapsed && <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Queueless</span>}
      </div>
    </div>
  );
};

export default Sidebar;
