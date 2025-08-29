# Videos Searching - Frontend (React + Vite)

A lightweight frontend for videos searching system.

- Auth: JWT login
- Upload: Upload video to MinIO via pre-signed URL
- Browse/Search: Search and play uploaded videos

## Requirements
- Node.js 18+
- Backend running at `http://localhost:3000`

## Setup
```bash
npm install
```

Optionally create `.env` (Vite) to override API base URL:
```bash
# .env
VITE_API_BASE_URL=http://localhost:3000
```

## Run Dev
```bash
npm run dev
```
Open the URL shown (default `http://localhost:5173`).

## Build
```bash
npm run build
npm run preview
```

## API Contracts (expected)
- POST /auth/login → `{ token: string }`
- POST /videos/presign body `{ filename, contentType, size }` → `{ uploadUrl, objectKey, headers? }`
- GET /videos?q=... → `{ items: Array<{ id, title?, objectKey, playbackUrl?, createdAt? }> }` or an array
- GET /videos/:id/stream → video stream (if `playbackUrl` not provided)

## Code Structure
- `src/modules/auth` — context and login page
- `src/modules/videos` — upload and list pages
- `src/services` — axios client with auth header

## Notes
- JWT is stored in `localStorage` as `vs_jwt_token`.
- Auth header `Authorization: Bearer <token>` is auto-injected for API requests.
- Upload is a direct `PUT` to `uploadUrl` from presign endpoint.