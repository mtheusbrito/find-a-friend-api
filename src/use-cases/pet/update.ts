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
import { UnauthorizedError } from '../errors/unauthorized-error'

type UpdatePetUseCaseRequest = {
  name: string
  about: string
  dtype: DType
  years: Years
  port: Port
  energyLevel: number
  dependencyLevel: Dependency
  environment: Environment
  organization_id: string
  pet_id: string
}

type UpdatePetUseCaseResponse = { pet: Pet }
export class UpdatePetUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    ...data
  }: UpdatePetUseCaseRequest): Promise<UpdatePetUseCaseResponse> {
    const petExists = await this.petsRepository.findById(data.pet_id)
    if (!petExists) {
      throw new ResourceNotFoundError()
    }

    if (petExists.organization_id !== data.organization_id) {
      throw new UnauthorizedError()
    }

    const pet = await this.petsRepository.save({ ...petExists, ...data })
    // console.log(pet.id)
    return { pet }
  }
}