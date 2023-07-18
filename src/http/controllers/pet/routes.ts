import { FastifyInstance } from 'fastify'
import { fetch } from './fetch'
import { getInfo } from './get'
import { authenticatedRoutes } from './authenticatedRoutes'
import { fetchRequirementsByPet } from './fetch-requirements-by-pet'

export async function petRoutes(app: FastifyInstance) {
  app.get('/', fetch)
  app.get('/:id', getInfo)
  app.get('/:id/requirements', fetchRequirementsByPet)

  // authenticated routes
  app.register(authenticatedRoutes)
}
