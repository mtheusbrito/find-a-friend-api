import { FastifyInstance } from 'fastify'
import { fetchStates } from './fetch-states'
import { fetchCitiesByState } from './fetch-cities-by-state'

export async function geolocationRoutes(app: FastifyInstance) {
  app.get('/states', fetchStates)
  app.get('/states/:state/cities', fetchCitiesByState)
}
