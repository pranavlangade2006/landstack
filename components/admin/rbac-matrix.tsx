'use client'

import { useState } from 'react'
import { Check, Minus } from 'lucide-react'
import { PERMISSIONS, ROLES, type Role } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export function RbacMatrix() {
  const [selected, setSelected] = useState<Role>('Revenue Officer')
  const allowed = PERMISSIONS.filter((p) => p.roles.includes(selected)).length

  return (
    <section aria-labelledby="rbac-heading" className="rounded-lg border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
        <div>
          <h2 id="rbac-heading" className="font-semibold">
            Role-based access control
          </h2>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{selected}</span> has {allowed} of {PERMISSIONS.length} permissions
          </p>
        </div>
        <div role="radiogroup" aria-label="Preview role" className="flex flex-wrap gap-1">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              role="radio"
              aria-checked={selected === r}
              onClick={() => setSelected(r)}
              className={cn(
                'h-8 rounded-md border px-2.5 text-xs font-medium',
                selected === r ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:bg-muted',
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <caption className="sr-only">Permissions granted to each role</caption>
          <thead>
            <tr className="border-b bg-muted/60 text-xs text-muted-foreground">
              <th scope="col" className="px-5 py-2.5 text-left font-medium">
                Permission
              </th>
              {ROLES.map((r) => (
                <th key={r} scope="col" className={cn('px-3 py-2.5 text-center font-medium', selected === r && 'bg-secondary text-primary')}>
                  {r}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERMISSIONS.map((p) => (
              <tr key={p.id} className="border-b last:border-0">
                <th scope="row" className="px-5 py-2.5 text-left font-normal">
                  {p.label}
                </th>
                {ROLES.map((r) => {
                  const ok = p.roles.includes(r)
                  return (
                    <td key={r} className={cn('px-3 py-2.5 text-center', selected === r && 'bg-secondary/60')}>
                      {ok ? (
                        <Check className="mx-auto size-4 text-success" aria-label="Allowed" />
                      ) : (
                        <Minus className="mx-auto size-4 text-muted-foreground/50" aria-label="Not allowed" />
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
