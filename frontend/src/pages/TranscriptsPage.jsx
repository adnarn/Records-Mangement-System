"use client"

import { useNavigate } from "react-router-dom"
import { AuthGuard } from "../components/AuthGuard"
import { useAuth } from "../hooks/useAuth"
import { useState, useEffect } from "react"
import { ArrowLeft, FileText, Download, Printer } from "lucide-react"
import "../cssStyles/TranscriptsPage.css"

function TranscriptsContent() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [student, setStudent] = useState(null)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.studentId) {
      // Load student data and academic records
      const storedStudents = JSON.parse(localStorage.getItem("srms_students") || "[]")
      const storedRecords = JSON.parse(localStorage.getItem("srms_academic_records") || "[]")

      const currentStudent = storedStudents.find((s) => s.studentId === user.studentId)
      const studentRecords = storedRecords.filter((record) => record.studentId === user.studentId)

      setStudent(currentStudent)
      setRecords(studentRecords)
    }
    setLoading(false)
  }, [user])

  const calculateGPA = () => {
    if (records.length === 0) return 0
    const totalPoints = records.reduce((sum, record) => sum + record.gpa * record.credits, 0)
    const totalCredits = records.reduce((sum, record) => sum + record.credits, 0)
    return totalCredits > 0 ? totalPoints / totalCredits : 0
  }

  const getTotalCredits = () => {
    return records.reduce((sum, record) => sum + record.credits, 0)
  }

  const downloadTranscript = () => {
    if (!student || records.length === 0) return

    const transcriptContent = generateTranscriptHTML()
    const blob = new Blob([transcriptContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transcript_${student.studentId}_${new Date().toISOString().split("T")[0]}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const printTranscript = () => {
    if (!student || records.length === 0) return

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(generateTranscriptHTML())
      printWindow.document.close()
      printWindow.print()
    }
  }

  const generateTranscriptHTML = () => {
    if (!student) return ""

    const groupedRecords = records.reduce((acc, record) => {
      const key = `${record.semester} ${record.year}`
      if (!acc[key]) acc[key] = []
      acc[key].push(record)
      return acc
    }, {})

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Official Transcript - ${student.firstName} ${student.lastName}</title>
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
          <p><strong>Name:</strong> ${student.firstName} ${student.lastName}</p>
          <p><strong>Student ID:</strong> ${student.studentId}</p>
          <p><strong>Program:</strong> ${student.program.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</p>
          <p><strong>Email:</strong> ${student.email}</p>
          <p><strong>Enrollment Date:</strong> ${new Date(student.enrollmentDate).toLocaleDateString()}</p>
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
          <p><strong>Total Credits Earned:</strong> ${getTotalCredits()}</p>
          <p><strong>Overall GPA:</strong> ${calculateGPA().toFixed(2)}</p>
          <p><strong>Total Courses:</strong> ${records.length}</p>
        </div>

        <div class="footer">
          <p>This transcript was generated on ${new Date().toLocaleDateString()} by the Student Records Management System.</p>
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

  const groupRecordsBySemester = () => {
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="transcripts-container">
      {/* Header */}
      <header className="transcripts-header">
        <div className="header-content">
          <div className="header-actions">
            <div className="flex items-center">
              <button 
                className="back-button" 
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="button-icon" />
                <span>Back to Dashboard</span>
              </button>
              <div className="header-title">
                <FileText className="icon" />
                <h1>My Transcripts</h1>
              </div>
            </div>
            {student && records.length > 0 && (
              <div className="action-buttons">
                <button 
                  className="button button-outline" 
                  onClick={printTranscript}
                >
                  <Printer className="button-icon" />
                  <span>Print</span>
                </button>
                <button 
                  className="button button-primary" 
                  onClick={downloadTranscript}
                >
                  <Download className="button-icon" />
                  <span>Download</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="transcripts-main">
        {!student || records.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <FileText className="empty-state-icon" />
              <h3 className="empty-state-title">No Transcript Available</h3>
              <p className="empty-state-description">
                {!student
                  ? "Student information not found. Please contact the administrator."
                  : "Your academic records will appear here once grades are entered by administrators."}
              </p>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Official Academic Transcript</h2>
              <p className="card-description">
                Generated for {student.firstName} {student.lastName} ({student.studentId})
              </p>
            </div>
            <div className="card-content">
              {/* Student Information */}
              <div className="student-info">
                <h3>Student Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <strong>Name:</strong> {student.firstName} {student.lastName}
                  </div>
                  <div className="info-item">
                    <strong>Student ID:</strong> {student.studentId}
                  </div>
                  <div className="info-item">
                    <strong>Program:</strong>{" "}
                    {student.program.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </div>
                  <div className="info-item">
                    <strong>Email:</strong> {student.email}
                  </div>
                  <div className="info-item">
                    <strong>Enrollment Date:</strong> {new Date(student.enrollmentDate).toLocaleDateString()}
                  </div>
                  <div className="info-item">
                    <strong>Generated:</strong> {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Academic Records by Semester */}
              <div className="semester-records">
                {Object.entries(groupRecordsBySemester())
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
                          semesterRecords.reduce((sum, r) => sum + r.gpa * r.credits, 0) /
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
                      {calculateGPA().toFixed(2)}
                    </div>
                    <div className="summary-label">Overall GPA</div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-value credits">
                      {getTotalCredits()}
                    </div>
                    <div className="summary-label">Total Credits</div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-value courses">
                      {records.length}
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

export default function TranscriptsPage() {
  return (
    <AuthGuard allowedRoles={["student"]}>
      <TranscriptsContent />
    </AuthGuard>
  )
}
