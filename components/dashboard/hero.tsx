import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Map, Search } from 'lucide-react'
import { DemoBadge } from '@/components/status-badge'
import { LAND_RECORDS } from '@/lib/mock-data'

export function DashboardHero() {
  const featured = LAND_RECORDS[5]
  return (
    <section className="border-b bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-14">
        <div>
          <p className="text-sm font-medium text-accent">Welcome to Land Stack</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary text-balance sm:text-4xl lg:text-5xl">
            One Parcel. One Platform. Connected Land Governance.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
            Land Stack integrates GIS, land records, governance data and citizen services into a unified digital
            infrastructure — offering unified digital access to parcel-centric land information.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/map"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 text-base font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Map className="size-5" aria-hidden="true" />
              Explore GIS Map
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/records"
              className="inline-flex h-12 items-center gap-2 rounded-md border border-input bg-card px-6 text-base font-semibold text-primary hover:bg-secondary"
            >
              <Search className="size-5" aria-hidden="true" />
              Search Land Records
            </Link>
          </div>
        </div>

        <figure className="relative overflow-hidden rounded-lg border bg-muted">
          <Image
            src="/images/cadastral-aerial.png"
            alt="Aerial view of village fields with cadastral parcel boundaries overlaid"
            width={1200}
            height={800}
            priority
            className="aspect-[4/3] h-auto w-full object-cover"
          />
          <DemoBadge className="absolute left-3 top-3 bg-card" label="Illustrative imagery" />
          <figcaption className="absolute inset-x-3 bottom-3 rounded-md border bg-card/95 p-3 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">ULPIN</p>
                <p className="truncate font-mono text-sm font-semibold text-primary">{featured.ulpin}</p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p className="font-medium text-foreground">
                  {featured.village}, {featured.taluka}
                </p>
                <p>
                  {featured.areaHa.toFixed(2)} ha · {featured.landUse}
                </p>
              </div>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
