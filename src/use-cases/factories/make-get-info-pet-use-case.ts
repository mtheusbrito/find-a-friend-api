import { PetsRepositoryPrisma } from '@/repositories/prisma/pets-repository-prisma'
import { GetInfoPetUseCase } from '../pet/get-info'

export function makeGetInfoPetUseCase() {
  return new GetInfoPetUseCase(new PetsRepositoryPrisma())
}
