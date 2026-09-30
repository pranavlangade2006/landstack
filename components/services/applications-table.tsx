import Link from 'next/link'
import type { ServiceRequest } from '@/lib/types'
import { StatusBadge } from '@/components/status-badge'
import { formatDate } from '@/lib/format'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function ApplicationsTable({ requests }: { requests: ServiceRequest[] }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/60 hover:bg-muted/60">
            <TableHead className="pl-4">Application ID</TableHead>
            <TableHead>Applicant</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>ULPIN</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((r) => (
            <TableRow key={r.applicationId}>
              <TableCell className="pl-4 font-mono text-xs font-medium">{r.applicationId}</TableCell>
              <TableCell>{r.applicant}</TableCell>
              <TableCell>{r.serviceType}</TableCell>
              <TableCell>
                <Link href={`/records/${r.ulpin}`} className="font-mono text-xs text-primary hover:underline">
                  {r.ulpin}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">{formatDate(r.submittedOn)}</TableCell>
              <TableCell>
                <StatusBadge status={r.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
