import { makeFetchCitiesByStateUseCase } from '@/use-cases/factories/make-fetch-cities-by-state-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchCitiesByState(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getParamsSchema = z.object({
    state: z.string(),
  })

  const { state } = getParamsSchema.parse(request.params)

  const fetchCitiesByStateUseCase = makeFetchCitiesByStateUseCase()

  const { cities } = await fetchCitiesByStateUseCase.execute({
    state,
  })
  return reply.status(200).send({
    cities,
  })
}
