import { OrderRepository } from '../../domain/repositories/order-repository'
import { UserRepository } from '../../domain/repositories/user-repository'
import { OrderStatus, Order } from '../../domain/entities/order'
import { UserRole } from '../../domain/entities/user'

interface PickUpOrderRequest {
  orderId: string
  deliverymanId: string
}

export class PickUpOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private userRepository: UserRepository
  ) {}

  async execute({ orderId, deliverymanId }: PickUpOrderRequest): Promise<Order> {
    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      throw new Error('Order not found')
    }

    if (order.status !== OrderStatus.AWAITING) {
      throw new Error('Order is not available for pickup')
    }

    const deliveryman = await this.userRepository.findById(deliverymanId)

    if (!deliveryman || deliveryman.role !== UserRole.DELIVERYMAN) {
      throw new Error('Invalid deliveryman')
    }

    const updatedOrder = await this.orderRepository.update(orderId, {
      deliverymanId,
      status: OrderStatus.PICKED_UP,
      pickedUpAt: new Date()
    })

    return updatedOrder
  }
}