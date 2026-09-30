'use client'

import { LAND_USE_COLORS, LAND_USES, MAP_LAYERS, type MapLayerId } from '@/lib/mock-data'

const LAYER_SWATCH: Record<MapLayerId, string> = {
  cadastral: '#1f3a73',
  landuse: '#65a30d',
  zoning: '#f59e0b',
  roads: '#78716c',
  water: '#38bdf8',
  buildings: '#64748b',
  utilities: '#eab308',
  admin: '#6b21a8',
}

export function LayerPanel({
  layers,
  onToggle,
  basemap,
  onBasemap,
}: {
  layers: Record<MapLayerId, boolean>
  onToggle: (id: MapLayerId) => void
  basemap: 'streets' | 'satellite'
  onBasemap: (b: 'streets' | 'satellite') => void
}) {
  return (
    <div className="space-y-5 p-4">
      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Base map</legend>
        <div className="grid grid-cols-2 gap-1 rounded-md bg-muted p-1">
          {(['streets', 'satellite'] as const).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => onBasemap(b)}
              aria-pressed={basemap === b}
              className={`rounded px-2 py-1.5 text-xs font-medium capitalize ${basemap === b ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {b}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Map layers</legend>
        <ul className="space-y-1">
          {MAP_LAYERS.map((layer) => (
            <li key={layer.id}>
              <label className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 hover:bg-muted">
                <input
                  type="checkbox"
                  checked={layers[layer.id]}
                  onChange={() => onToggle(layer.id)}
                  className="size-4 accent-[#1f3a73]"
                />
                <span className="size-3 shrink-0 rounded-sm" style={{ backgroundColor: LAYER_SWATCH[layer.id] }} aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{layer.name}</span>
                  <span className="block text-[11px] text-muted-foreground">
                    {layer.source} · {layer.features} features
                  </span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      {layers.landuse && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Land use legend</p>
          <ul className="grid grid-cols-1 gap-1.5 text-xs">
            {LAND_USES.map((u) => (
              <li key={u} className="flex items-center gap-2">
                <span className="size-3 rounded-sm" style={{ backgroundColor: LAND_USE_COLORS[u] }} aria-hidden="true" />
                {u}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Parcel outline</p>
        <ul className="space-y-1.5 text-xs">
          <li className="flex items-center gap-2"><span className="h-0.5 w-5 bg-[#1f3a73]" aria-hidden="true" />Verified</li>
          <li className="flex items-center gap-2"><span className="h-0.5 w-5 bg-[#b45309]" aria-hidden="true" />Pending verification</li>
          <li className="flex items-center gap-2"><span className="h-0.5 w-5 bg-[#0369a1]" aria-hidden="true" />Under mutation</li>
          <li className="flex items-center gap-2"><span className="h-0 w-5 border-t-2 border-dashed border-[#dc2626]" aria-hidden="true" />Discrepancy</li>
        </ul>
      </div>
    </div>
  )
}
