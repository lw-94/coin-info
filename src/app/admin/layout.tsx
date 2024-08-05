import Link from 'next/link'
import {
  LineChart,
  List,
  PanelLeft,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const menu = [
    {
      path: '/admin/hlprice',
      name: 'Table',
      icon: <List className="h-5 w-5" />,
    },
    {
      path: '/admin/kline',
      name: 'Kline',
      icon: <LineChart className="h-5 w-5" />,
    },
  ]
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          {
            menu.map(item => (
              <TooltipProvider key={item.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.path}
                      className={cn('flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:bg-accent md:h-8 md:w-8')}
                    >
                      {item.icon}
                      <span className="sr-only">{item.name}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))
          }
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              {/* <SheetHeader>
            <SheetTitle>123</SheetTitle>
            <SheetDescription>456</SheetDescription>
          </SheetHeader> */}
              <nav className="grid gap-6 text-lg font-medium">
                {
                  menu.map(item => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))
                }
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  )
}
