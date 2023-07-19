import { makeCreatePetUseCase } from '@/use-cases/factories/make-create-pet-use-create'
import { DType, Dependency, Environment, Port, Years } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    name: z.string(),
    about: z.string(),
    dtype: z.nativeEnum(DType),
    years: z.nativeEnum(Years),
    port: z.nativeEnum(Port),
    energy_level: z.coerce.number().min(1).max(5),
    dependency_level: z.nativeEnum(Dependency),
    environment: z.nativeEnum(Environment),
  })
  const { ...data } = createBodySchema.parse(request.body)

  const createPetUseCase = makeCreatePetUseCase()
  const org_id = request.user.sub
  const { pet } = await createPetUseCase.execute({
    ...data,
    organization_id: org_id,
  })
  return reply.status(201).send({ pet })
}
