import { OrgsRepositoryPrisma } from '@/repositories/prisma/orgs-repository-prisma'
import { RegisterOrgUseCase } from '../organization/register-org'

export function makeRegisterUseCase() {
  return new RegisterOrgUseCase(new OrgsRepositoryPrisma())
}
