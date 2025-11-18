import '@fastify/jwt'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { role: string }
    user: {
      sub: string
      role: string
    }
  }
}