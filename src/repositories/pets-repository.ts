import { Pet, Prisma } from '@prisma/client'

export interface PetsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
  save(data: Prisma.PetUncheckedUpdateInput): Promise<Pet>
  findById(id: string): Promise<Pet | null>
}
