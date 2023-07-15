import { Organization, Prisma } from '@prisma/client'
import { OrgsRepository } from '../orgs-repository'
import { randomUUID } from 'crypto'

export class OrgsRepositoryInMemory implements OrgsRepository {
  public items: Organization[] = []

  async create(data: Prisma.OrganizationCreateInput) {
    const newItem: Organization = {
      ...data,
      id: randomUUID(),
      latitude: new Prisma.Decimal(
        data.latitude ? data.latitude.toString() : 0,
      ),
      longitude: new Prisma.Decimal(
        data.longitude ? data.longitude.toString() : 0,
      ),
      city: data.city ?? '',
      state: data.state ?? '',
      phone: data.phone ?? '',
      created_at: new Date(),
    }
    this.items.push(newItem)
    return newItem
  }

  async findByEmail(email: string) {
    const org = this.items.find((o) => o.mail === email)
    if (!org) {
      return null
    }
    return org
  }
}
