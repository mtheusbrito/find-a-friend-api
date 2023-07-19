import { ensureAuthenticated } from '@/http/middlewares/ensure-authenticated'
import { FastifyInstance } from 'fastify'
import { createRequirements } from './create-requirements'
import { create } from './create'
import { deleteRequirement } from './delete-requirement'
import { uploadImages } from './upload-image'
import multer from 'fastify-multer'
import uploadConfig from '@/config/upload'
import { deletePet } from './delete'
import { deleteImage } from './delete-image'

const upload = multer(uploadConfig.upload('./tmp/pets'))

export async function authenticatedRoutes(app: FastifyInstance) {
  app.addHook('onRequest', ensureAuthenticated)
  app.post('/', create)
  app.delete('/:id', deletePet)

  // images
  app.post('/:id/images', { preHandler: upload.array('images') }, uploadImages)
  app.delete('/:id/images/:img_id', deleteImage)

  // requirements
  app.post('/:id/requirements', createRequirements)
  app.delete('/:id/requirements/:req_id', deleteRequirement)
}
