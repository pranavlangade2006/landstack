import type { LatLng } from '@/lib/types'

export function ParcelShape({ boundary, label }: { boundary: LatLng[]; label: string }) {
  const lats = boundary.map((p) => p[0])
  const lngs = boundary.map((p) => p[1])
  const [minLat, maxLat, minLng, maxLng] = [Math.min(...lats), Math.max(...lats), Math.min(...lngs), Math.max(...lngs)]
  const span = Math.max(maxLat - minLat, maxLng - minLng) || 1
  const size = 200
  const pad = 24
  const scale = (size - pad * 2) / span
  const offsetX = (size - (maxLng - minLng) * scale) / 2
  const offsetY = (size - (maxLat - minLat) * scale) / 2
  const points = boundary
    .map(([lat, lng]) => `${(offsetX + (lng - minLng) * scale).toFixed(1)},${(offsetY + (maxLat - lat) * scale).toFixed(1)}`)
    .join(' ')

  return (
    <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Boundary outline of parcel ${label}`} className="size-full">
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeOpacity="0.08" />
        </pattern>
      </defs>
      <rect width={size} height={size} fill="url(#grid)" className="text-primary" />
      <polygon points={points} className="fill-primary/15 stroke-primary" strokeWidth="2" strokeLinejoin="round" />
      {boundary.map(([lat, lng], i) => (
        <circle
          key={i}
          cx={offsetX + (lng - minLng) * scale}
          cy={offsetY + (maxLat - lat) * scale}
          r="3.5"
          className="fill-card stroke-accent"
          strokeWidth="2"
        />
      ))}
    </svg>
  )
}
