import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Activity, 
  TrendingUp,
  Clock,
  UserCheck,
  AlertCircle,
  Search,
  Filter,
  MoreVertical,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Stats data
  const stats = [
    {
      title: 'Total Patients',
      value: '1,234',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'rgb(239, 246, 255)'
    },
    {
      title: 'Appointments Today',
      value: '48',
      change: '+8.2%',
      trend: 'up',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'rgb(245, 243, 255)'
    },
    {
      title: 'Active Treatments',
      value: '156',
      change: '+5.4%',
      trend: 'up',
      icon: Activity,
      color: 'from-green-500 to-green-600',
      bgColor: 'rgb(236, 253, 245)'
    },
    {
      title: 'Critical Cases',
      value: '12',
      change: '-3.1%',
      trend: 'down',
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      bgColor: 'rgb(254, 242, 242)'
    }
  ];

  // Disease distribution data
  const diseaseData = [
    { name: 'Diabetes', value: 12, color: '#3b82f6' },
    { name: 'Cancer', value: 4, color: '#ef4444' },
    { name: 'Asthma', value: 6, color: '#f59e0b' },
    { name: 'Hypertension', value: 9, color: '#10b981' }
  ];

  // City distribution data
  const cityData = [
    { name: 'Junagadh', patients: 45 },
    { name: 'Rajkot', patients: 38 },
    { name: 'Ahmedabad', patients: 52 }
  ];

  // Weekly appointments data
  const weeklyData = [
    { day: 'Mon', appointments: 32 },
    { day: 'Tue', appointments: 45 },
    { day: 'Wed', appointments: 38 },
    { day: 'Thu', appointments: 51 },
    { day: 'Fri', appointments: 43 },
    { day: 'Sat', appointments: 35 },
    { day: 'Sun', appointments: 28 }
  ];

  // Recommended patients
  const recommendedPatients = [
    { id: 1, name: 'Amit Jha', condition: 'Diabetes', status: 'Stable', lastVisit: '2 days ago' },
    { id: 2, name: 'Jhanvi Sharma', condition: 'Hypertension', status: 'Monitoring', lastVisit: '1 week ago' },
    { id: 3, name: 'Neha Kapoor', condition: 'Asthma', status: 'Improving', lastVisit: '3 days ago' },
    { id: 4, name: 'Rahul Verma', condition: 'Cancer', status: 'Treatment', lastVisit: 'Today' },
    { id: 5, name: 'Priya Patel', condition: 'Diabetes', status: 'Stable', lastVisit: '5 days ago' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Stable': { bg: 'rgb(209, 250, 229)', text: 'rgb(5, 150, 105)' },
      'Monitoring': { bg: 'rgb(254, 249, 195)', text: 'rgb(202, 138, 4)' },
      'Improving': { bg: 'rgb(219, 234, 254)', text: 'rgb(29, 78, 216)' },
      'Treatment': { bg: 'rgb(237, 233, 254)', text: 'rgb(109, 40, 217)' }
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
      {/* Header Section */}
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
          }}>Dashboard Overview</h1>
          
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
            transition: 'all 0.3s ease'
          }}>
            <Filter size={18} />
            Filter
          </button>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
          }}>
            <Calendar size={18} />
            Schedule Appointment
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '24px',
        marginBottom: '30px'
      }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} style={{
              background: 'white',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              border: '1px solid #f3f4f6',
              transition: 'all 0.3s ease'
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: stat.bgColor
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
              <h3 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#1f2937',
                margin: '0 0 8px 0'
              }}>{stat.value}</h3>
              <p style={{
                fontSize: '0.9rem',
                color: '#6b7280',
                fontWeight: '500',
                margin: '0'
              }}>{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px',
        marginBottom: '30px'
      }}>
        {/* Disease Distribution */}
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f3f4f6'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '20px'
          }}>
            <div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#1f2937',
                margin: '0 0 4px 0'
              }}>Disease Distribution</h3>
              <p style={{
                fontSize: '0.85rem',
                color: '#6b7280',
                margin: '0'
              }}>Current patient conditions breakdown</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={diseaseData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {diseaseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginTop: '20px'
          }}>
            {diseaseData.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '3px',
                  background: item.color
                }}></div>
                <span style={{ fontSize: '0.9rem', color: '#6b7280', flex: 1 }}>{item.name}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1f2937' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* City Distribution */}
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f3f4f6'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '20px'
          }}>
            <div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#1f2937',
                margin: '0 0 4px 0'
              }}>Patients by City</h3>
              <p style={{
                fontSize: '0.85rem',
                color: '#6b7280',
                margin: '0'
              }}>Geographic distribution</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={cityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="patients" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Appointments */}
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f3f4f6',
          gridColumn: '1 / -1'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '20px'
          }}>
            <div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#1f2937',
                margin: '0 0 4px 0'
              }}>Weekly Appointments</h3>
              <p style={{
                fontSize: '0.85rem',
                color: '#6b7280',
                margin: '0'
              }}>Appointments trend for this week</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="appointments" 
                stroke="#667eea" 
                strokeWidth={3}
                dot={{ fill: '#667eea', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommended Patients Table */}
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
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
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 4px 0'
            }}>Recent Patients</h3>
            <p style={{
              fontSize: '0.85rem',
              color: '#6b7280',
              margin: '0'
            }}>Patients requiring attention</p>
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
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 42px',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontFamily: 'Inter, sans-serif'
              }}
            />
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                <th style={{
                  padding: '14px 16px',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Patient Name</th>
                <th style={{
                  padding: '14px 16px',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Condition</th>
                <th style={{
                  padding: '14px 16px',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Status</th>
                <th style={{
                  padding: '14px 16px',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Last Visit</th>
                <th style={{
                  padding: '14px 16px',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recommendedPatients.map((patient) => {
                const statusColors = getStatusColor(patient.status);
                return (
                  <tr key={patient.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '1rem'
                        }}>
                          {patient.name.charAt(0)}
                        </div>
                        <span style={{ fontWeight: '600', color: '#1f2937' }}>{patient.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: '#6b7280', fontWeight: '500' }}>{patient.condition}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        display: 'inline-flex',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        background: statusColors.bg,
                        color: statusColors.text
                      }}>
                        {patient.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280' }}>
                        <Clock size={14} style={{ color: '#9ca3af' }} />
                        {patient.lastVisit}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <button style={{
                        width: '32px',
                        height: '32px',
                        border: 'none',
                        background: 'transparent',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
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

export default Dashboard;