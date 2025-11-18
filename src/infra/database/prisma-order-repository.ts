import { PrismaClient } from '@prisma/client'
import { OrderRepository } from '../../domain/repositories/order-repository'
import { Order, CreateOrderRequest, OrderStatus } from '../../domain/entities/order'

export class PrismaOrderRepository implements OrderRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateOrderRequest): Promise<Order> {
    return await this.prisma.order.create({
      data
    })
  }

  async findById(id: string): Promise<Order | null> {
    return await this.prisma.order.findUnique({
      where: { id },
      include: {
        recipient: true,
        deliveryman: true
      }
    })
  }

  async findMany(): Promise<Order[]> {
    return await this.prisma.order.findMany({
      include: {
        recipient: true,
        deliveryman: true
      }
    })
  }

  async findByDeliverymanId(deliverymanId: string): Promise<Order[]> {
    return await this.prisma.order.findMany({
      where: { deliverymanId },
      include: {
        recipient: true
      }
    })
  }

  async findNearbyOrders(latitude: number, longitude: number, radius = 10): Promise<Order[]> {
    // Implementação simplificada - em produção usar PostGIS ou similar
    return await this.prisma.order.findMany({
      where: {
        status: OrderStatus.AWAITING,
        recipient: {
          latitude: {
            gte: latitude - radius * 0.01,
            lte: latitude + radius * 0.01
          },
          longitude: {
            gte: longitude - radius * 0.01,
            lte: longitude + radius * 0.01
          }
        }
      },
      include: {
        recipient: true
      }
    })
  }

  async update(id: string, data: Partial<Order>): Promise<Order> {
    return await this.prisma.order.update({
      where: { id },
      data
    })
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const updateData: any = { status }
    
    if (status === OrderStatus.PICKED_UP) {
      updateData.pickedUpAt = new Date()
    } else if (status === OrderStatus.DELIVERED) {
      updateData.deliveredAt = new Date()
    }

    return await this.prisma.order.update({
      where: { id },
      data: updateData
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.order.delete({
      where: { id }
    })
  }
}