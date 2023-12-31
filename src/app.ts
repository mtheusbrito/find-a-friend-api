import fastify from 'fastify'
// import fastifyBlipp from 'fastify-blipp'
// import { prisma } from './lib/prisma'
import { orgsRoutes } from './http/controllers/organization/routes'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'

import { petRoutes } from './http/controllers/pet/routes'
import { UnauthorizedError } from './use-cases/errors/unauthorized-error'
import { ResourceNotFoundError } from './use-cases/errors/resource-not-found-error'
import { OrgAlreadyExistsError } from './use-cases/errors/org-already-exists-error'
import fastifyMulter from 'fastify-multer'
import fastifyStatic from '@fastify/static'
import path from 'path'
import { geolocationRoutes } from './http/controllers/geolocation/routes'
// import printRoutes from 'fastify-print-routes'
export const app = fastify()

app.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'tmp'),
  prefix: '/public/',
})
app.register(fastifyMulter.contentParser)
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: '3m',
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

app.get('/', async (request, reply) => {
  return reply.status(200).send({ message: 'It`s works!' })
})
app.register(petRoutes, { prefix: 'pets' })
app.register(orgsRoutes, { prefix: 'organizations' })
app.register(geolocationRoutes, { prefix: 'geolocation' })

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }
  if (error instanceof OrgAlreadyExistsError) {
    return reply.status(400).send({ message: error.message })
  }
  if (error instanceof ResourceNotFoundError) {
    return reply.status(404).send({ message: error.message })
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
