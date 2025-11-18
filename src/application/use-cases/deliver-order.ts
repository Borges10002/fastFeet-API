import { OrderRepository } from '../../domain/repositories/order-repository'
import { OrderStatus, Order } from '../../domain/entities/order'

interface DeliverOrderRequest {
  orderId: string
  deliverymanId: string
  photoUrl: string
}

export class DeliverOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({ orderId, deliverymanId, photoUrl }: DeliverOrderRequest): Promise<Order> {
    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      throw new Error('Order not found')
    }

    if (order.status !== OrderStatus.PICKED_UP) {
      throw new Error('Order was not picked up')
    }

    if (order.deliverymanId !== deliverymanId) {
      throw new Error('Only the deliveryman who picked up the order can deliver it')
    }

    if (!photoUrl) {
      throw new Error('Photo is required to confirm delivery')
    }

    const updatedOrder = await this.orderRepository.update(orderId, {
      status: OrderStatus.DELIVERED,
      photoUrl,
      deliveredAt: new Date()
    })

    return updatedOrder
  }
}