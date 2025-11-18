import { PrismaClient } from '@prisma/client'
import { RecipientRepository } from '../../domain/repositories/recipient-repository'
import { Recipient, CreateRecipientRequest } from '../../domain/entities/recipient'

export class PrismaRecipientRepository implements RecipientRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateRecipientRequest): Promise<Recipient> {
    return await this.prisma.recipient.create({
      data
    })
  }

  async findById(id: string): Promise<Recipient | null> {
    return await this.prisma.recipient.findUnique({
      where: { id }
    })
  }

  async findMany(): Promise<Recipient[]> {
    return await this.prisma.recipient.findMany()
  }

  async update(id: string, data: Partial<Recipient>): Promise<Recipient> {
    return await this.prisma.recipient.update({
      where: { id },
      data
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.recipient.delete({
      where: { id }
    })
  }
}