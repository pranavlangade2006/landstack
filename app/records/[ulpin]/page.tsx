import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Map, Send } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { ParcelShape } from '@/components/records/parcel-shape'
import { RECORD_TABS, RecordTabs } from '@/components/records/record-tabs'
import { StatusBadge } from '@/components/status-badge'
import { getRecordByUlpin, LAND_RECORDS } from '@/lib/mock-data'

export function generateStaticParams() {
  return LAND_RECORDS.map((r) => ({ ulpin: r.ulpin }))
}

export async function generateMetadata({ params }: { params: Promise<{ ulpin: string }> }): Promise<Metadata> {
  const { ulpin } = await params
  const record = getRecordByUlpin(ulpin)
  return {
    title: record ? `Parcel ${record.ulpin}` : 'Record not found',
    description: record ? `Parcel-centric land record for ${record.parcelId}, ${record.village}, ${record.district}.` : undefined,
  }
}

export default async function RecordDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ ulpin: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const [{ ulpin }, { tab }] = await Promise.all([params, searchParams])
  const record = getRecordByUlpin(ulpin)
  if (!record) notFound()
  const activeTab = RECORD_TABS.some((t) => t.id === tab) ? tab! : 'overview'

  return (
    <>
      <PageHeader
        title={`Parcel ${record.parcelId}`}
        description={`${record.village}, ${record.taluka} taluka, ${record.district} district, ${record.state}`}
        breadcrumb={[{ label: 'Land Records', href: '/records' }, { label: record.ulpin }]}
        actions={
          <>
            <Link href={`/map?ulpin=${record.ulpin}`} className="inline-flex h-9 items-center gap-2 rounded-md border bg-card px-3 text-sm font-medium text-primary hover:bg-secondary">
              <Map className="size-4" aria-hidden="true" /> View on Map
            </Link>
            <Link href={`/services?ulpin=${record.ulpin}#request`} className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              <Send className="size-4" aria-hidden="true" /> Request Service
            </Link>
          </>
        }
      />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="space-y-4 lg:sticky lg:top-32 lg:self-start">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Unique Land Parcel ID</p>
            <p className="mt-1 break-all font-mono text-lg font-semibold text-primary">{record.ulpin}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <StatusBadge status={record.recordStatus} />
              <StatusBadge status={record.ownershipStatus} />
            </div>
          </div>
          <div className="aspect-square overflow-hidden rounded-lg border bg-card">
            <ParcelShape boundary={record.boundary} label={record.parcelId} />
          </div>
          <p className="text-xs text-muted-foreground">
            All departmental datasets on this page are joined through the ULPIN. Values are synthetic demo data.
          </p>
        </aside>
        <div className="min-w-0">
          <RecordTabs record={record} tab={activeTab} />
        </div>
      </div>
    </>
  )
}
