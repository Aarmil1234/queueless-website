import React, { useEffect, useState } from "react";
import { 
  Users, 
  Search, 
  Calendar,
  Clock,
  FileText,
  Filter,
  Download,
  Eye,
  Phone,
  Mail,
  MapPin,
  Activity
} from "lucide-react";
import { apiRequest } from "../reusable";
import moment from "moment";

const ClientList = () => {
  const [hospitalId, setHospitalId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const hospitalCookie = document.cookie
      .split("; ")
      .find(row => row.startsWith("hospitalId="))
      ?.split("=")[1];
    setHospitalId(hospitalCookie);
  }, []);

  const userListApiCall = async () => {
    setIsLoading(true);
    try {
      const result = await apiRequest('post', 'admin/getappointmentswithdetails', { hospitalId: hospitalId }, false);
      setAppointments(result.data);
    } catch (error) {
      console.error("Failed to fetch patients", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hospitalId) {
      userListApiCall();
    }
  }, [hospitalId]);

  // Filter and prepare patient data
  const filteredPatients = appointments
    .filter((appointment) => {
      const fullName = appointment?.fullName || appointment?.user?.[0]?.fullName || '';
      const nameMatch = fullName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDate = appointment.appointmentDetails.some((details) => {
        const date = moment(details.appointmentDate);
        if (dateFilter === "today") {
          return date.isSame(moment(), "day");
        } else if (dateFilter === "week") {
          return date.isSame(moment(), "week");
        } else if (dateFilter === "month") {
          return date.isSame(moment(), "month");
        } else if (dateFilter === "lastMonth") {
          const lastMonth = moment().subtract(1, "months");
          return date.month() === lastMonth.month() && date.year() === lastMonth.year();
        }
        return true;
      });

      return nameMatch && matchesDate;
    });

  // Get unique patients with their appointment count
  const uniquePatients = filteredPatients.reduce((acc, appointment) => {
  const mobile = appointment?.mobileNumber || appointment?.user?.[0]?.mobileNumber || 'N/A';
  const patientName = appointment?.fullName || appointment?.user?.[0]?.fullName || 'N/A';

  if (!acc[mobile]) {
    acc[mobile] = {
      id: mobile,
      name: patientName,
      phone: mobile,
      email: appointment?.email || 'N/A',
      appointments: [...appointment.appointmentDetails],
      totalVisits: appointment.appointmentDetails.length,
      lastVisit: moment.max(appointment.appointmentDetails.map(d => moment(d.appointmentDate))).format('DD MMM YYYY'),
      diseases: [...new Set(appointment.appointmentDetails.map(d => d.disease))],
    };
  } else {
    // Merge appointments if the same mobile number
    acc[mobile].appointments = [
      ...acc[mobile].appointments,
      ...appointment.appointmentDetails
    ];
    acc[mobile].totalVisits = acc[mobile].appointments.length;
    acc[mobile].lastVisit = moment.max(acc[mobile].appointments.map(d => moment(d.appointmentDate))).format('DD MMM YYYY');
    acc[mobile].diseases = [...new Set(acc[mobile].appointments.map(d => d.disease))];
  }

  return acc;
}, {});


  const patientsArray = Object.values(uniquePatients);

  const viewPatientDetails = (patient) => {
    setSelectedPatient(patient);
    setShowDetailsModal(true);
  };

  return (
    <div style={{
      padding: '30px',
      background: '#f8f9fa',
      minHeight: '100vh',
      marginLeft: '280px',
      marginTop: '80px',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '16px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        border: '1px solid #f3f4f6'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 8px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Users size={28} style={{ color: '#667eea' }} />
              Patients Directory
            </h1>
            <p style={{
              fontSize: '0.9rem',
              color: '#6b7280',
              margin: 0
            }}>Complete list of all registered patients</p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {/* Export functionality */}}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151',
                cursor: 'pointer'
              }}
            >
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          marginTop: '20px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }} />
            <input
              type="text"
              placeholder="Search by patient name..."
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

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              background: 'white',
              minWidth: '180px'
            }}
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="lastMonth">Last Month</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '24px',
        maxWidth: '300px'
      }}>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #f3f4f6',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '8px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgb(239, 246, 255)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={20} style={{ color: '#3b82f6' }} />
            </div>
            <div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1f2937',
                margin: 0
              }}>{patientsArray.length}</h3>
              <p style={{
                fontSize: '0.85rem',
                color: '#6b7280',
                margin: 0
              }}>Total Patients</p>
            </div>
          </div>
        </div>

        {/* <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #f3f4f6',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '8px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgb(236, 253, 245)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Activity size={20} style={{ color: '#10b981' }} />
            </div>
            <div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1f2937',
                margin: 0
              }}>{filteredPatients.reduce((acc, apt) => acc + apt.appointmentDetails.length, 0)}</h3>
              <p style={{
                fontSize: '0.85rem',
                color: '#6b7280',
                margin: 0
              }}>Total Visits</p>
            </div>
          </div>
        </div> */}
      </div>

      {/* Patients Table */}
      {isLoading ? (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '60px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f3f4f6'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#6b7280' }}>Loading patients...</p>
        </div>
      ) : patientsArray.length === 0 ? (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '60px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f3f4f6'
        }}>
          <Users size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
          <p style={{ fontSize: '1.1rem', color: '#6b7280', margin: 0 }}>No patients found</p>
        </div>
      ) : (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f3f4f6',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.9rem'
            }}>
              <thead>
                <tr style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white'
                }}>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>Patient Name</th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>Phone</th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>Total Visits</th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>Last Visit</th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>Conditions</th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patientsArray.map((patient, index) => (
                  <tr
                    key={patient.id}
                    style={{
                      borderBottom: '1px solid #f3f4f6',
                      transition: 'background 0.2s ease',
                      background: index % 2 === 0 ? 'white' : '#f9fafb'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f3f4f6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#f9fafb';
                    }}
                  >
                    <td style={{
                      padding: '16px 20px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '1.1rem',
                          fontWeight: '700',
                          flexShrink: 0
                        }}>
                          {patient.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{
                          fontWeight: '600',
                          color: '#1f2937'
                        }}>{patient.name}</span>
                      </div>
                    </td>
                    <td style={{
                      padding: '16px 20px',
                      color: '#6b7280'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <Phone size={14} />
                        {patient.phone}
                      </div>
                    </td>
                    <td style={{
                      padding: '16px 20px',
                      textAlign: 'center'
                    }}>
                      <span style={{
                        padding: '4px 12px',
                        background: '#ede9fe',
                        color: '#7c3aed',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}>
                        {patient.totalVisits}
                      </span>
                    </td>
                    <td style={{
                      padding: '16px 20px',
                      color: '#1f2937',
                      fontWeight: '500'
                    }}>
                      {patient.lastVisit}
                    </td>
                    <td style={{
                      padding: '16px 20px'
                    }}>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px'
                      }}>
                        {patient.diseases.slice(0, 2).map((disease, idx) => (
                          <span
                            key={idx}
                            style={{
                              padding: '4px 10px',
                              background: '#fef3c7',
                              color: '#92400e',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {disease}
                          </span>
                        ))}
                        {patient.diseases.length > 2 && (
                          <span style={{
                            padding: '4px 10px',
                            background: '#f3f4f6',
                            color: '#6b7280',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            whiteSpace: 'nowrap'
                          }}>
                            +{patient.diseases.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{
                      padding: '16px 20px',
                      textAlign: 'center'
                    }}>
                      <button
                        onClick={() => viewPatientDetails(patient)}
                        style={{
                          padding: '8px 16px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Patient Details Modal */}
      {showDetailsModal && selectedPatient && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '24px',
              borderBottom: '2px solid #f3f4f6',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '16px 16px 0 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '1.3rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <FileText size={24} />
                Patient History - {selectedPatient.name}
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  padding: '8px',
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              {/* Patient Info Summary */}
              <div style={{
                background: '#f9fafb',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '24px'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: '#6b7280' }}>Phone</p>
                    <p style={{ margin: 0, fontWeight: '600', color: '#1f2937' }}>{selectedPatient.phone}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: '#6b7280' }}>Total Visits</p>
                    <p style={{ margin: 0, fontWeight: '600', color: '#1f2937' }}>{selectedPatient.totalVisits}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: '#6b7280' }}>Last Visit</p>
                    <p style={{ margin: 0, fontWeight: '600', color: '#1f2937' }}>{selectedPatient.lastVisit}</p>
                  </div>
                </div>
              </div>

              {/* Appointment History */}
              <h4 style={{
                fontSize: '1.1rem',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '16px'
              }}>Appointment History</h4>

              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {selectedPatient.appointments.map((apt, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '16px',
                      background: '#f9fafb',
                      borderRadius: '10px',
                      marginBottom: '12px',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '8px'
                    }}>
                      <div>
                        <p style={{
                          margin: '0 0 4px 0',
                          fontWeight: '600',
                          color: '#1f2937',
                          fontSize: '0.95rem'
                        }}>
                          {moment(apt.appointmentDate).format('DD MMMM YYYY')}
                        </p>
                        <p style={{
                          margin: 0,
                          fontSize: '0.85rem',
                          color: '#6b7280',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <Clock size={14} />
                          {apt.appointmentTime}
                        </p>
                      </div>
                      <span style={{
                        padding: '4px 12px',
                        background: '#fef3c7',
                        color: '#92400e',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}>
                        {apt.disease}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ClientList;