import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Phone,
  AlertCircle,
  Edit3,
  FileText,
  Plus,
  Filter,
  Search,
  Download,
  X,
  CheckCircle,
  XCircle
} from "lucide-react";
import { apiRequest } from "../reusable";
import moment from "moment";

const Appointments = () => {
  const [hospitalId, setHospitalId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'reschedule', 'details', 'create'
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rescheduleTime, setRescheduleTime] = useState({ hours: "", minutes: "", period: "AM" });
  const [comment, setComment] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [dateFilter, setDateFilter] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    name: "",
    date: "",
    time: "",
    disease: "",
    mobileNumber: "",
  });

  useEffect(() => {
    const hospitalCookie = document.cookie
      .split("; ")
      .find(row => row.startsWith("hospitalId="))
      ?.split("=")[1];
    setHospitalId(hospitalCookie);
  }, []);

  useEffect(() => {
    if (hospitalId) {
      appointmentListApiCall(dateFilter);
    }
  }, [hospitalId]);

  const appointmentListApiCall = async (filter = dateFilter) => {
    setIsLoading(true);
    try {
      const result = await apiRequest(
        'post',
        'admin/getappointmentswithdetails',
        { dateFilter: filter, hospitalId: hospitalId },
        false
      );
      setAppointments(result.data);
    } catch (error) {
      console.error("Failed to fetch appointments", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (type, appointment = null) => {
    setModalType(type);
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setSelectedAppointment(null);
    setRescheduleTime({ hours: "", minutes: "", period: "AM" });
    setComment("");
    setNewAppointment({ name: "", date: "", time: "", disease: "", mobileNumber: "" });
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    const timeString = rescheduleTime.hours + ":" + rescheduleTime.minutes + " " + rescheduleTime.period;
    selectedAppointment['appointmentTime'] = moment(timeString, 'h:mm A').format('HH:mm:ss');

    delete selectedAppointment['_id'];
    delete selectedAppointment['delete'];
    delete selectedAppointment['disease'];
    delete selectedAppointment['duration'];
    delete selectedAppointment['isEmergency'];

    await apiRequest('post', 'admin/editappointmentdetails', selectedAppointment, false);
    alert(`Appointment rescheduled successfully!`);
    closeModal();
    appointmentListApiCall();
  };

  const handleInOutClick = async (appointmentDetailId, type) => {
    try {
      const payload = { appointmentId: appointmentDetailId, type };
      const response = await apiRequest('post', 'admin/updateappointmenttimebytype', payload, false);

      if (response.data?.success) {
        alert(response.data.message);

        setAppointments(prev => prev.map(apt => ({
          ...apt,
          appointmentDetails: apt.appointmentDetails.map(det => {
            if (det._id === appointmentDetailId) {
              return {
                ...det,
                inTime: type === 'in' ? response.data.data?.inTime || det.inTime : det.inTime,
                outTime: type === 'out' ? response.data.data?.outTime || det.outTime : det.outTime,
                status: type === 'out' ? 'Completed' : det.status
              };
            }
            return det;
          })
        })));

      } else {
        alert(response.data?.message || 'Failed to update appointment time');
      }

    } catch (err) {
      console.error(err);
      alert('Something went wrong while updating appointment time.');
    }
  };



  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const param = {
      chiefComplaints: formData.get("chiefComplaints"),
      probableDiagnosis: formData.get("diagnosis"),
      prescriptionList: formData.get("prescription"),
      labInvestigations: formData.get("labTests"),
      doctorRemarks: formData.get("remarks"),
      appointmentId: selectedAppointment.appointmentId,
    };

    const labReportFile = formData.get("labReport");
    if (labReportFile && labReportFile.size > 0) {
      param.labReportFile = labReportFile;
    }

    const finalFormData = new FormData();
    for (let key in param) {
      finalFormData.append(key, param[key]);
    }

    const response = await apiRequest("patch", "admin/editappointmentdetailsv2", finalFormData, true);
    if (response.status === 200) {
      alert(response.message);
      closeModal();
      appointmentListApiCall();
    } else {
      alert("Error submitting details");
    }
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Ensure hospitalId is loaded
      if (!hospitalId) {
        alert("Hospital ID not found. Please login again.");
        return setIsLoading(false);
      }

      // Prepare payload according to backend
      const appointmentToAdd = {
        hospitalId: hospitalId,
        doctorId: "685da2217be4f15a3b6ada01", // or dynamic
        fullName: newAppointment.name,
        mobilenumber: newAppointment.mobileNumber,
        appointmentDate: newAppointment.date,
        appointmentTime: newAppointment.timeSlot, // send the dropdown value
        startTime: "10:00", // static
        endTime: "19:00",   // static
        disease: newAppointment.disease,
        isEmergency: false
      };

      console.log("Creating appointment with payload:", appointmentToAdd);

      const result = await apiRequest(
        "post",
        "admin/addappointment",
        appointmentToAdd,
        false
      );

      console.log("Create appointment response:", result);

      if (result.status === 200) {
        alert("Appointment created successfully!");
        closeModal();
        appointmentListApiCall(); // refresh appointments
      } else {
        alert(result.message || "Failed to create appointment.");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Something went wrong while creating the appointment.");
    } finally {
      setIsLoading(false);
    }
  };


  // Prepare sorted appointments
  const sortedAppointments = appointments.flatMap((appointment) =>
    appointment.appointmentDetails.map((details) => ({
      appointmentId: details._id,
      fullName: appointment.fullName || appointment.user?.[0]?.fullName || "Unknown",
      mobileNumber: appointment.mobileNumber || appointment.user?.[0]?.mobileNumber || "",
      hospitalName: appointment.hospital?.[0]?.name || "",
      appointmentDate: details.appointmentDate,
      appointmentTime: details.appointmentTime,
      disease: details.disease,
      isEmergency: details.isEmergency || false,
      inTime: details.inTime || "",
      outTime: details.outTime || "",
      status: details.status || "Ongoing",
    }))
  )
    .sort((a, b) => {
      const dateA = moment(`${a.appointmentDate} ${a.appointmentTime}`, "YYYY-MM-DD HH:mm:ss");
      const dateB = moment(`${b.appointmentDate} ${b.appointmentTime}`, "YYYY-MM-DD HH:mm:ss");
      return dateA - dateB;
    });


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
              <Calendar size={28} style={{ color: '#667eea' }} />
              Appointments Management
            </h1>
            <p style={{
              fontSize: '0.9rem',
              color: '#6b7280',
              margin: 0
            }}>Manage and track all patient appointments</p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                appointmentListApiCall(e.target.value);
              }}
              style={{
                padding: '10px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                background: 'white'
              }}
            >
              <option value="all">All Appointments</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>

            <button
              onClick={() => openModal('create')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
              }}
            >
              <Plus size={18} />
              New Appointment
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ marginTop: '20px', position: 'relative', maxWidth: '400px' }}>
          <Search size={18} style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af'
          }} />
          <input
            type="text"
            placeholder="Search by patient name or disease..."
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

      {/* Appointments Table */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        border: '1px solid #f3f4f6',
        overflow: 'hidden'
      }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid #f3f4f6',
              borderTop: '4px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}></div>
            <p style={{ marginTop: '20px', color: '#6b7280' }}>Loading appointments...</p>
          </div>
        ) : sortedAppointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <Calendar size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
            <p style={{ fontSize: '1.1rem', color: '#6b7280', margin: 0 }}>No appointments found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f9fafb' }}>
                <tr>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>Patient</th>
                  <th style={thStyle}>Date & Time</th>
                  <th style={thStyle}>Disease</th>
                  <th style={thStyle}>In Time</th>
                  <th style={thStyle}>Out Time</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedAppointments.map((apt, index) => (
                  <tr key={apt._id} style={{
                    borderBottom: '1px solid #f3f4f6',
                    transition: 'background 0.2s'
                  }}>
                    <td style={tdStyle}>{index + 1}</td>
                    <td style={tdStyle}>
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
                          fontWeight: '600'
                        }}>
                          {apt.fullName?.charAt(0) || 'P'}
                        </div>
                        <span style={{ fontWeight: '600', color: '#1f2937' }}>{apt.fullName}</span>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontWeight: '500' }}>{moment(apt.appointmentDate).format('DD MMM YYYY')}</span>
                        <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{apt.appointmentTime}</span>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: '4px 12px',
                        background: '#fef3c7',
                        color: '#92400e',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: '500'
                      }}>{apt.disease}</span>
                    </td>
                    <td style={tdStyle}>
                      {apt.inTime ? (
                        <span style={{ color: '#059669', fontWeight: '500' }}>{apt.inTime}</span>
                      ) : (
                        <button
                          onClick={() => handleInOutClick(apt.appointmentId, "in")}
                          style={{
                            padding: '6px 16px',
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            cursor: 'pointer',

                          }}
                        >
                          Check In
                        </button>
                      )}
                    </td>
                    <td style={tdStyle}>
                      {apt.outTime ? (
                        <span style={{ color: '#dc2626', fontWeight: '500' }}>{apt.outTime}</span>
                      ) : (
                        <button
                          onClick={() => handleInOutClick(apt.appointmentId, "out")}
                          disabled={!apt.inTime}
                          style={{
                            padding: '6px 16px',
                            background: apt.inTime ? '#ef4444' : '#e5e7eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            cursor: apt.inTime ? 'pointer' : 'not-allowed'
                          }}
                        >
                          Check Out
                        </button>
                      )}
                    </td>
                    <td style={tdStyle}>
                      {apt.emergency ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          background: '#fee2e2',
                          color: '#dc2626',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          fontWeight: '600'
                        }}>
                          <AlertCircle size={14} />
                          Emergency
                        </span>
                      ) : (
                        <span style={{
                          padding: '6px 12px',
                          background: '#d1fae5',
                          color: '#059669',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          fontWeight: '600'
                        }}>
                          Regular
                        </span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => openModal('reschedule', apt)}
                          style={actionBtnStyle}
                          title="Reschedule"
                        >
                          <Clock size={16} />
                        </button>
                        <button
                          onClick={() => openModal('details', apt)}
                          style={actionBtnStyle}
                          title="View Details"
                        >
                          <FileText size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
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
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '24px',
              borderBottom: '2px solid #f3f4f6',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '16px 16px 0 0'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '700' }}>
                {modalType === 'create' && '➕ Create New Appointment'}
                {modalType === 'reschedule' && '⏰ Reschedule Appointment'}
                {modalType === 'details' && '🧾 Patient Details'}
              </h3>
              <button
                onClick={closeModal}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '8px'
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              {modalType === 'create' && (
                <form onSubmit={handleCreateAppointment}>
                  <FormGroup label="Patient Name" icon={<User size={16} />}>
                    <input
                      type="text"
                      placeholder="Enter patient full name"
                      value={newAppointment.name}
                      onChange={(e) => setNewAppointment({ ...newAppointment, name: e.target.value })}
                      style={inputStyle}
                      required
                    />
                  </FormGroup>

                  <FormGroup label="Mobile Number" icon={<Phone size={16} />}>
                    <input
                      type="tel"
                      placeholder="Enter mobile number"
                      value={newAppointment.mobileNumber}
                      onChange={(e) => setNewAppointment({ ...newAppointment, mobileNumber: e.target.value })}
                      style={inputStyle}
                      required
                    />
                  </FormGroup>

                  <FormGroup label="Appointment Date" icon={<Calendar size={16} />}>
                    <input
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                      style={inputStyle}
                      required
                    />
                  </FormGroup>

                  <FormGroup label="Time Slot">
                    <select
                      value={newAppointment.timeSlot}
                      onChange={(e) => setNewAppointment({ ...newAppointment, timeSlot: e.target.value })}
                      style={inputStyle}
                      required
                    >
                      <option value="">Select a time slot</option>
                      <option value="10:00 - 11:00">10:00 - 11:00</option>
                      <option value="11:00 - 12:00">11:00 - 12:00</option>
                      <option value="12:00 - 13:00">12:00 - 13:00</option>
                    </select>
                  </FormGroup>

                  <FormGroup label="Disease / Complaint" icon={<AlertCircle size={16} />}>
                    <input
                      type="text"
                      placeholder="Enter disease or complaint"
                      value={newAppointment.disease}
                      onChange={(e) => setNewAppointment({ ...newAppointment, disease: e.target.value })}
                      style={inputStyle}
                      required
                    />
                  </FormGroup>


                  <FormGroup label="Emergency">
                    <input
                      type="checkbox"
                      checked={newAppointment.isEmergency || false}
                      onChange={(e) => setNewAppointment({ ...newAppointment, isEmergency: e.target.checked })}
                    /> Mark as emergency
                  </FormGroup>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      padding: "14px",
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      marginTop: "10px",
                    }}
                  >
                    {isLoading ? "Creating..." : "Create Appointment"}
                  </button>
                </form>
              )}


              {modalType === 'reschedule' && selectedAppointment && (
                <form onSubmit={handleRescheduleSubmit}>
                  <div style={{ marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '10px' }}>
                    <p style={{ margin: '0 0 8px 0' }}><strong>Patient:</strong> {selectedAppointment.fullName}</p>
                    <p style={{ margin: 0 }}><strong>Current Time:</strong> {selectedAppointment.appointmentTime}</p>
                  </div>

                  <FormGroup label="New Time">
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <select
                        value={rescheduleTime.hours}
                        onChange={(e) => setRescheduleTime({ ...rescheduleTime, hours: e.target.value })}
                        style={inputStyle}
                        required
                      >
                        <option value="">HH</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                          <option key={hour} value={hour}>{hour}</option>
                        ))}
                      </select>
                      <span style={{ fontSize: '1.5rem', fontWeight: 'bold', alignSelf: 'center' }}>:</span>
                      <select
                        value={rescheduleTime.minutes}
                        onChange={(e) => setRescheduleTime({ ...rescheduleTime, minutes: e.target.value })}
                        style={inputStyle}
                        required
                      >
                        <option value="">MM</option>
                        {Array.from({ length: 60 }, (_, i) => (
                          <option key={i} value={i < 10 ? `0${i}` : i}>{i < 10 ? `0${i}` : i}</option>
                        ))}
                      </select>
                      <select
                        value={rescheduleTime.period}
                        onChange={(e) => setRescheduleTime({ ...rescheduleTime, period: e.target.value })}
                        style={inputStyle}
                        required
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </FormGroup>

                  <FormGroup label="Reason for Rescheduling">
                    <textarea
                      rows={3}
                      placeholder="Enter reason..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                      required
                    />
                  </FormGroup>

                  <button
                    type="submit"
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
                      marginTop: '10px'
                    }}
                  >
                    Reschedule Appointment
                  </button>
                </form>
              )}

              {modalType === 'details' && selectedAppointment && (
                <form onSubmit={handleDetailsSubmit}>
                  <div style={{ marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '10px' }}>
                    <p style={{ margin: '0 0 8px 0' }}><strong>👤 Patient:</strong> {selectedAppointment.fullName}</p>
                    <p style={{ margin: '0 0 8px 0' }}><strong>📅 Date:</strong> {moment(selectedAppointment.appointmentDate).format('DD-MM-YYYY')}</p>
                    <p style={{ margin: '0 0 8px 0' }}><strong>⏰ Time:</strong> {selectedAppointment.appointmentTime}</p>
                    <p style={{ margin: 0 }}><strong>🦠 Disease:</strong> {selectedAppointment.disease}</p>
                  </div>

                  <FormGroup label="Chief Complaints">
                    <textarea
                      name="chiefComplaints"
                      defaultValue={selectedAppointment.chiefComplaints}
                      rows={2}
                      placeholder="Enter patient's chief complaints..."
                      style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                      required
                    />
                  </FormGroup>

                  <FormGroup label="Probable Diagnosis">
                    <textarea
                      name="diagnosis"
                      defaultValue={selectedAppointment.probableDiagnosis}
                      rows={2}
                      placeholder="Enter probable diagnosis..."
                      style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                      required
                    />
                  </FormGroup>

                  <FormGroup label="Prescription List">
                    <textarea
                      name="prescription"
                      defaultValue={selectedAppointment.prescriptionList}
                      rows={3}
                      placeholder="Add medicine name, dose, and frequency..."
                      style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                      required
                    />
                  </FormGroup>

                  <FormGroup label="Lab Investigations">
                    <textarea
                      name="labTests"
                      defaultValue={selectedAppointment.labInvestigations}
                      rows={2}
                      placeholder="Suggest required lab tests..."
                      style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                      required
                    />
                  </FormGroup>

                  <FormGroup label="Upload Lab Reports">
                    <input
                      type="file"
                      name="labReport"
                      style={inputStyle}
                    />
                  </FormGroup>

                  <FormGroup label="Doctor's Remarks">
                    <textarea
                      name="remarks"
                      defaultValue={selectedAppointment.doctorRemarks}
                      rows={2}
                      placeholder="Add your final remarks..."
                      style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                    />
                  </FormGroup>

                  <button
                    type="submit"
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
                      marginTop: '10px'
                    }}
                  >
                    Submit Details
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        table tbody tr:hover {
          background: #f9fafb;
        }
      `}</style>
    </div>
  );
};

// Helper Components and Styles
const FormGroup = ({ label, icon, children }) => (
  <div style={{ marginBottom: '20px' }}>
    <label style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px'
    }}>
      {icon && <span style={{ color: '#667eea' }}>{icon}</span>}
      {label}
    </label>
    {children}
  </div>
);

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  border: '2px solid #e5e7eb',
  borderRadius: '10px',
  fontSize: '0.9rem',
  fontFamily: 'Inter, sans-serif',
  transition: 'all 0.3s ease',
  background: '#f9fafb'
};

const thStyle = {
  padding: '16px',
  textAlign: 'left',
  fontSize: '0.85rem',
  fontWeight: '600',
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  borderBottom: '2px solid #f3f4f6'
};

const tdStyle = {
  padding: '16px',
  fontSize: '0.9rem',
  color: '#374151'
};

const actionBtnStyle = {
  width: '36px',
  height: '36px',
  border: 'none',
  background: '#f3f4f6',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#6b7280',
  transition: 'all 0.3s ease'
};

export default Appointments;