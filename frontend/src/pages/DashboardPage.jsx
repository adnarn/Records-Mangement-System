import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { GraduationCap, Users, FileText, BarChart3, LogOut, UserPlus, BookOpen } from "lucide-react"
import { AuthGuard } from "../components/Authguard"

function DashboardContent() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const adminFeatures = [
    {
      title: "Student Registration",
      description: "Add and manage student records",
      icon: UserPlus,
      href: "/students/register",
      color: "#3b82f6", // blue-500
    },
    {
      title: "Student Records",
      description: "View and manage all students",
      icon: Users,
      href: "/students/list",
      color: "#6366f1", // indigo-500
    },
    {
      title: "Academic Records",
      description: "Manage grades and course records",
      icon: BookOpen,
      href: "/academic-records",
      color: "#10b981", // green-500
    },
    {
      title: "Generate Reports",
      description: "Create transcripts and academic reports",
      icon: FileText,
      href: "/reports",
      color: "#8b5cf6", // purple-500
    },
    {
      title: "System Analytics",
      description: "View system statistics and insights",
      icon: BarChart3,
      href: "/analytics",
      color: "#f97316", // orange-500
    },
  ]

  const studentFeatures = [
    {
      title: "My Profile",
      description: "View and update personal information",
      icon: Users,
      href: "/profile",
      color: "#3b82f6", // blue-500
    },
    {
      title: "Academic Records",
      description: "View grades and course history",
      icon: BookOpen,
      href: "/my-records",
      color: "#10b981", // green-500
    },
    {
      title: "Transcripts",
      description: "Download official transcripts",
      icon: FileText,
      href: "/transcripts",
      color: "#8b5cf6", // purple-500
    },
  ]

  const features = user?.role === "administrator" ? adminFeatures : studentFeatures

  const handleFeatureClick = (href) => {
    navigate(href)
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'box-shadow 0.2s ease-in-out',
    cursor: 'pointer',
    overflow: 'hidden',
  }

  const cardHoverStyle = {
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  }

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.4rem 0.8rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    backgroundColor: 'transparent',
    color: '#374151',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  }

  const buttonHoverStyle = {
    backgroundColor: '#f3f4f6',
    borderColor: '#9ca3af',
  }

  const outlineButtonStyle = {
    width: '100%',
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    backgroundColor: 'transparent',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s',
  }

  const outlineButtonHoverStyle = {
    backgroundColor: '#f9fafb',
    borderColor: '#9ca3af',
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#fff',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        borderBottom: '1px solid #e5e7eb',
      }}>
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '0 1rem',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '4rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <GraduationCap style={{ height: '2rem', width: '2rem', color: '#2563eb', marginRight: '0.75rem' }} />
              <h1 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#111827',
                margin: 0,
              }}>
                Student Records Management System
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>Welcome, {user?.name}</span>
              <button 
                onClick={handleLogout}
                style={buttonStyle}
                onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = '#d1d5db';
                }}
              >
                <LogOut style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '80rem',
        margin: '0 auto',
        padding: '2rem 1rem',
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#111827',
            margin: '0 0 0.5rem 0',
          }}>
            {user?.role === "administrator" ? "Administrator Dashboard" : "Student Dashboard"}
          </h2>
          <p style={{
            color: '#6b7280',
            margin: 0,
          }}>
            {user?.role === "administrator"
              ? "Manage student records and generate reports"
              : "Access your academic information and records"}
          </p>
        </div>

        {/* Feature Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                style={{
                  ...cardStyle,
                  ':hover': cardHoverStyle,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = cardHoverStyle.boxShadow;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = cardStyle.boxShadow;
                }}
                onClick={() => handleFeatureClick(feature.href)}
              >
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{
                      backgroundColor: feature.color,
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      marginRight: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Icon style={{ height: '1.5rem', width: '1.5rem', color: 'white' }} />
                    </div>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: '#111827',
                      margin: 0,
                    }}>
                      {feature.title}
                    </h3>
                  </div>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    margin: '0.5rem 0 1rem 0',
                  }}>
                    {feature.description}
                  </p>
                  <button
                    style={{
                      ...outlineButtonStyle,
                      ':hover': outlineButtonHoverStyle,
                    }}
                    onMouseOver={(e) => Object.assign(e.target.style, outlineButtonHoverStyle)}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.borderColor = '#d1d5db';
                    }}
                  >
                    Access Module
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
