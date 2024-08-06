import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/server/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgres://default:d3iW8qTrflcs@ep-young-bar-a1b6wmvf.ap-southeast-1.aws.neon.tech:5432/verceldb?sslmode=require',
  },
})
