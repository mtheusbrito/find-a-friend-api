import { RequirementsRepository } from '@/repositories/requirements-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { PetsRepository } from '@/repositories/pets-repository'
import { UnauthorizedError } from '../errors/unauthorized-error'

type DeleteRequirementUseCaseRequest = {
  req_id: string
  pet_id: string
  org_id: string
}
type DeleteRequirementUseCaseResponse = void
class DeleteRequirementUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private requirementsRepository: RequirementsRepository,
  ) {}

  async execute({
    pet_id,
    org_id,
    req_id,
  }: DeleteRequirementUseCaseRequest): Promise<DeleteRequirementUseCaseResponse> {
    const requirement = await this.requirementsRepository.findById(req_id)

    if (!requirement) {
      throw new ResourceNotFoundError()
    }

    const pet = await this.petsRepository.findById(pet_id)
    if (!pet) {
      throw new ResourceNotFoundError()
    }

    if (pet.id !== requirement.pet_id) {
      throw new UnauthorizedError()
    }

    if (pet.organization_id !== org_id) {
      throw new UnauthorizedError()
    }

    await this.requirementsRepository.delete(req_id)
  }
}

export { DeleteRequirementUseCase }
