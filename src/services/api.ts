import axios from 'axios'
import { getAuthToken } from './auth'

const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false
})

api.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers = config.headers || {}
    ;(config.headers as any)['Authorization'] = `Bearer ${token}`
  }
  return config
})

export function getApiBaseUrl() {
  return BASE_URL
}


