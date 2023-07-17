import { PetsRepositoryPrisma } from '@/repositories/prisma/pets-repository-prisma'
import { CreatePetUseCase } from '../pet/create'
import { OrgsRepositoryPrisma } from '@/repositories/prisma/orgs-repository-prisma'

export function makeCreatePetUseCase() {
  return new CreatePetUseCase(
    new PetsRepositoryPrisma(),
    new OrgsRepositoryPrisma(),
  )
}
