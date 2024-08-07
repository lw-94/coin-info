'use client'

import Image from 'next/image'
import { useWindowScroll } from 'react-use'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ThemeButton } from '@/components/theme-button'

export default function HomePage() {
  const [showHeaderBorder, setShowHeaderBorder] = useState(false)
  const { y } = useWindowScroll()
  useEffect(() => {
    setShowHeaderBorder(y > 40)
  }, [y])

  return (
    <div className="h-screen w-full">
      <div className={cn('sticky top-0', showHeaderBorder ? 'border-b' : '')}>
        <div className="flex items-center justify-between h-16 px-8 max-w-[90rem] mx-auto">
          <div className="flex gap-4">
            <Image src="/next.svg" alt="logo" width={120} height={40} />
            <p className="text-3xl">Nextjs Starter</p>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button>Login</Button>
            </Link>
            <ThemeButton />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full items-center justify-center">
        <p className="text-3xl">Home</p>
      </div>
    </div>
  )
}
