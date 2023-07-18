import { Prisma, Requirement } from '@prisma/client'
import { RequirementsRepository } from '../requirements-repository'
import { randomUUID } from 'crypto'

class RequirementsRepositoryInMemory implements RequirementsRepository {
  public items: Requirement[] = []
  async create(data: Prisma.RequirementUncheckedCreateInput) {
    const newItem: Requirement = {
      ...data,
      id: data.id ?? randomUUID(),
      created_at: new Date(),
    }

    this.items.push(newItem)
    return newItem
  }

  async delete(id: string) {
    this.items = this.items.filter((i) => i.id !== id)
  }

  async fetchByPetId(pet_id: string) {
    return this.items.filter((i) => i.pet_id === pet_id)
  }

  async createMany(data: Prisma.RequirementUncheckedCreateInput[]) {
    this.items = [
      ...this.items,
      ...data.map((r) => {
        return { ...r, id: r.id ?? randomUUID(), created_at: new Date() }
      }),
    ]

    return await this.fetchByPetId(data[0].pet_id)
  }

  async findById(id: string) {
    const requirement = this.items.find((r) => r.id === id)
    if (requirement) {
      return requirement
    }
    return null
  }
}

export { RequirementsRepositoryInMemory }
