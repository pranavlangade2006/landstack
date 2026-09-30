'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import { CircleMarker, MapContainer, Polygon, Polyline, ScaleControl, TileLayer, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import {
  ADMIN_BOUNDARIES,
  BUILDINGS,
  LAND_USE_COLORS,
  PARCELS,
  ROADS,
  UTILITIES,
  WATER_BODIES,
  ZONING,
  type MapLayerId,
} from '@/lib/mock-data'
import type { LatLng } from '@/lib/types'

export type MapFocus = { kind: 'parcel'; ulpin: string } | { kind: 'district'; name: string } | null

const BASEMAPS = {
  streets: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Imagery &copy; Esri',
  },
}

const STATUS_STROKE: Record<string, string> = {
  Verified: '#1f3a73',
  'Pending Verification': '#b45309',
  'Under Mutation': '#0369a1',
  Discrepancy: '#dc2626',
}

function FocusController({ focus }: { focus: MapFocus }) {
  const map = useMap()
  useEffect(() => {
    if (!focus) return
    let points: LatLng[] = []
    if (focus.kind === 'parcel') {
      points = PARCELS.find((p) => p.ulpin === focus.ulpin)?.boundary ?? []
      if (points.length) map.flyToBounds(L.latLngBounds(points), { maxZoom: 17, padding: [80, 80], duration: 0.8 })
      return
    }
    points = PARCELS.filter((p) => p.district === focus.name).flatMap((p) => p.boundary)
    if (points.length) map.flyToBounds(L.latLngBounds(points), { padding: [40, 40], duration: 1 })
  }, [focus, map])
  return null
}

export default function LeafletMap({
  layers,
  basemap,
  selectedUlpin,
  focus,
  onSelect,
}: {
  layers: Record<MapLayerId, boolean>
  basemap: keyof typeof BASEMAPS
  selectedUlpin: string | null
  focus: MapFocus
  onSelect: (ulpin: string) => void
}) {
  const initialBounds = L.latLngBounds(PARCELS.filter((p) => p.district === 'Pune').flatMap((p) => p.boundary))

  return (
    <MapContainer bounds={initialBounds} boundsOptions={{ padding: [30, 30] }} className="size-full" zoomControl scrollWheelZoom>
      <TileLayer key={basemap} url={BASEMAPS[basemap].url} attribution={BASEMAPS[basemap].attribution} maxZoom={19} />
      <ScaleControl position="bottomleft" />
      <FocusController focus={focus} />

      {layers.admin &&
        ADMIN_BOUNDARIES.map((b) => (
          <Polygon
            key={b.name}
            positions={b.boundary}
            pathOptions={{ color: '#6b21a8', weight: 2, dashArray: '8 6', fill: false }}
            interactive={false}
          />
        ))}

      {layers.zoning &&
        ZONING.map((z) => (
          <Polygon
            key={z.name}
            positions={z.boundary}
            pathOptions={{ color: z.color, weight: 1, fillColor: z.color, fillOpacity: 0.12, dashArray: '2 4' }}
          >
            <Tooltip sticky>{z.name}</Tooltip>
          </Polygon>
        ))}

      {layers.cadastral &&
        PARCELS.map((p) => {
          const selected = p.ulpin === selectedUlpin
          const fillColor = layers.landuse ? LAND_USE_COLORS[p.landUse] : '#3b5998'
          return (
            <Polygon
              key={p.ulpin}
              positions={p.boundary}
              eventHandlers={{ click: () => onSelect(p.ulpin) }}
              pathOptions={{
                color: selected ? '#16a34a' : STATUS_STROKE[p.recordStatus],
                weight: selected ? 4 : 1.5,
                dashArray: p.recordStatus === 'Discrepancy' && !selected ? '4 4' : undefined,
                fillColor,
                fillOpacity: selected ? 0.55 : layers.landuse ? 0.4 : 0.15,
              }}
            >
              <Tooltip sticky>
                <strong>{p.parcelId}</strong>
                <br />
                ULPIN: {p.ulpin}
                <br />
                {p.areaHa.toFixed(2)} ha · {p.landUse}
                <br />
                {p.ownershipStatus} · {p.recordStatus}
              </Tooltip>
            </Polygon>
          )
        })}

      {layers.water &&
        WATER_BODIES.map((w) => (
          <Polygon key={w.name} positions={w.boundary} pathOptions={{ color: '#0284c7', weight: 1, fillColor: '#38bdf8', fillOpacity: 0.6 }}>
            <Tooltip sticky>{w.name}</Tooltip>
          </Polygon>
        ))}

      {layers.buildings &&
        BUILDINGS.map((b) => (
          <Polygon
            key={b.ulpin}
            positions={b.boundary}
            eventHandlers={{ click: () => onSelect(b.ulpin) }}
            pathOptions={{ color: '#334155', weight: 1, fillColor: '#64748b', fillOpacity: 0.85 }}
          >
            <Tooltip sticky>{b.name}</Tooltip>
          </Polygon>
        ))}

      {layers.roads &&
        ROADS.map((r) => (
          <Polyline
            key={r.name}
            positions={r.path}
            pathOptions={{
              color: r.type === 'National Highway' ? '#ea580c' : '#78716c',
              weight: r.type === 'National Highway' ? 6 : r.type === 'District Road' ? 4 : 3,
              opacity: 0.9,
            }}
          >
            <Tooltip sticky>
              {r.name} ({r.type})
            </Tooltip>
          </Polyline>
        ))}

      {layers.utilities &&
        UTILITIES.map((u) => (
          <CircleMarker
            key={u.name}
            center={u.position}
            radius={6}
            pathOptions={{ color: '#fff', weight: 2, fillColor: u.type === 'Electric Transformer' ? '#eab308' : '#0ea5e9', fillOpacity: 1 }}
          >
            <Tooltip>
              {u.name}
              <br />
              {u.type}
            </Tooltip>
          </CircleMarker>
        ))}
    </MapContainer>
  )
}
