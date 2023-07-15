import { OrgsRepository } from '@/repositories/orgs-repository'
import { Organization } from '@prisma/client'
import { hash } from 'bcryptjs'
import { OrgAlreadyExistsError } from '../errors/org-already-exists-error'
type RegisterOrgUseCaseRequest = {
  responsible: string
  email: string
  address: string
  zip_code: string
  city: string
  state: string
  latitude: number
  longitude: number
  phone: string
  password: string
}
type RegisterOrgUseCaseResponse = {
  org: Organization
}

class RegisterOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}
  async execute({
    password,
    ...data
  }: RegisterOrgUseCaseRequest): Promise<RegisterOrgUseCaseResponse> {
    const password_hash = await hash(password, 6)

    const orgWithSameEmail = await this.orgsRepository.findByEmail(data.email)
    if (orgWithSameEmail) {
      throw new OrgAlreadyExistsError()
    }

    const org = await this.orgsRepository.create({
      ...data,
      password_hash,
    })
    return { org }
  }
}
export { RegisterOrgUseCase }
