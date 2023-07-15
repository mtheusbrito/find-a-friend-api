import { beforeEach, describe, expect, it } from 'vitest'
import { CreatePetUseCase } from './create'
import { PetsRepository } from '@/repositories/pets-repository'
import { PetsRepositoryInMemory } from '@/repositories/in-memory/pets-repository-in-memory'
import { OrgsRepository } from '@/repositories/orgs-repository'
import { OrgsRepositoryInMemory } from '@/repositories/in-memory/orgs-repository-in-memory'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

let sut: CreatePetUseCase
let petsRepository: PetsRepository
let orgsRepository: OrgsRepository

describe('Create Pet Use Case', async () => {
  beforeEach(async () => {
    petsRepository = new PetsRepositoryInMemory()
    orgsRepository = new OrgsRepositoryInMemory()
    sut = new CreatePetUseCase(petsRepository, orgsRepository)
  })

  it('should to be able create a pet', async () => {
    const org = await orgsRepository.create({
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
    const { pet } = await sut.execute({
      name: 'Smile dog',
      about: 'awesome',
      dependencyLevel: 'AVERAGE',
      dtype: 'DOG',
      energyLevel: 2,
      environment: 'AVERAGE',
      port: 'AVERAGE',
      years: 'ELDERLY',
      organization_id: org.id,
    })

    expect(pet.id).toEqual(expect.any(String))
  })

  it('should not be able to create a pet to a non-existent organization', async () => {
    expect(async () => {
      await sut.execute({
        name: 'Smile dog',
        about: 'awesome',
        dependencyLevel: 'AVERAGE',
        dtype: 'DOG',
        energyLevel: 2,
        environment: 'AVERAGE',
        port: 'AVERAGE',
        years: 'ELDERLY',
        organization_id: 'org-01',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
