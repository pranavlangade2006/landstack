import type { Metadata } from 'next'
import { CheckCircle2, ClipboardList, Layers, TriangleAlert } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { ChartCard, DonutChart, MonthlyChart, SimpleBarChart, VerificationChart } from '@/components/analytics/charts'
import { LandIntelligence } from '@/components/analytics/land-intelligence'
import { DISTRICTS, LAND_RECORDS, LAND_USE_COLORS, LAND_USES, MONTHLY_REQUESTS, SERVICE_REQUESTS, VILLAGES } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'GIS Analytics',
  description: 'Land use distribution, verification status, service requests and parcel size analytics for Land Stack demo data.',
}

const AREA_BUCKETS: [string, number, number][] = [
  ['< 0.5 ha', 0, 0.5],
  ['0.5–1 ha', 0.5, 1],
  ['1–2 ha', 1, 2],
  ['2–4 ha', 2, 4],
  ['> 4 ha', 4, Infinity],
]

export default function AnalyticsPage() {
  const records = LAND_RECORDS
  const landUse = LAND_USES.map((u) => ({ name: u, value: records.filter((r) => r.landUse === u).length, color: LAND_USE_COLORS[u] })).filter((d) => d.value > 0)
  const verification = DISTRICTS.map((d) => {
    const inDistrict = records.filter((r) => r.district === d)
    const verified = inDistrict.filter((r) => r.recordStatus === 'Verified').length
    return { name: d, verified, unverified: inDistrict.length - verified }
  })
  const statusColors: Record<string, string> = {
    Submitted: 'var(--chart-3)',
    'Under Review': 'var(--chart-4)',
    'Field Verification': 'var(--chart-5)',
    Approved: 'var(--chart-2)',
    Rejected: 'var(--destructive)',
  }
  const requestStatus = Object.keys(statusColors).map((s) => ({ name: s, value: SERVICE_REQUESTS.filter((r) => r.status === s).length, color: statusColors[s] }))
  const areaDist = AREA_BUCKETS.map(([name, min, max]) => ({ name, value: records.filter((r) => r.areaHa >= min && r.areaHa < max).length }))

  const verifiedCount = records.filter((r) => r.recordStatus === 'Verified').length
  const discrepancies = records.filter((r) => r.recordStatus === 'Discrepancy').length

  return (
    <>
      <PageHeader title="GIS Analytics" description="Parcel-level analytics across districts, land use and citizen services." breadcrumb={[{ label: 'Analytics' }]} />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Parcels analysed" value={String(records.length)} icon={Layers} hint={`${DISTRICTS.length} districts · ${VILLAGES.length} villages`} />
          <StatCard label="Verification rate" value={`${Math.round((verifiedCount / records.length) * 100)}%`} icon={CheckCircle2} tone="accent" hint={`${verifiedCount} verified records`} />
          <StatCard label="Service requests" value={String(SERVICE_REQUESTS.length)} icon={ClipboardList} hint="Last 90 days" />
          <StatCard label="Data discrepancies" value={String(discrepancies)} icon={TriangleAlert} tone="destructive" hint="Flagged for review" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Land use distribution" description="Share of parcels by current land use">
            <DonutChart data={landUse} />
          </ChartCard>
          <ChartCard title="Verified vs unverified records" description="By district">
            <VerificationChart data={verification} />
          </ChartCard>
          <ChartCard title="Service requests by status" description="All open and closed applications">
            <SimpleBarChart data={requestStatus} layout="vertical" />
          </ChartCard>
          <ChartCard title="Parcel distribution by area" description="Number of parcels per size band">
            <SimpleBarChart data={areaDist} color="var(--chart-3)" />
          </ChartCard>
        </div>

        <ChartCard title="Monthly service requests" description="State-wide demo volume, April – September 2026">
          <MonthlyChart data={MONTHLY_REQUESTS} />
        </ChartCard>

        <LandIntelligence records={records} />
      </div>
    </>
  )
}
