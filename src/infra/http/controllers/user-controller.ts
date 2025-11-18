import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { CreateUserUseCase } from '../../../application/use-cases/create-user'
import { UserRepository } from '../../../domain/repositories/user-repository'
import { UserRole } from '../../../domain/entities/user'

const createUserBodySchema = z.object({
  cpf: z.string(),
  name: z.string(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'DELIVERYMAN']),
  latitude: z.number().optional(),
  longitude: z.number().optional()
})

export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private userRepository: UserRepository
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = createUserBodySchema.parse(request.body)

      const user = await this.createUserUseCase.execute({
        ...data,
        role: data.role as UserRole
      })

      return reply.status(201).send({
        id: user.id,
        name: user.name,
        cpf: user.cpf,
        role: user.role
      })
    } catch (error) {
      return reply.status(400).send({
        message: error instanceof Error ? error.message : 'Failed to create user'
      })
    }
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const users = await this.userRepository.findMany()

      return reply.status(200).send({
        users: users.map(user => ({
          id: user.id,
          name: user.name,
          cpf: user.cpf,
          role: user.role
        }))
      })
    } catch (error) {
      return reply.status(500).send({
        message: 'Failed to list users'
      })
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }

      await this.userRepository.delete(id)

      return reply.status(204).send()
    } catch (error) {
      return reply.status(400).send({
        message: 'Failed to delete user'
      })
    }
  }
}