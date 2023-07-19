import { makeUploadImagesPet } from '@/use-cases/factories/make-upload-images-pet'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function uploadImages(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getInfoParamsSchema = z.object({
    id: z.string(),
  })
  const { id } = getInfoParamsSchema.parse(request.params)
  const getFilesScheme = z.object({
    files: z.array(z.object({ filename: z.string() })),
  })
  const { files: images } = getFilesScheme.parse(request)
  const images_name = images.map((file) => file.filename)

  const { sub: org_id } = request.user
  const uploadImagesPet = makeUploadImagesPet()
  const { images: imagesCreated } = await uploadImagesPet.execute({
    images_name,
    pet_id: id,
    org_id,
  })

  return reply.status(201).send({ images: imagesCreated })
}
