import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { PetsRepository } from '@/repositories/pets-repository'
import { UnauthorizedError } from '../errors/unauthorized-error'
import { ImagesPetRepository } from '@/repositories/images-pet-repository'
import { deleteFile } from '@/utils/file'

type DeleteImageUseCaseRequest = {
  img_id: string
  pet_id: string
  org_id: string
}
type DeleteImageUseCaseResponse = void
class DeleteImageUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private imagesPetRepository: ImagesPetRepository,
  ) {}

  async execute({
    pet_id,
    org_id,
    img_id,
  }: DeleteImageUseCaseRequest): Promise<DeleteImageUseCaseResponse> {
    const pet = await this.petsRepository.findById(pet_id)
    if (!pet) {
      throw new ResourceNotFoundError()
    }
    if (pet.organization_id !== org_id) {
      throw new UnauthorizedError()
    }

    const image = await this.imagesPetRepository.findById(img_id)

    if (!image) {
      throw new ResourceNotFoundError()
    }

    const imageOnPet = await this.imagesPetRepository.findByPetIdAndImageId(
      pet.id,
      image.id,
    )

    if (!imageOnPet) {
      throw new UnauthorizedError()
    }

    await this.imagesPetRepository.deleteById(image.id)
    await deleteFile(`./tmp/pets/${image.name}`)
  }
}

export { DeleteImageUseCase }
