import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { CreateRecipientUseCase } from '../../../application/use-cases/create-recipient'
import { RecipientRepository } from '../../../domain/repositories/recipient-repository'

const createRecipientBodySchema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  latitude: z.number(),
  longitude: z.number()
})

export class RecipientController {
  constructor(
    private createRecipientUseCase: CreateRecipientUseCase,
    private recipientRepository: RecipientRepository
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = createRecipientBodySchema.parse(request.body)

      const recipient = await this.createRecipientUseCase.execute(data)

      return reply.status(201).send(recipient)
    } catch (error) {
      return reply.status(400).send({
        message: error instanceof Error ? error.message : 'Failed to create recipient'
      })
    }
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const recipients = await this.recipientRepository.findMany()

      return reply.status(200).send({ recipients })
    } catch (error) {
      return reply.status(500).send({
        message: 'Failed to list recipients'
      })
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }

      await this.recipientRepository.delete(id)

      return reply.status(204).send()
    } catch (error) {
      return reply.status(400).send({
        message: 'Failed to delete recipient'
      })
    }
  }
}