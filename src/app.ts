import fastify from 'fastify'
import fastifyBlipp from 'fastify-blipp'

export const app = fastify()

app.register(fastifyBlipp)

app.get('/', async (request, reply) => {
  return reply.status(200).send({ message: 'It`s works!' })
})
