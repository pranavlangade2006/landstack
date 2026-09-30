import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { DemoBadge } from './status-badge'

export function PageHeader({
  title,
  description,
  breadcrumb,
  actions,
  demo = true,
}: {
  title: string
  description?: string
  breadcrumb?: { label: string; href?: string }[]
  actions?: React.ReactNode
  demo?: boolean
}) {
  return (
    <div className="border-b bg-card">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {breadcrumb && (
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Home
                </Link>
              </li>
              {breadcrumb.map((item) => (
                <li key={item.label} className="flex items-center gap-1">
                  <ChevronRight className="size-3" aria-hidden="true" />
                  {item.href ? (
                    <Link href={item.href} className="hover:text-foreground">
                      {item.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-foreground">
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">{title}</h1>
              {demo && <DemoBadge />}
            </div>
            {description && <p className="mt-1.5 max-w-3xl text-sm text-muted-foreground text-pretty">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  )
}
