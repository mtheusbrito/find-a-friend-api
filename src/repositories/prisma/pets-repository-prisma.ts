/* eslint-disable prettier/prettier */
import { Organization, Pet, Prisma } from '@prisma/client'
import { FiltersPet, PetsRepository } from '../pets-repository'
import { prisma } from '@/lib/prisma'

export class PetsRepositoryPrisma implements PetsRepository {
  async create(data: Prisma.PetUncheckedCreateInput) {
    return await prisma.pet.create({ data: { ...data } })
  }

  async save(data: Pet) {
    return await prisma.pet.update({where: {id: data.id},data})
  }

  async delete(id: string): Promise<void> {
    await prisma.pet.delete({ where: { id } })
  }

  async findById(id: string) {
    const pet =  prisma.pet.findFirst({
      include: { organization: true, files: true, requiriments: true },
      where: { id },
      
    })
    return pet
  }

  async fetchAll() {
    return prisma.pet.findMany()
  }
  // SELECT P.* FROM pets as P
  // JOIN organizations as O on O.id = P.organization_id
  // WHERE O.city like '%Itaperuna%'

  async fetchByFilters(data: FiltersPet) {
    const city = `${data.city}`
    const pets = await prisma.$queryRawUnsafe<Pet[]>(
      `SELECT P.* FROM pets as P JOIN organizations as O on O.id = P.organization_id WHERE UPPER(O.city::text) LIKE UPPER('%${city}%')` +
        `${data.dtype ? ` AND P.dtype::text = '${data.dtype}'` : ''}` +
        `${data.dependency_level ? ` AND P.dependency_level::text = '${data.dependency_level}'`: ''}` +
        `${data.energy_level ? ` AND P.energy_level = ${data.energy_level}` : ''}` +
        `${data.environment ? ` AND P.environment::text = '${data.environment}'`: ''}` +
        `${data.port ? ` AND P.port::text = '${data.port}'` : ''}` +
        `${data.years ? ` AND P.years::text = '${data.years}'` : ''}`,
    )
    // const pets = await prisma.$queryRaw<Pet[]>(Prisma.sql`
    //     SELECT P.* FROM pets as P
    //         JOIN organizations as O on O.id = P.organization_id
    //      WHERE UPPER(O.city::text) LIKE UPPER('%${Prisma.sql`${city.toString()}`}%') ${
    //        data.dtype
    //          ? Prisma.sql`AND P.dtype::text = ${data.dtype}`
    //          : Prisma.empty
    //      }
    //      ${
    //        data.dependencyLevel
    //          ? Prisma.sql`AND P.dependencyLevel::text = ${data.dependencyLevel}`
    //          : Prisma.empty
    //      }
    //      ${
    //        data.energyLevel
    //          ? Prisma.sql`AND P.energyLevel::text = ${data.energyLevel}`
    //          : Prisma.empty
    //      }
    //      ${
    //        data.environment
    //          ? Prisma.sql`AND P.environment::text = ${data.environment}`
    //          : Prisma.empty
    //      }
    //      ${
    //        data.port
    //          ? Prisma.sql`AND P.port::text = ${data.port}`
    //          : Prisma.empty
    //      }
    //      ${
    //        data.years
    //          ? Prisma.sql`AND P.years::text = ${data.years}`
    //          : Prisma.empty
    //      }
    //      `)
    return pets
  }
}
