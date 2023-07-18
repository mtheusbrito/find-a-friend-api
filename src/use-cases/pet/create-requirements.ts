import { PetsRepository } from '@/repositories/pets-repository'
import { RequirementsRepository } from '@/repositories/requirements-repository'
import { Requirement } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UnauthorizedError } from '../errors/unauthorized-error'

type CreateRequirementsRequest = {
  requirements: string[]
  org_id: string
  pet_id: string
}
type CreateRequirementsResponse = {
  requirements: Requirement[]
}
export class CreateRequirementsUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private requirementsRepository: RequirementsRepository,
  ) {}

  async execute({
    org_id,
    requirements,
    pet_id,
  }: CreateRequirementsRequest): Promise<CreateRequirementsResponse> {
    const pet = await this.petsRepository.findById(pet_id)

    if (!pet) {
      throw new ResourceNotFoundError()
    }

    if (pet.organization_id !== org_id) {
      throw new UnauthorizedError()
    }

    const requirementsCreated = await this.requirementsRepository.createMany(
      requirements.map((r) => {
        return { description: r, pet_id }
      }),
    )
    return { requirements: requirementsCreated }
  }
}
