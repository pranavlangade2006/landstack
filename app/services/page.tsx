import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PageHeader } from '@/components/page-header'
import { ServiceCatalog } from '@/components/services/service-catalog'
import { RequestForm } from '@/components/services/request-form'
import { ApplicationsTable } from '@/components/services/applications-table'
import { Skeleton } from '@/components/ui/skeleton'
import { SERVICE_REQUESTS } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'Citizen Services',
  description: 'Apply for ownership verification, land record search, registration status, mutation and property information services.',
}

export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ ulpin?: string }> }) {
  const { ulpin } = await searchParams
  return (
    <>
      <PageHeader
        title="Citizen Services"
        description="Parcel-linked services powered by the ULPIN. Choose a service and apply online — every request is tied to a single land parcel."
        breadcrumb={[{ label: 'Services' }]}
      />
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
        <section aria-labelledby="catalog-heading">
          <h2 id="catalog-heading" className="mb-4 text-lg font-semibold">
            Available services
          </h2>
          <ServiceCatalog ulpin={ulpin} />
        </section>

        <section id="request" aria-labelledby="request-heading" className="scroll-mt-32 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 id="request-heading" className="mb-4 text-lg font-semibold">
              Submit a service request
            </h2>
            <Suspense fallback={<Skeleton className="h-[560px] w-full rounded-lg" />}>
              <RequestForm />
            </Suspense>
          </div>
          <aside className="space-y-4 lg:pt-11">
            <div className="rounded-lg border bg-card p-5">
              <h3 className="text-sm font-semibold">How it works</h3>
              <ol className="mt-3 space-y-3 text-sm">
                {['Enter your details and the ULPIN of the parcel.', 'Attach any supporting document.', 'Receive an application ID instantly.', 'Track status from the applications list below.'].map(
                  (step, i) => (
                    <li key={step} className="flex gap-3">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-primary">
                        {i + 1}
                      </span>
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ),
                )}
              </ol>
            </div>
            <div className="rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm text-warning-foreground">
              This is a prototype. Requests are not forwarded to any Tahsil, IGR or local body office.
            </div>
          </aside>
        </section>

        <section aria-labelledby="applications-heading">
          <h2 id="applications-heading" className="mb-4 text-lg font-semibold">
            Recent applications
          </h2>
          <ApplicationsTable requests={SERVICE_REQUESTS.slice(0, 10)} />
        </section>
      </div>
    </>
  )
}
