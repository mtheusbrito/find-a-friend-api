import { PetsRepositoryPrisma } from '@/repositories/prisma/pets-repository-prisma'
import { CreateRequirementsUseCase } from '../pet/create-requirements'
import { RequirementsRepositoryPrisma } from '@/repositories/prisma/requirements-repository-prisma'

export function makeCreateRequirementsUseCase() {
  return new CreateRequirementsUseCase(
    new PetsRepositoryPrisma(),
    new RequirementsRepositoryPrisma(),
  )
}
