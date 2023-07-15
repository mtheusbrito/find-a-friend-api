import { OrgsRepository } from '@/repositories/orgs-repository'
import { Organization } from '@prisma/client'
import { hash } from 'bcryptjs'
import { OrgAlreadyExistsError } from '../errors/org-already-exists-error'
type RegisterOrgUseCaseRequest = {
  responsible: string
  mail: string
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
    mail,
    ...data
  }: RegisterOrgUseCaseRequest): Promise<RegisterOrgUseCaseResponse> {
    const password_hash = await hash(password, 6)

    const orgWithSameEmail = await this.orgsRepository.findByEmail(mail)
    if (orgWithSameEmail) {
      throw new OrgAlreadyExistsError()
    }

    const org = await this.orgsRepository.create({
      ...data,
      password_hash,
      mail,
    })
    return { org }
  }
}
export { RegisterOrgUseCase }
