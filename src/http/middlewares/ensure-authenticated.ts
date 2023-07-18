import { FastifyReply, FastifyRequest } from 'fastify'

export async function ensureAuthenticated(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    if (!request.headers.authorization) {
      throw new Error()
    }
    await request.jwtVerify()
  } catch (err) {
    return reply.status(401).send({ message: 'Unauthorized.' })
  }
}
