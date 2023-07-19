import { ImagesPetRepositoryPrisma } from '@/repositories/prisma/images-pet-repository-prisma'
import { UploadImagesPetUseCase } from '../pet/upload-images'
import { PetsRepositoryPrisma } from '@/repositories/prisma/pets-repository-prisma'

export function makeUploadImagesPet() {
  return new UploadImagesPetUseCase(
    new ImagesPetRepositoryPrisma(),
    new PetsRepositoryPrisma(),
  )
}
