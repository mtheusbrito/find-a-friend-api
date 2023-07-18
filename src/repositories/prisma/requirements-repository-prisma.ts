import { Prisma, Requirement } from '@prisma/client'
import { RequirementsRepository } from '../requirements-repository'
import { prisma } from '@/lib/prisma'

export class RequirementsRepositoryPrisma implements RequirementsRepository {
  async create(
    data: Prisma.RequirementUncheckedCreateInput,
  ): Promise<Requirement> {
    const requirement = await prisma.requirement.create({ data: { ...data } })
    return requirement
  }

  async delete(id: string): Promise<void> {
    await prisma.requirement.delete({ where: { id } })
  }

  async fetchByPetId(pet_id: string): Promise<Requirement[]> {
    return await prisma.requirement.findMany({
      where: {
        pet_id,
      },
    })
  }

  async createMany(
    data: Prisma.RequirementUncheckedCreateInput[],
  ): Promise<Requirement[]> {
    console.log(data)
    await prisma.requirement.createMany({
      data,
      skipDuplicates: true,
    })

    return await this.fetchByPetId(data[0].pet_id)
  }

  async findById(id: string) {
    return await prisma.requirement.findFirst({
      where: { id },
      include: { pet: true },
    })
  }
}
