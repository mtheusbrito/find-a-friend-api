import { OrgsRepository } from '@/repositories/orgs-repository'
import { PetsRepository } from '@/repositories/pets-repository'
import {
  DType,
  Dependency,
  Environment,
  Pet,
  Port,
  Years,
} from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

type CreatePetUseCaseRequest = {
  name: string
  about: string
  dtype: DType
  years: Years
  port: Port
  energyLevel: number
  dependencyLevel: Dependency
  environment: Environment
  organization_id: string
}

type CreatePetUseCaseResponse = {
  pet: Pet
}
export class CreatePetUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrgsRepository,
  ) {}

  async execute({
    ...data
  }: CreatePetUseCaseRequest): Promise<CreatePetUseCaseResponse> {
    const org = await this.orgsRepository.findById(data.organization_id)
    if (!org) {
      throw new ResourceNotFoundError('Organization')
    }
    const pet = await this.petsRepository.create({
      ...data,
    })
    return { pet }
  }
}
