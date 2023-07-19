import { Prisma, File, ImagesOnPets } from '@prisma/client'

export interface ImagesPetRepository {
  createManyImagesPet(
    data: Prisma.FileUncheckedCreateInput[],
    pet_id: string,
  ): Promise<File[]>
  fetchImagesByPetId(pet_id: string): Promise<File[]>
  findById(id: string): Promise<File | null>
  findByPetIdAndImageId(
    pet_id: string,
    img_id: string,
  ): Promise<ImagesOnPets | null>

  deleteById(id: string): Promise<void>
}
