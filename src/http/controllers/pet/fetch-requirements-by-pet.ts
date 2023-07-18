import { makeFetchRequirementsByPet } from '@/use-cases/factories/make-fetch-requirements-by-pet'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchRequirementsByPet(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getParamsSchema = z.object({
    id: z.string(),
  })
  const { id } = getParamsSchema.parse(request.params)
  const createRequirements = makeFetchRequirementsByPet()

  const { requirements } = await createRequirements.execute({
    pet_id: id,
  })

  return reply.status(201).send({ requirements })
}
