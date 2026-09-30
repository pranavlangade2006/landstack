import Link from 'next/link'
import { ArrowRight, FilePen, FileSearch, Home, type LucideIcon, ReceiptText, Send, ShieldCheck } from 'lucide-react'
import { StatusBadge } from '@/components/status-badge'

export const SERVICES: {
  name: string
  icon: LucideIcon
  description: string
  required: string[]
  status: 'Available' | 'Demo Mode'
  sla: string
}[] = [
  {
    name: 'Ownership Verification',
    icon: ShieldCheck,
    description: 'Verify the current recorded owners and shares on a parcel using the linked Record of Rights.',
    required: ['ULPIN or Survey No.', 'Applicant ID proof', 'Purpose of verification'],
    status: 'Available',
    sla: '3 working days',
  },
  {
    name: 'Land Record Search',
    icon: FileSearch,
    description: 'Search and obtain a digitally signed extract of the land record for a parcel.',
    required: ['ULPIN or Parcel ID', 'District & village'],
    status: 'Available',
    sla: 'Instant',
  },
  {
    name: 'Registration Status',
    icon: ReceiptText,
    description: 'Check the status of a registered deed and its linkage with the parcel record.',
    required: ['Registration document no.', 'ULPIN'],
    status: 'Available',
    sla: '1 working day',
  },
  {
    name: 'Mutation / Record Update',
    icon: FilePen,
    description: 'Apply for mutation after sale, inheritance, partition or gift to update the RoR.',
    required: ['ULPIN', 'Registered deed / legal heir certificate', 'Applicant ID proof'],
    status: 'Demo Mode',
    sla: '15 working days',
  },
  {
    name: 'Property Information',
    icon: Home,
    description: 'Get consolidated zoning, building permission, tax and utility details for a parcel.',
    required: ['ULPIN'],
    status: 'Available',
    sla: 'Instant',
  },
  {
    name: 'Service Request',
    icon: Send,
    description: 'Raise a general request, correction or grievance against a parcel record.',
    required: ['ULPIN', 'Description of request', 'Supporting documents (optional)'],
    status: 'Demo Mode',
    sla: '7 working days',
  },
]

export function ServiceCatalog({ ulpin }: { ulpin?: string }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {SERVICES.map((s) => {
        const params = new URLSearchParams({ service: s.name })
        if (ulpin) params.set('ulpin', ulpin)
        return (
          <li key={s.name} className="flex flex-col rounded-lg border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="flex size-10 items-center justify-center rounded-md bg-secondary text-primary">
                <s.icon className="size-5" aria-hidden="true" />
              </span>
              <StatusBadge status={s.status} tone={s.status === 'Available' ? 'success' : 'warning'} />
            </div>
            <h3 className="mt-4 font-semibold">{s.name}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
            <div className="mt-4">
              <p className="text-xs font-medium text-muted-foreground">Required information</p>
              <ul className="mt-1.5 space-y-1 text-sm">
                {s.required.map((r) => (
                  <li key={r} className="flex gap-2">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto flex items-center justify-between gap-2 pt-5">
              <p className="text-xs text-muted-foreground">SLA: {s.sla}</p>
              <Link
                href={`/services?${params.toString()}#request`}
                scroll={false}
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Apply Now <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
