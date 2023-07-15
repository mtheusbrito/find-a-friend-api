import { FastifyInstance } from 'fastify'
import { create } from './create'
import { ensureAuthenticated } from '@/http/middlewares/ensure-authenticated'

export async function petRoutes(app: FastifyInstance) {
  app.post('/', { onRequest: [ensureAuthenticated] }, create)
}
