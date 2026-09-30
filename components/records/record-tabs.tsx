import { AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import type { LandRecord } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatusBadge } from '@/components/status-badge'
import { formatDate, formatINR, haToAcres } from '@/lib/format'
import { cn } from '@/lib/utils'

export const RECORD_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'spatial', label: 'Spatial' },
  { id: 'ownership', label: 'Ownership' },
  { id: 'registration', label: 'Registration' },
  { id: 'zoning', label: 'Land Use & Zoning' },
  { id: 'building', label: 'Building Permission' },
  { id: 'tax', label: 'Property Tax' },
  { id: 'utilities', label: 'Utilities' },
  { id: 'restrictions', label: 'Restrictions' },
] as const

function Fields({ items }: { items: [string, React.ReactNode][] }) {
  return (
    <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
          <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

function Section({ title, source, children }: { title: string; source: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">Source: {source}</p>
      </div>
      <div className="p-5">{children}</div>
    </section>
  )
}

const SEVERITY = {
  Info: { icon: Info, cls: 'border-l-primary' },
  Caution: { icon: AlertTriangle, cls: 'border-l-warning' },
  Critical: { icon: AlertTriangle, cls: 'border-l-destructive' },
}

export function RecordTabs({ record, tab }: { record: LandRecord; tab: string }) {
  const r = record
  return (
    <Tabs defaultValue={tab}>
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <TabsList variant="line" className="w-max justify-start gap-1 border-b pb-1">
          {RECORD_TABS.map((t) => (
            <TabsTrigger key={t.id} value={t.id} className="px-3">
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="overview" className="mt-4">
        <Section title="Parcel Overview" source="Survey & Settlement / Revenue Dept. (Demo)">
          <Fields
            items={[
              ['ULPIN', <span key="u" className="font-mono text-primary">{r.ulpin}</span>],
              ['Parcel ID', <span key="p" className="font-mono">{r.parcelId}</span>],
              ['Survey / Gat No.', r.surveyNo],
              ['State', r.state],
              ['District', r.district],
              ['Taluka', r.taluka],
              ['Village', r.village],
              ['Area', `${r.areaHa.toFixed(2)} ha (${haToAcres(r.areaHa)} acres)`],
              ['Land Use', r.landUse],
              ['Ownership Status', <StatusBadge key="o" status={r.ownershipStatus} />],
              ['Record Status', <StatusBadge key="s" status={r.recordStatus} />],
              ['Last Updated', formatDate(r.lastUpdated)],
            ]}
          />
        </Section>
      </TabsContent>

      <TabsContent value="spatial" className="mt-4">
        <Section title="Spatial Information" source="Cadastral GIS Layer (Demo)">
          <Fields
            items={[
              ['Geometry Type', 'Polygon (WGS 84 / EPSG:4326)'],
              ['Centroid', <span key="c" className="font-mono">{r.centroid[0].toFixed(6)}, {r.centroid[1].toFixed(6)}</span>],
              ['GIS Area', `${r.areaHa.toFixed(2)} ha`],
              ['Vertices', r.boundary.length],
              ['Survey Method', 'ETS / DGPS re-survey'],
              ['Map Sheet', `${r.district.slice(0, 3).toUpperCase()}-${r.taluka.slice(0, 3).toUpperCase()}-${r.surveyNo}`],
            ]}
          />
          <h3 className="mt-5 text-xs font-medium text-muted-foreground">Boundary vertices</h3>
          <div className="mt-2 overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/60 hover:bg-muted/60">
                  <TableHead>Point</TableHead>
                  <TableHead>Latitude</TableHead>
                  <TableHead>Longitude</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {r.boundary.map(([lat, lng], i) => (
                  <TableRow key={i}>
                    <TableCell>P{i + 1}</TableCell>
                    <TableCell className="font-mono text-xs">{lat.toFixed(6)}</TableCell>
                    <TableCell className="font-mono text-xs">{lng.toFixed(6)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Section>
      </TabsContent>

      <TabsContent value="ownership" className="mt-4 space-y-4">
        <Section title="Record of Rights (7/12 Extract)" source="Revenue Dept. RoR (Demo)">
          <Fields items={[['RoR Type', r.ownership.rorType], ['Cultivator', r.ownership.cultivator], ['Tenancy', r.ownership.tenancy]]} />
          <div className="mt-5 overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/60 hover:bg-muted/60">
                  <TableHead>Owner Name</TableHead>
                  <TableHead>Relation</TableHead>
                  <TableHead>Share</TableHead>
                  <TableHead>Khata No.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {r.ownership.owners.map((o) => (
                  <TableRow key={o.name}>
                    <TableCell className="font-medium">{o.name}</TableCell>
                    <TableCell>{o.relation}</TableCell>
                    <TableCell>{o.share}</TableCell>
                    <TableCell className="font-mono text-xs">{o.khataNo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Section>
        <Section title="Mutation History" source="Mutation Register (Demo)">
          <ol className="space-y-3">
            {r.ownership.mutations.map((m) => (
              <li key={m.mutationNo} className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-background px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{m.type}</p>
                  <p className="text-xs text-muted-foreground">
                    Mutation No. <span className="font-mono">{m.mutationNo}</span> · {formatDate(m.date)}
                  </p>
                </div>
                <StatusBadge status={m.status} />
              </li>
            ))}
          </ol>
        </Section>
      </TabsContent>

      <TabsContent value="registration" className="mt-4">
        <Section title="Registration Details" source="IGR Registration Registry (Demo)">
          <Fields
            items={[
              ['Document No.', <span key="d" className="font-mono">{r.registration.documentNo}</span>],
              ['Deed Type', r.registration.deedType],
              ['Registration Date', formatDate(r.registration.registrationDate)],
              ['Sub-Registrar Office', r.registration.subRegistrarOffice],
              ['Consideration Value', formatINR(r.registration.considerationValue)],
              ['Stamp Duty Paid', formatINR(r.registration.stampDuty)],
              ['Encumbrance', r.registration.encumbrance],
            ]}
          />
        </Section>
      </TabsContent>

      <TabsContent value="zoning" className="mt-4">
        <Section title="Land Use & Zoning" source="Town Planning / Development Plan (Demo)">
          <Fields
            items={[
              ['Current Land Use', r.landUse],
              ['Zone', r.zoning.zone],
              ['Permissible FSI', r.zoning.permissibleFsi.toFixed(2)],
              ['Plan Reference', r.zoning.planReference],
            ]}
          />
          <h3 className="mt-5 text-xs font-medium text-muted-foreground">Permitted uses</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {r.zoning.permittedUses.map((u) => (
              <li key={u} className="rounded-md border bg-secondary px-2.5 py-1 text-xs font-medium text-primary">
                {u}
              </li>
            ))}
          </ul>
        </Section>
      </TabsContent>

      <TabsContent value="building" className="mt-4">
        <Section title="Building Permission" source="Urban Local Body / Gram Panchayat (Demo)">
          {r.buildingPermission ? (
            <Fields
              items={[
                ['Permit No.', <span key="p" className="font-mono">{r.buildingPermission.permitNo}</span>],
                ['Status', <StatusBadge key="s" status={r.buildingPermission.status} />],
                ['Built-up Area', `${r.buildingPermission.builtUpAreaSqm.toLocaleString('en-IN')} sq m`],
                ['Floors', `G + ${r.buildingPermission.floors - 1}`],
                ['Approved On', r.buildingPermission.approvedOn ? formatDate(r.buildingPermission.approvedOn) : '—'],
                ['Authority', r.buildingPermission.authority],
              ]}
            />
          ) : (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="size-4" aria-hidden="true" />
              No building permission has been issued or applied for on this parcel.
            </p>
          )}
        </Section>
      </TabsContent>

      <TabsContent value="tax" className="mt-4">
        <Section title="Property Tax" source="Local Body Tax Register (Demo)">
          <Fields
            items={[
              ['Assessment No.', <span key="a" className="font-mono">{r.propertyTax.assessmentNo}</span>],
              ['Annual Tax', formatINR(r.propertyTax.annualTax)],
              ['Payment Status', <StatusBadge key="s" status={r.propertyTax.status} />],
              ['Last Paid On', formatDate(r.propertyTax.lastPaidOn)],
              ['Authority', r.propertyTax.authority],
            ]}
          />
        </Section>
      </TabsContent>

      <TabsContent value="utilities" className="mt-4">
        <Section title="Utilities" source="MSEDCL / Jal Jeevan Mission (Demo)">
          <ul className="grid gap-3 sm:grid-cols-2">
            {r.utilities.map((u) => (
              <li key={u.type} className="flex items-start justify-between gap-3 rounded-md border bg-background p-4">
                <div>
                  <p className="text-sm font-medium">{u.type}</p>
                  <p className="text-xs text-muted-foreground">{u.provider}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{u.reference}</p>
                </div>
                <StatusBadge status={u.status} />
              </li>
            ))}
          </ul>
        </Section>
      </TabsContent>

      <TabsContent value="restrictions" className="mt-4">
        <Section title="Restrictions & Encumbrances" source="Multiple departments (Demo)">
          {r.restrictions.length === 0 ? (
            <p className="flex items-center gap-2 text-sm text-success">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              No restrictions recorded against this parcel.
            </p>
          ) : (
            <ul className="space-y-3">
              {r.restrictions.map((x) => {
                const S = SEVERITY[x.severity]
                return (
                  <li key={x.type} className={cn('flex gap-3 rounded-md border border-l-4 bg-background p-4', S.cls)}>
                    <S.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium">{x.type}</p>
                        <StatusBadge status={x.severity} />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{x.description}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </Section>
      </TabsContent>
    </Tabs>
  )
}
