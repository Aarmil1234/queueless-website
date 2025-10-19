import React, { useState } from "react";
import { Clock, Save, Settings, CheckCircle, AlertCircle } from "lucide-react";

const Setting = () => {
  const [timer, setTimer] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    
    if (timer < 1 || timer > 120) {
      setError("Please enter a valid time between 1 and 120 minutes.");
      return;
    }
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
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
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: '100px',
          right: '30px',
          background: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 10000,
          border: '2px solid #10b981',
          animation: 'slideIn 0.3s ease'
        }}>
          <CheckCircle size={24} style={{ color: '#10b981' }} />
          <div>
            <p style={{ margin: 0, fontWeight: '600', color: '#1f2937' }}>Settings Saved!</p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>
              Appointment timing set to {timer} minutes
            </p>
          </div>
        </div>
      )}


      <div style={{
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'white',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f3f4f6'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
            paddingBottom: '20px',
            borderBottom: '2px solid #f3f4f6'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Clock size={24} style={{ color: 'white' }} />
            </div>
            <div>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '700',
                color: '#1f2937',
                margin: 0
              }}>Appointment Duration</h3>
              <p style={{
                fontSize: '0.85rem',
                color: '#6b7280',
                margin: 0
              }}>Set the average time for one appointment</p>
            </div>
          </div>

          <div onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Time Duration (minutes)
              </label>
              
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  min="1"
                  max="120"
                  placeholder="Enter time (e.g., 30)"
                  value={timer}
                  onChange={(e) => {
                    setTimer(e.target.value);
                    setError("");
                  }}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: error ? '2px solid #ef4444' : '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    if (!error) {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    if (!error) {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                />
              </div>

              <p style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                marginTop: '8px',
                marginBottom: 0
              }}>
                Enter a value between 1 and 120 minutes
              </p>

              {error && (
                <div style={{
                  marginTop: '12px',
                  padding: '12px 16px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
                  <p style={{
                    margin: 0,
                    fontSize: '0.85rem',
                    color: '#dc2626',
                    fontWeight: '500'
                  }}>{error}</p>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '12px'
              }}>
                Quick Select
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '10px'
              }}>
                {[15, 30, 45, 60].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      setTimer(time.toString());
                      setError("");
                    }}
                    style={{
                      padding: '12px',
                      background: timer === time.toString() ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                      color: timer === time.toString() ? 'white' : '#374151',
                      border: timer === time.toString() ? 'none' : '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (timer !== time.toString()) {
                        e.currentTarget.style.borderColor = '#667eea';
                        e.currentTarget.style.background = '#f9fafb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (timer !== time.toString()) {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.background = 'white';
                      }
                    }}
                  >
                    {time} min
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Save size={20} />
              Save Settings
            </button>
          </div>
        </div>

        <div style={{
          marginTop: '20px',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          padding: '16px 20px',
          borderRadius: '12px'
        }}>
          <p style={{
            margin: 0,
            fontSize: '0.85rem',
            color: '#1e40af',
            lineHeight: '1.6'
          }}>
            <strong>Note:</strong> This setting determines the default duration for each appointment slot. 
            You can adjust this based on your typical consultation time.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Setting;