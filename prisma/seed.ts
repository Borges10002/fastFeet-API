import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Criar usuário admin
  const adminPassword = await hash('123456', 8)
  
  const admin = await prisma.user.upsert({
    where: { cpf: '12345678901' },
    update: {},
    create: {
      cpf: '12345678901',
      name: 'Admin FastFeet',
      password: adminPassword,
      role: 'ADMIN'
    }
  })

  // Criar entregador
  const deliverymanPassword = await hash('123456', 8)
  
  const deliveryman = await prisma.user.upsert({
    where: { cpf: '98765432100' },
    update: {},
    create: {
      cpf: '98765432100',
      name: 'João Entregador',
      password: deliverymanPassword,
      role: 'DELIVERYMAN',
      latitude: -23.5505,
      longitude: -46.6333
    }
  })

  // Criar destinatário
  const recipient = await prisma.recipient.upsert({
    where: { id: 'recipient-1' },
    update: {},
    create: {
      id: 'recipient-1',
      name: 'Maria Silva',
      email: 'maria@example.com',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      latitude: -23.5489,
      longitude: -46.6388
    }
  })

  // Criar encomenda
  await prisma.order.upsert({
    where: { id: 'order-1' },
    update: {},
    create: {
      id: 'order-1',
      title: 'Pacote de roupas',
      description: 'Encomenda contendo roupas diversas',
      recipientId: recipient.id,
      status: 'PENDING'
    }
  })

  console.log('Seed completed!')
  console.log('Admin CPF: 12345678901, Password: 123456')
  console.log('Deliveryman CPF: 98765432100, Password: 123456')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })