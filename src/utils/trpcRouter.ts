import { TRPCError, initTRPC } from '@trpc/server'
import { auth } from '@/auth'

const t = initTRPC.create()

export const { router, middleware, procedure, createCallerFactory } = t

const checkAuthMiddleware = middleware(async ({ ctx, next }) => {
  const session = await auth()
  if (!session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    })
  }
  return next({
    ctx: {
      ...ctx,
      session,
    },
  })
})

export const authProcedure = procedure.use(checkAuthMiddleware)
