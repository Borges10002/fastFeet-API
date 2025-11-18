import { OrderRepository } from '../../domain/repositories/order-repository'
import { OrderStatus, Order } from '../../domain/entities/order'

interface ReturnOrderRequest {
  orderId: string
}

export class ReturnOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({ orderId }: ReturnOrderRequest): Promise<Order> {
    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      throw new Error('Order not found')
    }

    if (order.status !== OrderStatus.PICKED_UP) {
      throw new Error('Order must be picked up to be returned')
    }

    const updatedOrder = await this.orderRepository.updateStatus(orderId, OrderStatus.RETURNED)

    return updatedOrder
  }
}