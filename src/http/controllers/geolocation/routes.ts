import { FastifyInstance } from 'fastify'
import { fetchStates } from './fetch-states'

export async function geolocationRoutes(app: FastifyInstance) {
  app.get('/states', fetchStates)
}
