import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './utils/AuthContext.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { SignupPage } from './pages/SignupPage.jsx'
import { TasksPage } from './pages/TasksPage.jsx'

function ProtectedRoute({ children }) {
  const { tokenReady, token } = useAuth()
  if (!tokenReady) return null
  if (!token) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const { tokenReady, token } = useAuth()

  if (!tokenReady) return null

  return (
    <Routes>
      <Route path="/" element={<Navigate to={token ? '/app' : '/login'} replace />} />
      <Route path="/login" element={token ? <Navigate to="/app" replace /> : <LoginPage />} />
      <Route path="/signup" element={token ? <Navigate to="/app" replace /> : <SignupPage />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <TasksPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
