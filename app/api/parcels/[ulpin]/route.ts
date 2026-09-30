import { NextResponse } from 'next/server'
import { getRecordByUlpin } from '@/lib/mock-data'

export async function GET(_req: Request, { params }: { params: Promise<{ ulpin: string }> }) {
  const { ulpin } = await params
  const record = getRecordByUlpin(ulpin)
  if (!record) return NextResponse.json({ demo: true, error: 'Parcel not found' }, { status: 404 })
  return NextResponse.json({ demo: true, data: record })
}
