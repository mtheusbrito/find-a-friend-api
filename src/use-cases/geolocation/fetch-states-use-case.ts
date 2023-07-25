import { PetsRepository } from '@/repositories/pets-repository'

type FetchStatesUseCaseResponse = {
  states: { name: string }[]
}

export class FetchStatesUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute(): Promise<FetchStatesUseCaseResponse> {
    const states = await this.petsRepository.fetchAllStates()

    return {
      states,
    }
  }
}
