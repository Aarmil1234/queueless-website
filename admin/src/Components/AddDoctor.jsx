import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Spinner, Card } from "react-bootstrap";
import { apiRequest } from "../reusable";

const AddDoctor = () => {
  const [hospitalId, setHospitalId] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [viewDoctor, setViewDoctor] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
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

  // ✅ Initial load
  useEffect(() => {
    const hospitalCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hospitalId="))
      ?.split("=")[1];

    if (hospitalCookie) {
      setHospitalId(hospitalCookie);
      fetchDoctors(hospitalCookie);
    } else {
      fetchDoctors();
    }

    fetchHospitals();
    fetchSpecializations();
    fetchDegrees();
  }, []);

  // ✅ Fetch doctors
  const fetchDoctors = async (hid) => {
    try {
      setLoading(true);
      const res = await apiRequest("POST", "admin/getdoctors", hid ? { hospitalId: hid } : {});
      const list = res.data?.doctors || res.data?.data?.doctors || [];
      setDoctors(list);
      setFilteredDoctors(list);
    } catch (err) {
      console.error("❌ Error fetching doctors:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch hospitals
  const fetchHospitals = async () => {
    try {
      const res = await apiRequest("POST", "admin/gethospitals", {});
      const list = res.data?.hospitals || res.data?.data?.hospitals || [];
      setHospitals(list);
    } catch (err) {
      console.error("❌ Error fetching hospitals:", err.message);
    }
  };

  // ✅ Fetch specializations
  const fetchSpecializations = async () => {
    try {
      const res = await apiRequest("POST", "admin/getspecializations", {});
      const list = res.data?.specializations || res.data?.data?.specializations || [];
      setSpecializations(list);
    } catch (err) {
      console.error("❌ Error fetching specializations:", err.message);
    }
  };

  // ✅ Fetch degrees
  const fetchDegrees = async () => {
    try {
      const res = await apiRequest("POST", "admin/getdegrees", {});
      const list = res.data?.degrees || res.data?.data?.degrees || [];
      setDegrees(list);
    } catch (err) {
      console.error("❌ Error fetching degrees:", err.message);
    }
  };

  // ✅ Search doctors
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchQuery(value);
    const filtered = doctors.filter((doc) =>
      Object.values(doc).join(" ").toLowerCase().includes(value)
    );
    setFilteredDoctors(filtered);
  };

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle submit (Add/Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isEditMode ? "admin/updatedoctor" : "admin/adddoctor";
      await apiRequest("POST", endpoint, {
        ...formData,
        hospitalId: hospitalId || formData.hospitalId,
      });
      alert(isEditMode ? "Doctor updated successfully!" : "Doctor added successfully!");
      setShowModal(false);
      setIsEditMode(false);
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
      fetchDoctors(hospitalId);
    } catch (err) {
      alert("Failed to save doctor: " + (err.response?.data?.message || err.message));
    }
  };

  // ✅ View doctor
  const handleView = (doctor) => setViewDoctor(doctor);

  // ✅ Edit doctor
  const handleEdit = (doctor) => {
    setFormData({
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      mobileNumber: doctor.mobileNumber,
      specializationId: doctor.specializationId,
      degreeId: doctor.degreeId,
      hospitalId: doctor.hospitalId,
      address: doctor.address,
      appointmentCharge: doctor.appointmentCharge,
      experience: doctor.experience,
      age: doctor.age,
      gender: doctor.gender,
    });
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleBack = () => setViewDoctor(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        margin: "60px 0 0 280px",
        background: "#f8f9fa",
      }}
    >
      {viewDoctor ? (
        // ✅ View Doctor Card
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <Card
            style={{
              borderRadius: "20px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              padding: "30px",
            }}
          >
            <Card.Body>
              <h2>{viewDoctor.name}</h2>
              <p><b>Email:</b> {viewDoctor.email}</p>
              <p><b>Mobile:</b> {viewDoctor.mobileNumber}</p>
              <p><b>Specialization:</b> {viewDoctor.specializationId}</p>
              <p><b>Degree:</b> {viewDoctor.degreeId}</p>
              <p><b>Address:</b> {viewDoctor.address}</p>
              <p><b>Appointment Charge:</b> ₹{viewDoctor.appointmentCharge}</p>
              <p><b>Experience:</b> {viewDoctor.experience} years</p>
              <p><b>Age:</b> {viewDoctor.age}</p>
              <p><b>Gender:</b> {viewDoctor.gender}</p>
              <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                <Button variant="secondary" onClick={handleBack}>
                  ⬅ Back
                </Button>
                <Button variant="warning" onClick={() => handleEdit(viewDoctor)}>
                  ✏️ Edit
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      ) : (
        // ✅ Main Table View
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h1>Doctors</h1>
            <Button
              variant="primary"
              onClick={() => {
                setFormData((prev) => ({ ...prev, hospitalId }));
                setShowModal(true);
              }}
            >
              ➕ Add Doctor
            </Button>
          </div>

          {/* Search Bar */}
          <div style={{ marginBottom: "15px", textAlign: "right" }}>
            <input
              type="text"
              placeholder="🔍 Search..."
              value={searchQuery}
              onChange={handleSearch}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "1px solid #ddd",
              }}
            />
          </div>

          {/* Table */}
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            {loading ? (
              <div style={{ textAlign: "center", padding: "60px" }}>
                <Spinner animation="border" />
              </div>
            ) : (
              <Table striped bordered hover>
                <thead style={{ background: "#f8fafc", position: "sticky", top: 0 }}>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Specialization</th>
                    <th>Degree</th>
                    <th>Charge</th>
                    <th>Experience</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.length ? (
                    filteredDoctors.map((doc) => (
                      <tr key={doc._id}>
                        <td>{doc.name}</td>
                        <td>{doc.email}</td>
                        <td>{doc.mobileNumber}</td>
                        <td>{doc.specializationId}</td>
                        <td>{doc.degreeId}</td>
                        <td>{doc.appointmentCharge}</td>
                        <td>{doc.experience}</td>
                        <td>
                          <Button
                            size="sm"
                            variant="info"
                            onClick={() => handleView(doc)}
                            style={{ marginRight: "8px" }}
                          >
                            👁 View
                          </Button>
                          <Button
                            size="sm"
                            variant="warning"
                            onClick={() => handleEdit(doc)}
                          >
                            ✏️ Edit
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center", padding: "40px" }}>
                        No doctors found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </div>
        </div>
      )}

      {/* ✅ Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? "Edit Doctor" : "Add Doctor"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Select
              name="hospitalId"
              value={formData.hospitalId}
              onChange={handleChange}
              required
            >
              <option value="">Select Hospital</option>
              {hospitals.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.name}
                </option>
              ))}
            </Form.Select>

            <Form.Control
              name="name"
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-3"
            />

            <Form.Control
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-3"
            />

            <Form.Control
              name="mobileNumber"
              type="text"
              placeholder="Mobile Number"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              className="mt-3"
            />

            <Form.Select
              name="specializationId"
              value={formData.specializationId}
              onChange={handleChange}
              required
              className="mt-3"
            >
              <option value="">Select Specialization</option>
              {specializations.map((sp) => (
                <option key={sp._id} value={sp._id}>
                  {sp.name}
                </option>
              ))}
            </Form.Select>

            <Form.Select
              name="degreeId"
              value={formData.degreeId}
              onChange={handleChange}
              required
              className="mt-3"
            >
              <option value="">Select Degree</option>
              {degrees.map((deg) => (
                <option key={deg._id} value={deg._id}>
                  {deg.name}
                </option>
              ))}
            </Form.Select>

            <Form.Control
              name="address"
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              className="mt-3"
            />

            <Form.Control
              name="appointmentCharge"
              type="number"
              placeholder="Appointment Charge"
              value={formData.appointmentCharge}
              onChange={handleChange}
              required
              className="mt-3"
            />

            <Form.Control
              name="experience"
              type="number"
              placeholder="Experience (years)"
              value={formData.experience}
              onChange={handleChange}
              required
              className="mt-3"
            />

            <Form.Control
              name="age"
              type="number"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              required
              className="mt-3"
            />

            <Form.Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="mt-3"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Form.Select>

            <Button
              type="submit"
              variant="primary"
              style={{ width: "100%", marginTop: "20px" }}
            >
              {isEditMode ? "Update Doctor" : "Add Doctor"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddDoctor;
