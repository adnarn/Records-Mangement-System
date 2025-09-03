"use client"

import { useNavigate } from "react-router-dom"
import { AuthGuard } from "../components/Authguard"
import { useState, useEffect } from "react"
import { ArrowLeft, BarChart3, Users, BookOpen, FileText, TrendingUp } from "lucide-react"
import "./AnalyticsPage.css"

function AnalyticsContent() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalRecords: 0,
    averageGPA: 0,
    programDistribution: {},
    gradeDistribution: {},
  })

  useEffect(() => {
    // Load and calculate statistics
    const students = JSON.parse(localStorage.getItem("srms_students") || "[]")
    const records = JSON.parse(localStorage.getItem("srms_academic_records") || "[]")

    // Calculate program distribution
    const programDist = students.reduce((acc, student) => {
      acc[student.program] = (acc[student.program] || 0) + 1
      return acc
    }, {})

    // Calculate grade distribution
    const gradeDist = records.reduce((acc, record) => {
      acc[record.grade] = (acc[record.grade] || 0) + 1
      return acc
    }, {})

    // Calculate average GPA
    const totalGPA = records.reduce((sum, record) => sum + record.gpa, 0)
    const avgGPA = records.length > 0 ? totalGPA / records.length : 0

    // Get unique courses
    const uniqueCourses = new Set(records.map((record) => record.courseCode))

    setStats({
      totalStudents: students.length,
      totalCourses: uniqueCourses.size,
      totalRecords: records.length,
      averageGPA: avgGPA,
      programDistribution: programDist,
      gradeDistribution: gradeDist,
    })
  }, [])

  const formatProgramName = (program) => {
    return program.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="analytics-header">
        <div className="header-container">
          <div className="header-content">
            <button className="back-button" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="icon" />
              <span>Back to Dashboard</span>
            </button>
            <div className="header-title">
              <BarChart3 className="icon" />
              <h1>System Analytics</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <Users className="stat-icon blue" />
              <div className="stat-details">
                <p className="stat-value">{stats.totalStudents}</p>
                <p className="stat-label">Total Students</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <BookOpen className="stat-icon green" />
              <div className="stat-details">
                <p className="stat-value">{stats.totalCourses}</p>
                <p className="stat-label">Active Courses</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <FileText className="stat-icon purple" />
              <div className="stat-details">
                <p className="stat-value">{stats.totalRecords}</p>
                <p className="stat-label">Academic Records</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <TrendingUp className="stat-icon orange" />
              <div className="stat-details">
                <p className="stat-value">{stats.averageGPA.toFixed(2)}</p>
                <p className="stat-label">Average GPA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Program Distribution */}
        <div className="distribution-grid">
          <div className="distribution-card">
            <div className="card-header">
              <h3>Program Distribution</h3>
              <p>Number of students by program</p>
            </div>
            <div className="card-content">
              {Object.entries(stats.programDistribution).map(([program, count]) => (
                <div key={program} className="distribution-item">
                  <span className="distribution-label">{formatProgramName(program)}</span>
                  <div className="distribution-bar-container">
                    <div 
                      className="distribution-bar blue"
                      style={{
                        width: `${(count / stats.totalStudents) * 100}%`,
                      }}
                    ></div>
                    <span className="distribution-count">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="distribution-card">
            <div className="card-header">
              <h3>Grade Distribution</h3>
              <p>Distribution of grades across all courses</p>
            </div>
            <div className="card-content">
              {Object.entries(stats.gradeDistribution)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([grade, count]) => (
                  <div key={grade} className="distribution-item">
                    <span className="distribution-label">{grade}</span>
                    <div className="distribution-bar-container">
                      <div 
                        className="distribution-bar green"
                        style={{
                          width: `${(count / (stats.totalRecords || 1)) * 100}%`,
                        }}
                      ></div>
                      <span className="distribution-count">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <AuthGuard allowedRoles={["administrator"]}>
      <AnalyticsContent />
    </AuthGuard>
  )
}
