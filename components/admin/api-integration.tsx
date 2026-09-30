'use client'

import { useState } from 'react'
import { ArrowRight, Loader2, Play } from 'lucide-react'
import { API_ENDPOINTS } from '@/lib/mock-data'
import { StatusBadge } from '@/components/status-badge'

const FLOW = [
  { label: 'Survey & Settlement', sub: 'Cadastral maps, ETS/DGPS' },
  { label: 'Revenue Dept.', sub: 'RoR, mutation register' },
  { label: 'IGR Registration', sub: 'Deeds, encumbrance' },
  { label: 'Town Planning', sub: 'Zoning, permissions' },
]

function EndpointCard({ endpoint }: { endpoint: (typeof API_ENDPOINTS)[number] }) {
  const [state, setState] = useState<{ loading: boolean; body?: string; status?: number; ms?: number }>({ loading: false })

  const run = async () => {
    setState({ loading: true })
    const started = performance.now()
    try {
      const res = await fetch(endpoint.example)
      const json = await res.json()
      const trimmed = Array.isArray(json.data) ? { ...json, data: json.data.slice(0, 2) } : json
      setState({ loading: false, status: res.status, ms: Math.round(performance.now() - started), body: JSON.stringify(trimmed, null, 2) })
    } catch {
      setState({ loading: false, status: 0, body: '// Request failed' })
    }
  }

  return (
    <li className="overflow-hidden rounded-lg border bg-card">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3">
        <span className="rounded bg-success/15 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-success">{endpoint.method}</span>
        <code className="font-mono text-sm font-medium">{endpoint.path}</code>
        <StatusBadge status={endpoint.status} tone={endpoint.status === 'Connected' ? 'success' : 'warning'} className="ml-auto" />
      </div>
      <p className="px-4 text-sm text-muted-foreground">{endpoint.description}</p>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <code className="truncate font-mono text-xs text-muted-foreground">{endpoint.example}</code>
        <button
          type="button"
          onClick={run}
          disabled={state.loading}
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border bg-card px-2.5 text-xs font-medium hover:bg-muted disabled:opacity-60"
        >
          {state.loading ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> : <Play className="size-3.5" aria-hidden="true" />}
          Try it
        </button>
      </div>
      {state.body && (
        <div className="border-t bg-foreground text-background">
          <p className="px-4 pt-2 font-mono text-[11px] opacity-70">
            {state.status} · {state.ms} ms
          </p>
          <pre className="max-h-64 overflow-auto px-4 py-2 font-mono text-[11px] leading-relaxed" aria-live="polite">
            {state.body}
          </pre>
        </div>
      )}
    </li>
  )
}

export function ApiIntegration() {
  return (
    <div className="space-y-6">
      <section aria-labelledby="arch-heading" className="rounded-lg border bg-card p-5">
        <h2 id="arch-heading" className="font-semibold">
          Integration architecture
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Department systems publish to the Land Stack API gateway, which links every record to a ULPIN.</p>
        <div className="mt-5 grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
          <ul className="grid gap-2">
            {FLOW.map((f) => (
              <li key={f.label} className="rounded-md border bg-background px-3 py-2">
                <p className="text-sm font-medium">{f.label}</p>
                <p className="text-xs text-muted-foreground">{f.sub}</p>
              </li>
            ))}
          </ul>
          <ArrowRight className="mx-auto size-5 rotate-90 text-muted-foreground lg:rotate-0" aria-hidden="true" />
          <div className="rounded-lg border-2 border-primary bg-secondary p-4 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">API Gateway</p>
            <p className="mt-1 font-semibold">Land Stack Core</p>
            <p className="mt-2 text-xs text-muted-foreground">ULPIN linkage · Consent · Audit · Rate limiting</p>
          </div>
          <ArrowRight className="mx-auto size-5 rotate-90 text-muted-foreground lg:rotate-0" aria-hidden="true" />
          <ul className="grid gap-2">
            {['Citizen Portal', 'Officer Dashboards', 'Banks & Financial Inst.', 'Planning & Analytics'].map((c) => (
              <li key={c} className="rounded-md border bg-background px-3 py-2 text-sm font-medium">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="endpoints-heading">
        <h2 id="endpoints-heading" className="mb-3 font-semibold">
          Endpoints
        </h2>
        <ul className="grid gap-4 xl:grid-cols-2">
          {API_ENDPOINTS.map((e) => (
            <EndpointCard key={e.path} endpoint={e} />
          ))}
        </ul>
      </section>
    </div>
  )
}
