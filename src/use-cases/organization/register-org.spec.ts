import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterOrgUseCase } from './register-org'
import { OrgsRepositoryInMemory } from '@/repositories/in-memory/orgs-repository-in-memory'
import { compare } from 'bcryptjs'
import { OrgAlreadyExistsError } from '../errors/org-already-exists-error'

let organizationsRepository: OrgsRepositoryInMemory
let sut: RegisterOrgUseCase
describe('Register Organization Use Case', async () => {
  beforeEach(() => {
    organizationsRepository = new OrgsRepositoryInMemory()
    sut = new RegisterOrgUseCase(organizationsRepository)
  })
  it('should to be able register a organization', async () => {
    const { org } = await sut.execute({
      responsible: 'Test',
      mail: 'test@mail',
      address: 'address',
      zip_code: '2899999',
      city: 'Itaperuna',
      state: 'Rio de Janeiro',
      latitude: 0,
      longitude: 0,
      phone: '22999999',
      password: 'abc123',
    })

    expect(org.id).toEqual(expect.any(String))
  })

  it('should hash organization password upon registration', async () => {
    const { org } = await sut.execute({
      responsible: 'Test',
      mail: 'test@mail',
      address: 'address',
      zip_code: '2899999',
      city: 'Itaperuna',
      state: 'Rio de Janeiro',
      latitude: 0,
      longitude: 0,
      phone: '22999999',
      password: 'abc123',
    })
    const isPasswordCorrectlyHashed = await compare('abc123', org.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
  it('should not be able to register with same email twice', async () => {
    await sut.execute({
      responsible: 'Test',
      mail: 'test@mail',
      address: 'address',
      zip_code: '2899999',
      city: 'Itaperuna',
      state: 'Rio de Janeiro',
      latitude: 0,
      longitude: 0,
      phone: '22999999',
      password: 'abc123',
    })

    expect(async () => {
      await sut.execute({
        responsible: 'Test',
        mail: 'test@mail',
        address: 'address',
        zip_code: '2899999',
        city: 'Itaperuna',
        state: 'Rio de Janeiro',
        latitude: 0,
        longitude: 0,
        phone: '22999999',
        password: 'abc123',
      })
    }).rejects.toBeInstanceOf(OrgAlreadyExistsError)
  })
})
