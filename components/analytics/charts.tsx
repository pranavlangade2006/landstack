'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type Datum = { name: string; value: number; color?: string }

const AXIS = { fontSize: 12, fill: 'var(--muted-foreground)' }
const TOOLTIP = {
  contentStyle: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    fontSize: 12,
    color: 'var(--foreground)',
  },
  cursor: { fill: 'var(--muted)', opacity: 0.6 },
}

export function ChartCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col rounded-lg border bg-card p-5">
      <h3 className="text-sm font-semibold">{title}</h3>
      {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      <div className="mt-4 h-64">{children}</div>
    </section>
  )
}

export function DonutChart({ data }: { data: Datum[] }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  return (
    <div className="flex h-full items-center gap-4">
      <div className="relative h-full min-w-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="88%" paddingAngle={2} stroke="var(--card)">
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <Tooltip {...TOOLTIP} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold">{total}</span>
          <span className="text-xs text-muted-foreground">parcels</span>
        </div>
      </div>
      <ul className="w-36 shrink-0 space-y-1.5 text-xs">
        {data.map((d) => (
          <li key={d.name} className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-1.5">
              <span className="size-2.5 shrink-0 rounded-sm" style={{ background: d.color }} aria-hidden="true" />
              <span className="truncate">{d.name}</span>
            </span>
            <span className="font-medium tabular-nums">{Math.round((d.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function VerificationChart({ data }: { data: { name: string; verified: number; unverified: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ left: -20, right: 8 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis dataKey="name" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip {...TOOLTIP} />
        <Legend wrapperStyle={{ fontSize: 12 }} iconType="square" iconSize={10} />
        <Bar dataKey="verified" name="Verified" stackId="a" fill="var(--chart-2)" />
        <Bar dataKey="unverified" name="Unverified" stackId="a" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function SimpleBarChart({ data, color = 'var(--chart-1)', layout = 'horizontal' }: { data: Datum[]; color?: string; layout?: 'horizontal' | 'vertical' }) {
  const vertical = layout === 'vertical'
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout={layout} margin={vertical ? { left: 24, right: 16 } : { left: -20, right: 8 }}>
        <CartesianGrid horizontal={!vertical} vertical={vertical} stroke="var(--border)" />
        {vertical ? (
          <>
            <XAxis type="number" tick={AXIS} axisLine={false} tickLine={false} allowDecimals={false} />
            <YAxis type="category" dataKey="name" tick={AXIS} axisLine={false} tickLine={false} width={110} />
          </>
        ) : (
          <>
            <XAxis dataKey="name" tick={AXIS} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS} axisLine={false} tickLine={false} allowDecimals={false} />
          </>
        )}
        <Tooltip {...TOOLTIP} />
        <Bar dataKey="value" name="Count" fill={color} radius={vertical ? [0, 4, 4, 0] : [4, 4, 0, 0]}>
          {data.map((d) => (
            <Cell key={d.name} fill={d.color ?? color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function MonthlyChart({ data }: { data: { month: string; submitted: number; resolved: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ left: -12, right: 8 }}>
        <defs>
          <linearGradient id="fillSubmitted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fillResolved" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis dataKey="month" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} />
        <Tooltip {...TOOLTIP} cursor={{ stroke: 'var(--border)' }} />
        <Legend wrapperStyle={{ fontSize: 12 }} iconType="square" iconSize={10} />
        <Area type="monotone" dataKey="submitted" name="Submitted" stroke="var(--chart-1)" strokeWidth={2} fill="url(#fillSubmitted)" />
        <Area type="monotone" dataKey="resolved" name="Resolved" stroke="var(--chart-2)" strokeWidth={2} fill="url(#fillResolved)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
