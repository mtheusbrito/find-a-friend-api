/* eslint-disable prettier/prettier */
import {  Pet, Prisma } from '@prisma/client'
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
    const pet = await prisma.pet.findFirst({
      include: { organization: true, images:{
        include:{
          file: true
        }
      }, requirements: true },
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
    //        data.dependency_level
    //          ? Prisma.sql`AND P.dependency_level::text = ${data.dependency_level}`
    //          : Prisma.empty
    //      }
    //      ${
    //        data.energy_level
    //          ? Prisma.sql`AND P.energy_level::text = ${data.energy_level}`
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

  async fetchAllStates(){
    const data = await prisma.$queryRaw<{state:string}[]>`SELECT DISTINCT  O.state FROM pets AS P JOIN organizations O ON O.id = P.organization_id `;
    return data.map(d =>{
      return {
        name: d.state
       }
    })
  }

  async fetchAllCitiesByState(state: string){
    const data = await prisma.$queryRaw<{city:string}[]>`select distinct O.city FROM pets as P join organizations O on O.id = P.organization_id where UPPER(O.state) = UPPER(${state})`;
    return data.map(d =>{
      return {
        name: d.city
       }
    })
  }
}
