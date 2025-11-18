import { OrderRepository } from '../../domain/repositories/order-repository'
import { RecipientRepository } from '../../domain/repositories/recipient-repository'
import { Order, CreateOrderRequest } from '../../domain/entities/order'

export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private recipientRepository: RecipientRepository
  ) {}

  async execute(data: CreateOrderRequest): Promise<Order> {
    const recipient = await this.recipientRepository.findById(data.recipientId)

    if (!recipient) {
      throw new Error('Recipient not found')
    }

    const order = await this.orderRepository.create(data)

    return order
  }
}