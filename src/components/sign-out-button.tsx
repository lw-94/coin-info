import type { ReactNode } from 'react'
import { Button } from './ui/button'
import { signOut } from '@/auth'

export function SignOutButton({
  children,
}: {
  children?: ReactNode
}) {
  return (
    <form
      action={async () => {
        'use server'
        await signOut()
      }}
    >
      <Button type="submit">
        {children || 'Logout'}
      </Button>
    </form>
  )
}
