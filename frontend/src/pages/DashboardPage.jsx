import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { GraduationCap, Users, FileText, BarChart3, UserPlus, BookOpen } from "lucide-react"
import { AuthGuard } from "../components/AuthGuard.jsx"
import Navbar from "../components/Navbar"

function DashboardContent() {
  const { user } = useAuth()
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <GraduationCap className="h-6 w-6 text-blue-500 mr-3" />
              <h1 className="text-lg font-bold text-gray-900">
                Student Records Management System
              </h1>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-4">
                Welcome, {user?.name}
              </span>
              <button
                className="bg-white hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 border border-gray-300 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {user?.role === "administrator" ? "Administrator Dashboard" : "Student Dashboard"}
          </h2>
          <p className="text-gray-600">
            {user?.role === "administrator"
              ? "Manage student records and generate reports"
              : "Access your academic information and records"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer"
                onClick={() => handleFeatureClick(feature.href)}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div
                      className="p-2 rounded-lg mr-3 flex-shrink-0"
                      style={{ backgroundColor: feature.color }}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {feature.description}
                  </p>
                  <button
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Access Module
                  </button>
                </div>
              </div>
            )
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
