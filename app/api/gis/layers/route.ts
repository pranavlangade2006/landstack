import { NextResponse } from 'next/server'
import { MAP_LAYERS } from '@/lib/mock-data'

export function GET() {
  return NextResponse.json({
    demo: true,
    crs: 'EPSG:4326',
    data: MAP_LAYERS.map((l) => ({ ...l, format: 'GeoJSON', version: '2.1' })),
  })
}
