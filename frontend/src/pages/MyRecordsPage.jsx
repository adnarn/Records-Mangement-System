"use client"

import { useNavigate } from "react-router-dom"
import { AuthGuard } from "../components/AuthGuard.jsx"
import { useAuth } from "../hooks/useAuth"
import { useState, useEffect } from "react"
import { ArrowLeft, BookOpen, Download } from "lucide-react"

function MyRecordsContent() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.studentId) {
      const storedRecords = JSON.parse(localStorage.getItem("srms_academic_records") || "[]")
      const studentRecords = storedRecords.filter((record) => record.studentId === user.studentId)
      setRecords(studentRecords)
    }
    setLoading(false)
  }, [user])

  const getGradeColor = (grade) => {
    if (["A+", "A", "A-"].includes(grade)) return "bg-green-100 text-green-800"
    if (["B+", "B", "B-"].includes(grade)) return "bg-blue-100 text-blue-800"
    if (["C+", "C", "C-"].includes(grade)) return "bg-yellow-100 text-yellow-800"
    if (["D+", "D"].includes(grade)) return "bg-orange-100 text-orange-800"
    return "bg-red-100 text-red-800"
  }

  const calculateGPA = () => {
    if (records.length === 0) return 0
    const totalPoints = records.reduce((sum, record) => sum + record.gpa * record.credits, 0)
    const totalCredits = records.reduce((sum, record) => sum + record.credits, 0)
    return totalCredits > 0 ? totalPoints / totalCredits : 0
  }

  const getTotalCredits = () => {
    return records.reduce((sum, record) => sum + record.credits, 0)
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const groupedRecords = groupRecordsBySemester()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                className="flex items-center px-3 py-1 text-sm border rounded hover:bg-gray-100"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </button>
              <div className="ml-4 flex items-center">
                <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
                <h1 className="text-xl font-semibold text-gray-900">My Academic Records</h1>
              </div>
            </div>
            <button
              className="flex items-center px-3 py-1 text-sm border rounded hover:bg-gray-100"
              onClick={() => navigate("/transcripts")}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Transcript
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow rounded p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall GPA</h3>
            <p className="text-3xl font-bold text-blue-600">{calculateGPA().toFixed(2)}</p>
          </div>
          <div className="bg-white shadow rounded p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Credits</h3>
            <p className="text-3xl font-bold text-green-600">{getTotalCredits()}</p>
          </div>
          <div className="bg-white shadow rounded p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Courses Completed</h3>
            <p className="text-3xl font-bold text-purple-600">{records.length}</p>
          </div>
        </div>

        {/* Academic Records */}
        {Object.keys(groupedRecords).length === 0 ? (
          <div className="bg-white shadow rounded p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Academic Records</h3>
            <p className="text-gray-600">
              Your academic records will appear here once grades are entered by administrators.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedRecords)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([semester, semesterRecords]) => (
                <div key={semester} className="bg-white shadow rounded p-6">
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold">{semester}</h2>
                    <p className="text-sm text-gray-600">
                      {semesterRecords.length} courses •{" "}
                      {semesterRecords.reduce((sum, r) => sum + r.credits, 0)} credits
                    </p>
                  </div>
                  <div className="space-y-3">
                    {semesterRecords.map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-medium text-gray-900">
                              {record.courseCode} - {record.courseName}
                            </h4>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded ${getGradeColor(record.grade)}`}
                            >
                              {record.grade}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {record.credits} credits • GPA Points: {record.gpa.toFixed(1)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t flex justify-between text-sm">
                    <span className="font-medium">Semester GPA:</span>
                    <span className="font-bold">
                      {(
                        semesterRecords.reduce((sum, r) => sum + r.gpa * r.credits, 0) /
                        semesterRecords.reduce((sum, r) => sum + r.credits, 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default function MyRecordsPage() {
  return (
    <AuthGuard allowedRoles={["student"]}>
      <MyRecordsContent />
    </AuthGuard>
  )
}
