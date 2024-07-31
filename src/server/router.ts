import { authRoutes } from './routes/auth'

import { createCallerFactory, router } from '@/utils/trpcRouter'

export const trpcRouter = router({
  auth: authRoutes,
})

export type TRPCRouter = typeof trpcRouter

const serverCaller = createCallerFactory(trpcRouter)
export const trpcServerCaller = serverCaller({})
