import { BarChart3, ChevronRight, FileText, Fingerprint, Globe2, Grid3x3, Users } from 'lucide-react'

const STEPS = [
  { icon: Grid3x3, title: 'Cadastral Maps', text: 'Digitised survey boundaries' },
  { icon: Fingerprint, title: 'ULPIN', text: '14-digit unique parcel ID' },
  { icon: FileText, title: 'Land Records', text: 'RoR, ownership, registration' },
  { icon: Globe2, title: 'GIS', text: 'Zoning, utilities, layers' },
  { icon: Users, title: 'Citizen Services', text: 'Verification & mutation' },
  { icon: BarChart3, title: 'Analytics', text: 'Insights & decision support' },
]

export function StackFlow() {
  return (
    <section aria-labelledby="flow-heading" className="rounded-lg border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="flow-heading" className="text-base font-semibold">
          How Land Stack connects land data
        </h2>
        <p className="text-xs text-muted-foreground">Every dataset is linked through the parcel&apos;s ULPIN</p>
      </div>
      <ol className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:items-stretch lg:gap-0">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex items-center lg:flex-1">
            <div className="flex h-full w-full flex-col gap-2 rounded-md border bg-background p-3">
              <span className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-primary">
                  <step.icon className="size-4" aria-hidden="true" />
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">0{i + 1}</span>
              </span>
              <span className="text-sm font-semibold text-foreground">{step.title}</span>
              <span className="text-xs text-muted-foreground">{step.text}</span>
            </div>
            {i < STEPS.length - 1 && (
              <ChevronRight className="mx-1 hidden size-5 shrink-0 text-accent lg:block" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
