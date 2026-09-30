'use client'

import { useMemo, useState } from 'react'
import { AUDIT_LOGS } from '@/lib/mock-data'
import { StatusBadge } from '@/components/status-badge'
import { cn } from '@/lib/utils'

export function AuditLogTable({ limit }: { limit?: number }) {
  const modules = useMemo(() => ['All', ...Array.from(new Set(AUDIT_LOGS.map((l) => l.module)))], [])
  const [module, setModule] = useState('All')
  const rows = AUDIT_LOGS.filter((l) => module === 'All' || l.module === module).slice(0, limit)

  return (
    <section aria-labelledby="audit-heading" className="rounded-lg border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
        <h2 id="audit-heading" className="font-semibold">
          Audit logs
        </h2>
        {!limit && (
          <div className="flex flex-wrap gap-1" role="group" aria-label="Filter by module">
            {modules.map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={module === m}
                onClick={() => setModule(m)}
                className={cn('h-7 rounded-md border px-2 text-xs', module === m ? 'border-primary bg-secondary font-medium text-primary' : 'hover:bg-muted')}
              >
                {m}
              </button>
            ))}
          </div>
        )}
      </div>
      <ol className="divide-y">
        {rows.map((l) => (
          <li key={l.id} className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-center sm:gap-4">
            <time className="w-32 shrink-0 font-mono text-xs text-muted-foreground">{l.timestamp}</time>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{l.action}</p>
              <p className="text-xs text-muted-foreground">
                {l.user} · {l.role} · {l.module}
              </p>
            </div>
            <StatusBadge status={l.status} tone={l.status === 'Success' ? 'success' : l.status === 'Failed' ? 'destructive' : 'warning'} />
          </li>
        ))}
      </ol>
    </section>
  )
}
