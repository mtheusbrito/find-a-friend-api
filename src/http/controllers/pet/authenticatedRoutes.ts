import { ensureAuthenticated } from '@/http/middlewares/ensure-authenticated'
import { FastifyInstance } from 'fastify'
import { createRequirements } from './create-requirements'
import { create } from './create'
import { deleteRequirement } from './delete-requirement'

export async function authenticatedRoutes(app: FastifyInstance) {
  app.addHook('onRequest', ensureAuthenticated)
  app.post('/', create)
  app.post('/:id/requirements', createRequirements)
  app.delete('/:id/requirements/:req_id', deleteRequirement)
}
