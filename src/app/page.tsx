import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { trpcServerCaller } from '@/server/router'

export default async function Home() {
  const authKey = await trpcServerCaller.auth.authKey()

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <form className="w-full max-w-xl flex flex-col gap-4">
        <h1 className="text-center text-3xl font-bold">Create App</h1>
        <Input placeholder="Enter app name" />
        <Textarea placeholder="Enter app description" />
        <Button>Click Me</Button>
      </form>
      <p>{authKey}</p>
    </div>
  )
}
