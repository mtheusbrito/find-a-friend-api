import { PetsRepositoryPrisma } from '@/repositories/prisma/pets-repository-prisma'
import { FetchRequirementsByPetUseCase } from '../pet/fetch-requirements-by-pet'
import { RequirementsRepositoryPrisma } from '@/repositories/prisma/requirements-repository-prisma'

export function makeFetchRequirementsByPet() {
  return new FetchRequirementsByPetUseCase(
    new PetsRepositoryPrisma(),
    new RequirementsRepositoryPrisma(),
  )
}
