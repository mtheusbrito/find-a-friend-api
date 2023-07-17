import { beforeEach, describe, expect, it } from 'vitest'
import { GetInfoPetUseCase } from './get-info'
import { PetsRepository } from '@/repositories/pets-repository'
import { OrgsRepository } from '@/repositories/orgs-repository'
import { OrgsRepositoryInMemory } from '@/repositories/in-memory/orgs-repository-in-memory'
import { PetsRepositoryInMemory } from '@/repositories/in-memory/pets-repository-in-memory'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

let sut: GetInfoPetUseCase
let petsRepository: PetsRepository
let orgsRepository: OrgsRepository
describe('Get Info Pet Use Case', () => {
  beforeEach(() => {
    petsRepository = new PetsRepositoryInMemory()
    orgsRepository = new OrgsRepositoryInMemory()
    sut = new GetInfoPetUseCase(petsRepository)
  })

  it('should to be able get info specific pet', async () => {
    const { id: org_id } = await orgsRepository.create({
      responsible: 'Test',
      email: 'test@mail',
      address: 'address',
      zip_code: '2899999',
      city: 'Itaperuna',
      state: 'Rio de Janeiro',
      latitude: 0,
      longitude: 0,
      phone: '22999999',
      password_hash: await hash('abc123', 6),
    })
    const { id: pet_id } = await petsRepository.create({
      name: 'Smile dog',
      about: 'awesome',
      dependency_level: 'AVERAGE',
      dtype: 'DOG',
      energy_level: 2,
      environment: 'AVERAGE',
      port: 'AVERAGE',
      years: 'ELDERLY',
      organization_id: org_id,
    })

    const { pet } = await sut.execute({ pet_id })
    expect(pet.id).toEqual(expect.any(String))
  })
  it('should not to be able get info inexistent pet', async () => {
    expect(async () => {
      await sut.execute({ pet_id: 'pet-01' })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
