import type { BuiltInProviderType } from 'next-auth/providers'
import type { ReactNode } from 'react'
import { Button } from './ui/button'
import { signIn } from '@/auth'

export function SignInButton({
  type,
  children,
}: {
  type: BuiltInProviderType
  children?: ReactNode
}) {
  return (
    <form
      action={async () => {
        'use server'
        await signIn(type)
      }}
    >
      <Button
        variant="outline"
        className="w-full"
      >
        {children || ` Login with ${type}`}
      </Button>
    </form>
  )
}
