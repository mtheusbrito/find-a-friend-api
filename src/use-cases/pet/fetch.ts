import { PetsRepository } from '@/repositories/pets-repository'
import {
  DType,
  Dependency,
  Environment,
  Pet,
  Port,
  Years,
} from '@prisma/client'

type FetchPetsUseCaseRequest = {
  city: string
  dtype?: DType | null
  years?: Years | null
  port?: Port | null
  energy_level?: number | null
  dependency_level?: Dependency | null
  environment?: Environment | null
}
type FetchPetsUseCaseResponse = {
  pets: Pet[]
}
export class FetchPetsUseCase {
  constructor(private petsRepository: PetsRepository) {}
  async execute({
    ...data
  }: FetchPetsUseCaseRequest): Promise<FetchPetsUseCaseResponse> {
    const pets = await this.petsRepository.fetchByFilters(data)

    return { pets }
  }
}
