'use client'

import Link from 'next/link'
import { FileText, ReceiptText, Send, X } from 'lucide-react'
import type { Parcel } from '@/lib/types'
import { DemoBadge, StatusBadge } from '@/components/status-badge'
import { formatDate, haToAcres } from '@/lib/format'

export function ParcelPanel({ parcel, onClose }: { parcel: Parcel; onClose: () => void }) {
  const rows: [string, React.ReactNode][] = [
    ['ULPIN', <span key="u" className="font-mono font-semibold text-primary">{parcel.ulpin}</span>],
    ['Parcel ID', <span key="p" className="font-mono">{parcel.parcelId}</span>],
    ['Survey / Gat No.', parcel.surveyNo],
    ['District', parcel.district],
    ['Taluka', parcel.taluka],
    ['Village', parcel.village],
    ['Area', `${parcel.areaHa.toFixed(2)} ha (${haToAcres(parcel.areaHa)} acres)`],
    ['Land Use', parcel.landUse],
    ['Ownership Status', <StatusBadge key="o" status={parcel.ownershipStatus} />],
    ['Record Status', <StatusBadge key="r" status={parcel.recordStatus} />],
    ['Last Updated', formatDate(parcel.lastUpdated)],
  ]

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-2 border-b px-4 py-3">
        <div>
          <h2 className="text-base font-semibold">Parcel Information</h2>
          <DemoBadge className="mt-1" />
        </div>
        <button type="button" onClick={onClose} aria-label="Close parcel panel" className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
          <X className="size-4" />
        </button>
      </div>
      <dl className="flex-1 divide-y overflow-y-auto px-4">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 py-2.5 text-sm">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="text-right font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="grid gap-2 border-t p-4">
        <Link href={`/records/${parcel.ulpin}`} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <FileText className="size-4" aria-hidden="true" /> View Land Record
        </Link>
        <Link href={`/records/${parcel.ulpin}?tab=registration`} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border bg-card text-sm font-medium text-primary hover:bg-secondary">
          <ReceiptText className="size-4" aria-hidden="true" /> View Registration
        </Link>
        <Link href={`/services?ulpin=${parcel.ulpin}#request`} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-accent text-sm font-medium text-accent-foreground hover:bg-accent/90">
          <Send className="size-4" aria-hidden="true" /> Submit Service Request
        </Link>
      </div>
    </div>
  )
}
