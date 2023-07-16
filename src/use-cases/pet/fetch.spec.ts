import { beforeEach, describe, expect, it } from 'vitest'
import { FetchPetsUseCase } from './fetch'
import { PetsRepository } from '@/repositories/pets-repository'
import { PetsRepositoryInMemory } from '@/repositories/in-memory/pets-repository-in-memory'
import { OrgsRepository } from '@/repositories/orgs-repository'
import { OrgsRepositoryInMemory } from '@/repositories/in-memory/orgs-repository-in-memory'
import { hash } from 'bcryptjs'

let sut: FetchPetsUseCase
let petsRepository: PetsRepository
let orgsRepository: OrgsRepository
describe('Fetch Pet Use Case', () => {
  beforeEach(() => {
    petsRepository = new PetsRepositoryInMemory()
    orgsRepository = new OrgsRepositoryInMemory()
    sut = new FetchPetsUseCase(petsRepository)
  })

  it('should to be able fetch a pets by attrs', async () => {
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

    await petsRepository.create({
      name: 'Smile dog',
      about: 'awesome',
      dependencyLevel: 'AVERAGE',
      dtype: 'DOG',
      energyLevel: 2,
      environment: 'AVERAGE',
      port: 'AVERAGE',
      years: 'ELDERLY',
      organization_id: org_id,
    })

    await petsRepository.create({
      name: 'Smile cat',
      about: 'awesome',
      dependencyLevel: 'AVERAGE',
      dtype: 'CAT',
      energyLevel: 2,
      environment: 'AVERAGE',
      port: 'AVERAGE',
      years: 'ELDERLY',
      organization_id: org_id,
    })

    expect(
      (await sut.execute({ city: 'Itaperuna', dtype: 'CAT' })).pets.length,
    ).toEqual(1)
  })
})
