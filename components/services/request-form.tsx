'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Copy, Loader2, Paperclip, X } from 'lucide-react'
import { SERVICE_TYPES } from '@/lib/mock-data'
import { DemoBadge } from '@/components/status-badge'

type Errors = Partial<Record<'name' | 'mobile' | 'ulpin' | 'serviceType' | 'description' | 'document' | 'form', string>>

const MAX_FILE_BYTES = 5 * 1024 * 1024
const ACCEPTED = ['application/pdf', 'image/jpeg', 'image/png']
const inputCls =
  'h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40 aria-invalid:border-destructive'

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export function RequestForm() {
  const params = useSearchParams()
  const presetService = params.get('service') ?? ''
  const presetUlpin = params.get('ulpin') ?? ''

  const [serviceType, setServiceType] = useState(presetService)
  const [ulpin, setUlpin] = useState(presetUlpin)
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<{ applicationId: string; serviceType: string; ulpin: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (presetService) setServiceType(presetService)
    if (presetUlpin) setUlpin(presetUlpin)
  }, [presetService, presetUlpin])

  const validate = (fd: FormData): Errors => {
    const e: Errors = {}
    if (String(fd.get('name') ?? '').trim().length < 3) e.name = 'Enter the applicant’s full name.'
    if (!/^[6-9]\d{9}$/.test(String(fd.get('mobile') ?? '').trim())) e.mobile = 'Enter a valid 10-digit Indian mobile number.'
    if (!/^[A-Z0-9]{14}$/i.test(String(fd.get('ulpin') ?? '').trim())) e.ulpin = 'ULPIN must be 14 alphanumeric characters.'
    if (!SERVICE_TYPES.includes(String(fd.get('serviceType')) as (typeof SERVICE_TYPES)[number])) e.serviceType = 'Select a service type.'
    const desc = String(fd.get('description') ?? '').trim()
    if (desc.length < 10) e.description = 'Describe your request in at least 10 characters.'
    if (desc.length > 1000) e.description = 'Keep the description under 1000 characters.'
    if (file && !ACCEPTED.includes(file.type)) e.document = 'Upload a PDF, JPG or PNG file.'
    if (file && file.size > MAX_FILE_BYTES) e.document = 'File must be 5 MB or smaller.'
    return e
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const fd = new FormData(form)
    const found = validate(fd)
    setErrors(found)
    if (Object.keys(found).length) {
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }
    setPending(true)
    try {
      const res = await fetch('/api/services', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) {
        setErrors(data.errors ?? { form: data.error ?? 'Could not submit the request.' })
        return
      }
      setResult(data)
      form.reset()
      setFile(null)
      setServiceType('')
      setUlpin('')
    } catch {
      setErrors({ form: 'Network error. Please try again.' })
    } finally {
      setPending(false)
    }
  }

  if (result) {
    return (
      <div role="status" className="flex flex-col items-center rounded-lg border border-success/30 bg-success/5 px-6 py-10 text-center">
        <CheckCircle2 className="size-12 text-success" aria-hidden="true" />
        <h3 className="mt-3 text-lg font-semibold">Request submitted successfully</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Your {result.serviceType} request for ULPIN <span className="font-mono">{result.ulpin}</span> has been recorded.
        </p>
        <div className="mt-5 rounded-md border bg-card px-5 py-3">
          <p className="text-xs text-muted-foreground">Application ID</p>
          <p className="flex items-center gap-2 font-mono text-xl font-semibold text-primary">
            {result.applicationId}
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(result.applicationId)}
              aria-label="Copy application ID"
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Copy className="size-4" />
            </button>
          </p>
        </div>
        <DemoBadge className="mt-4" label="Mock application — not submitted to any government office" />
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button type="button" onClick={() => setResult(null)} className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Submit another request
          </button>
          <Link href="/records" className="inline-flex h-10 items-center rounded-md border bg-card px-4 text-sm font-medium hover:bg-muted">
            Back to Land Records
          </Link>
        </div>
      </div>
    )
  }

  const aria = (key: keyof Errors) => ({
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `${key}-error` : undefined,
  })

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 rounded-lg border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold">Service Request Form</h3>
        <DemoBadge label="Demo submission" />
      </div>
      {errors.form && <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">{errors.form}</p>}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Applicant Name" error={errors.name}>
          <input id="name" name="name" autoComplete="name" className={inputCls} placeholder="e.g. Sunita Ramesh Patil" {...aria('name')} />
        </Field>
        <Field id="mobile" label="Mobile Number" error={errors.mobile} hint="10-digit number, without +91">
          <input id="mobile" name="mobile" type="tel" inputMode="numeric" maxLength={10} autoComplete="tel-national" className={inputCls} placeholder="98XXXXXXXX" {...aria('mobile')} />
        </Field>
        <Field id="ulpin" label="ULPIN" error={errors.ulpin} hint="14-character Unique Land Parcel ID">
          <input
            id="ulpin"
            name="ulpin"
            value={ulpin}
            onChange={(e) => setUlpin(e.target.value.toUpperCase())}
            maxLength={14}
            className={`${inputCls} font-mono`}
            placeholder="MH27A4B8C1D2E3"
            {...aria('ulpin')}
          />
        </Field>
        <Field id="serviceType" label="Service Type" error={errors.serviceType}>
          <select id="serviceType" name="serviceType" value={serviceType} onChange={(e) => setServiceType(e.target.value)} className={inputCls} {...aria('serviceType')}>
            <option value="">Select a service</option>
            {SERVICE_TYPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field id="description" label="Description" error={errors.description}>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={1000}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40 aria-invalid:border-destructive"
          placeholder="Describe what you need, e.g. correction of owner name spelling in 7/12 extract."
          {...aria('description')}
        />
      </Field>

      <Field id="document" label="Document Upload (optional)" error={errors.document} hint="PDF, JPG or PNG up to 5 MB">
        <input
          ref={fileRef}
          id="document"
          name="document"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="sr-only"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          {...aria('document')}
        />
        {file ? (
          <div className="flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <Paperclip className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="truncate">{file.name}</span>
              <span className="shrink-0 text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</span>
            </span>
            <button
              type="button"
              aria-label="Remove file"
              onClick={() => {
                setFile(null)
                if (fileRef.current) fileRef.current.value = ''
              }}
              className="rounded p-1 text-muted-foreground hover:bg-muted"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex h-20 items-center justify-center gap-2 rounded-md border border-dashed bg-background text-sm text-muted-foreground hover:border-primary hover:text-primary"
          >
            <Paperclip className="size-4" aria-hidden="true" /> Choose a file to attach
          </button>
        )}
      </Field>

      <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">No data is sent to any government system. This is a prototype.</p>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-70"
        >
          {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {pending ? 'Submitting…' : 'Submit Request'}
        </button>
      </div>
    </form>
  )
}
