'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDeferredValue, useMemo, useState } from 'react'
import { ChevronRight, FileSearch, RotateCcw, Search } from 'lucide-react'
import { DISTRICTS, LAND_USES, RECORD_STATUSES } from '@/lib/mock-data'
import type { Parcel } from '@/lib/types'
import { StatusBadge } from '@/components/status-badge'
import { formatDate } from '@/lib/format'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const PAGE_SIZE = 12

function FilterSelect({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  options: readonly string[]
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-md border border-input bg-background px-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}

export function RecordsTable({ parcels }: { parcels: Parcel[] }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [district, setDistrict] = useState('')
  const [landUse, setLandUse] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const deferredQuery = useDeferredValue(query)
  const isStale = deferredQuery !== query

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    return parcels.filter((p) => {
      if (district && p.district !== district) return false
      if (landUse && p.landUse !== landUse) return false
      if (status && p.recordStatus !== status) return false
      if (!q) return true
      return [p.ulpin, p.parcelId, p.village, p.district, p.taluka, p.surveyNo].some((f) => f.toLowerCase().includes(q))
    })
  }, [parcels, deferredQuery, district, landUse, status])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const hasFilters = query || district || landUse || status

  const reset = () => {
    setQuery('')
    setDistrict('')
    setLandUse('')
    setStatus('')
    setPage(1)
  }

  const withReset = (setter: (v: string) => void) => (v: string) => {
    setter(v)
    setPage(1)
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="grid gap-3 border-b p-4 md:grid-cols-[1fr_auto_auto_auto_auto] md:items-end">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="record-search" className="text-xs font-medium text-muted-foreground">
            Search
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              id="record-search"
              type="search"
              value={query}
              onChange={(e) => withReset(setQuery)(e.target.value)}
              placeholder="ULPIN, Parcel ID, survey no., village…"
              className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </div>
        </div>
        <FilterSelect id="f-district" label="District" value={district} onChange={withReset(setDistrict)} options={DISTRICTS} />
        <FilterSelect id="f-landuse" label="Land use" value={landUse} onChange={withReset(setLandUse)} options={LAND_USES} />
        <FilterSelect id="f-status" label="Record status" value={status} onChange={withReset(setStatus)} options={RECORD_STATUSES} />
        <button
          type="button"
          onClick={reset}
          disabled={!hasFilters}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border px-3 text-sm font-medium text-muted-foreground hover:bg-muted disabled:opacity-50"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" /> Reset
        </button>
      </div>

      <div className="flex items-center justify-between px-4 py-2.5 text-xs text-muted-foreground">
        <p aria-live="polite">
          Showing <span className="font-medium text-foreground">{filtered.length}</span> of {parcels.length} records
        </p>
        <p className="hidden sm:block">Click a row to open the parcel record</p>
      </div>

      <div className={isStale ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 border-t px-4 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted">
              <FileSearch className="size-6 text-muted-foreground" aria-hidden="true" />
            </span>
            <p className="font-medium">No land records found</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Try a different ULPIN or parcel ID, or clear the filters to see all demo records.
            </p>
            <button type="button" onClick={reset} className="mt-2 text-sm font-medium text-primary hover:underline">
              Clear all filters
            </button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/60 hover:bg-muted/60">
                <TableHead className="pl-4">ULPIN</TableHead>
                <TableHead>Parcel ID</TableHead>
                <TableHead>Village</TableHead>
                <TableHead>District</TableHead>
                <TableHead className="text-right">Area (ha)</TableHead>
                <TableHead>Land Use</TableHead>
                <TableHead>Record Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-8">
                  <span className="sr-only">Open</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => (
                <TableRow key={p.ulpin} className="cursor-pointer" onClick={() => router.push(`/records/${p.ulpin}`)}>
                  <TableCell className="pl-4">
                    <Link href={`/records/${p.ulpin}`} className="font-mono text-sm font-medium text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                      {p.ulpin}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{p.parcelId}</TableCell>
                  <TableCell>{p.village}</TableCell>
                  <TableCell>{p.district}</TableCell>
                  <TableCell className="text-right tabular-nums">{p.areaHa.toFixed(2)}</TableCell>
                  <TableCell>{p.landUse}</TableCell>
                  <TableCell>
                    <StatusBadge status={p.recordStatus} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(p.lastUpdated)}</TableCell>
                  <TableCell>
                    <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {filtered.length > PAGE_SIZE && (
        <nav aria-label="Pagination" className="flex items-center justify-between border-t px-4 py-3 text-sm">
          <p className="text-muted-foreground">
            Page {currentPage} of {pageCount}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 rounded-md border px-3 font-medium hover:bg-muted disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage === pageCount}
              className="h-8 rounded-md border px-3 font-medium hover:bg-muted disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </nav>
      )}
    </div>
  )
}
