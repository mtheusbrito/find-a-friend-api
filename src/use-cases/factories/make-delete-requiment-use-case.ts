import { PetsRepositoryPrisma } from '@/repositories/prisma/pets-repository-prisma'
import { DeleteRequirementUseCase } from '../pet/delete-requirement'
import { RequirementsRepositoryPrisma } from '@/repositories/prisma/requirements-repository-prisma'

export function makeDeleteRequirementUseCase() {
  return new DeleteRequirementUseCase(
    new PetsRepositoryPrisma(),
    new RequirementsRepositoryPrisma(),
  )
}
