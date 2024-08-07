import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { SignOutButton } from '@/components/sign-out-button'

export default async function AuthPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/')
  }

  return (
    <div>
      <p>
        Hi,
        {session.user.name}
      </p>
      <SignOutButton />
    </div>
  )
}
