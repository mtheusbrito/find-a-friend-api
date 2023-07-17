import { makeFetchPetsUseCase } from '@/use-cases/factories/make-fetch-pets-use-case'
import { DType, Dependency, Environment, Port } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
  const fetchQuerySchema = z.object({
    city: z.string(),
    dtype: z.nativeEnum(DType).optional(),
    dependency_level: z.nativeEnum(Dependency).optional(),
    energy_level: z.coerce.number().optional(),
    environment: z.nativeEnum(Environment).optional(),
    port: z.nativeEnum(Port).optional(),
  })
  const { city, dtype, dependency_level, energy_level, environment, port } =
    fetchQuerySchema.parse(request.query)
  const fetchPetsUseCase = makeFetchPetsUseCase()
  const { pets } = await fetchPetsUseCase.execute({
    city,
    dtype,
    dependency_level,
    energy_level,
    environment,
    port,
  })

  return reply.status(200).send({ pets })
}
