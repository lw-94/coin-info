import { drizzle } from 'drizzle-orm/postgres-js'
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http'
import postgres from 'postgres'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

function createDB() {
  const vercelDBUrl = process.env.VERCEL_DB_URL // vercel storage 使用的是neon服务

  if (vercelDBUrl) {
    return drizzleNeon(neon(vercelDBUrl), { schema })
  }
  else {
    const queryClient = postgres('postgres://postgres:123456@0.0.0.0:5432/postgres')
    return drizzle(queryClient, { schema })
  }
}

// for query purposes
export const dbClient = createDB()
