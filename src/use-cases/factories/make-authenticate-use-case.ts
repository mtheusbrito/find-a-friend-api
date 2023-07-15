import { OrgsRepositoryPrisma } from '@/repositories/prisma/orgs-repository-prisma'
import { AuthenticateOrgUseCase } from '../organization/authenticate'

export function makeAuthenticateUseCase() {
  return new AuthenticateOrgUseCase(new OrgsRepositoryPrisma())
}
