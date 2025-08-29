import { Route, Routes, Navigate, Link } from 'react-router-dom'
import { LoginPage } from './modules/auth/LoginPage'
import { UploadPage } from './modules/videos/UploadPage'
import { VideosPage } from './modules/videos/VideosPage'
import { useAuth } from './modules/auth/AuthContext'

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  return (
    <nav className="navbar">
      <Link to="/">Videos</Link>
      {isAuthenticated && <Link to="/upload">Upload</Link>}
      <div className="spacer" />
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  )
}

export function App() {
  return (
    <div>
      <Navbar />
      <div className="container vstack">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<VideosPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}


