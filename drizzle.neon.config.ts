import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/server/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://coin-info_owner:UKj8dD9VzrEH@ep-sparkling-sound-a1m55d3y.ap-southeast-1.aws.neon.tech/coin-info?sslmode=require',
  },
})
