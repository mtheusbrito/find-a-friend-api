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
  energyLevel?: number | null
  dependencyLevel?: Dependency | null
  environment?: Environment | null
}
export interface PetsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
  save(data: Prisma.PetUncheckedUpdateInput): Promise<Pet>
  delete(id: string): Promise<void>
  findById(id: string): Promise<Pet | null>
  fetchAll(): Promise<Pet[]>
  fetchByFilters(data: FiltersPet): Promise<Pet[]>
}
