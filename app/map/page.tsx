import type { Metadata } from 'next'
import { Suspense } from 'react'
import { MapExplorer } from '@/components/map/map-explorer'

export const metadata: Metadata = {
  title: 'GIS Map',
  description: 'Interactive cadastral parcel map with land use, zoning, roads, utilities and administrative layers.',
}

export default function MapPage() {
  return (
    <Suspense fallback={<div className="h-[calc(100dvh-6.5rem)] animate-pulse bg-muted" />}>
      <MapExplorer />
    </Suspense>
  )
}
