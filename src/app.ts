import fastify from 'fastify'
import fastifyBlipp from 'fastify-blipp'
// import { prisma } from './lib/prisma'
import { orgsRoutes } from './http/controllers/organization/routes'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'

import { petRoutes } from './http/controllers/pet/routes'
import { UnauthorizedError } from './use-cases/errors/unauthorized-error'

export const app = fastify()
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: '3',
  },
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
})
app.register(fastifyCors, {
  origin: true,
  credentials: true,
})
app.register(fastifyCookie)
app.register(fastifyBlipp)

app.get('/', async (request, reply) => {
  return reply.status(200).send({ message: 'It`s works!' })
})

app.register(orgsRoutes, { prefix: 'organizations' })
app.register(petRoutes, { prefix: 'pets' })

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }
  if (error instanceof UnauthorizedError) {
    return reply.status(403).send({ message: 'Unauthorized!' })
  }
  if (env.NODE_ENV !== 'production') {
    console.log(error)
  } else {
    // TODO: Here we should log to on external tool like DataDog/NewRelic/Sentry
  }
  return reply.status(500).send({ message: 'Internal server error.' })
})
