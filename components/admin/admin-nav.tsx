import Link from 'next/link'
import {
  ClipboardList,
  FileText,
  History,
  Layers,
  LayoutDashboard,
  type LucideIcon,
  Map,
  PlugZap,
  Settings,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const ADMIN_SECTIONS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'users', label: 'Users & Roles', icon: Users },
  { id: 'parcels', label: 'Parcel Management', icon: Map },
  { id: 'records', label: 'Land Records', icon: FileText },
  { id: 'applications', label: 'Service Applications', icon: ClipboardList },
  { id: 'layers', label: 'GIS Layers', icon: Layers },
  { id: 'audit', label: 'Audit Logs', icon: History },
  { id: 'api', label: 'API Integration', icon: PlugZap },
  { id: 'settings', label: 'System Settings', icon: Settings },
]

export function AdminNav({ active }: { active: string }) {
  return (
    <nav aria-label="Admin sections" className="lg:sticky lg:top-24">
      <ul className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
        {ADMIN_SECTIONS.map((s) => {
          const isActive = s.id === active
          return (
            <li key={s.id} className="shrink-0">
              <Link
                href={s.id === 'overview' ? '/admin' : `/admin?section=${s.id}`}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2.5 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <s.icon className="size-4" aria-hidden="true" />
                {s.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
