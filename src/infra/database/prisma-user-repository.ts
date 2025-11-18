import { PrismaClient } from '@prisma/client'
import { UserRepository } from '../../domain/repositories/user-repository'
import { User, CreateUserRequest } from '../../domain/entities/user'

export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateUserRequest): Promise<User> {
    return await this.prisma.user.create({
      data
    })
  }

  async findById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id }
    })
  }

  async findByCpf(cpf: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { cpf }
    })
  }

  async findMany(): Promise<User[]> {
    return await this.prisma.user.findMany()
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id }
    })
  }
}