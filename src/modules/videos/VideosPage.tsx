import { useEffect, useMemo, useState } from 'react'
import { api, getApiBaseUrl } from '../../services/api'

type VideoItem = {
  id: string
  title?: string
  objectKey: string
  playbackUrl?: string
  createdAt?: string
}

export function VideosPage() {
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchVideos(q: string) {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/videos', { params: q ? { q } : {} })
      setItems(res.data?.items || res.data || [])
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos('')
  }, [])

  const base = useMemo(() => getApiBaseUrl(), [])

  return (
    <div className="container vstack">
      <div className="kicker">Library</div>
      <h2 className="page-title">Videos</h2>
      <div className="panel vstack">
        <div className="hstack">
          <input
            placeholder="Search by title/object key"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={() => fetchVideos(query)} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {error && <div style={{ color: '#ff8a8a' }}>{error}</div>}
      </div>
      <div className="grid">
        {items.map((v) => {
          const url = v.playbackUrl || `${base}/videos/${encodeURIComponent(v.id)}/stream`
          return (
            <div key={v.id} className="video-item">
              <div className="title">{v.title || v.objectKey}</div>
              <video src={url} controls />
              {v.createdAt && (
                <div className="meta">{new Date(v.createdAt).toLocaleString()}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}


