import { makeDeletePetUseCase } from '@/use-cases/factories/make-delete-pet-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deletePet(request: FastifyRequest, reply: FastifyReply) {
  const getParamsSchema = z.object({
    id: z.string(),
  })

  const deletePetUseCase = makeDeletePetUseCase()

  const { id } = getParamsSchema.parse(request.params)
  const { sub: org_id } = request.user
  await deletePetUseCase.execute({ org_id, pet_id: id })
  return reply.status(204).send({})
}
