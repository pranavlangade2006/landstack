import Link from 'next/link'
import { CheckCircle2, ClipboardList, Layers, Users } from 'lucide-react'
import { LAND_RECORDS, MAP_LAYERS, NOTIFICATIONS, SERVICE_REQUESTS, USERS } from '@/lib/mock-data'
import { StatCard } from '@/components/stat-card'
import { StatusBadge } from '@/components/status-badge'
import { ApplicationsTable } from '@/components/services/applications-table'
import { RbacMatrix } from './rbac-matrix'
import { AuditLogTable } from './audit-log-table'
import { formatArea, formatDate } from '@/lib/format'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border bg-card">
      <div className="flex items-center justify-between gap-3 border-b px-5 py-4">
        <h2 className="font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

export function OverviewSection() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active users" value={String(USERS.filter((u) => u.status === 'Active').length)} icon={Users} hint={`${USERS.length} total`} />
        <StatCard label="Records verified" value={String(LAND_RECORDS.filter((r) => r.recordStatus === 'Verified').length)} icon={CheckCircle2} tone="accent" hint={`of ${LAND_RECORDS.length}`} />
        <StatCard label="Open applications" value={String(SERVICE_REQUESTS.filter((r) => !['Approved', 'Rejected'].includes(r.status)).length)} icon={ClipboardList} />
        <StatCard label="Published layers" value={String(MAP_LAYERS.length)} icon={Layers} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <AuditLogTable limit={6} />
        <Panel title="Alerts">
          <ul className="divide-y">
            {NOTIFICATIONS.map((n) => (
              <li key={n.id} className="px-5 py-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{n.title}</p>
                  <StatusBadge status={n.tone === 'destructive' ? 'Critical' : n.tone === 'warning' ? 'Action' : 'Info'} tone={n.tone} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
      <RbacMatrix />
    </div>
  )
}

export function UsersSection() {
  return (
    <div className="space-y-6">
      <Panel title="Users" action={<span className="text-xs text-muted-foreground">{USERS.length} users</span>}>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="pl-5">Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden md:table-cell">Office</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {USERS.map((u) => (
              <TableRow key={u.email}>
                <TableCell className="pl-5">
                  <p className="font-medium">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">{u.office}</TableCell>
                <TableCell>
                  <StatusBadge status={u.status} tone={u.status === 'Active' ? 'success' : 'neutral'} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>
      <RbacMatrix />
    </div>
  )
}

export function ParcelsSection() {
  const flagged = LAND_RECORDS.filter((r) => r.recordStatus !== 'Verified').slice(0, 12)
  return (
    <Panel title="Parcels needing attention" action={<Link href="/map" className="text-sm font-medium text-primary hover:underline">Open map</Link>}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/60 hover:bg-muted/60">
            <TableHead className="pl-5">Parcel</TableHead>
            <TableHead>Village</TableHead>
            <TableHead className="text-right">Area</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flagged.map((r) => (
            <TableRow key={r.ulpin}>
              <TableCell className="pl-5">
                <Link href={`/records/${r.ulpin}`} className="font-mono text-xs font-medium text-primary hover:underline">
                  {r.ulpin}
                </Link>
                <p className="text-xs text-muted-foreground">{r.parcelId}</p>
              </TableCell>
              <TableCell>{r.village}</TableCell>
              <TableCell className="text-right tabular-nums">{formatArea(r.areaHa)}</TableCell>
              <TableCell>
                <StatusBadge status={r.recordStatus} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Panel>
  )
}

export function RecordsSection() {
  const recent = [...LAND_RECORDS].sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated)).slice(0, 12)
  return (
    <Panel title="Recently updated records" action={<Link href="/records" className="text-sm font-medium text-primary hover:underline">All records</Link>}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/60 hover:bg-muted/60">
            <TableHead className="pl-5">ULPIN</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead className="hidden md:table-cell">Khata</TableHead>
            <TableHead>Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recent.map((r) => (
            <TableRow key={r.ulpin}>
              <TableCell className="pl-5">
                <Link href={`/records/${r.ulpin}`} className="font-mono text-xs font-medium text-primary hover:underline">
                  {r.ulpin}
                </Link>
              </TableCell>
              <TableCell>{r.ownership.owners[0]?.name}</TableCell>
              <TableCell className="hidden md:table-cell">{r.ownership.khataNo}</TableCell>
              <TableCell className="text-muted-foreground">{formatDate(r.lastUpdated)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Panel>
  )
}

export function ApplicationsSection() {
  return <ApplicationsTable requests={SERVICE_REQUESTS} />
}

export function LayersSection() {
  return (
    <Panel title="Published GIS layers">
      <ul className="divide-y">
        {MAP_LAYERS.map((l) => (
          <li key={l.id} className="flex items-center justify-between gap-4 px-5 py-3">
            <div>
              <p className="text-sm font-medium">{l.name}</p>
              <p className="text-xs text-muted-foreground">
                {l.source} · {l.features} features · GeoJSON
              </p>
            </div>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              Public
              <Switch defaultChecked={l.id !== 'utilities'} aria-label={`Publish ${l.name} publicly`} />
            </label>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

export function SettingsSection() {
  const settings = [
    ['Require OTP for owner PII access', true],
    ['Enable anomaly detection jobs', true],
    ['Sync IGR registrations nightly', true],
    ['Allow public API access (read-only)', false],
    ['Show demo data banner', true],
  ] as const
  return (
    <Panel title="System settings">
      <ul className="divide-y">
        {settings.map(([label, on]) => (
          <li key={label} className="flex items-center justify-between gap-4 px-5 py-3">
            <span className="text-sm">{label}</span>
            <Switch defaultChecked={on} aria-label={label} />
          </li>
        ))}
      </ul>
      <p className="border-t px-5 py-3 text-xs text-muted-foreground">Settings are local to this demo and are not persisted.</p>
    </Panel>
  )
}
