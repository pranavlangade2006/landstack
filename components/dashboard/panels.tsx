import Link from 'next/link'
import { ArrowUpRight, FileSearch, FilePen, History, Info, ReceiptText, ShieldCheck, Send } from 'lucide-react'
import { NOTIFICATIONS, PARCEL_ACTIVITY, SERVICE_REQUESTS } from '@/lib/mock-data'
import { StatusBadge } from '@/components/status-badge'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

function Panel({ title, href, children }: { title: string; href?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b px-5 py-3.5">
        <h2 className="text-sm font-semibold">{title}</h2>
        {href && (
          <Link href={href} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            View all <ArrowUpRight className="size-3" aria-hidden="true" />
          </Link>
        )}
      </div>
      <div className="flex-1">{children}</div>
    </section>
  )
}

export function RecentServices() {
  return (
    <Panel title="Recent Land Services" href="/services">
      <ul className="divide-y">
        {SERVICE_REQUESTS.slice(0, 5).map((s) => (
          <li key={s.applicationId} className="flex items-center justify-between gap-3 px-5 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{s.serviceType}</p>
              <p className="truncate text-xs text-muted-foreground">
                <span className="font-mono">{s.applicationId}</span> · {s.applicant} · {formatDate(s.submittedOn)}
              </p>
            </div>
            <StatusBadge status={s.status} />
          </li>
        ))}
      </ul>
    </Panel>
  )
}

export function ParcelActivity() {
  return (
    <Panel title="Recent Parcel Activity" href="/records">
      <ol className="space-y-0 px-5 py-2">
        {PARCEL_ACTIVITY.map((a, i) => (
          <li key={a.ulpin + i} className="relative flex gap-3 py-2.5">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
              <History className="size-3.5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium">{a.action}</p>
              <p className="text-xs text-muted-foreground">
                <Link href={`/records/${a.ulpin}`} className="font-mono text-primary hover:underline">
                  {a.parcelId}
                </Link>{' '}
                · {a.actor} · {a.time}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  )
}

const TONE = {
  warning: 'border-l-warning',
  success: 'border-l-success',
  destructive: 'border-l-destructive',
  info: 'border-l-primary',
}

export function NotificationsPanel() {
  return (
    <Panel title="Notifications">
      <ul className="space-y-2 p-4">
        {NOTIFICATIONS.map((n) => (
          <li key={n.id} className={cn('rounded-md border border-l-4 bg-background px-3 py-2.5', TONE[n.tone])}>
            <p className="text-sm font-medium">{n.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{n.time}</p>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

const QUICK = [
  { label: 'Ownership Verification', icon: ShieldCheck },
  { label: 'Land Record Search', icon: FileSearch },
  { label: 'Registration Status', icon: ReceiptText },
  { label: 'Mutation / Record Update', icon: FilePen },
  { label: 'Property Information', icon: Info },
  { label: 'Service Request', icon: Send },
]

export function QuickServices() {
  return (
    <Panel title="Quick Services" href="/services">
      <ul className="grid grid-cols-2 gap-2 p-4">
        {QUICK.map((q) => (
          <li key={q.label}>
            <Link
              href={`/services?service=${encodeURIComponent(q.label)}#request`}
              className="flex h-full flex-col gap-2 rounded-md border bg-background p-3 text-sm font-medium hover:border-primary/40 hover:bg-secondary"
            >
              <q.icon className="size-5 text-accent" aria-hidden="true" />
              {q.label}
            </Link>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
