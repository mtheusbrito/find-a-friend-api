import { makeCreateRequirementsUseCase } from '@/use-cases/factories/make-create-requirements-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createRequirements(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createBodySchema = z.object({
    requirements: z.array(z.string()).min(1),
  })
  const getParamsSchema = z.object({
    id: z.string(),
  })
  const { id } = getParamsSchema.parse(request.params)
  const { requirements } = createBodySchema.parse(request.body)
  const { sub: org_id } = request.user
  const createRequirements = makeCreateRequirementsUseCase()

  const { requirements: requirementsCreated } =
    await createRequirements.execute({
      org_id,
      pet_id: id,
      requirements,
    })

  return reply.status(201).send({ requirements: requirementsCreated })
}
