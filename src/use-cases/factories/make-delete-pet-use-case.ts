import { PetsRepositoryPrisma } from '@/repositories/prisma/pets-repository-prisma'
import { DeletePetUseCase } from '../pet/delete'

export function makeDeletePetUseCase() {
  return new DeletePetUseCase(new PetsRepositoryPrisma())
}
