import { PetsRepository } from '@/repositories/pets-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UnauthorizedError } from '../errors/unauthorized-error'
import { ImagesPetRepository } from '@/repositories/images-pet-repository'
import { File } from '@prisma/client'
type UploadImagesPetUseCaseRequest = {
  images_name: string[]
  pet_id: string
  org_id: string
}
type UploadImagesPetUseCaseResponse = {
  images: File[]
}
export class UploadImagesPetUseCase {
  constructor(
    private imagesPetRepository: ImagesPetRepository,
    private petsRepository: PetsRepository,
  ) {}

  async execute({
    images_name,
    pet_id,
    org_id,
  }: UploadImagesPetUseCaseRequest): Promise<UploadImagesPetUseCaseResponse> {
    const pet = await this.petsRepository.findById(pet_id)
    if (!pet) {
      throw new ResourceNotFoundError()
    }

    if (pet.organization_id !== org_id) {
      throw new UnauthorizedError()
    }

    const images = await this.imagesPetRepository.createManyImagesPet(
      images_name.map((i) => {
        return { name: i }
      }),
      pet_id,
    )

    return { images }
  }
}
