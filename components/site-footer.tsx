import Link from 'next/link'
import { Layers3 } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Layers3 className="size-4" aria-hidden="true" />
            </span>
            <span className="font-bold tracking-wide text-primary">
              LAND <span className="text-accent">STACK</span>
            </span>
          </div>
          <p className="mt-3 max-w-md text-sm text-muted-foreground text-pretty">
            A functional prototype of a parcel-centric Digital Public Infrastructure for land governance. All data shown is
            synthetic demo data and is not an official government record.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Platform</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/map" className="hover:text-foreground">GIS Map</Link></li>
            <li><Link href="/records" className="hover:text-foreground">Land Records</Link></li>
            <li><Link href="/services" className="hover:text-foreground">Citizen Services</Link></li>
            <li><Link href="/admin?section=api" className="hover:text-foreground">API Integration</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Project</h2>
          <dl className="mt-3 space-y-2 text-sm text-muted-foreground">
            <div><dt className="inline">Problem Statement: </dt><dd className="inline font-mono text-foreground">SIH26014</dd></div>
            <div><dt className="inline">Theme: </dt><dd className="inline">Agriculture, FoodTech &amp; Rural Development</dd></div>
            <div><dt className="inline">Team: </dt><dd className="inline">OrbitIQ12 (ID 167551)</dd></div>
          </dl>
        </div>
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
          Smart India Hackathon 2026 prototype. Not affiliated with or endorsed by any government department.
        </p>
      </div>
    </footer>
  )
}
