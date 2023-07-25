import { PetsRepositoryPrisma } from '@/repositories/prisma/pets-repository-prisma'
import { FetchCitiesByStateUseCase } from '../geolocation/fetch-cities-by-state-use-case'

export function makeFetchCitiesByStateUseCase() {
  return new FetchCitiesByStateUseCase(new PetsRepositoryPrisma())
}
