import { beforeEach, describe, expect, it } from 'vitest'
import { DeletePetUseCase } from './delete'
import { PetsRepository } from '@/repositories/pets-repository'
import { PetsRepositoryInMemory } from '@/repositories/in-memory/pets-repository-in-memory'
import { OrgsRepository } from '@/repositories/orgs-repository'
import { OrgsRepositoryInMemory } from '@/repositories/in-memory/orgs-repository-in-memory'
import { hash } from 'bcryptjs'
import { UnauthorizedError } from '../errors/unauthorized-error'

let sut: DeletePetUseCase
let petsRepository: PetsRepository
let orgsRepository: OrgsRepository
describe('Delete Pet Use Case', async () => {
  beforeEach(() => {
    orgsRepository = new OrgsRepositoryInMemory()
    petsRepository = new PetsRepositoryInMemory()
    sut = new DeletePetUseCase(petsRepository)
  })

  it('should to be able delete a pet', async () => {
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
      dependencyLevel: 'AVERAGE',
      dtype: 'DOG',
      energyLevel: 2,
      environment: 'AVERAGE',
      port: 'AVERAGE',
      years: 'ELDERLY',
      organization_id: org_id,
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

    await sut.execute({
      org_id,
      pet_id,
    })
    const petsCount = (await petsRepository.fetchAll()).length
    expect(petsCount).toEqual(2)
  })

  it('should not be possible to delete a pet from a different organization', async () => {
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
      dependencyLevel: 'AVERAGE',
      dtype: 'DOG',
      energyLevel: 2,
      environment: 'AVERAGE',
      port: 'AVERAGE',
      years: 'ELDERLY',
      organization_id: org_id,
    })

    expect(async () => {
      await sut.execute({
        pet_id,
        org_id: 'eeee',
      })
    }).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
