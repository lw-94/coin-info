import { Button } from './ui/button'
import { signOut } from '@/auth'

export function SignOut() {
  return (
    <form
      action={async () => {
        'use server'
        await signOut()
      }}
    >
      <Button type="submit">Signout</Button>
    </form>
  )
}
