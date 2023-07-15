import { Pet, Prisma } from '@prisma/client'
import { PetsRepository } from '../pets-repository'
import { randomUUID } from 'crypto'

export class PetsRepositoryInMemory implements PetsRepository {
  public items: Pet[] = []
  async create(data: Prisma.PetUncheckedCreateInput) {
    const newItem: Pet = {
      ...data,
      id: data.id ?? randomUUID(),
      years: data.years ?? 'ADULT',
      port: data.port ?? 'AVERAGE',
      dependencyLevel: data.dependencyLevel ?? 'AVERAGE',
      environment: data.environment ?? 'AVERAGE',
      created_at: new Date(),
    }

    this.items.push(newItem)
    return newItem
  }
}
