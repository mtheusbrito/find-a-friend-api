import { makeGetInfoPetUseCase } from '@/use-cases/factories/make-get-info-pet-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getInfo(request: FastifyRequest, reply: FastifyReply) {
  const getInfoParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = getInfoParamsSchema.parse(request.params)
  const getInfoPetUseCase = makeGetInfoPetUseCase()

  const { pet } = await getInfoPetUseCase.execute({ pet_id: id })

  return reply.status(200).send({ pet })
}
