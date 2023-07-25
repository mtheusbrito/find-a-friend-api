import {
  DType,
  Dependency,
  Environment,
  Pet,
  Port,
  Prisma,
  Years,
} from '@prisma/client'
export type FiltersPet = {
  city: string
  dtype?: DType | null
  years?: Years | null
  port?: Port | null
  energy_level?: number | null
  dependency_level?: Dependency | null
  environment?: Environment | null
}
export interface PetsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
  save(data: Pet): Promise<Pet>
  delete(id: string): Promise<void>
  findById(id: string): Promise<Pet | null>
  fetchAll(): Promise<Pet[]>
  fetchByFilters(data: FiltersPet): Promise<Pet[]>
  fetchAllStates(): Promise<{ name: string }[]>
  fetchAllCitiesByState(state: string): Promise<{ name: string }[]>
}
