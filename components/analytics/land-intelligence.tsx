import Link from 'next/link'
import { BrainCircuit, Radar, SatelliteDish, ScanSearch, TrendingUp } from 'lucide-react'
import type { LandRecord } from '@/lib/types'
import { DemoBadge } from '@/components/status-badge'
import { Progress } from '@/components/ui/progress'

export function LandIntelligence({ records }: { records: LandRecord[] }) {
  const anomalies = records.filter((r) => r.recordStatus === 'Discrepancy').slice(0, 3)
  const changed = records.filter((r) => r.landUse === 'Agricultural').slice(3, 6)

  return (
    <section aria-labelledby="li-heading" className="rounded-xl border bg-primary text-primary-foreground">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary-foreground/15 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary-foreground/10">
            <BrainCircuit className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="li-heading" className="font-semibold">
              Land Intelligence
            </h2>
            <p className="text-xs text-primary-foreground/70">AI/ML-assisted insights on parcel data — prototype models on synthetic data</p>
          </div>
        </div>
        <DemoBadge label="Demo AI features" className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground" />
      </div>

      <div className="grid gap-px bg-primary-foreground/10 sm:grid-cols-2">
        <article className="bg-primary p-5 sm:p-6">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ScanSearch className="size-4" aria-hidden="true" /> Record Anomaly Detection
          </div>
          <p className="mt-1 text-xs text-primary-foreground/70">Flags mismatches between RoR area, GIS area and registration data.</p>
          <ul className="mt-4 space-y-2">
            {anomalies.map((r, i) => (
              <li key={r.ulpin}>
                <Link href={`/records/${r.ulpin}`} className="flex items-center justify-between gap-3 rounded-md bg-primary-foreground/5 px-3 py-2 text-sm hover:bg-primary-foreground/10">
                  <span className="min-w-0">
                    <span className="block truncate font-mono text-xs">{r.parcelId}</span>
                    <span className="text-xs text-primary-foreground/70">{['Area mismatch 7.4%', 'Owner name variance', 'Duplicate khata entry'][i]}</span>
                  </span>
                  <span className="shrink-0 font-mono text-xs">{[0.92, 0.87, 0.81][i]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </article>

        <article className="bg-primary p-5 sm:p-6">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <SatelliteDish className="size-4" aria-hidden="true" /> Satellite Change Detection
          </div>
          <p className="mt-1 text-xs text-primary-foreground/70">Compares multi-temporal imagery to detect new construction on agricultural parcels.</p>
          <ul className="mt-4 space-y-2">
            {changed.map((r, i) => (
              <li key={r.ulpin} className="flex items-center justify-between gap-3 rounded-md bg-primary-foreground/5 px-3 py-2 text-sm">
                <span className="min-w-0">
                  <span className="block truncate font-mono text-xs">{r.parcelId}</span>
                  <span className="text-xs text-primary-foreground/70">{['New structure ~420 sq m', 'Vegetation loss 18%', 'Access road built'][i]}</span>
                </span>
                <span className="shrink-0 text-xs text-primary-foreground/70">Mar → Sep 2026</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="bg-primary p-5 sm:p-6">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <TrendingUp className="size-4" aria-hidden="true" /> Predictive Land Analysis
          </div>
          <p className="mt-1 text-xs text-primary-foreground/70">Forecasts land-use conversion probability for peri-urban villages.</p>
          <ul className="mt-4 space-y-3">
            {[
              ['Wagholi, Haveli', 78],
              ['Hinjawadi, Mulshi', 64],
              ['Sinnar, Nashik', 41],
              ['Karad, Satara', 23],
            ].map(([village, pct]) => (
              <li key={village as string}>
                <div className="mb-1 flex justify-between text-xs">
                  <span>{village}</span>
                  <span className="tabular-nums">{pct}%</span>
                </div>
                <Progress value={pct as number} aria-label={`${village} conversion probability`} className="h-1.5 bg-primary-foreground/15 [&_[data-slot=progress-indicator]]:bg-accent" />
              </li>
            ))}
          </ul>
        </article>

        <article className="bg-primary p-5 sm:p-6">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Radar className="size-4" aria-hidden="true" /> Decision Support
          </div>
          <p className="mt-1 text-xs text-primary-foreground/70">Recommended actions for officers, ranked by impact.</p>
          <ol className="mt-4 space-y-2 text-sm">
            {[
              'Prioritise re-survey of 14 parcels in Wagholi with area mismatch above 5%.',
              'Issue notices for 6 unauthorised structures detected in Agricultural zone.',
              'Fast-track 212 pending mutations older than 30 days in Haveli taluka.',
            ].map((t, i) => (
              <li key={t} className="flex gap-3 rounded-md bg-primary-foreground/5 px-3 py-2">
                <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-xs leading-relaxed">{t}</span>
              </li>
            ))}
          </ol>
        </article>
      </div>
    </section>
  )
}
