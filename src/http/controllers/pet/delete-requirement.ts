import { makeDeleteRequirementUseCase } from '@/use-cases/factories/make-delete-requiment-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteRequirement(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getParamsSchema = z.object({
    id: z.string(),
    req_id: z.string(),
  })
  const { id, req_id } = getParamsSchema.parse(request.params)

  const { sub: org_id } = request.user
  const deleteRequirement = makeDeleteRequirementUseCase()

  await deleteRequirement.execute({
    org_id,
    pet_id: id,
    req_id,
  })

  return reply.status(200).send()
}
