"use client"

import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { ArrowLeft, Search, UserPlus, Edit, Eye } from "lucide-react"
import { AuthGuard } from "../components/AuthGuard"

function StudentListContent() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredStudents, setFilteredStudents] = useState([])

  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem("srms_students") || "[]")
    setStudents(storedStudents)
    setFilteredStudents(storedStudents)
  }, [])

  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.program.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredStudents(filtered)
  }, [searchTerm, students])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getProgramColor = (program) => {
    const colors = {
      "computer-science": "bg-blue-100 text-blue-800",
      "business-admin": "bg-green-100 text-green-800",
      engineering: "bg-purple-100 text-purple-800",
      mathematics: "bg-orange-100 text-orange-800",
      english: "bg-pink-100 text-pink-800",
      psychology: "bg-indigo-100 text-indigo-800",
    }
    return colors[program] || "bg-gray-100 text-gray-800"
  }

  const formatProgramName = (program) => {
    const names = {
      "computer-science": "Computer Science",
      "business-admin": "Business Administration",
      engineering: "Engineering",
      mathematics: "Mathematics",
      english: "English Literature",
      psychology: "Psychology",
    }
    return names[program] || program
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Student Records</h1>
          </div>
          <button
            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            onClick={() => navigate("/students/register")}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add New Student
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Registered Students ({filteredStudents.length})
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Manage and view all registered students
            </p>
          </div>
          <div className="p-6">
            {/* Search */}
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, student ID, or program..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* List */}
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  {students.length === 0
                    ? "No students registered yet."
                    : "No students match your search."}
                </p>
                {students.length === 0 && (
                  <button
                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                    onClick={() => navigate("/students/register")}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register First Student
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {student.firstName} {student.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              ID: {student.studentId}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded ${getProgramColor(
                              student.program
                            )}`}
                          >
                            {formatProgramName(student.program)}
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Email:</span>{" "}
                            {student.email}
                          </div>
                          <div>
                            <span className="font-medium">Phone:</span>{" "}
                            {student.phone}
                          </div>
                          <div>
                            <span className="font-medium">Enrolled:</span>{" "}
                            {formatDate(student.enrollmentDate)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-0 flex space-x-2">
                        <button className="px-3 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </button>
                        <button className="px-3 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
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

export default function StudentListPage() {
  return (
    <AuthGuard allowedRoles={["administrator"]}>
      <StudentListContent />
    </AuthGuard>
  )
}
