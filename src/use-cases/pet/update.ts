type UpdatePetUseCaseRequest = {
  name: string
}

type UpdatePetUseCaseResponse = void
export class UpdatePetUseCase {
  async execute({
    ...data
  }: UpdatePetUseCaseRequest): Promise<UpdatePetUseCaseResponse> {
    console.log({ ...data })
  }
}
