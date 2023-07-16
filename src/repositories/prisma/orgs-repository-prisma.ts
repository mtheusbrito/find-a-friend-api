import { Prisma } from '@prisma/client'
import { OrgsRepository } from '../orgs-repository'
import { prisma } from '@/lib/prisma'

export class OrgsRepositoryPrisma implements OrgsRepository {
  async create(data: Prisma.OrganizationCreateInput) {
    const org = await prisma.organization.create({
      data: {
        ...data,
      },
    })
    return org
  }

  async findByEmail(email: string) {
    const org = await prisma.organization.findFirst({
      where: {
        email,
      },
    })
    return org
  }

  async findById(id: string) {
    const org = await prisma.organization.findFirst({ where: { id } })
    return org
  }
}
