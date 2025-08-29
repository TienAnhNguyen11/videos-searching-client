import { FormEvent, useState } from 'react'
import { api } from '../../services/api'

type PresignResponse = {
  uploadUrl: string
  objectKey: string
  headers?: Record<string, string>
}

export function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [progress, setProgress] = useState<number>(0)

  async function requestPresign(name: string, type: string, size: number) {
    const res = await api.post<PresignResponse>('/videos/presign', {
      filename: name,
      contentType: type,
      size
    })
    return res.data
  }

  async function handleUpload(e: FormEvent) {
    e.preventDefault()
    if (!file) return
    setStatus('Requesting upload URL...')
    try {
      const { uploadUrl, headers } = await requestPresign(file.name, file.type, file.size)
      setStatus('Uploading to storage...')

      const putRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
          ...(headers || {})
        },
        body: file
      })

      if (!putRes.ok) throw new Error(`Upload failed: ${putRes.status}`)

      setProgress(100)
      setStatus('Upload successful')
    } catch (err: any) {
      setStatus(err?.message || 'Upload failed')
    }
  }

  return (
    <div className="container" style={{ maxWidth: 700 }}>
      <div className="kicker">Upload</div>
      <h2 className="page-title">Upload a video</h2>
      <div className="panel vstack">
        <form onSubmit={handleUpload} className="vstack">
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <div className="hstack" style={{ justifyContent: 'flex-end' }}>
            <button type="submit" disabled={!file}>Upload</button>
          </div>
        </form>
        {status && <div>{status}</div>}
        {progress > 0 && (
          <div className="progress"><div style={{ width: `${progress}%` }} /></div>
        )}
      </div>
    </div>
  )
}


