import { authProcedure, router } from '@/utils/trpcRouter'

export const authRoutes = router({
  authKey: authProcedure.query(async () => {
    return process.env.AUTH_SECRET
  }),
})
