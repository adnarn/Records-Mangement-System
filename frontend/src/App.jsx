import { Routes, Route, Navigate, Outlet } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import StudentRegisterPage from "./pages/StudentRegisterPage"
import StudentListPage from "./pages/StudentListPage"
import AcademicRecordsPage from "./pages/AcademicRecordsPage"
import MyRecordsPage from "./pages/MyRecordsPage"
import ReportsPage from "./pages/ReportsPage"
import TranscriptsPage from "./pages/TranscriptsPage"
import AnalyticsPage from "./pages/AnalyticsPage"
import ProfilePage from "./pages/ProfilePage"
import { useAuth } from "./hooks/useAuth"

// Protected route component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }

  // Check role if required
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children || <Outlet />;
};

// Public route component (for login/register when already authenticated)
const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } 
        />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/my-records" element={<MyRecordsPage />} />
          <Route path="/transcripts" element={<TranscriptsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Admin protected routes */}
        <Route element={<ProtectedRoute requiredRole="administrator" />}>
          <Route path="/students/register" element={<StudentRegisterPage />} />
          <Route path="/students/list" element={<StudentListPage />} />
          <Route path="/academic-records" element={<AcademicRecordsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>

        {/* Catch all other routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default App
