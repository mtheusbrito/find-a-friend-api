import { Pet, Prisma } from '@prisma/client'
import { FiltersPet, PetsRepository } from '../pets-repository'
import { randomUUID } from 'crypto'

export class PetsRepositoryInMemory implements PetsRepository {
  public items: Pet[] = []
  async create(data: Prisma.PetUncheckedCreateInput) {
    const newItem: Pet = {
      ...data,
      id: data.id ?? randomUUID(),
      years: data.years ?? 'ADULT',
      port: data.port ?? 'AVERAGE',
      dependency_level: data.dependency_level ?? 'AVERAGE',
      energy_level: data.energy_level ?? 1,
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
      const withenergy_level = p.energy_level
        .toString()
        .includes(data.energy_level?.toString() ?? '')
      const withdependency_level = p.dependency_level.includes(
        data.dependency_level ?? '',
      )
      const withEnvironment = p.environment.includes(data.environment ?? '')
      return (
        withDtype &&
        withYears &&
        withPort &&
        withenergy_level &&
        withdependency_level &&
        withEnvironment
      )
    })
  }
}
