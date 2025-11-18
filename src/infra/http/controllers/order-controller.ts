import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { CreateOrderUseCase } from '../../../application/use-cases/create-order'
import { PickUpOrderUseCase } from '../../../application/use-cases/pick-up-order'
import { DeliverOrderUseCase } from '../../../application/use-cases/deliver-order'
import { OrderRepository } from '../../../domain/repositories/order-repository'
import { OrderStatus } from '../../../domain/entities/order'

const createOrderBodySchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  recipientId: z.string()
})

const pickUpOrderParamsSchema = z.object({
  id: z.string()
})

const deliverOrderBodySchema = z.object({
  photoUrl: z.string()
})

export class OrderController {
  constructor(
    private createOrderUseCase: CreateOrderUseCase,
    private pickUpOrderUseCase: PickUpOrderUseCase,
    private deliverOrderUseCase: DeliverOrderUseCase,
    private orderRepository: OrderRepository
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = createOrderBodySchema.parse(request.body)

      const order = await this.createOrderUseCase.execute(data)

      return reply.status(201).send(order)
    } catch (error) {
      return reply.status(400).send({
        message: error instanceof Error ? error.message : 'Failed to create order'
      })
    }
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const orders = await this.orderRepository.findMany()

      return reply.status(200).send({ orders })
    } catch (error) {
      return reply.status(500).send({
        message: 'Failed to list orders'
      })
    }
  }

  async markAsAwaiting(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = pickUpOrderParamsSchema.parse(request.params)

      const order = await this.orderRepository.updateStatus(id, OrderStatus.AWAITING)

      return reply.status(200).send(order)
    } catch (error) {
      return reply.status(400).send({
        message: 'Failed to mark order as awaiting'
      })
    }
  }

  async pickUp(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = pickUpOrderParamsSchema.parse(request.params)
      const { sub: deliverymanId } = request.user

      const order = await this.pickUpOrderUseCase.execute({
        orderId: id,
        deliverymanId
      })

      return reply.status(200).send(order)
    } catch (error) {
      return reply.status(400).send({
        message: error instanceof Error ? error.message : 'Failed to pick up order'
      })
    }
  }

  async deliver(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = pickUpOrderParamsSchema.parse(request.params)
      const { photoUrl } = deliverOrderBodySchema.parse(request.body)
      const { sub: deliverymanId } = request.user

      const order = await this.deliverOrderUseCase.execute({
        orderId: id,
        deliverymanId,
        photoUrl
      })

      return reply.status(200).send(order)
    } catch (error) {
      return reply.status(400).send({
        message: error instanceof Error ? error.message : 'Failed to deliver order'
      })
    }
  }

  async listDeliveries(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { sub: deliverymanId } = request.user

      const orders = await this.orderRepository.findByDeliverymanId(deliverymanId)

      return reply.status(200).send({ orders })
    } catch (error) {
      return reply.status(500).send({
        message: 'Failed to list deliveries'
      })
    }
  }

  async listNearby(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { latitude, longitude } = request.query as { latitude: string, longitude: string }

      if (!latitude || !longitude) {
        return reply.status(400).send({
          message: 'Latitude and longitude are required'
        })
      }

      const orders = await this.orderRepository.findNearbyOrders(
        parseFloat(latitude),
        parseFloat(longitude)
      )

      return reply.status(200).send({ orders })
    } catch (error) {
      return reply.status(500).send({
        message: 'Failed to list nearby orders'
      })
    }
  }
}