'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Bell, ChevronDown, Layers3, LogIn, Menu, User, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NOTIFICATIONS } from '@/lib/mock-data'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const NAV = [
  { href: '/', label: 'Dashboard' },
  { href: '/map', label: 'GIS Map' },
  { href: '/records', label: 'Land Records' },
  { href: '/services', label: 'Services' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/admin', label: 'Admin' },
  { href: '/about', label: 'About' },
]

const TONE_DOT = {
  warning: 'bg-warning',
  success: 'bg-success',
  destructive: 'bg-destructive',
  info: 'bg-primary',
}

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <header className="sticky top-0 z-[1100] border-b bg-card">
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-1.5 text-xs sm:px-6 lg:px-8">
          <p>
            <span className="font-semibold">Smart India Hackathon 2026 Prototype</span>
            <span className="opacity-80"> · Problem Statement SIH26014 · Team OrbitIQ12</span>
          </p>
          <p className="opacity-90">Demo data only — not connected to official land records</p>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Layers3 className="size-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-base font-bold leading-tight tracking-wide text-primary">
              LAND <span className="text-accent">STACK</span>
            </span>
            <span className="hidden truncate text-[11px] leading-tight text-muted-foreground sm:block">
              Integrated GIS-Based Digital Public Infrastructure for Land Governance
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="ml-auto hidden xl:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-secondary text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 xl:ml-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="relative flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label={`Notifications, ${NOTIFICATIONS.length} unread`}
            >
              <Bell className="size-5" aria-hidden="true" />
              <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-white">
                {NOTIFICATIONS.length}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Notifications (Demo)</DropdownMenuLabel>
                {NOTIFICATIONS.map((n) => (
                  <DropdownMenuItem key={n.id} className="items-start gap-2.5 py-2">
                    <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', TONE_DOT[n.tone])} aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{n.title}</span>
                      <span className="block text-xs text-muted-foreground">{n.body}</span>
                      <span className="mt-0.5 block text-[11px] text-muted-foreground">{n.time}</span>
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-md px-1.5 py-1 hover:bg-muted" aria-label="User profile menu">
              <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-primary">
                GU
              </span>
              <ChevronDown className="hidden size-4 text-muted-foreground sm:block" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <span className="block text-sm font-medium text-foreground">Guest User</span>
                  <span className="block">Role: Citizen (Demo)</span>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href="/services" />}>
                <User aria-hidden="true" /> My Applications
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/login" />}>
                <LogIn aria-hidden="true" /> Sign in
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/login"
            className="hidden items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 sm:inline-flex"
          >
            <LogIn className="size-4" aria-hidden="true" />
            Login
          </Link>

          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted xl:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t bg-card xl:hidden">
          <ul className="mx-auto grid max-w-7xl gap-1 px-4 py-3 sm:grid-cols-2 sm:px-6">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'block rounded-md px-3 py-2 text-sm font-medium',
                    isActive(item.href) ? 'bg-secondary text-primary' : 'text-foreground hover:bg-muted',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="sm:hidden">
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-muted">
                Login
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
