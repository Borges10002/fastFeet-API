export enum UserRole {
  ADMIN = 'ADMIN',
  DELIVERYMAN = 'DELIVERYMAN'
}

export interface User {
  id: string
  cpf: string
  name: string
  password: string
  role: UserRole
  latitude?: number
  longitude?: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserRequest {
  cpf: string
  name: string
  password: string
  role: UserRole
  latitude?: number
  longitude?: number
}