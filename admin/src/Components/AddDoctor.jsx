import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Spinner } from "react-bootstrap";
import { apiRequest } from "../reusable";

const AddDoctor = () => {
  // const hospitalId = "6849df2a339cf2f608e326a4"; hey aa wk kar nw  Tya logout and username
  const [hospitalId, setHospitalId] = useState(null);
  useEffect(() => {
    const hospitalCookie = document.cookie
      .split("; ")
      .find(row => row.startsWith("hospitalId="))
      ?.split("=")[1];

    setHospitalId(hospitalCookie);
  }, [])
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    specializationId: "",
    degreeId: "",
    hospitalId: hospitalId,
    address: "",
    appointmentCharge: "",
    experience: "",
    age: "",
    gender: "",
  });

  useEffect(() => {
    hospitalId != null &&
      fetchDoctors();
  }, [hospitalId]);

  useEffect(() => {
    fetchHospitals();
  }, [])

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await apiRequest("POST", "admin/getdoctors", JSON);
      setDoctors(res.data?.doctors || res.data?.data?.doctors || []);
    } catch (err) {
      console.error("Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const res = await apiRequest("POST", "admin/gethospitals", JSON);
      setHospitals(res.data?.hospitals || res.data?.data?.hospitals || []);
    } catch (err) {
      console.error("Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("POST", "admin/adddoctor", formData);
      //DONE
      setShowModal(false);
      setFormData({
        name: "",
        email: "",
        mobileNumber: "",
        specializationId: "",
        degreeId: "",
        hospitalId: "",
        address: "",
        appointmentCharge: "",
        experience: "",
        age: "",
        gender: "",
      });
      fetchDoctors();
    } catch (err) {
      alert("Failed to add doctor: " + err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{
            color: '#000',
            fontSize: '36px',
            fontWeight: '600',
            margin: '0'
          }}>Doctors</h1>
          <Button
            variant="primary"
            onClick={() => {
              setFormData((prev) => ({ ...prev, hospitalId }));
              setShowModal(true);
            }}
            style={{
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)'
            }}
          >
            ➕ Add Doctor
          </Button>
        </div>

        {/* Table or Loader */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '0',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <Table striped bordered hover style={{
              margin: '0',
              background: 'transparent',
              border: 'none'
            }}>
              <thead>
                <tr style={{
                  background: 'rgba(248, 250, 252, 0.8)',
                  borderBottom: '1px solid rgba(226, 232, 240, 0.5)'
                }}>
                  <th style={headerStyle}>Name</th>
                  <th style={headerStyle}>Email</th>
                  <th style={headerStyle}>Mobile</th>
                  <th style={headerStyle}>Specialization</th>
                  <th style={headerStyle}>Degree</th>
                  <th style={headerStyle}>Charge</th>
                  <th style={headerStyle}>Experience</th>
                  <th style={headerStyle}>Age</th>
                  <th style={headerStyle}>Gender</th>
                </tr>
              </thead>
              <tbody>
                {doctors.length > 0 ? (
                  doctors.map((doc) => (
                    <tr key={doc._id}>
                      <td style={cellStyle}>{doc.name}</td>
                      <td style={cellStyle}>{doc.email}</td>
                      <td style={cellStyle}>{doc.mobileNumber}</td>
                      <td style={cellStyle}>{doc.specializationId}</td>
                      <td style={cellStyle}>{doc.degreeId}</td>
                      <td style={cellStyle}>{doc.appointmentCharge}</td>
                      <td style={cellStyle}>{doc.experience}</td>
                      <td style={cellStyle}>{doc.age}</td>
                      <td style={cellStyle}>{doc.gender}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" style={{
                      ...cellStyle,
                      textAlign: 'center',
                      color: '#64748b',
                      fontStyle: 'italic',
                      padding: '40px'
                    }}>No doctors found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </div>

        {/* Add Doctor Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            border: 'none',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
          }}>
            <Modal.Header closeButton style={{
              border: 'none',
              padding: '30px 30px 0 30px'
            }}>
              <Modal.Title style={{
                color: '#1e293b',
                fontSize: '24px',
                fontWeight: '600'
              }}>Add Doctor</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: '20px 30px 30px 30px' }}>
              <Form onSubmit={handleSubmit}>
                <Form.Select
                  name="hospitalId"
                  value={formData.hospitalId}
                  onChange={handleChange}
                  required
                // style={{ ...inputStyle, marginBottom: '15px' }}
                >
                  <option value="">Select Hospital</option>
                  {hospitals.map((data, index) => {
                    return (<option value={data._id}>{data.name}</option>)
                  })}
                  {/* <option value="Male">Male</option>
                  <option value="Female">Female</option> */}
                </Form.Select>
                <Form.Control
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  // style={inputStyle}
                  style={{ ...inputStyle, marginTop: '15px' }}
                />
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ ...inputStyle, marginTop: '15px' }}
                />
                <Form.Control
                  name="mobileNumber"
                  placeholder="Mobile Number"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                  style={{ ...inputStyle, marginTop: '15px' }}
                />
                <Form.Control
                  name="specializationId"
                  placeholder="Specialization ID"
                  value={formData.specializationId}
                  onChange={handleChange}
                  required
                  style={{ ...inputStyle, marginTop: '15px' }}
                />
                <Form.Control
                  name="degreeId"
                  placeholder="Degree ID"
                  value={formData.degreeId}
                  onChange={handleChange}
                  required
                  style={{ ...inputStyle, marginTop: '15px' }}
                />
                <Form.Control
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  style={{ ...inputStyle, marginTop: '15px' }}
                />
                <Form.Control
                  name="appointmentCharge"
                  placeholder="Appointment Charge"
                  value={formData.appointmentCharge}
                  onChange={handleChange}
                  required
                  style={{ ...inputStyle, marginTop: '15px' }}
                />
                <Form.Control
                  name="experience"
                  placeholder="Experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  style={{ ...inputStyle, marginTop: '15px' }}
                />
                <Form.Control
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  style={{ ...inputStyle, marginTop: '15px' }}
                />
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  style={{ ...inputStyle, marginTop: '15px' }}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Form.Select>
                <Button
                  type="submit"
                  variant="success"
                  style={{
                    marginTop: '25px',
                    width: '100%',
                    padding: '12px',
                    border: 'none',
                    borderRadius: '10px',
                    background: '#4f46e5',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                >
                  Submit
                </Button>
              </Form>
            </Modal.Body>
          </div>
        </Modal>
      </div>
    </div>
  );
};

const headerStyle = {
  padding: '16px 20px',
  textAlign: 'left',
  fontWeight: '600',
  fontSize: '14px',
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  border: 'none',
  background: 'transparent'
};

const cellStyle = {
  padding: '16px 20px',
  color: '#334155',
  fontSize: '14px',
  verticalAlign: 'middle',
  border: 'none',
  borderBottom: '1px solid rgba(226, 232, 240, 0.3)'
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  border: '2px solid #e2e8f0',
  borderRadius: '10px',
  fontSize: '16px',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box'
};

export default AddDoctor;
