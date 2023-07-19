import { Prisma, File } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { ImagesPetRepository } from '../images-pet-repository'

export class ImagesPetRepositoryPrisma implements ImagesPetRepository {
  async createManyImagesPet(
    data: Prisma.FileUncheckedCreateInput[],
    pet_id: string,
  ) {
    console.log(pet_id)
    const files: File[] = []
    await Promise.all(
      data.map(async (d) => {
        const file = await prisma.file.create({
          data: {
            name: d.name,
            pets: {
              create: [
                {
                  pet: {
                    connect: {
                      id: pet_id,
                    },
                  },
                },
              ],
            },
          },
        })
        files.push(file)
      }),
    )

    return files
  }

  async fetchImagesByPetId(pet_id: string) {
    const images = await prisma.file.findMany({
      where: {
        pets: {
          some: {
            pet: {
              id: pet_id,
            },
          },
        },
      },
    })
    return images
  }

  async findById(id: string) {
    return await prisma.file.findFirst({
      where: {
        id,
      },
      include: {
        pets: true,
      },
    })
  }

  async findByPetIdAndImageId(pet_id: string, file_id: string) {
    return await prisma.imagesOnPets.findFirst({
      where: {
        pet_id,
        file_id,
      },
      include: {
        file: true,
        pet: true,
      },
    })
  }

  async deleteById(id: string) {
    console.log(id)
    await prisma.file.delete({
      where: {
        id,
      },
    })
  }
}
