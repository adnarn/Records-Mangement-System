"use client"

import { useNavigate } from "react-router-dom"
import { AuthGuard } from "../components/AuthGuard.jsx"
import { useState } from "react"
import { ArrowLeft, Save, UserPlus } from "lucide-react"

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
  formGroup: {
    marginBottom: '1.5rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#374151'
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    '&:focus': {
      outline: 'none',
      ring: '1px solid #93c5fd',
      borderColor: '#93c5fd'
    }
  },
  textarea: {
    display: 'block',
    width: '100%',
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    '&:focus': {
      outline: 'none',
      ring: '1px solid #93c5fd',
      borderColor: '#93c5fd'
    }
  },
  select: {
    display: 'block',
    width: '100%',
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    backgroundColor: 'white',
    '&:focus': {
      outline: 'none',
      ring: '1px solid #93c5fd',
      borderColor: '#93c5fd'
    }
  },
  alert: {
    padding: '1rem',
    borderRadius: '0.375rem',
    marginBottom: '1.5rem'
  },
  alertSuccess: {
    backgroundColor: '#ecfdf5',
    border: '1px solid #a7f3d0',
    color: '#065f46'
  },
  alertError: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#b91c1c'
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
  spaceY6: {
    '& > * + *': {
      marginTop: '1.5rem'
    }
  },
  spaceX4: {
    '& > * + *': {
      marginLeft: '1rem'
    }
  },
  pt6: {
    paddingTop: '1.5rem'
  },
  mb4: {
    marginBottom: '1rem'
  },
  mb6: {
    marginBottom: '1.5rem'
  },
  ml4: {
    marginLeft: '1rem'
  },
  textXl: {
    fontSize: '1.25rem',
    lineHeight: '1.75rem'
  },
  textLg: {
    fontSize: '1.125rem',
    lineHeight: '1.75rem'
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
  maxW4xl: {
    maxWidth: '56rem'
  },
  mxAuto: {
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  px4: {
    paddingLeft: '1rem',
    paddingRight: '1rem'
  },
  smPx6: {
    '@media (min-width: 640px)': {
      paddingLeft: '1.5rem',
      paddingRight: '1.5rem'
    }
  },
  lgPx8: {
    '@media (min-width: 1024px)': {
      paddingLeft: '2rem',
      paddingRight: '2rem'
    }
  },
  py8: {
    paddingTop: '2rem',
    paddingBottom: '2rem'
  },
  h16: {
    height: '4rem'
  },
  justifyEnd: {
    justifyContent: 'flex-end'
  },
  itemsCenter: {
    alignItems: 'center'
  },
  hidden: {
    display: 'none'
  },
  '@media (min-width: 768px)': {
    mdBlock: {
      display: 'block'
    },
    mdGridCols2: {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))'
    },
    mdGridCols3: {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))'
    }
  }
}

function StudentRegistrationContent() {
  const navigate = useNavigate()
  const [studentData, setStudentData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    emergencyContact: "",
    emergencyPhone: "",
    program: "",
    enrollmentDate: "",
    studentId: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const generateStudentId = () => {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
    return `STU${year}${random}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Generate student ID if not provided
      const finalData = {
        ...studentData,
        studentId: studentData.studentId || generateStudentId(),
      }

      // Mock API call - in real app this would save to MongoDB
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Store in localStorage for demo purposes
      const existingStudents = JSON.parse(localStorage.getItem("srms_students") || "[]")
      existingStudents.push({
        ...finalData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      })
      localStorage.setItem("srms_students", JSON.stringify(existingStudents))

      setSuccess(true)
      // Reset form
      setStudentData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        emergencyContact: "",
        emergencyPhone: "",
        program: "",
        enrollmentDate: "",
        studentId: "",
      })
    } catch (err) {
      setError("Failed to register student. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setStudentData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={{...styles.maxW7xl, ...styles.mxAuto, ...styles.px4, ...styles.smPx6, ...styles.lgPx8}}>
          <div style={{...styles.flexCenter, ...styles.h16}}>
            <button 
              style={{...styles.button, ...styles.buttonOutline, ...styles.flexCenter}}
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft style={styles.icon} />
              Back to Dashboard
            </button>
            <div style={{...styles.flexCenter, ...styles.ml4}}>
              <UserPlus style={{...styles.iconLg, color: '#2563eb'}} />
              <h1 style={{...styles.textXl, ...styles.fontSemibold, ...styles.textGray900, margin: 0}}>Student Registration</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{...styles.maxW4xl, ...styles.mxAuto, ...styles.px4, ...styles.smPx6, ...styles.lgPx8, ...styles.py8}}>
        {success && (
          <div style={{...styles.alert, ...styles.alertSuccess, ...styles.mb6}}>
            <p style={{margin: 0}}>
              Student registered successfully! Student ID: {studentData.studentId || "Generated automatically"}
            </p>
          </div>
        )}

        {error && (
          <div style={{...styles.alert, ...styles.alertError, ...styles.mb6}}>
            <p style={{margin: 0}}>{error}</p>
          </div>
        )}

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>New Student Registration</h2>
            <p style={styles.cardDescription}>Enter student bio-data and enrollment information</p>
          </div>
          <div style={styles.cardContent}>
            <form onSubmit={handleSubmit} style={styles.spaceY6}>
              {/* Personal Information */}
              <div style={styles.spaceY6}>
                <h3 style={{...styles.textLg, ...styles.fontMedium, ...styles.textGray900, ...styles.mb4}}>Personal Information</h3>
                <div style={{...styles.grid, ...styles.gridCols1, ...styles.mdGridCols2, gap: '1rem'}}>
                  <div style={styles.formGroup}>
                    <label htmlFor="firstName" style={styles.label}>First Name *</label>
                    <input
                      id="firstName"
                      type="text"
                      style={styles.input}
                      value={studentData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label htmlFor="lastName" style={styles.label}>Last Name *</label>
                    <input
                      id="lastName"
                      type="text"
                      style={styles.input}
                      value={studentData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label htmlFor="email" style={styles.label}>Email Address *</label>
                    <input
                      id="email"
                      type="email"
                      style={styles.input}
                      value={studentData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label htmlFor="phone" style={styles.label}>Phone Number *</label>
                    <input
                      id="phone"
                      type="tel"
                      style={styles.input}
                      value={studentData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label htmlFor="dateOfBirth" style={styles.label}>Date of Birth *</label>
                    <input
                      id="dateOfBirth"
                      type="date"
                      style={styles.input}
                      value={studentData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label htmlFor="gender" style={styles.label}>Gender *</label>
                    <select
                      id="gender"
                      style={styles.select}
                      value={studentData.gender}
                      onChange={(e) => handleInputChange("gender", e.target.value)}
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div style={styles.spaceY6}>
                <h3 style={{...styles.textLg, ...styles.fontMedium, ...styles.textGray900, ...styles.mb4}}>Address Information</h3>
                <div style={{...styles.spaceY4}}>
                  <div style={styles.formGroup}>
                    <label htmlFor="address" style={styles.label}>Street Address *</label>
                    <textarea
                      id="address"
                      style={{...styles.textarea, minHeight: '5rem'}}
                      value={studentData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      rows={2}
                      required
                    />
                  </div>
                  <div style={{...styles.grid, ...styles.gridCols1, ...styles.mdGridCols3, gap: '1rem'}}>
                    <div style={styles.formGroup}>
                      <label htmlFor="city" style={styles.label}>City *</label>
                      <input
                        id="city"
                        type="text"
                        style={styles.input}
                        value={studentData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        required
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label htmlFor="state" style={styles.label}>State *</label>
                      <input
                        id="state"
                        type="text"
                        style={styles.input}
                        value={studentData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        required
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label htmlFor="zipCode" style={styles.label}>ZIP Code *</label>
                      <input
                        id="zipCode"
                        type="text"
                        style={styles.input}
                        value={studentData.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div style={styles.spaceY6}>
                <h3 style={{...styles.textLg, ...styles.fontMedium, ...styles.textGray900, ...styles.mb4}}>Emergency Contact</h3>
                <div style={{...styles.grid, ...styles.gridCols1, ...styles.mdGridCols2, gap: '1rem'}}>
                  <div style={styles.formGroup}>
                    <label htmlFor="emergencyContact" style={styles.label}>Contact Name *</label>
                    <input
                      id="emergencyContact"
                      type="text"
                      style={styles.input}
                      value={studentData.emergencyContact}
                      onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label htmlFor="emergencyPhone" style={styles.label}>Contact Phone *</label>
                    <input
                      id="emergencyPhone"
                      type="tel"
                      style={styles.input}
                      value={studentData.emergencyPhone}
                      onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div style={styles.spaceY6}>
                <h3 style={{...styles.textLg, ...styles.fontMedium, ...styles.textGray900, ...styles.mb4}}>Academic Information</h3>
                <div style={{...styles.grid, ...styles.gridCols1, ...styles.mdGridCols2, gap: '1rem'}}>
                  <div style={styles.formGroup}>
                    <label htmlFor="program" style={styles.label}>Program/Course *</label>
                    <select
                      id="program"
                      style={styles.select}
                      value={studentData.program}
                      onChange={(e) => handleInputChange("program", e.target.value)}
                      required
                    >
                      <option value="">Select program</option>
                      <option value="computer-science">Computer Science</option>
                      <option value="business-admin">Business Administration</option>
                      <option value="engineering">Engineering</option>
                      <option value="mathematics">Mathematics</option>
                      <option value="english">English Literature</option>
                      <option value="psychology">Psychology</option>
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label htmlFor="enrollmentDate" style={styles.label}>Enrollment Date *</label>
                    <input
                      id="enrollmentDate"
                      type="date"
                      style={styles.input}
                      value={studentData.enrollmentDate}
                      onChange={(e) => handleInputChange("enrollmentDate", e.target.value)}
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label htmlFor="studentId" style={styles.label}>Student ID (Optional)</label>
                    <input
                      id="studentId"
                      type="text"
                      style={styles.input}
                      value={studentData.studentId}
                      onChange={(e) => handleInputChange("studentId", e.target.value)}
                      placeholder="Leave blank to auto-generate"
                    />
                  </div>
                </div>
              </div>

              <div style={{...styles.flexCenter, ...styles.justifyEnd, ...styles.spaceX4, ...styles.pt6}}>
                <button 
                  type="button" 
                  style={{...styles.button, ...styles.buttonOutline}}
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{...styles.button, ...styles.buttonPrimary}}
                  disabled={isSubmitting}
                >
                  <Save style={{...styles.icon, height: '1rem', width: '1rem'}} />
                  {isSubmitting ? "Registering..." : "Register Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function StudentRegisterPage() {
  return (
    <AuthGuard allowedRoles={["administrator"]}>
      <StudentRegistrationContent />
    </AuthGuard>
  )
}
