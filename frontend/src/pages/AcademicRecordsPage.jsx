"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthGuard } from "../components/AuthGuard"
import "../cssStyles/academicRecordsPage.css"

function AcademicRecordsContent() {
  const navigate = useNavigate()
  const [records, setRecords] = useState([])
  const [students, setStudents] = useState([])
  const [filteredRecords, setFilteredRecords] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("all")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newRecord, setNewRecord] = useState({
    studentId: "",
    courseCode: "",
    courseName: "",
    semester: "",
    year: "",
    grade: "",
    credits: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const storedRecords = JSON.parse(localStorage.getItem("srms_academic_records") || "[]")
    const storedStudents = JSON.parse(localStorage.getItem("srms_students") || "[]")
    setRecords(storedRecords)
    setStudents(storedStudents)
    setFilteredRecords(storedRecords)
  }, [])

  useEffect(() => {
    let filtered = records

    if (selectedStudent && selectedStudent !== "all") {
      filtered = filtered.filter((record) => record.studentId === selectedStudent)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (record) =>
          record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.semester.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredRecords(filtered)
  }, [searchTerm, selectedStudent, records])

  const handleAddRecord = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const student = students.find((s) => s.studentId === newRecord.studentId)
      if (!student) {
        setError("Student not found")
        return
      }

      const record = {
        id: Date.now().toString(),
        studentId: newRecord.studentId,
        studentName: `${student.firstName} ${student.lastName}`,
        courseCode: newRecord.courseCode,
        courseName: newRecord.courseName,
        semester: newRecord.semester,
        year: newRecord.year,
        grade: newRecord.grade,
        credits: Number.parseInt(newRecord.credits),
        createdAt: new Date().toISOString(),
      }

      const updatedRecords = [...records, record]
      setRecords(updatedRecords)
      localStorage.setItem("srms_academic_records", JSON.stringify(updatedRecords))

      setSuccess("Academic record added successfully!")
      setShowAddForm(false)
      setNewRecord({
        studentId: "",
        courseCode: "",
        courseName: "",
        semester: "",
        year: "",
        grade: "",
        credits: "",
      })
    } catch (err) {
      setError("Failed to add academic record. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteRecord = (recordId) => {
    const updatedRecords = records.filter((record) => record.id !== recordId)
    setRecords(updatedRecords)
    localStorage.setItem("srms_academic_records", JSON.stringify(updatedRecords))
    setSuccess("Record deleted successfully!")
  }

  return (
    <div className="academic-page">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <button className="btn btn-back" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>
          <h1 className="page-title">Academic Records</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
          + Add Record
        </button>
      </header>

      <main className="content">
        {success && <div className="alert success">{success}</div>}
        {error && <div className="alert error">{error}</div>}

        {/* Add Record Form */}
        {showAddForm && (
          <div className="form-container">
            <h3>Add Academic Record</h3>
            <form onSubmit={handleAddRecord} className="record-form">
              <div className="form-grid">
                <select
                  value={newRecord.studentId}
                  onChange={(e) => setNewRecord((p) => ({ ...p, studentId: e.target.value }))}
                  required
                >
                  <option value="">Select Student</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.studentId}>
                      {s.firstName} {s.lastName} ({s.studentId})
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Course Code"
                  value={newRecord.courseCode}
                  onChange={(e) => setNewRecord((p) => ({ ...p, courseCode: e.target.value }))}
                  required
                />
                <input
                  type="text"
                  placeholder="Course Name"
                  value={newRecord.courseName}
                  onChange={(e) => setNewRecord((p) => ({ ...p, courseName: e.target.value }))}
                  required
                />
                <select
                  value={newRecord.semester}
                  onChange={(e) => setNewRecord((p) => ({ ...p, semester: e.target.value }))}
                  required
                >
                  <option value="">Select Semester</option>
                  <option value="Fall">Fall</option>
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                </select>
                <input
                  type="number"
                  placeholder="Year"
                  value={newRecord.year}
                  onChange={(e) => setNewRecord((p) => ({ ...p, year: e.target.value }))}
                  required
                />
                <select
                  value={newRecord.grade}
                  onChange={(e) => setNewRecord((p) => ({ ...p, grade: e.target.value }))}
                  required
                >
                  <option value="">Select Grade</option>
                  <option value="A+">A+</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="F">F</option>
                </select>
                <input
                  type="number"
                  placeholder="Credits"
                  value={newRecord.credits}
                  onChange={(e) => setNewRecord((p) => ({ ...p, credits: e.target.value }))}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Record"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search + Filter */}
        <div className="filter-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
            <option value="all">All Students</option>
            {students.map((s) => (
              <option key={s.id} value={s.studentId}>
                {s.firstName} {s.lastName} ({s.studentId})
              </option>
            ))}
          </select>
        </div>

        {/* Records */}
        <div className="records">
          {filteredRecords.length === 0 ? (
            <p>No records found.</p>
          ) : (
            filteredRecords.map((r) => (
              <div key={r.id} className="record-card">
                <div className="record-info">
                  <h4>{r.studentName}</h4>
                  <p>
                    {r.courseCode} - {r.courseName}
                  </p>
                  <p>
                    {r.semester} {r.year} • {r.credits} credits
                  </p>
                  <span className="grade">{r.grade}</span>
                </div>
                <div className="record-actions">
                  <button className="btn">Edit</button>
                  <button className="btn btn-danger" onClick={() => deleteRecord(r.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export default function AcademicRecordsPage() {
  return (
    <AuthGuard allowedRoles={["administrator"]}>
      <AcademicRecordsContent />
    </AuthGuard>
  )
}
