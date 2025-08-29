import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { api } from '../../services/api'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { username, password })
      if (res.status !== 200) throw new Error(res.data?.message || 'Login failed')
      const data = res.data
      const jwt = data.data?.token || data.data?.access_token || data.data?.jwt
      if (!jwt) throw new Error('No token returned')
      login(jwt)
      navigate('/')
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <div className="kicker">Authentication</div>
      <h2 className="page-title">Sign in</h2>
      <div className="panel vstack">
        <form onSubmit={handleSubmit} className="vstack">
          <div className="vstack">
            <label>Username</label>
            <input type="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="vstack">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="hstack" style={{ justifyContent: 'flex-end' }}>
            <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
          </div>
          {error && <div style={{ color: '#ff8a8a' }}>{error}</div>}
        </form>
      </div>
    </div>
  )
}


