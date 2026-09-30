import type { Metadata } from 'next'
import Link from 'next/link'
import { Map } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { RecordsTable } from '@/components/records/records-table'
import { PARCELS } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'Land Records',
  description: 'Search parcel-centric land records by ULPIN, parcel ID, village, district, land use and status.',
}

export default function RecordsPage() {
  return (
    <>
      <PageHeader
        title="Land Records"
        description="Search the parcel-centric record registry. Each record links RoR, registration, zoning, tax and utility data through the ULPIN."
        breadcrumb={[{ label: 'Land Records' }]}
        actions={
          <Link href="/map" className="inline-flex h-9 items-center gap-2 rounded-md border bg-card px-3 text-sm font-medium text-primary hover:bg-secondary">
            <Map className="size-4" aria-hidden="true" /> View on GIS Map
          </Link>
        }
      />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <RecordsTable parcels={PARCELS} />
      </div>
    </>
  )
}
