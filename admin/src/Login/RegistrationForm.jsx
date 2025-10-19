import React, { useState } from 'react';
import { apiRequest } from '../reusable';
import { ChevronRight, ChevronLeft, Building2, Mail, Phone, MapPin, Hash, Tag, Lock, User, CheckCircle } from 'lucide-react';

const QueuelessRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
  hospitalName: '',
  ownerName: '',
  socialMediaLinks: '',
  email: '',
  phone: '',
  hospitalAddress: '',
  city: '',
  pincode: '',
  categories: '',
  specialization: '',
  otherSpecialization: '',
  loginEmail: '',
  password: ''
});


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "specialization" && value !== "Other" ? { otherSpecialization: "" } : {})
    }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const handlePrev = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = async () => {
  try {
    const payload = {
      name: formData.hospitalName,
      ownerName: formData.ownerName,
      socialMediaLinks: formData.socialMediaLinks || null,
      email: formData.email,
      mobileNumber: formData.phone,
      address: formData.hospitalAddress,
      city: formData.city,
      profile: null,
      loginField: formData.loginEmail,  // ✅ Added
      password: formData.password       // ✅ Added
    };

    console.log("Payload sent to backend:", payload);

    const response = await apiRequest("POST", "admin/addhospital", payload);

    console.log("Response:", response);
    alert("Registration completed successfully!");
    window.location.href = "/login";
  } catch (error) {
    console.error("Error submitting registration:", error);
    alert(error.message || "Registration failed. Please check your inputs.");
  }
};




  return (
    <>
      <div className="registration-wrapper">
        <div className="registration-container">
          {/* Brand Header */}
          <div className="brand-header">
            <h1 className="brand-title">Queueless</h1>
          </div>

          {/* Form Card */}
          <div className="form-card">
            {/* Form Header */}
            <div className="form-header">
              <div className="step-indicator">
                <div className={`step-circle ${currentStep >= 1 ? 'active' : 'inactive'}`}>
                  1
                </div>
                <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`}></div>
                <div className={`step-circle ${currentStep >= 2 ? 'active' : 'inactive'}`}>
                  2
                </div>
              </div>
              <h2>Registration Form</h2>
            </div>

            {/* Form Body */}
            <div className="form-body">
              {currentStep === 1 && (
                <div>
                  <h3 className="step-title">Hospital Information</h3>

                  <div className="form-grid">
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">
                        <Building2 size={18} /> &nbsp;
                        Hospital Name
                      </label>
                      <input
                        type="text"
                        name="hospitalName"
                        value={formData.hospitalName}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter hospital name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <User size={18} /> &nbsp;
                        Owner Name
                      </label>
                      <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter owner's full name"
                        required
                      />
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">
                        <Tag size={18} /> &nbsp;
                        Social Media Link (optional)
                      </label>
                      <input
                        type="url"
                        name="socialMediaLinks"
                        value={formData.socialMediaLinks}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="https://twitter.com/yourhospital"
                      />
                    </div>


                    <div className="form-group">
                      <label className="form-label">
                        <Mail size={18} />  &nbsp;
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="hospital@example.com"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <Phone size={18} />  &nbsp;
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">
                        <MapPin size={18} />  &nbsp;
                        Hospital Address
                      </label>
                      <textarea
                        name="hospitalAddress"
                        value={formData.hospitalAddress}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter complete hospital address"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <MapPin size={18} />  &nbsp;
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter city"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <Hash size={18} />  &nbsp;
                        Pincode
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="123456"
                        pattern="[0-9]{6}"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <Tag size={18} />  &nbsp;
                        Hospital Category
                      </label>
                      <select
                        name="categories"
                        value={formData.categories}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      >
                        <option value="">Select category</option>
                        <option value="general">General Hospital</option>
                        <option value="specialty">Specialty Hospital</option>
                        <option value="multispecialty">Multi-Specialty Hospital</option>
                        <option value="super-specialty">Super Specialty Hospital</option>
                        <option value="clinic">Clinic</option>
                        <option value="diagnostic">Diagnostic Center</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <Tag size={18} />  &nbsp;
                        Specialization
                      </label>
                      <select
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      >
                        <option value="">Select specialization</option>
                        <option value="Dentist">Dentist</option>
                        <option value="Psychiatrist">Psychiatrist</option>
                        <option value="Dermatologist">Dermatologist</option>
                        <option value="General medicine">General Medicine</option>
                        <option value="Other">Other</option>
                      </select>
                      {formData.specialization === "Other" && (
                        <div className="specialization-other">
                          <input
                            type="text"
                            name="otherSpecialization"
                            value={formData.otherSpecialization}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Enter your specialization"
                            required
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="button-group end">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-custom btn-primary"
                    >
                      <span>Next Step</span>
                      <ChevronRight size={20} />  &nbsp;
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h3 className="step-title">Account Setup</h3>

                  <div className="auth-container">
                    <div className="form-group" style={{ marginBottom: '28px' }}>
                      <label className="form-label">
                        <User size={18} />  &nbsp;
                        Login Email
                      </label>
                      <input
                        type="email"
                        name="loginEmail"
                        value={formData.loginEmail}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter login email"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <Lock size={18} />  &nbsp;
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Create a secure password"
                        minLength="8"
                        required
                      />

                    </div>
                  </div>

                  <div className="button-group">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="btn-custom btn-secondary"
                    >
                      <ChevronLeft size={20} />
                      <span>Previous</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="btn-custom btn-success"
                    >
                      <CheckCircle size={20} />
                      <span>Complete Registration</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QueuelessRegistrationForm;