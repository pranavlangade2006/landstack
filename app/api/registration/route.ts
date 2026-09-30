import { NextResponse, type NextRequest } from 'next/server'
import { LAND_RECORDS } from '@/lib/mock-data'

export function GET(req: NextRequest) {
  const limit = Math.min(Number(req.nextUrl.searchParams.get('limit')) || 10, 50)
  const data = LAND_RECORDS.slice(0, limit).map((r) => ({ ulpin: r.ulpin, ...r.registration }))
  return NextResponse.json({ demo: true, count: data.length, data })
}
