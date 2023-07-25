import { PetsRepository } from '@/repositories/pets-repository'

type FetchCitiesByStateUseCaseRequest = {
  state: string
}
type FetchCitiesByStateUseCaseResponse = {
  cities: { name: string }[]
}
export class FetchCitiesByStateUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    state,
  }: FetchCitiesByStateUseCaseRequest): Promise<FetchCitiesByStateUseCaseResponse> {
    const cities = await this.petsRepository.fetchAllCitiesByState(state)
    return {
      cities,
    }
  }
}
