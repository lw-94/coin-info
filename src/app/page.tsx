import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Link href="/admin/hlprice">
        <Button>Login</Button>
      </Link>
    </div>
  )
}
