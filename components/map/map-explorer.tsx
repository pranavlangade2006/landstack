'use client'

import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Layers, Loader2, MousePointerClick, Search } from 'lucide-react'
import { DISTRICTS, MAP_LAYERS, PARCELS, type MapLayerId } from '@/lib/mock-data'
import { LayerPanel } from './layer-panel'
import { ParcelPanel } from './parcel-panel'
import type { MapFocus } from './leaflet-map'
import { DemoBadge } from '@/components/status-badge'
import { cn } from '@/lib/utils'

const LeafletMap = dynamic(() => import('./leaflet-map'), {
  ssr: false,
  loading: () => (
    <div className="flex size-full flex-col items-center justify-center gap-3 bg-muted text-sm text-muted-foreground">
      <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
      Loading GIS map…
    </div>
  ),
})

const DEFAULT_LAYERS = Object.fromEntries(
  MAP_LAYERS.map((l) => [l.id, ['cadastral', 'landuse', 'roads', 'water', 'admin'].includes(l.id)]),
) as Record<MapLayerId, boolean>

export function MapExplorer() {
  const params = useSearchParams()
  const initialUlpin = params.get('ulpin')
  const initialValid = initialUlpin && PARCELS.some((p) => p.ulpin === initialUlpin) ? initialUlpin : null

  const [layers, setLayers] = useState(DEFAULT_LAYERS)
  const [basemap, setBasemap] = useState<'streets' | 'satellite'>('streets')
  const [selected, setSelected] = useState<string | null>(initialValid)
  const [focus, setFocus] = useState<MapFocus>(initialValid ? { kind: 'parcel', ulpin: initialValid } : null)
  const [query, setQuery] = useState('')
  const [district, setDistrict] = useState('Pune')
  const [layersOpen, setLayersOpen] = useState(false)

  const selectedParcel = PARCELS.find((p) => p.ulpin === selected) ?? null

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return []
    return PARCELS.filter(
      (p) =>
        p.ulpin.toLowerCase().includes(q) ||
        p.parcelId.toLowerCase().includes(q) ||
        p.village.toLowerCase().includes(q) ||
        p.surveyNo.includes(q),
    ).slice(0, 6)
  }, [query])

  const selectParcel = (ulpin: string, fly = false) => {
    setSelected(ulpin)
    if (fly) setFocus({ kind: 'parcel', ulpin })
  }

  return (
    <div className="flex h-[calc(100dvh-6.5rem)] min-h-[560px] flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b bg-card px-4 py-2.5">
        <h1 className="mr-2 text-base font-semibold">GIS Map</h1>
        <DemoBadge />
        <div className="relative order-last w-full sm:order-none sm:ml-auto sm:w-80">
          <label htmlFor="map-search" className="sr-only">
            Search parcel by ULPIN, parcel ID or village
          </label>
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            id="map-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ULPIN, Parcel ID, village…"
            autoComplete="off"
            className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          />
          {query.trim().length >= 2 && (
            <ul className="absolute inset-x-0 top-10 z-[1200] overflow-hidden rounded-md border bg-popover shadow-lg" role="listbox">
              {matches.length === 0 ? (
                <li className="px-3 py-3 text-sm text-muted-foreground">No parcels match &ldquo;{query}&rdquo;</li>
              ) : (
                matches.map((p) => (
                  <li key={p.ulpin}>
                    <button
                      type="button"
                      className="flex w-full flex-col items-start px-3 py-2 text-left hover:bg-muted"
                      onClick={() => {
                        selectParcel(p.ulpin, true)
                        setDistrict(p.district)
                        setQuery('')
                      }}
                    >
                      <span className="font-mono text-sm font-medium text-primary">{p.ulpin}</span>
                      <span className="text-xs text-muted-foreground">
                        {p.parcelId} · {p.village}, {p.district}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
        <label htmlFor="district-jump" className="sr-only">
          Jump to district
        </label>
        <select
          id="district-jump"
          value={district}
          onChange={(e) => {
            setDistrict(e.target.value)
            setFocus({ kind: 'district', name: e.target.value })
          }}
          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
        >
          {DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d} district
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setLayersOpen((o) => !o)}
          aria-expanded={layersOpen}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-sm font-medium lg:hidden"
        >
          <Layers className="size-4" aria-hidden="true" /> Layers
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1">
        <aside
          aria-label="Map layer controls"
          className={cn(
            'absolute inset-y-0 left-0 z-[1001] w-72 overflow-y-auto border-r bg-card shadow-lg lg:static lg:block lg:shadow-none',
            layersOpen ? 'block' : 'hidden',
          )}
        >
          <LayerPanel
            layers={layers}
            onToggle={(id) => setLayers((prev) => ({ ...prev, [id]: !prev[id] }))}
            basemap={basemap}
            onBasemap={setBasemap}
          />
        </aside>

        <div className="relative isolate min-w-0 flex-1">
          <LeafletMap layers={layers} basemap={basemap} selectedUlpin={selected} focus={focus} onSelect={(u) => selectParcel(u)} />
          {!selectedParcel && (
            <div className="pointer-events-none absolute left-1/2 top-3 z-[1000] flex -translate-x-1/2 items-center gap-2 rounded-md border bg-card/95 px-3 py-2 text-xs font-medium shadow-sm">
              <MousePointerClick className="size-4 text-accent" aria-hidden="true" />
              Click any parcel to view its information
            </div>
          )}
        </div>

        {selectedParcel && (
          <aside
            aria-label="Parcel information"
            className="absolute inset-x-0 bottom-0 z-[1002] max-h-[70%] border-t bg-card shadow-2xl md:inset-x-auto md:inset-y-0 md:right-0 md:max-h-none md:w-96 md:border-l md:border-t-0 lg:static lg:shadow-none"
          >
            <ParcelPanel parcel={selectedParcel} onClose={() => setSelected(null)} />
          </aside>
        )}
      </div>
    </div>
  )
}
