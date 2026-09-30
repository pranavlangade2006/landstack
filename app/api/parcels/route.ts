import { NextResponse, type NextRequest } from 'next/server'
import { PARCELS } from '@/lib/mock-data'

export function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const district = sp.get('district')
  const landUse = sp.get('landUse')
  const limit = Math.min(Number(sp.get('limit')) || 20, 100)
  const data = PARCELS.filter((p) => (!district || p.district === district) && (!landUse || p.landUse === landUse))
    .slice(0, limit)
    .map(({ boundary: _boundary, ...rest }) => rest)
  return NextResponse.json({ demo: true, count: data.length, data })
}
