import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialProvider from 'next-auth/providers/credentials'
import type { DefaultSession } from 'next-auth'
import NextAuth from 'next-auth'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { dbClient } from './server/db/db'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    sessionToken: string
    userId: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(dbClient),
  providers: [
    CredentialProvider({
      async authorize(credentials) {
        return null
      },
    }),
    GithubProvider,
    GoogleProvider,
  ],
  pages: {
    signIn: '/',
  },
})
