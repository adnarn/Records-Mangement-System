"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthGuard } from "../components/AuthGuard"
// UI components replaced with standard HTML elements
import { ArrowLeft, Plus, Search, BookOpen, Edit, Trash2 } from "lucide-react"

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
    // Load data from localStorage
    const storedRecords = JSON.parse(localStorage.getItem("srms_academic_records") || "[]")
    const storedStudents = JSON.parse(localStorage.getItem("srms_students") || "[]")
    setRecords(storedRecords)
    setStudents(storedStudents)
    setFilteredRecords(storedRecords)
  }, [])

  useEffect(() => {
    // Filter records based on search term and selected student
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

  const gradeToGPA = (grade) => {
    const gradeMap = {
      "A+": 4.0,
      A: 4.0,
      "A-": 3.7,
      "B+": 3.3,
      B: 3.0,
      "B-": 2.7,
      "C+": 2.3,
      C: 2.0,
      "C-": 1.7,
      "D+": 1.3,
      D: 1.0,
      F: 0.0,
    }
    return gradeMap[grade] || 0.0
  }

  const getGradeColor = (grade) => {
    if (["A+", "A", "A-"].includes(grade)) return "bg-green-100 text-green-800"
    if (["B+", "B", "B-"].includes(grade)) return "bg-blue-100 text-blue-800"
    if (["C+", "C", "C-"].includes(grade)) return "bg-yellow-100 text-yellow-800"
    if (["D+", "D"].includes(grade)) return "bg-orange-100 text-orange-800"
    return "bg-red-100 text-red-800"
  }

  const handleAddRecord = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const student = students.find((s) => s.studentId === newRecord.studentId)
      if (!student) {
        setError("Student not found")
        return
      }

      const gpa = gradeToGPA(newRecord.grade)
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
        gpa,
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

  const calculateStudentGPA = (studentId) => {
    const studentRecords = records.filter((record) => record.studentId === studentId)
    if (studentRecords.length === 0) return 0

    const totalPoints = studentRecords.reduce((sum, record) => sum + record.gpa * record.credits, 0)
    const totalCredits = studentRecords.reduce((sum, record) => sum + record.credits, 0)

    return totalCredits > 0 ? totalPoints / totalCredits : 0
  }

  const deleteRecord = (recordId) => {
    const updatedRecords = records.filter((record) => record.id !== recordId)
    setRecords(updatedRecords)
    localStorage.setItem("srms_academic_records", JSON.stringify(updatedRecords))
    setSuccess("Record deleted successfully!")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button 
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </button>
              <div className="ml-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.477 6.364 9.268 5.129 7.5 4.908c-1.669 0.24-2.83 1.438-2.83 3.254 0 3.108 2.623 4.996 5.757 4.996 3.078 0 5.424-2.356 5.424-5.181 0-2.824-2.346-5.181-5.424-5.181-3.135 0-5.758 1.887-5.758 4.996zm0-4.069c1.176 0 2.256.06 3.354.177a.75.75 0 000-1.493z" />
                </svg>
                <h1 className="text-xl font-semibold text-gray-900">Academic Records</h1>
              </div>
            </div>
            <button 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setShowAddForm(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Record
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success && (
          <div className="mb-6 p-4 border border-green-200 bg-green-50 rounded-md">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Add Record Form */}
        {showAddForm && (
          <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Add Academic Record</h3>
              <p className="mt-1 text-sm text-gray-500">Enter course grade and details for a student</p>
            </div>
            <div className="p-6">
              <form onSubmit={handleAddRecord} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="studentSelect" className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
                    <select
                      id="studentSelect"
                      value={newRecord.studentId}
                      onChange={(e) => setNewRecord((prev) => ({ ...prev, studentId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select student</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.studentId}>
                          {student.firstName} {student.lastName} ({student.studentId})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700 mb-1">Course Code *</label>
                    <input
                      type="text"
                      id="courseCode"
                      value={newRecord.courseCode}
                      onChange={(e) => setNewRecord((prev) => ({ ...prev, courseCode: e.target.value }))}
                      placeholder="e.g., CS101"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">Course Name *</label>
                    <input
                      type="text"
                      id="courseName"
                      value={newRecord.courseName}
                      onChange={(e) => setNewRecord((prev) => ({ ...prev, courseName: e.target.value }))}
                      placeholder="e.g., Introduction to Computer Science"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">Semester *</label>
                    <select
                      id="semester"
                      value={newRecord.semester}
                      onChange={(e) => setNewRecord((prev) => ({ ...prev, semester: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select semester</option>
                      <option value="Fall">Fall</option>
                      <option value="Spring">Spring</option>
                      <option value="Summer">Summer</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                    <input
                      type="number"
                      id="year"
                      value={newRecord.year}
                      onChange={(e) => setNewRecord((prev) => ({ ...prev, year: e.target.value }))}
                      placeholder="e.g., 2024"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">Grade *</label>
                    <select
                      id="grade"
                      value={newRecord.grade}
                      onChange={(e) => setNewRecord((prev) => ({ ...prev, grade: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select grade</option>
                      <option value="A+">A+</option>
                      <option value="A">A</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B">B</option>
                      <option value="B-">B-</option>
                      <option value="C+">C+</option>
                      <option value="C">C</option>
                      <option value="C-">C-</option>
                      <option value="D+">D+</option>
                      <option value="D">D</option>
                      <option value="F">F</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="credits" className="block text-sm font-medium text-gray-700 mb-1">Credits *</label>
                    <input
                      type="number"
                      id="credits"
                      value={newRecord.credits}
                      onChange={(e) => setNewRecord((prev) => ({ ...prev, credits: e.target.value }))}
                      placeholder="e.g., 3"
                      min="1"
                      max="6"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isSubmitting ? "Adding..." : "Add Record"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Records</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="search"
                    placeholder="Search by student, course, or semester..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="studentFilter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Student</label>
                <select
                  id="studentFilter"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All students</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.studentId}>
                      {student.firstName} {student.lastName} ({student.studentId})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Records List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Academic Records ({filteredRecords.length})</h3>
            <p className="mt-1 text-sm text-gray-500">View and manage student grades and course records</p>
          </div>
          <div className="p-6">
            {filteredRecords.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {records.length === 0 ? "No academic records found." : "No records match your search criteria."}
                </p>
                {records.length === 0 && (
                  <button
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setShowAddForm(true)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add First Record
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRecords.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="font-medium text-gray-900">{record.studentName}</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {record.studentId}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(record.grade)}`}>
                            {record.grade}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          <p>{record.courseCode} - {record.courseName}</p>
                          <p>{record.semester} {record.year} • {record.credits} credits</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => {}}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          className="inline-flex items-center px-3 py-1.5 border border-red-200 shadow-sm text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={() => deleteRecord(record.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
