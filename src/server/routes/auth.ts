import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { dbClient } from '../db/db'
import { users } from '../db/schema'
import { procedure, router } from '@/utils/trpcRouter'

export const authRoutes = router({
  getUser: procedure.mutation(async () => {

  }),
  createUser: procedure.input(z.object({
    email: z.string().email(),
    password: z.string(),
  })).mutation(async ({ input }) => {
    const { email, password } = input
  }),
})

async function emailExists(email: string) {
  const result = await dbClient.select().from(users).where(eq(users.email, email))
  return result.length > 0
}
