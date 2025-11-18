import { RecipientRepository } from '../../domain/repositories/recipient-repository'
import { Recipient, CreateRecipientRequest } from '../../domain/entities/recipient'

export class CreateRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute(data: CreateRecipientRequest): Promise<Recipient> {
    const recipient = await this.recipientRepository.create(data)
    return recipient
  }
}