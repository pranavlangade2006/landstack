import { cn } from '@/lib/utils'
import { FlaskConical } from 'lucide-react'

type Tone = 'success' | 'warning' | 'destructive' | 'info' | 'neutral'

const TONE_CLASSES: Record<Tone, string> = {
  success: 'bg-success/10 text-success border-success/25',
  warning: 'bg-warning/15 text-warning-foreground border-warning/40',
  destructive: 'bg-destructive/10 text-destructive border-destructive/25',
  info: 'bg-primary/8 text-primary border-primary/20',
  neutral: 'bg-muted text-muted-foreground border-border',
}

const STATUS_TONES: Record<string, Tone> = {
  Verified: 'success',
  Approved: 'success',
  Paid: 'success',
  Active: 'success',
  Success: 'success',
  Certified: 'success',
  Connected: 'success',
  'Single Owner': 'info',
  'Joint Ownership': 'info',
  'Government Land': 'neutral',
  'Pending Verification': 'warning',
  'Under Review': 'warning',
  'Field Verification': 'warning',
  'Under Mutation': 'info',
  Submitted: 'info',
  Pending: 'warning',
  Due: 'warning',
  Warning: 'warning',
  Caution: 'warning',
  'Demo Mode': 'warning',
  Discrepancy: 'destructive',
  Disputed: 'destructive',
  Rejected: 'destructive',
  Overdue: 'destructive',
  Failed: 'destructive',
  Critical: 'destructive',
  Inactive: 'neutral',
  'Not Connected': 'neutral',
  Info: 'neutral',
}

export function StatusBadge({ status, tone, className }: { status: string; tone?: Tone; className?: string }) {
  const resolved = tone ?? STATUS_TONES[status] ?? 'neutral'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium',
        TONE_CLASSES[resolved],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  )
}

export function DemoBadge({ className, label = 'Demo Data' }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border border-warning/50 bg-warning/15 px-2 py-0.5 text-xs font-semibold text-warning-foreground',
        className,
      )}
    >
      <FlaskConical className="size-3" aria-hidden="true" />
      {label}
    </span>
  )
}
