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
  energy_level: number
  dependency_level: Dependency
  environment: Environment
  org_id: string
  pet_id: string
}

type UpdatePetUseCaseResponse = { pet: Pet }
export class UpdatePetUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    name,
    about,
    dtype,
    years,
    port,
    energy_level,
    dependency_level,
    environment,
    ...data
  }: UpdatePetUseCaseRequest): Promise<UpdatePetUseCaseResponse> {
    const petExists = await this.petsRepository.findById(data.pet_id)
    if (!petExists) {
      throw new ResourceNotFoundError()
    }

    if (petExists.organization_id !== data.org_id) {
      throw new UnauthorizedError()
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const pet = await this.petsRepository.save({
      ...petExists,
      name,
      about,
      dtype,
      years,
      port,
      energy_level,
      dependency_level,
      environment,
    })

    return { pet }
  }
}
