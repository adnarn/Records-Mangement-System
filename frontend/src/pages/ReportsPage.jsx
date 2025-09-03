"use client"

import { useNavigate } from "react-router-dom"
import {AuthGuard} from "../components/AuthGuard"
import { useState, useEffect } from "react"
import { ArrowLeft, FileText, Download, Printer } from "lucide-react"

// Import CSS for styling
import "../cssStyles/ReportsPage.css"

function ReportsContent() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [records, setRecords] = useState([])
  const [selectedStudent, setSelectedStudent] = useState("")
  const [reportType, setReportType] = useState("")
  const [transcriptData, setTranscriptData] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    // Load data from localStorage
    const storedStudents = JSON.parse(localStorage.getItem("srms_students") || "[]")
    const storedRecords = JSON.parse(localStorage.getItem("srms_academic_records") || "[]")
    setStudents(storedStudents)
    setRecords(storedRecords)
  }, [])

  const generateTranscript = async () => {
    if (!selectedStudent) {
      setError("Please select a student")
      return
    }

    setIsGenerating(true)
    setError("")

    try {
      const student = students.find((s) => s.studentId === selectedStudent)
      if (!student) {
        setError("Student not found")
        return
      }

      const studentRecords = records.filter((record) => record.studentId === selectedStudent)

      if (studentRecords.length === 0) {
        setError("No academic records found for this student")
        return
      }

      // Calculate GPA
      const totalPoints = studentRecords.reduce((sum, record) => sum + record.gpa * record.credits, 0)
      const totalCredits = studentRecords.reduce((sum, record) => sum + record.credits, 0)
      const overallGPA = totalCredits > 0 ? totalPoints / totalCredits : 0

      const transcript = {
        student,
        records: studentRecords.sort((a, b) =>
          `${b.year}${b.semester}`.localeCompare(`${a.year}${a.semester}`)
        ),
        overallGPA,
        totalCredits,
        generatedDate: new Date().toISOString(),
      }

      setTranscriptData(transcript)
      setSuccess("Transcript generated successfully!")

      // Simulate saving to localStorage for demo
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (err) {
      setError("Failed to generate transcript. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadTranscript = () => {
    if (!transcriptData) return

    const transcriptContent = generateTranscriptHTML(transcriptData)
    const blob = new Blob([transcriptContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transcript_${transcriptData.student.studentId}_${new Date()
      .toISOString()
      .split("T")[0]}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const printTranscript = () => {
    if (!transcriptData) return

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(generateTranscriptHTML(transcriptData))
      printWindow.document.close()
      printWindow.print()
    }
  }

  const generateTranscriptHTML = (data) => {
    const groupedRecords = data.records.reduce((acc, record) => {
      const key = `${record.semester} ${record.year}`
      if (!acc[key]) acc[key] = []
      acc[key].push(record)
      return acc
    }, {})

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Official Transcript - ${data.student.firstName} ${data.student.lastName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .student-info { margin-bottom: 30px; }
          .semester { margin-bottom: 25px; }
          .semester h3 { background: #f5f5f5; padding: 10px; margin: 0; border-left: 4px solid #2563eb; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
          th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #f8f9fa; font-weight: bold; }
          .summary { background: #f8f9fa; padding: 20px; margin-top: 30px; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>STUDENT RECORDS MANAGEMENT SYSTEM</h1>
          <h2>OFFICIAL ACADEMIC TRANSCRIPT</h2>
        </div>
        
        <div class="student-info">
          <h3>Student Information</h3>
          <p><strong>Name:</strong> ${data.student.firstName} ${data.student.lastName}</p>
          <p><strong>Student ID:</strong> ${data.student.studentId}</p>
          <p><strong>Program:</strong> ${data.student.program
            .replace("-", " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())}</p>
          <p><strong>Email:</strong> ${data.student.email}</p>
          <p><strong>Enrollment Date:</strong> ${new Date(
            data.student.enrollmentDate
          ).toLocaleDateString()}</p>
        </div>

        ${Object.entries(groupedRecords)
          .map(
            ([semester, semesterRecords]) => `
          <div class="semester">
            <h3>${semester}</h3>
            <table>
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Credits</th>
                  <th>Grade</th>
                  <th>GPA Points</th>
                </tr>
              </thead>
              <tbody>
                ${semesterRecords
                  .map(
                    (record) => `
                  <tr>
                    <td>${record.courseCode}</td>
                    <td>${record.courseName}</td>
                    <td>${record.credits}</td>
                    <td>${record.grade}</td>
                    <td>${record.gpa.toFixed(1)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
            <p><strong>Semester GPA:</strong> ${(
              semesterRecords.reduce((sum, r) => sum + r.gpa * r.credits, 0) /
              semesterRecords.reduce((sum, r) => sum + r.credits, 0)
            ).toFixed(2)}</p>
          </div>
        `
          )
          .join("")}

        <div class="summary">
          <h3>Academic Summary</h3>
          <p><strong>Total Credits Earned:</strong> ${data.totalCredits}</p>
          <p><strong>Overall GPA:</strong> ${data.overallGPA.toFixed(2)}</p>
          <p><strong>Total Courses:</strong> ${data.records.length}</p>
        </div>

        <div class="footer">
          <p>This transcript was generated on ${new Date(
            data.generatedDate
          ).toLocaleDateString()} by the Student Records Management System.</p>
          <p>This is an official document. Any alterations will void its authenticity.</p>
        </div>
      </body>
      </html>
    `
  }

  const getGradeColor = (grade) => {
    if (["A+", "A", "A-"].includes(grade)) return "bg-green-100 text-green-800"
    if (["B+", "B", "B-"].includes(grade)) return "bg-blue-100 text-blue-800"
    if (["C+", "C", "C-"].includes(grade)) return "bg-yellow-100 text-yellow-800"
    if (["D+", "D"].includes(grade)) return "bg-orange-100 text-orange-800"
    return "bg-red-100 text-red-800"
  }

  const groupRecordsBySemester = (records) => {
    const grouped = {}
    records.forEach((record) => {
      const key = `${record.semester} ${record.year}`
      if (!grouped[key]) {
        grouped[key] = []
      }
      grouped[key].push(record)
    })
    return grouped
  }

  return (
    <div className="reports-container">
      {/* Header */}
      <header className="reports-header">
        <div className="header-content">
          <div className="header-actions">
            <button 
              className="back-button" 
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="icon" />
              <span>Back to Dashboard</span>
            </button>
            <div className="header-title">
              <FileText className="icon" />
              <h1>Report Generation</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="reports-main">
        {success && (
          <div className="alert success">
            <p className="alert-message">{success}</p>
          </div>
        )}

        {error && (
          <div className="alert error">
            <p className="alert-message">{error}</p>
          </div>
        )}

        {/* Report Generation Form */}
        <div className="card">
          <div className="card-header">
            <h2>Generate Academic Reports</h2>
            <p className="card-description">Create official transcripts and academic reports for students</p>
          </div>
          <div className="card-content">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="reportType">Report Type</label>
                <select 
                  id="reportType"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select report type</option>
                  <option value="transcript">Official Transcript</option>
                  <option value="grade-report">Grade Report</option>
                  <option value="gpa-summary">GPA Summary</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="studentSelect">Student</label>
                <select
                  id="studentSelect"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.studentId}>
                      {student.firstName} {student.lastName} ({student.studentId})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group form-button">
                <button
                  onClick={generateTranscript}
                  disabled={isGenerating || !selectedStudent || !reportType}
                  className="btn btn-primary"
                >
                  <FileText className="btn-icon" />
                  <span>{isGenerating ? "Generating..." : "Generate Report"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Generated Transcript Preview */}
        {transcriptData && (
          <div className="card transcript-preview">
            <div className="card-header">
              <div className="transcript-header">
                <div>
                  <h2>Official Transcript Preview</h2>
                  <p className="card-description">
                    Generated for {transcriptData.student.firstName} {transcriptData.student.lastName} (
                    {transcriptData.student.studentId})
                  </p>
                </div>
                <div className="action-buttons">
                  <button 
                    className="btn btn-outline" 
                    onClick={printTranscript}
                  >
                    <Printer className="btn-icon" />
                    <span>Print</span>
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={downloadTranscript}
                  >
                    <Download className="btn-icon" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="card-content">
              {/* Student Information */}
              <div className="student-info">
                <h3>Student Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <strong>Name:</strong> {transcriptData.student.firstName}{" "}
                    {transcriptData.student.lastName}
                  </div>
                  <div className="info-item">
                    <strong>Student ID:</strong> {transcriptData.student.studentId}
                  </div>
                  <div className="info-item">
                    <strong>Program:</strong>{" "}
                    {transcriptData.student.program
                      .replace("-", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </div>
                  <div className="info-item">
                    <strong>Email:</strong> {transcriptData.student.email}
                  </div>
                  <div className="info-item">
                    <strong>Enrollment Date:</strong>{" "}
                    {new Date(transcriptData.student.enrollmentDate).toLocaleDateString()}
                  </div>
                  <div className="info-item">
                    <strong>Generated:</strong>{" "}
                    {new Date(transcriptData.generatedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Academic Records by Semester */}
              <div className="semester-records">
                {Object.entries(groupRecordsBySemester(transcriptData.records))
                  .sort(([a], [b]) => b.localeCompare(a))
                  .map(([semester, semesterRecords]) => (
                    <div key={semester} className="semester-card">
                      <h4>{semester}</h4>
                      <div className="records-list">
                        {semesterRecords.map((record) => (
                          <div
                            key={record.id}
                            className="record-item"
                          >
                            <div className="record-main">
                              <span className="course-code">{record.courseCode}</span>
                              <span className="course-name">{record.courseName}</span>
                              <span className={`grade-badge ${getGradeColor(record.grade).replace(/\s+/g, '-')}`}>
                                {record.grade}
                              </span>
                            </div>
                            <div className="record-details">
                              <div>{record.credits} credits</div>
                              <div>{record.gpa.toFixed(1)} GPA points</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="semester-summary">
                        <strong>Semester GPA: </strong>
                        {(
                          semesterRecords.reduce(
                            (sum, r) => sum + r.gpa * r.credits,
                            0
                          ) /
                          semesterRecords.reduce((sum, r) => sum + r.credits, 0)
                        ).toFixed(2)}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Academic Summary */}
              <div className="academic-summary">
                <h3>Academic Summary</h3>
                <div className="summary-grid">
                  <div className="summary-item">
                    <div className="summary-value gpa">
                      {transcriptData.overallGPA.toFixed(2)}
                    </div>
                    <div className="summary-label">Overall GPA</div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-value credits">
                      {transcriptData.totalCredits}
                    </div>
                    <div className="summary-label">Total Credits</div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-value courses">
                      {transcriptData.records.length}
                    </div>
                    <div className="summary-label">Courses Completed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function ReportsPage() {
  return (
    <AuthGuard allowedRoles={["administrator"]}>
      <ReportsContent />
    </AuthGuard>
  )
}
