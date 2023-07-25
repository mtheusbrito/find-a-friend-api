import { PetsRepositoryPrisma } from '@/repositories/prisma/pets-repository-prisma'
import { FetchStatesUseCase } from '../geolocation/fetch-states-use-case'

export function makeFetchStatesUseCase() {
  return new FetchStatesUseCase(new PetsRepositoryPrisma())
}
