import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  real,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import type { AdapterAccountType } from 'next-auth/adapters'

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  password: text('password'),
})

export const accounts = pgTable('account', {
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').$type<AdapterAccountType>().notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, account => ({
  compoundKey: primaryKey({
    columns: [account.provider, account.providerAccountId],
  }),
}))

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable('verificationToken', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
}, verificationToken => ({
  compositePk: primaryKey({
    columns: [verificationToken.identifier, verificationToken.token],
  }),
}))

export const authenticators = pgTable('authenticator', {
  credentialId: text('credentialID').notNull().unique(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  providerAccountId: text('providerAccountId').notNull(),
  credentialPublicKey: text('credentialPublicKey').notNull(),
  counter: integer('counter').notNull(),
  credentialDeviceType: text('credentialDeviceType').notNull(),
  credentialBackedUp: boolean('credentialBackedUp').notNull(),
  transports: text('transports'),
}, authenticator => ({
  compositePK: primaryKey({
    columns: [authenticator.userId, authenticator.credentialId],
  }),
}))

// 公用的需要用function返回
function createHLPriceSchema() {
  return {
    id: serial('id').primaryKey(),
    high: real('high').default(0),
    low: real('low').default(0),
    amplitude: real('amplitude').default(0),
    date: varchar('date', { length: 10 }).notNull(),
    timestamp: timestamp('timestamp', { mode: 'date' }).notNull().unique(),
    createAt: timestamp('createAt', { mode: 'date' }).notNull().defaultNow(),
    updateAt: timestamp('updateAt', { mode: 'date' }).notNull().defaultNow(),
  }
}

export const btcPriceInfoDay = pgTable('btcPriceInfoDay', createHLPriceSchema())

export const btcPriceInfoWeek = pgTable('btcPriceInfoWeek', createHLPriceSchema())

export const btcPriceInfoMonth = pgTable('btcPriceInfoMonth', createHLPriceSchema())
