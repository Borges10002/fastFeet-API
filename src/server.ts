import fastify from 'fastify'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import { appRoutes } from './infra/http/routes'

const app = fastify()

app.register(cors, {
  origin: true
})

app.register(jwt, {
  secret: process.env.JWT_SECRET || 'supersecret'
})

app.register(multipart)

app.register(appRoutes)

app.get('/', async () => {
  return { message: 'FastFeet API is running!' }
})

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3333
    await app.listen({ port, host: '0.0.0.0' })
    console.log(`🚀 Server running on port ${port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()