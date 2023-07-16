import { PetsRepository } from '@/repositories/pets-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UnauthorizedError } from '../errors/unauthorized-error'
type DeletePetUseCaseRequest = {
  pet_id: string
  org_id: string
}
type DeletePetUseCaseResponse = void
class DeletePetUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    org_id,
    pet_id,
  }: DeletePetUseCaseRequest): Promise<DeletePetUseCaseResponse> {
    const petExists = await this.petsRepository.findById(pet_id)
    if (!petExists) {
      throw new ResourceNotFoundError()
    }

    if (petExists.organization_id !== org_id) {
      throw new UnauthorizedError()
    }

    await this.petsRepository.delete(pet_id)
  }
}
export { DeletePetUseCase }
