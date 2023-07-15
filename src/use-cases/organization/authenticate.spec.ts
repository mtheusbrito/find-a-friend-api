import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateOrgUseCase } from './authenticate'
import { OrgsRepositoryInMemory } from '@/repositories/in-memory/orgs-repository-in-memory'
import { RegisterOrgUseCase } from './register-org'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

let sut: AuthenticateOrgUseCase
let orgsRepository: OrgsRepositoryInMemory
let registerAuthenticateUseCase: RegisterOrgUseCase

describe('Register Organization Use Case', async () => {
  beforeEach(() => {
    orgsRepository = new OrgsRepositoryInMemory()
    sut = new AuthenticateOrgUseCase(orgsRepository)
    registerAuthenticateUseCase = new RegisterOrgUseCase(orgsRepository)
  })

  it('should to be able authenticate a organization', async () => {
    await registerAuthenticateUseCase.execute({
      responsible: 'Test',
      email: 'test@mail',
      address: 'address',
      zip_code: '2899999',
      city: 'Itaperuna',
      state: 'Rio de Janeiro',
      latitude: 0,
      longitude: 0,
      phone: '22999999',
      password: 'abc123',
    })
    const { org } = await sut.execute({
      email: 'test@mail',
      password: 'abc123',
    })

    expect(org.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate a non-existent organization', async () => {
    expect(async () => {
      await sut.execute({
        email: 'test@mail',
        password: 'abc123',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate an organization with incorrect password', async () => {
    await registerAuthenticateUseCase.execute({
      responsible: 'Test',
      email: 'test@mail',
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
        email: 'test@mail',
        password: 'password',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
