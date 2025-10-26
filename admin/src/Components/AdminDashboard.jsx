import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  MapPin, 
  AlertTriangle, 
  Search, 
  Filter, 
  Calendar, 
  ArrowUp, 
  ArrowDown, 
  MoreVertical,
  Clock
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Stats Data (example)
  const stats = [
    {
      title: 'Total Hospitals Registered',
      value: '52',
      change: '+10.4%',
      trend: 'up',
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'rgb(239, 246, 255)',
    },
    {
      title: 'New Hospitals This Month',
      value: '7',
      change: '+3.2%',
      trend: 'up',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'rgb(245, 243, 255)',
    },
    {
      title: 'Active Doctors',
      value: '315',
      change: '+8.7%',
      trend: 'up',
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'rgb(236, 253, 245)',
    },
    {
      title: 'Pending Approvals',
      value: '5',
      change: '-2.1%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      bgColor: 'rgb(254, 242, 242)',
    },
  ];

  // City Distribution Data
  const cityData = [
    { name: 'Ahmedabad', hospitals: 18 },
    { name: 'Rajkot', hospitals: 12 },
    { name: 'Surat', hospitals: 10 },
    { name: 'Junagadh', hospitals: 6 },
    { name: 'Vadodara', hospitals: 6 },
  ];

  // Monthly Growth Data
  const monthlyData = [
    { month: 'Jan', entries: 8 },
    { month: 'Feb', entries: 6 },
    { month: 'Mar', entries: 9 },
    { month: 'Apr', entries: 7 },
    { month: 'May', entries: 12 },
    { month: 'Jun', entries: 10 },
    { month: 'Jul', entries: 8 },
    { month: 'Aug', entries: 11 },
    { month: 'Sep', entries: 15 },
    { month: 'Oct', entries: 10 },
  ];

  // Total Hospitals List
  const hospitalList = [
    { id: 1, name: 'Apollo Hospital', city: 'Ahmedabad', doctors: 85, status: 'Active', lastUpdate: '2 days ago' },
    { id: 2, name: 'Sterling Hospital', city: 'Rajkot', doctors: 62, status: 'Active', lastUpdate: '1 week ago' },
    { id: 3, name: 'Unity Care', city: 'Surat', doctors: 40, status: 'Pending', lastUpdate: '4 days ago' },
    { id: 4, name: 'Healing Touch', city: 'Junagadh', doctors: 35, status: 'Active', lastUpdate: 'Today' },
    { id: 5, name: 'LifeLine Medical', city: 'Vadodara', doctors: 50, status: 'Active', lastUpdate: '3 days ago' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      Active: { bg: 'rgb(209, 250, 229)', text: 'rgb(5, 150, 105)' },
      Pending: { bg: 'rgb(254, 249, 195)', text: 'rgb(202, 138, 4)' },
      Inactive: { bg: 'rgb(254, 226, 226)', text: 'rgb(220, 38, 38)' },
    };
    return colors[status] || { bg: 'rgb(243, 244, 246)', text: 'rgb(107, 114, 128)' };
  };

  return (
    <div style={{
      padding: '30px',
      margin: '60px 0 0 280px',
      background: '#f8f9fa',
      minHeight: '100vh',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 5px 0',
            lineHeight: '1.2'
          }}>Admin Dashboard Overview</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: 'white',
            border: '2px solid #e5e7eb',
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#374151',
            cursor: 'pointer',
          }}>
            <Filter size={18} /> Filter
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '24px',
        marginBottom: '30px'
      }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} style={{
              background: 'white',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              border: '1px solid #f3f4f6'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: stat.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={24} style={{ color: stat.color.includes('blue') ? '#3b82f6' : stat.color.includes('purple') ? '#8b5cf6' : stat.color.includes('green') ? '#10b981' : '#ef4444' }} />
                </div>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  background: stat.trend === 'up' ? '#d1fae5' : '#fee2e2',
                  color: stat.trend === 'up' ? '#059669' : '#dc2626'
                }}>
                  {stat.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  {stat.change}
                </span>
              </div>
              <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>{stat.value}</h3>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0 }}>{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px',
        marginBottom: '30px'
      }}>
        {/* Pie Chart: Hospitals by City */}
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          border: '1px solid #f3f4f6'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '12px' }}>Hospitals by City</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={cityData} cx="50%" cy="50%" outerRadius={90} dataKey="hospitals" label>
                {cityData.map((entry, i) => (
                  <Cell key={i} fill={['#667eea', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][i % 5]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart: Monthly Hospital Growth */}
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          border: '1px solid #f3f4f6'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '12px' }}>Hospitals Added per Month</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="entries" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Registered Hospitals Table */}
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        border: '1px solid #f3f4f6'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>Registered Hospitals</h3>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0 }}>Recently added hospitals</p>
          </div>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }} />
            <input
              type="text"
              placeholder="Search hospitals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 42px',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '0.9rem'
              }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                {['Hospital Name', 'City', 'Doctors', 'Status', 'Last Updated', 'Actions'].map((head, i) => (
                  <th key={i} style={{
                    padding: '14px 16px',
                    textAlign: 'left',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase'
                  }}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hospitalList
                .filter((h) => h.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((h) => {
                  const statusColors = getStatusColor(h.status);
                  return (
                    <tr key={h.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '16px', fontWeight: '600', color: '#1f2937' }}>{h.name}</td>
                      <td style={{ padding: '16px', color: '#6b7280' }}>{h.city}</td>
                      <td style={{ padding: '16px', color: '#6b7280' }}>{h.doctors}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          background: statusColors.bg,
                          color: statusColors.text,
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontWeight: '600',
                          fontSize: '0.8rem'
                        }}>{h.status}</span>
                      </td>
                      <td style={{ padding: '16px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} color="#9ca3af" /> {h.lastUpdate}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <button style={{
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          color: '#6b7280'
                        }}>
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
