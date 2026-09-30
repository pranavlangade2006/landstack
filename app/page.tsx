import { ClipboardList, Clock, LandPlot, ShieldCheck } from 'lucide-react'
import { DashboardHero } from '@/components/dashboard/hero'
import { StackFlow } from '@/components/dashboard/stack-flow'
import { NotificationsPanel, ParcelActivity, QuickServices, RecentServices } from '@/components/dashboard/panels'
import { StatCard } from '@/components/stat-card'
import { DemoBadge } from '@/components/status-badge'
import { DASHBOARD_STATS } from '@/lib/mock-data'
import { formatNumber } from '@/lib/format'

export default function DashboardPage() {
  const verifiedPct = ((DASHBOARD_STATS.verifiedRecords / DASHBOARD_STATS.totalParcels) * 100).toFixed(1)
  return (
    <>
      <DashboardHero />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <section aria-labelledby="stats-heading">
          <div className="mb-3 flex items-center gap-2">
            <h2 id="stats-heading" className="text-base font-semibold">
              Platform overview
            </h2>
            <DemoBadge />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Parcels" value={formatNumber(DASHBOARD_STATS.totalParcels)} icon={LandPlot} hint="Across 4 pilot districts" />
            <StatCard label="Verified Records" value={formatNumber(DASHBOARD_STATS.verifiedRecords)} icon={ShieldCheck} tone="accent" hint={`${verifiedPct}% of parcels verified`} />
            <StatCard label="Active Applications" value={formatNumber(DASHBOARD_STATS.activeApplications)} icon={ClipboardList} hint="+8.4% vs last month" />
            <StatCard label="Pending Services" value={formatNumber(DASHBOARD_STATS.pendingServices)} icon={Clock} tone="warning" hint="Avg. 4.2 days to resolve" />
          </div>
        </section>

        <StackFlow />

        <div className="grid gap-6 lg:grid-cols-2">
          <RecentServices />
          <ParcelActivity />
          <NotificationsPanel />
          <QuickServices />
        </div>
      </div>
    </>
  )
}
