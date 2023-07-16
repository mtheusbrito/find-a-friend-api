import { beforeEach, describe, expect, it } from 'vitest'
import { UpdatePetUseCase } from './update'
import { PetsRepository } from '@/repositories/pets-repository'
import { PetsRepositoryInMemory } from '@/repositories/in-memory/pets-repository-in-memory'
import { OrgsRepository } from '@/repositories/orgs-repository'
import { OrgsRepositoryInMemory } from '@/repositories/in-memory/orgs-repository-in-memory'
import { hash } from 'bcryptjs'
import { UnauthorizedError } from '../errors/unauthorized-error'

let sut: UpdatePetUseCase
let petsRepository: PetsRepositoryInMemory
let orgsRepository: OrgsRepository
describe('Update Pet Use Case', () => {
  beforeEach(() => {
    petsRepository = new PetsRepositoryInMemory()
    orgsRepository = new OrgsRepositoryInMemory()
    sut = new UpdatePetUseCase(petsRepository)
  })

  it('should to be able update a pet', async () => {
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
    const { id: pet_id, ...data } = await petsRepository.create({
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

    const { pet } = await sut.execute({
      ...data,
      name: 'Smile dog edited',
      pet_id,
      organization_id: org_id,
    })
    expect(pet.name).toEqual('Smile dog edited')
    expect(petsRepository.items).toEqual([
      expect.objectContaining({ name: 'Smile dog edited' }),
    ])
  })

  it('should not be possible to update a pet from a different organization', async () => {
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
    const { id: pet_id, ...data } = await petsRepository.create({
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
        ...data,
        name: 'Smile dog edited',
        pet_id,
        organization_id: 'eeee',
      })
    }).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
