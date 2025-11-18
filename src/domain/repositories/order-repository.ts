import { Order, CreateOrderRequest, OrderStatus } from '../entities/order'

export interface OrderRepository {
  create(data: CreateOrderRequest): Promise<Order>
  findById(id: string): Promise<Order | null>
  findMany(): Promise<Order[]>
  findByDeliverymanId(deliverymanId: string): Promise<Order[]>
  findNearbyOrders(latitude: number, longitude: number, radius?: number): Promise<Order[]>
  update(id: string, data: Partial<Order>): Promise<Order>
  updateStatus(id: string, status: OrderStatus): Promise<Order>
  delete(id: string): Promise<void>
}