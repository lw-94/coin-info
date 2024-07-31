import { procedure, router } from '@/utils/trpcRouter'

export const authRoutes = router({
  authKey: procedure.query(async () => {
    return process.env.AUTH_SECRET
  }),
})
