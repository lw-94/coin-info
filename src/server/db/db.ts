import { drizzle } from 'drizzle-orm/postgres-js'
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http'
import postgres from 'postgres'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

function createDB() {
  const neonDBUrl = process.env.NEON_DB_URL

  if (neonDBUrl) {
    return drizzleNeon(neon(neonDBUrl), { schema })
  }
  else {
    const queryClient = postgres('postgres://postgres:123456@0.0.0.0:5432/postgres')
    return drizzle(queryClient, { schema })
  }
}

// for query purposes
export const dbClient = createDB()
