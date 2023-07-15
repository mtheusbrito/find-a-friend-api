import { env } from '@/env'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})

// prisma.$use(async (params, next) => {
//   // Check incoming query type
//   const model = params.model

//   if (
//     model === 'File' ||
//     model === 'Organization' ||
//     model === 'Pet' ||
//     model === 'Requirement'
//   ) {
//     if (params.args === undefined) {
//       params.args = {}
//     }
//     if (params.action === 'findMany') {
//       // Find many queries

//       if (params.args && params.args.where) {
//         if (params.args.where.deleted_at === undefined) {
//           // Exclude deleted records if they have not been explicitly requested
//           params.args.where.deleted_at = null
//         }
//       } else {
//         params.args.where = { deleted_at: null }
//       }
//     }
//     if (params.action === 'delete') {
//       // Delete queries
//       // Change action to an update
//       params.action = 'update'
//       params.args.data = { deleted_at: new Date() }
//     }
//     if (params.action === 'deleteMany') {
//       // Delete many queries
//       params.action = 'updateMany'
//       if (params.args.data !== undefined) {
//         params.args.data.deleted_at = new Date()
//       } else {
//         params.args.data = { deleted_at: new Date() }
//       }
//     }
//   }
//   return next(params)
// })
