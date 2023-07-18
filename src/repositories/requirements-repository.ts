import { Prisma, Requirement } from '@prisma/client'

export interface RequirementsRepository {
  create(data: Prisma.RequirementUncheckedCreateInput): Promise<Requirement>
  createMany(
    data: Prisma.RequirementUncheckedCreateInput[],
  ): Promise<Requirement[]>
  delete(id: string): Promise<void>
  fetchByPetId(id: string): Promise<Requirement[]>
  findById(id: string): Promise<Requirement | null>
}
