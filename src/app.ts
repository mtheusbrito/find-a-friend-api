import fastify from 'fastify'
import fastifyBlipp from 'fastify-blipp'
import { prisma } from './lib/prisma'

export const app = fastify()

app.register(fastifyBlipp)

app.get('/', async (request, reply) => {
  // await prisma.organization.create({
  //   data: {
  //     responsible: 'Test',
  //     address: 'Test',
  //     mail: 'mail@test.com',
  //     number: '11 99999999',
  //     password_hash: '1123123',
  //     zip_code: '13123123',
  //   },
  // })
  await prisma.organization.delete({
    where: {
      id: '790700c5-3805-4d2e-8bf1-6e6f2f019a1a',
    },
  })
  const orgs = await prisma.organization.findMany({
    // where: { id: '790700c5-3805-4d2e-8bf1-6e6f2f019a1a' },
  })

  // await prisma.pet.create({
  //   data: {
  //     organization_id: '790700c5-3805-4d2e-8bf1-6e6f2f019a1a',
  //     name: 'aaaa',
  //     about: 'aaaaaa',
  //   },
  // })
  const pets = await prisma.pet.findMany()
  return reply.status(200).send({ message: 'It`s works!', pets })
})
