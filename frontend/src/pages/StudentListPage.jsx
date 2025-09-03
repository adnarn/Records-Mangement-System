"use client"

import { useNavigate } from "react-router-dom"
import { AuthGuard } from "../components/Authguard"
import { useState, useEffect } from "react"
import { ArrowLeft, Search, UserPlus, Edit, Eye } from "lucide-react"

// Inline styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb'
  },
  header: {
    backgroundColor: 'white',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    borderBottom: '1px solid #e5e7eb',
    padding: '0 1rem'
  },
  button: {
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid transparent',
    fontSize: '0.875rem',
    fontWeight: 500,
    transition: 'all 0.2s',
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  },
  buttonPrimary: {
    backgroundColor: '#2563eb',
    color: 'white',
    '&:hover': {
      backgroundColor: '#1d4ed8'
    }
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderColor: '#d1d5db',
    color: '#374151',
    '&:hover': {
      backgroundColor: '#f3f4f6'
    }
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    marginBottom: '2rem'
  },
  cardHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid #e5e7eb'
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#111827',
    margin: 0
  },
  cardDescription: {
    marginTop: '0.5rem',
    color: '#6b7280',
    fontSize: '0.875rem'
  },
  cardContent: {
    padding: '1.5rem'
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '0.5rem 0.75rem 0.5rem 2.5rem',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    '&:focus': {
      outline: 'none',
      borderColor: '#93c5fd',
      boxShadow: '0 0 0 1px #93c5fd'
    }
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '0.375rem',
    padding: '0.25rem 0.5rem',
    fontSize: '0.75rem',
    fontWeight: 500,
    lineHeight: '1'
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    marginRight: '0.5rem',
    height: '1rem',
    width: '1rem'
  },
  iconLg: {
    marginRight: '0.5rem',
    height: '1.5rem',
    width: '1.5rem'
  },
  grid: {
    display: 'grid',
    gap: '1rem'
  },
  gridCols1: {
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))'
  },
  gridCols2: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))'
  },
  gridCols3: {
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))'
  },
  spaceY4: {
    '& > * + *': {
      marginTop: '1rem'
    }
  },
  spaceX2: {
    '& > * + *': {
      marginLeft: '0.5rem'
    }
  },
  spaceX4: {
    '& > * + *': {
      marginLeft: '1rem'
    }
  },
  mb6: {
    marginBottom: '1.5rem'
  },
  mt4: {
    marginTop: '1rem'
  },
  ml4: {
    marginLeft: '1rem'
  },
  textXl: {
    fontSize: '1.25rem',
    lineHeight: '1.75rem'
  },
  textSm: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem'
  },
  fontSemibold: {
    fontWeight: 600
  },
  textGray900: {
    color: '#111827'
  },
  textGray600: {
    color: '#4b5563'
  },
  maxW7xl: {
    maxWidth: '80rem'
  },
  mxAuto: {
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  px4: {
    paddingLeft: '1rem',
    paddingRight: '1rem'
  },
  py8: {
    paddingTop: '2rem',
    paddingBottom: '2rem'
  },
  h16: {
    height: '4rem'
  },
  justifyBetween: {
    justifyContent: 'space-between'
  },
  itemsCenter: {
    alignItems: 'center'
  },
  relative: {
    position: 'relative'
  },
  absolute: {
    position: 'absolute'
  },
  insetY0: {
    top: 0,
    bottom: 0
  },
  left3: {
    left: '0.75rem'
  },
  top3: {
    top: '0.75rem'
  },
  textCenter: {
    textAlign: 'center'
  },
  border: {
    border: '1px solid #e5e7eb'
  },
  roundedLg: {
    borderRadius: '0.5rem'
  },
  p4: {
    padding: '1rem'
  },
  hoverBgGray50: {
    ':hover': {
      backgroundColor: '#f9fafb'
    }
  },
  '@media (min-width: 640px)': {
    smPx6: {
      paddingLeft: '1.5rem',
      paddingRight: '1.5rem'
    }
  },
  '@media (min-width: 768px)': {
    mdGridCols2: {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))'
    },
    mdGridCols3: {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))'
    }
  },
  '@media (min-width: 1024px)': {
    lgPx8: {
      paddingLeft: '2rem',
      paddingRight: '2rem'
    }
  }
}

function StudentListContent() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredStudents, setFilteredStudents] = useState([])

  useEffect(() => {
    // Load students from localStorage
    const storedStudents = JSON.parse(localStorage.getItem("srms_students") || "[]")
    setStudents(storedStudents)
    setFilteredStudents(storedStudents)
  }, [])

  useEffect(() => {
    // Filter students based on search term
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
      "computer-science": { backgroundColor: '#dbeafe', color: '#1e40af' },
      "business-admin": { backgroundColor: '#dcfce7', color: '#166534' },
      engineering: { backgroundColor: '#f3e8ff', color: '#6b21a8' },
      mathematics: { backgroundColor: '#ffedd5', color: '#9a3412' },
      english: { backgroundColor: '#fce7f3', color: '#9d174d' },
      psychology: { backgroundColor: '#e0e7ff', color: '#3730a3' }
    }
    return colors[program] || { backgroundColor: '#f3f4f6', color: '#374151' }
  }

  const formatProgramName = (program) => {
    const names = {
      "computer-science": "Computer Science",
      "business-admin": "Business Administration",
      engineering: "Engineering",
      mathematics: "Mathematics",
      english: "English Literature",
      psychology: "Psychology"
    }
    return names[program] || program
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={{...styles.maxW7xl, ...styles.mxAuto, ...styles.px4, ...styles.smPx6, ...styles.lgPx8}}>
          <div style={{...styles.flexCenter, ...styles.justifyBetween, ...styles.h16}}>
            <div style={styles.flexCenter}>
              <button 
                style={{...styles.button, ...styles.buttonOutline, ...styles.flexCenter}}
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft style={styles.icon} />
                Back to Dashboard
              </button>
              <div style={styles.ml4}>
                <h1 style={{...styles.textXl, ...styles.fontSemibold, ...styles.textGray900, margin: 0}}>
                  Student Records
                </h1>
              </div>
            </div>
            <button 
              style={{...styles.button, ...styles.buttonPrimary, ...styles.flexCenter}}
              onClick={() => navigate("/students/register")}
            >
              <UserPlus style={styles.icon} />
              Add New Student
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{...styles.maxW7xl, ...styles.mxAuto, ...styles.px4, ...styles.smPx6, ...styles.lgPx8, ...styles.py8}}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Registered Students ({filteredStudents.length})</h2>
            <p style={styles.cardDescription}>Manage and view all registered students</p>
          </div>
          <div style={styles.cardContent}>
            {/* Search */}
            <div style={styles.mb6}>
              <div style={styles.relative}>
                <Search style={{...styles.absolute, ...styles.left3, ...styles.top3, height: '1rem', width: '1rem', color: '#9ca3af'}} />
                <input
                  type="text"
                  placeholder="Search by name, email, student ID, or program..."
                  style={styles.input}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Students List */}
            {filteredStudents.length === 0 ? (
              <div style={{...styles.textCenter, ...styles.py8}}>
                <p style={{...styles.textGray600, margin: 0}}>
                  {students.length === 0 ? "No students registered yet." : "No students match your search."}
                </p>
                {students.length === 0 && (
                  <button 
                    style={{...styles.button, ...styles.buttonPrimary, ...styles.flexCenter, ...styles.mt4, margin: '0 auto'}}
                    onClick={() => navigate("/students/register")}
                  >
                    <UserPlus style={styles.icon} />
                    Register First Student
                  </button>
                )}
              </div>
            ) : (
              <div style={styles.spaceY4}>
                {filteredStudents.map((student) => {
                  const programColor = getProgramColor(student.program);
                  return (
                    <div 
                      key={student.id} 
                      style={{
                        ...styles.border,
                        ...styles.roundedLg,
                        ...styles.p4,
                        ...styles.hoverBgGray50,
                        transition: 'background-color 0.2s',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{...styles.flexCenter, ...styles.justifyBetween}}>
                        <div style={{ flex: 1 }}>
                          <div style={{...styles.flexCenter, gap: '1rem'}}>
                            <div>
                              <h3 style={{...styles.fontSemibold, ...styles.textGray900, margin: 0}}>
                                {student.firstName} {student.lastName}
                              </h3>
                              <p style={{...styles.textSm, ...styles.textGray600, margin: '0.25rem 0 0 0'}}>
                                ID: {student.studentId}
                              </p>
                            </div>
                            <span 
                              style={{
                                ...styles.badge,
                                backgroundColor: programColor.backgroundColor,
                                color: programColor.color
                              }}
                            >
                              {formatProgramName(student.program)}
                            </span>
                          </div>
                          <div style={{
                            ...styles.grid,
                            ...styles.gridCols1,
                            ...styles.mdGridCols3,
                            gap: '1rem',
                            marginTop: '0.5rem',
                            ...styles.textSm,
                            ...styles.textGray600
                          }}>
                            <div>
                              <span style={styles.fontSemibold}>Email:</span> {student.email}
                            </div>
                            <div>
                              <span style={styles.fontSemibold}>Phone:</span> {student.phone}
                            </div>
                            <div>
                              <span style={styles.fontSemibold}>Enrolled:</span> {formatDate(student.enrollmentDate)}
                            </div>
                          </div>
                        </div>
                        <div style={{...styles.flexCenter, ...styles.spaceX2}}>
                          <button style={{...styles.button, ...styles.buttonOutline, ...styles.flexCenter}}>
                            <Eye style={{...styles.icon, height: '1rem', width: '1rem', marginRight: '0.25rem'}} />
                            View
                          </button>
                          <button style={{...styles.button, ...styles.buttonOutline, ...styles.flexCenter}}>
                            <Edit style={{...styles.icon, height: '1rem', width: '1rem', marginRight: '0.25rem'}} />
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
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
