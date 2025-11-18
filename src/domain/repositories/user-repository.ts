import { User, CreateUserRequest } from '../entities/user'

export interface UserRepository {
  create(data: CreateUserRequest): Promise<User>
  findById(id: string): Promise<User | null>
  findByCpf(cpf: string): Promise<User | null>
  findMany(): Promise<User[]>
  update(id: string, data: Partial<User>): Promise<User>
  delete(id: string): Promise<void>
}