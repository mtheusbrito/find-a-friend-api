import {
  DType,
  Dependency,
  Environment,
  Pet,
  Port,
  Prisma,
  Years,
} from '@prisma/client'
import { FiltersPet, PetsRepository } from '../pets-repository'
import { randomUUID } from 'crypto'
import { GetResult } from '@prisma/client/runtime/library'

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

  async save(data: Pet) {
    const index = this.items.findIndex((p) => p.id === data.id)
    if (index >= 0) {
      this.items[index] = { ...data }
    }
    return this.items[index]
  }

  async findById(id: string) {
    const pet = this.items.find((p) => p.id === id)
    if (!pet) {
      return null
    }
    return pet
  }

  async delete(id: string) {
    this.items = this.items.filter((p) => p.id !== id)
  }

  async fetchAll() {
    const pets = this.items
    return pets
  }

  async fetchByFilters(data: FiltersPet) {
    return this.items.filter((p) => {
      const withDtype = p.dtype.includes(data.dtype ?? '')
      const withYears = p.years.includes(data.years ?? '')
      const withPort = p.port.includes(data.port ?? '')
      const withEnergyLevel = p.energyLevel
        .toString()
        .includes(data.energyLevel?.toString() ?? '')
      const withDependencyLevel = p.dependencyLevel.includes(
        data.dependencyLevel ?? '',
      )
      const withEnvironment = p.environment.includes(data.environment ?? '')
      return (
        withDtype &&
        withYears &&
        withPort &&
        withEnergyLevel &&
        withDependencyLevel &&
        withEnvironment
      )
    })
  }
}
