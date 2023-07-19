import { PetsRepositoryPrisma } from '@/repositories/prisma/pets-repository-prisma'
import { DeleteImageUseCase } from '../pet/delete-image'
import { ImagesPetRepositoryPrisma } from '@/repositories/prisma/images-pet-repository-prisma'

export function makeDeleteImagePetUseCase() {
  return new DeleteImageUseCase(
    new PetsRepositoryPrisma(),
    new ImagesPetRepositoryPrisma(),
  )
}
