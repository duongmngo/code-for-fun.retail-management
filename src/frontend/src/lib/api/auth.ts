import { apiClient } from './client'

// Request types
export interface SignInRequest {
  email: string
  password: string
  tenantCode: string
  deviceInfo?: string
}

export interface SignUpRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  tenantCode: string
  businessName: string
  businessAddress?: string
  businessPhone?: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

// Response types
export interface AuthResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
  user: UserInfo
}

export interface UserInfo {
  id: string
  email: string
  firstName: string
  lastName: string
  tenantId: string
  tenantCode: string
  tenantName: string
  roles: string[]
  permissions: string[]
}

// API wrapper response
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
}

// Auth API functions
export const authApi = {
  signIn: async (request: SignInRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/v1/auth/signin', request)
    return response.data.data
  },

  signUp: async (request: SignUpRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/v1/auth/signup', request)
    return response.data.data
  },

  refreshToken: async (request: RefreshTokenRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/v1/auth/refresh', request)
    return response.data.data
  },

  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post('/v1/auth/logout', { refreshToken })
  },

  logoutAll: async (): Promise<void> => {
    await apiClient.post('/v1/auth/logout-all')
  },
}
