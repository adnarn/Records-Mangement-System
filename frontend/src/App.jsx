import { Routes, Route, Navigate } from "react-router-dom"
 import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"
import StudentRegisterPage from "./pages/StudentRegisterPage"
import StudentListPage from "./pages/StudentListPage"
import AcademicRecordsPage from "./pages/AcademicRecordsPage"
import MyRecordsPage from "./pages/MyRecordsPage"
import ReportsPage from "./pages/ReportsPage"
import TranscriptsPage from "./pages/TranscriptsPage"
import AnalyticsPage from "./pages/AnalyticsPage"
import ProfilePage from "./pages/ProfilePage"
import { AuthProvider } from "./hooks/useAuth"

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/students/register" element={<StudentRegisterPage />} />
          <Route path="/students/list" element={<StudentListPage />} />
          <Route path="/academic-records" element={<AcademicRecordsPage />} />
          <Route path="/my-records" element={<MyRecordsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/transcripts" element={<TranscriptsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        <ToastContainer />
      </div>
    </AuthProvider>
  )
}

export default App
