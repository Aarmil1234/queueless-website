import React, { useState, useContext } from "react";
import { ReportsContext } from "../context/ReportContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  FileText,
  User,
  Calendar,
  Download,
  Printer,
  Edit,
  CheckCircle,
  Plus,
  Save,
} from "lucide-react";
import "../Scss/Reports.scss";

const Reports = () => {
  const { reports, setReports } = useContext(ReportsContext);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isPrintMode, setIsPrintMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    referredBy: "",
    doctorNumber: "",
    address: "",
    mobile: "",
    tests: [],
    summary: "",
  });

  const testOptions = [
    "Blood Test",
    "Urine Test",
    "X-Ray",
    "MRI Scan",
    "CT Scan",
    "Ultrasound",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTestSelection = (test) => {
    setFormData((prev) => {
      const updatedTests = prev.tests.includes(test)
        ? prev.tests.filter((t) => t !== test)
        : [...prev.tests, test];
      return { ...prev, tests: updatedTests };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReport = {
      id: Date.now(),
      ...formData,
      status: "Pending",
      results: {},
    };
    setReports([newReport, ...reports]);
    setFormData({
      name: "",
      referredBy: "",
      doctorNumber: "",
      address: "",
      mobile: "",
      tests: [],
      summary: "",
    });
    setShowForm(false);
  };

  const handleEnterResults = (report) => {
    setSelectedReport(report);
    setShowPreview(true);
  };

  const handleResultChange = (test, value) => {
    setSelectedReport((prev) => ({
      ...prev,
      results: { ...prev.results, [test]: value },
    }));
  };

  const handleSaveResults = () => {
    setReports((prevReports) =>
      prevReports.map((r) =>
        r.id === selectedReport.id
          ? { ...selectedReport, status: "Completed" }
          : r
      )
    );
    setShowPreview(false);
    setSelectedReport(null);
    alert("✅ Report saved successfully!");
  };

  const handleDownloadPDF = async () => {
    setIsPrintMode(true);
    setTimeout(async () => {
      const reportElement = document.getElementById("report-preview");
      const canvas = await html2canvas(reportElement, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${selectedReport?.name || "report"}.pdf`);
      setIsPrintMode(false);
    }, 100);
  };

  const handlePrint = () => {
    setIsPrintMode(true);
    setTimeout(() => {
      window.print();
      setIsPrintMode(false);
    }, 100);
  };

  return (
    <div className="reports-wrapper">
      <div className="reports-container">
        {/* Table + Add Report Button */}
        {!showForm && !showPreview && (
          <>
            <div className="reports-header">
              <h2>📋 Patient Reports</h2>
              <button
                className="btn-report btn-primary"
                onClick={() => setShowForm(true)}
              >
                <Plus size={18} /> Add Report
              </button>
            </div>

            <table className="reports-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Referred By</th>
                  <th>Doctor No.</th>
                  <th>Mobile</th>
                  <th>Tests</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No reports available
                    </td>
                  </tr>
                ) : (
                  reports.map((r) => (
                    <tr key={r.id}>
                      <td>{r.name}</td>
                      <td>{r.referredBy}</td>
                      <td>{r.doctorNumber}</td>
                      <td>{r.mobile}</td>
                      <td>{r.tests.join(", ")}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            r.status === "Completed" ? "completed" : "pending"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-small btn-info"
                          onClick={() => handleEnterResults(r)}
                        >
                          {r.status === "Pending" ? "Enter Results" : "View / Print"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}

        {/* Add Report Form */}
        {showForm && !showPreview && (
          <form onSubmit={handleSubmit} className="reports-form-card">
            <h3>Enter Patient & Report Details</h3>
            <div className="reports-form-grid">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Patient Name"
                required
              />
              <input
                type="text"
                name="referredBy"
                value={formData.referredBy}
                onChange={handleChange}
                placeholder="Referred By"
                required
              />
              <input
                type="text"
                name="doctorNumber"
                value={formData.doctorNumber}
                onChange={handleChange}
                placeholder="Doctor Number"
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
              />
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Mobile / WhatsApp"
              />
            </div>

            <div className="tests-selection">
              <label>Select Tests:</label>
              {testOptions.map((test) => (
                <label key={test}>
                  <input
                    type="checkbox"
                    checked={formData.tests.includes(test)}
                    onChange={() => handleTestSelection(test)}
                  />
                  <span>{test}</span>
                </label>
              ))}
            </div>

            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              placeholder="Summary / Description"
              required
            />

            <div className="reports-button-group">
              <button
                type="button"
                className="btn-report btn-secondary"
                onClick={() => setShowForm(false)}
              >
                <Edit size={18} /> Cancel
              </button>
              <button type="submit" className="btn-report btn-success">
                <CheckCircle size={18} /> Add Report
              </button>
            </div>
          </form>
        )}

        {/* Preview / Enter Results */}
        {showPreview && selectedReport && (
          <div className="report-preview-container">
            <div id="report-preview" className="report-preview">
              <h3>{selectedReport.name}</h3>
              <div className="report-meta">
                <p>
                  <strong>Referred By:</strong> {selectedReport.referredBy} (
                  {selectedReport.doctorNumber})
                </p>
                <p>
                  <strong>Mobile:</strong> {selectedReport.mobile}
                </p>
                <p>
                  <strong>Tests:</strong> {selectedReport.tests.join(", ")}
                </p>
              </div>
              <hr />
              <div className="report-results">
                {selectedReport.tests.map((test) => (
                  <div key={test}>
                    <label>{test} Result:</label>
                    {isPrintMode ? (
                      <p style={{ 
                        margin: '8px 0 0 0', 
                        color: '#1f2937', 
                        fontSize: '15px',
                        lineHeight: '1.6',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {selectedReport.results[test] || "N/A"}
                      </p>
                    ) : (
                      <input
                        type="text"
                        value={selectedReport.results[test] || ""}
                        onChange={(e) => handleResultChange(test, e.target.value)}
                        disabled={selectedReport.status === "Completed"}
                      />
                    )}
                  </div>
                ))}
              </div>
              <hr />
              <p>
                <strong>Summary:</strong> 
                <span style={{ display: 'block', marginTop: '8px', fontWeight: 'normal' }}>
                  {selectedReport.summary}
                </span>
              </p>
            </div>

            <div className="reports-button-group no-print">
              <button
                type="button"
                onClick={() => {
                  setShowPreview(false);
                  setSelectedReport(null);
                }}
                className="btn-report btn-secondary"
              >
                <Edit size={18} /> Back
              </button>

              {selectedReport.status === "Pending" && (
                <button
                  type="button"
                  onClick={handleSaveResults}
                  className="btn-report btn-success"
                >
                  <Save size={18} /> Save
                </button>
              )}

              <button
                type="button"
                onClick={handleDownloadPDF}
                className="btn-report btn-primary"
              >
                <Download size={18} /> Download PDF
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="btn-report btn-info"
              >
                <Printer size={18} /> Print
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Print-specific styles */}
      <style>{`
        @media print {
          body * { 
            visibility: hidden; 
          }
          #report-preview, 
          #report-preview * {
            visibility: visible;
          }
          #report-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 40px;
          }
          .no-print {
            display: none !important;
          }
          .reports-wrapper {
            background: white !important;
          }
          .reports-wrapper::before,
          .reports-wrapper::after {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Reports;