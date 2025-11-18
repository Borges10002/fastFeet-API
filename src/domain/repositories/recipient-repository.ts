import { Recipient, CreateRecipientRequest } from '../entities/recipient'

export interface RecipientRepository {
  create(data: CreateRecipientRequest): Promise<Recipient>
  findById(id: string): Promise<Recipient | null>
  findMany(): Promise<Recipient[]>
  update(id: string, data: Partial<Recipient>): Promise<Recipient>
  delete(id: string): Promise<void>
}