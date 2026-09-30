import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { ADMIN_SECTIONS, AdminNav } from '@/components/admin/admin-nav'
import {
  ApplicationsSection,
  LayersSection,
  OverviewSection,
  ParcelsSection,
  RecordsSection,
  SettingsSection,
  UsersSection,
} from '@/components/admin/admin-sections'
import { AuditLogTable } from '@/components/admin/audit-log-table'
import { ApiIntegration } from '@/components/admin/api-integration'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage users, roles, parcels, land records, service applications, GIS layers, audit logs and API integrations.',
}

const SECTIONS: Record<string, () => React.ReactNode> = {
  overview: OverviewSection,
  users: UsersSection,
  parcels: ParcelsSection,
  records: RecordsSection,
  applications: ApplicationsSection,
  layers: LayersSection,
  audit: () => <AuditLogTable />,
  api: ApiIntegration,
  settings: SettingsSection,
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ section?: string }> }) {
  const { section: raw } = await searchParams
  const section = raw && raw in SECTIONS ? raw : 'overview'
  const Section = SECTIONS[section]
  const label = ADMIN_SECTIONS.find((s) => s.id === section)?.label ?? 'Overview'

  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        description="Signed in as Priya Deshmukh · Administrator (demo session)"
        breadcrumb={[{ label: 'Admin', href: '/admin' }, { label }]}
      />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
        <AdminNav active={section} />
        <div className="min-w-0">
          <h2 className="sr-only">{label}</h2>
          <Section />
        </div>
      </div>
    </>
  )
}
