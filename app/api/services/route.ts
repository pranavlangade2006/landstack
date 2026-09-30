import { NextResponse, type NextRequest } from 'next/server'
import { SERVICE_REQUESTS, SERVICE_TYPES } from '@/lib/mock-data'

const MAX_FILE_BYTES = 5 * 1024 * 1024
const ACCEPTED = ['application/pdf', 'image/jpeg', 'image/png']

export function GET(req: NextRequest) {
  const limit = Math.min(Number(req.nextUrl.searchParams.get('limit')) || 20, 50)
  return NextResponse.json({ demo: true, count: SERVICE_REQUESTS.length, data: SERVICE_REQUESTS.slice(0, limit) })
}

export async function POST(req: NextRequest) {
  let fd: FormData
  try {
    fd = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form submission.' }, { status: 400 })
  }

  const name = String(fd.get('name') ?? '').trim()
  const mobile = String(fd.get('mobile') ?? '').trim()
  const ulpin = String(fd.get('ulpin') ?? '').trim().toUpperCase()
  const serviceType = String(fd.get('serviceType') ?? '')
  const description = String(fd.get('description') ?? '').trim()
  const document = fd.get('document')

  const errors: Record<string, string> = {}
  if (name.length < 3 || name.length > 100) errors.name = 'Enter the applicant’s full name.'
  if (!/^[6-9]\d{9}$/.test(mobile)) errors.mobile = 'Enter a valid 10-digit Indian mobile number.'
  if (!/^[A-Z0-9]{14}$/.test(ulpin)) errors.ulpin = 'ULPIN must be 14 alphanumeric characters.'
  if (!SERVICE_TYPES.includes(serviceType as (typeof SERVICE_TYPES)[number])) errors.serviceType = 'Select a service type.'
  if (description.length < 10 || description.length > 1000) errors.description = 'Description must be 10–1000 characters.'
  if (document instanceof File && document.size > 0) {
    if (!ACCEPTED.includes(document.type)) errors.document = 'Upload a PDF, JPG or PNG file.'
    else if (document.size > MAX_FILE_BYTES) errors.document = 'File must be 5 MB or smaller.'
  }
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 })

  await new Promise((r) => setTimeout(r, 700))
  const applicationId = `LS-${new Date().getFullYear()}-${String(Math.floor(100000 + Math.random() * 900000))}`

  return NextResponse.json({ demo: true, applicationId, serviceType, ulpin, status: 'Submitted' }, { status: 201 })
}
