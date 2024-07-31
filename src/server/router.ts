import { authRoutes } from './routes/auth'

import { btcInfoRoutes } from './routes/btcInfo'
import { createCallerFactory, router } from '@/utils/trpcRouter'

export const trpcRouter = router({
  auth: authRoutes,
  btcInfo: btcInfoRoutes,
})

export type TRPCRouter = typeof trpcRouter

const serverCaller = createCallerFactory(trpcRouter)
export const trpcServerCaller = serverCaller({})
