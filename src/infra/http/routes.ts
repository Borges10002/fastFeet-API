import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { BcryptHasher } from '../cryptography/bcrypt-hasher'
import { PrismaUserRepository } from '../database/prisma-user-repository'
import { PrismaOrderRepository } from '../database/prisma-order-repository'
import { PrismaRecipientRepository } from '../database/prisma-recipient-repository'
import { AuthenticateUserUseCase } from '../../application/use-cases/authenticate-user'
import { CreateUserUseCase } from '../../application/use-cases/create-user'
import { CreateOrderUseCase } from '../../application/use-cases/create-order'
import { PickUpOrderUseCase } from '../../application/use-cases/pick-up-order'
import { DeliverOrderUseCase } from '../../application/use-cases/deliver-order'
import { CreateRecipientUseCase } from '../../application/use-cases/create-recipient'
import { AuthController } from './controllers/auth-controller'
import { UserController } from './controllers/user-controller'
import { OrderController } from './controllers/order-controller'
import { RecipientController } from './controllers/recipient-controller'
import { verifyJWT, verifyUserRole } from './auth'

export async function appRoutes(app: FastifyInstance) {
  const prisma = new PrismaClient()
  const hasher = new BcryptHasher()
  
  const userRepository = new PrismaUserRepository(prisma)
  const orderRepository = new PrismaOrderRepository(prisma)
  const recipientRepository = new PrismaRecipientRepository(prisma)
  
  const authenticateUserUseCase = new AuthenticateUserUseCase(userRepository, hasher)
  const createUserUseCase = new CreateUserUseCase(userRepository, hasher)
  const createOrderUseCase = new CreateOrderUseCase(orderRepository, recipientRepository)
  const pickUpOrderUseCase = new PickUpOrderUseCase(orderRepository, userRepository)
  const deliverOrderUseCase = new DeliverOrderUseCase(orderRepository)
  const createRecipientUseCase = new CreateRecipientUseCase(recipientRepository)
  
  const authController = new AuthController(authenticateUserUseCase)
  const userController = new UserController(createUserUseCase, userRepository)
  const orderController = new OrderController(
    createOrderUseCase,
    pickUpOrderUseCase,
    deliverOrderUseCase,
    orderRepository
  )
  const recipientController = new RecipientController(createRecipientUseCase, recipientRepository)

  // Auth routes
  app.post('/sessions', authController.authenticate.bind(authController))

  // Admin routes
  app.register(async function adminRoutes(app) {
    app.addHook('onRequest', verifyJWT)
    app.addHook('onRequest', verifyUserRole('ADMIN'))

    // User management
    app.post('/users', userController.create.bind(userController))
    app.get('/users', userController.list.bind(userController))
    app.delete('/users/:id', userController.delete.bind(userController))

    // Order management
    app.post('/orders', orderController.create.bind(orderController))
    app.get('/orders', orderController.list.bind(orderController))
    app.patch('/orders/:id/awaiting', orderController.markAsAwaiting.bind(orderController))

    // Recipient management
    app.post('/recipients', recipientController.create.bind(recipientController))
    app.get('/recipients', recipientController.list.bind(recipientController))
    app.delete('/recipients/:id', recipientController.delete.bind(recipientController))
  })

  // Deliveryman routes
  app.register(async function deliverymanRoutes(app) {
    app.addHook('onRequest', verifyJWT)
    app.addHook('onRequest', verifyUserRole('DELIVERYMAN'))

    app.get('/deliveries', orderController.listDeliveries.bind(orderController))
    app.get('/orders/nearby', orderController.listNearby.bind(orderController))
    app.patch('/orders/:id/pick-up', orderController.pickUp.bind(orderController))
    app.patch('/orders/:id/deliver', orderController.deliver.bind(orderController))
  })
}