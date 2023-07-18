import { PetsRepository } from '@/repositories/pets-repository'
import { RequirementsRepository } from '@/repositories/requirements-repository'
import { Requirement } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

type FetchRequirementsByPetRequest = {
  pet_id: string
}
type FetchRequirementsByPetResponse = {
  requirements: Requirement[]
}
export class FetchRequirementsByPetUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private requirementsRepository: RequirementsRepository,
  ) {}

  async execute({
    pet_id,
  }: FetchRequirementsByPetRequest): Promise<FetchRequirementsByPetResponse> {
    const pet = await this.petsRepository.findById(pet_id)

    if (!pet) {
      throw new ResourceNotFoundError()
    }

    const requirements = await this.requirementsRepository.fetchByPetId(pet_id)
    return { requirements }
  }
}
