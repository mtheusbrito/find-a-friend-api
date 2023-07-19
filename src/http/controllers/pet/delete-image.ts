import { makeDeleteImagePetUseCase } from '@/use-cases/factories/make-delete-image-pet-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteImage(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getInfoParamsSchema = z.object({
    id: z.string(),
    img_id: z.string(),
  })
  const { id, img_id } = getInfoParamsSchema.parse(request.params)

  const deleteImagePetUseCase = makeDeleteImagePetUseCase()
  const { sub: org_id } = request.user
  await deleteImagePetUseCase.execute({ pet_id: id, org_id, img_id })
  return reply.status(204).send({})
}
