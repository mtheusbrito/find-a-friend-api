import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

type GetInfoPetUseCaseRequest = {
  pet_id: string
}
type GetInfoPetUseCaseResponse = {
  pet: Pet
}
class GetInfoPetUseCase {
  constructor(private petsRepository: PetsRepository) {}
  async execute({
    pet_id,
  }: GetInfoPetUseCaseRequest): Promise<GetInfoPetUseCaseResponse> {
    const pet = await this.petsRepository.findById(pet_id)

    if (!pet) {
      throw new ResourceNotFoundError()
    }

    return { pet }
  }
}
export { GetInfoPetUseCase }
