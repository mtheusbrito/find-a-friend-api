import { FastifyInstance } from 'fastify'
import { create } from './create'
import { ensureAuthenticated } from '@/http/middlewares/ensure-authenticated'
import { fetch } from './fetch'
import { getInfo } from './get'

export async function petRoutes(app: FastifyInstance) {
  app.post('/', { onRequest: [ensureAuthenticated] }, create)
  app.get('/:id', getInfo)
  app.get('/', fetch)
}
