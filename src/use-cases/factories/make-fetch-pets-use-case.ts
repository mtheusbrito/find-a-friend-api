import { PetsRepositoryPrisma } from '@/repositories/prisma/pets-repository-prisma'
import { FetchPetsUseCase } from '../pet/fetch'

export function makeFetchPetsUseCase() {
  return new FetchPetsUseCase(new PetsRepositoryPrisma())
}
