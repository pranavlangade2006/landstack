import type {
  AuditLog,
  LandRecord,
  LandUse,
  LatLng,
  OwnershipStatus,
  RecordStatus,
  Restriction,
  ServiceRequest,
  Utility,
} from './types'

function createRng(seed: number) {
  let state = seed
  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rng = createRng(26014)
const pick = <T,>(items: readonly T[]): T => items[Math.floor(rng() * items.length)]
function weighted<T>(entries: readonly (readonly [T, number])[]): T {
  const total = entries.reduce((sum, [, w]) => sum + w, 0)
  let roll = rng() * total
  for (const [value, weight] of entries) {
    roll -= weight
    if (roll <= 0) return value
  }
  return entries[0][0]
}

const ULPIN_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'
function makeUlpin() {
  let id = 'MH'
  for (let i = 0; i < 12; i++) id += ULPIN_CHARS[Math.floor(rng() * ULPIN_CHARS.length)]
  return id
}

function isoDate(year: number, monthFrom: number, monthTo: number) {
  const month = monthFrom + Math.floor(rng() * (monthTo - monthFrom + 1))
  const day = 1 + Math.floor(rng() * 27)
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export interface VillageConfig {
  village: string
  taluka: string
  district: string
  code: string
  sro: string
  origin: LatLng
  cols: number
  rows: number
}

export const CELL_LAT = 0.0026
export const CELL_LNG = 0.003

export const VILLAGES: VillageConfig[] = [
  { village: 'Wagholi', taluka: 'Haveli', district: 'Pune', code: 'PN-HVL-WAG', sro: 'SRO Haveli No. 3', origin: [18.575, 73.975], cols: 4, rows: 3 },
  { village: 'Kesnand', taluka: 'Haveli', district: 'Pune', code: 'PN-HVL-KES', sro: 'SRO Haveli No. 3', origin: [18.575, 73.9875], cols: 4, rows: 3 },
  { village: 'Awhalwadi', taluka: 'Haveli', district: 'Pune', code: 'PN-HVL-AWH', sro: 'SRO Haveli No. 3', origin: [18.5835, 73.975], cols: 4, rows: 3 },
  { village: 'Musalgaon', taluka: 'Sinnar', district: 'Nashik', code: 'NS-SNR-MUS', sro: 'SRO Sinnar', origin: [19.845, 73.995], cols: 3, rows: 2 },
  { village: 'Wanadongri', taluka: 'Hingna', district: 'Nagpur', code: 'NG-HNG-WAN', sro: 'SRO Hingna', origin: [21.095, 79.02], cols: 3, rows: 2 },
  { village: 'Malkapur', taluka: 'Karad', district: 'Satara', code: 'ST-KRD-MAL', sro: 'SRO Karad', origin: [17.265, 74.18], cols: 3, rows: 2 },
]

export const DISTRICTS = ['Pune', 'Nashik', 'Nagpur', 'Satara'] as const
export const LAND_USES: LandUse[] = [
  'Agricultural',
  'Residential',
  'Commercial',
  'Industrial',
  'Public / Institutional',
  'Forest / Open Space',
]
export const RECORD_STATUSES: RecordStatus[] = ['Verified', 'Pending Verification', 'Under Mutation', 'Discrepancy']

export const LAND_USE_COLORS: Record<LandUse, string> = {
  Agricultural: '#65a30d',
  Residential: '#f59e0b',
  Commercial: '#dc2626',
  Industrial: '#7c3aed',
  'Public / Institutional': '#0284c7',
  'Forest / Open Space': '#15803d',
}

const FIRST_NAMES = ['Ramesh', 'Suresh', 'Sunita', 'Anil', 'Vaishali', 'Prakash', 'Meena', 'Dattatray', 'Savita', 'Vijay', 'Rohini', 'Balasaheb', 'Kavita', 'Sanjay', 'Asha', 'Nitin', 'Pooja', 'Mahadev', 'Lata', 'Ganesh']
const SURNAMES = ['Patil', 'Jadhav', 'Pawar', 'Shinde', 'Kulkarni', 'Deshmukh', 'Gaikwad', 'More', 'Kale', 'Bhosale', 'Chavan', 'Wagh', 'Salunkhe', 'Thorat', 'Kadam']
const FATHER_NAMES = ['Shankar', 'Maruti', 'Tukaram', 'Vitthal', 'Dnyaneshwar', 'Baburao', 'Laxman', 'Namdev']

function personName() {
  return `${pick(FIRST_NAMES)} ${pick(FATHER_NAMES)} ${pick(SURNAMES)}`
}

const ZONES: Record<LandUse, { zone: string; fsi: number; uses: string[] }> = {
  Agricultural: { zone: 'Agricultural Zone (A)', fsi: 0.2, uses: ['Cultivation', 'Farm house', 'Agro-processing (with NOC)'] },
  Residential: { zone: 'Residential Zone (R1)', fsi: 1.1, uses: ['Housing', 'Convenience shops', 'Clinics'] },
  Commercial: { zone: 'Commercial Zone (C1)', fsi: 1.5, uses: ['Retail', 'Offices', 'Hospitality'] },
  Industrial: { zone: 'Industrial Zone (I1)', fsi: 1.0, uses: ['Light industry', 'Warehousing', 'Service industry'] },
  'Public / Institutional': { zone: 'Public / Semi-Public Zone (PSP)', fsi: 1.0, uses: ['Schools', 'Hospitals', 'Government offices'] },
  'Forest / Open Space': { zone: 'Green Belt / No Development Zone', fsi: 0, uses: ['Plantation', 'Recreational open space'] },
}

function buildRecord(v: VillageConfig, row: number, col: number, index: number): LandRecord {
  const gap = 0.00012
  const jitter = () => (rng() - 0.5) * 0.00018
  const south = v.origin[0] + row * CELL_LAT + gap
  const north = v.origin[0] + (row + 1) * CELL_LAT - gap
  const west = v.origin[1] + col * CELL_LNG + gap
  const east = v.origin[1] + (col + 1) * CELL_LNG - gap
  const boundary: LatLng[] = [
    [south + jitter(), west + jitter()],
    [north + jitter(), west + jitter()],
    [north + jitter(), east + jitter()],
    [south + jitter(), east + jitter()],
  ]
  const centroid: LatLng = [(south + north) / 2, (west + east) / 2]

  const landUse = weighted<LandUse>([
    ['Agricultural', 48],
    ['Residential', 20],
    ['Commercial', 8],
    ['Industrial', 7],
    ['Public / Institutional', 8],
    ['Forest / Open Space', 5],
  ])
  const ownershipStatus: OwnershipStatus =
    landUse === 'Public / Institutional' || landUse === 'Forest / Open Space'
      ? 'Government Land'
      : weighted<OwnershipStatus>([
          ['Single Owner', 55],
          ['Joint Ownership', 33],
          ['Disputed', 7],
        ])
  const recordStatus: RecordStatus =
    ownershipStatus === 'Disputed'
      ? 'Discrepancy'
      : weighted<RecordStatus>([
          ['Verified', 62],
          ['Pending Verification', 20],
          ['Under Mutation', 12],
          ['Discrepancy', 6],
        ])

  const surveyNo = `${112 + index * 3}/${1 + Math.floor(rng() * 4)}`
  const parcelId = `${v.code}-${String(index + 1).padStart(4, '0')}`
  const areaHa = Math.round((0.35 + rng() * 2.6) * 100) / 100
  const ulpin = makeUlpin()
  const khataNo = String(200 + Math.floor(rng() * 1400))

  const ownerCount = ownershipStatus === 'Joint Ownership' ? 2 + Math.floor(rng() * 2) : 1
  const owners =
    ownershipStatus === 'Government Land'
      ? [{ name: 'Government of Maharashtra (Collector, ' + v.district + ')', relation: '—', share: '100%', khataNo }]
      : Array.from({ length: ownerCount }, () => ({
          name: personName(),
          relation: pick(['S/o', 'W/o', 'D/o']),
          share: ownerCount === 1 ? '100%' : `${Math.round(100 / ownerCount)}%`,
          khataNo,
        }))

  const regDate = isoDate(2015 + Math.floor(rng() * 10), 1, 12)
  const consideration = Math.round(areaHa * (landUse === 'Agricultural' ? 42 : 180) * 100000)

  const hasBuilding = landUse === 'Residential' || landUse === 'Commercial' || landUse === 'Industrial'
  const permitStatus = weighted<'Approved' | 'Under Review'>([
    ['Approved', 75],
    ['Under Review', 25],
  ])

  const utilities: Utility[] = [
    { type: 'Electricity', provider: 'MSEDCL', reference: `CN-${170000000 + Math.floor(rng() * 9999999)}`, status: 'Active' },
    {
      type: 'Water Supply',
      provider: v.district === 'Pune' ? 'PMRDA Water Supply' : 'Gram Panchayat',
      reference: `WS-${10000 + Math.floor(rng() * 89999)}`,
      status: rng() > 0.25 ? 'Active' : 'Not Connected',
    },
    {
      type: 'Sewerage',
      provider: 'Local Body',
      reference: hasBuilding ? `SW-${1000 + Math.floor(rng() * 8999)}` : '—',
      status: hasBuilding ? 'Active' : 'Not Connected',
    },
    { type: 'Road Access', provider: 'PWD / ZP', reference: `${pick([6, 9, 12, 18])} m access road`, status: 'Active' },
  ]

  const restrictions: Restriction[] = []
  if (ownershipStatus === 'Disputed')
    restrictions.push({ type: 'Court Order', description: `Status quo order – Civil Judge, ${v.taluka} (RCS ${100 + index}/2025)`, severity: 'Critical' })
  if (rng() > 0.7)
    restrictions.push({ type: 'Encumbrance', description: `Mortgage in favour of ${pick(['Bank of Maharashtra', 'State Bank of India', 'Pune District Central Co-op Bank'])}`, severity: 'Caution' })
  if (rng() > 0.78)
    restrictions.push({ type: 'Environmental Buffer', description: 'Part of parcel within 30 m nala / stream buffer', severity: 'Caution' })
  if (landUse === 'Forest / Open Space')
    restrictions.push({ type: 'Land Use Restriction', description: 'No development permitted under Regional Plan', severity: 'Critical' })
  if (restrictions.length === 0) restrictions.push({ type: 'None', description: 'No restrictions or encumbrances recorded', severity: 'Info' })

  return {
    ulpin,
    parcelId,
    surveyNo,
    state: 'Maharashtra',
    district: v.district,
    taluka: v.taluka,
    village: v.village,
    areaHa,
    landUse,
    ownershipStatus,
    recordStatus,
    lastUpdated: isoDate(2026, 1, 9),
    centroid,
    boundary,
    ownership: {
      owners,
      rorType: '7/12 Extract (Satbara Utara)',
      cultivator: ownershipStatus === 'Government Land' ? 'Not applicable' : landUse === 'Agricultural' ? owners[0].name : 'Non-agricultural (NA) use',
      tenancy: rng() > 0.85 ? 'Protected tenant recorded' : 'No tenancy',
      mutations: Array.from({ length: 1 + Math.floor(rng() * 3) }, (_, i) => ({
        mutationNo: String(1800 + Math.floor(rng() * 4000)),
        date: isoDate(2019 + i * 2, 1, 12),
        type: pick(['Sale', 'Inheritance', 'Partition', 'Loan Entry', 'Gift']),
        status: recordStatus === 'Under Mutation' && i === 0 ? 'Pending' : 'Certified',
      })),
    },
    registration: {
      documentNo: `${v.code.split('-')[1]}-${regDate.slice(0, 4)}-${String(1000 + Math.floor(rng() * 8999)).padStart(6, '0')}`,
      deedType: ownershipStatus === 'Government Land' ? 'Government Allotment' : pick(['Sale Deed', 'Gift Deed', 'Partition Deed', 'Release Deed']),
      registrationDate: regDate,
      subRegistrarOffice: v.sro,
      considerationValue: consideration,
      stampDuty: Math.round(consideration * 0.06),
      encumbrance: restrictions.some((r) => r.type === 'Encumbrance') ? 'Encumbrance recorded' : 'Nil encumbrance',
    },
    zoning: {
      zone: ZONES[landUse].zone,
      permissibleFsi: ZONES[landUse].fsi,
      planReference: v.district === 'Pune' ? 'PMRDA Development Plan 2021–41 (Draft)' : `${v.district} Regional Plan`,
      permittedUses: ZONES[landUse].uses,
    },
    buildingPermission: hasBuilding
      ? {
          permitNo: `BP/${v.code.split('-')[1]}/${2020 + Math.floor(rng() * 6)}/${100 + Math.floor(rng() * 900)}`,
          status: permitStatus,
          builtUpAreaSqm: Math.round(areaHa * 10000 * (0.2 + rng() * 0.3)),
          floors: 1 + Math.floor(rng() * (landUse === 'Commercial' ? 6 : 4)),
          approvedOn: permitStatus === 'Approved' ? isoDate(2023, 1, 12) : null,
          authority: v.district === 'Pune' ? 'PMRDA Building Permission Cell' : 'Town Planning Department',
        }
      : null,
    propertyTax: {
      assessmentNo: `PT-${v.code.split('-')[2]}-${String(index + 1).padStart(5, '0')}`,
      annualTax: Math.round(areaHa * (hasBuilding ? 18500 : 1200)),
      status: weighted<'Paid' | 'Due' | 'Overdue'>([
        ['Paid', 70],
        ['Due', 20],
        ['Overdue', 10],
      ]),
      lastPaidOn: isoDate(2026, 1, 6),
      authority: `Gram Panchayat ${v.village}`,
    },
    utilities,
    restrictions,
  }
}

function buildAllRecords() {
  const records: LandRecord[] = []
  for (const v of VILLAGES) {
    let index = 0
    for (let row = 0; row < v.rows; row++) {
      for (let col = 0; col < v.cols; col++) {
        records.push(buildRecord(v, row, col, index))
        index++
      }
    }
  }
  return records
}

export const LAND_RECORDS: LandRecord[] = buildAllRecords()

export function getRecordByUlpin(ulpin: string) {
  return LAND_RECORDS.find((r) => r.ulpin.toLowerCase() === ulpin.toLowerCase())
}

export function toParcelSummary(r: LandRecord) {
  return {
    ulpin: r.ulpin,
    parcelId: r.parcelId,
    surveyNo: r.surveyNo,
    state: r.state,
    district: r.district,
    taluka: r.taluka,
    village: r.village,
    areaHa: r.areaHa,
    landUse: r.landUse,
    ownershipStatus: r.ownershipStatus,
    recordStatus: r.recordStatus,
    lastUpdated: r.lastUpdated,
    centroid: r.centroid,
    boundary: r.boundary,
  }
}

export const PARCELS = LAND_RECORDS.map(toParcelSummary)

/* ---------- GIS context layers ---------- */

function villageBounds(v: VillageConfig) {
  return {
    south: v.origin[0],
    west: v.origin[1],
    north: v.origin[0] + v.rows * CELL_LAT,
    east: v.origin[1] + v.cols * CELL_LNG,
  }
}

export const ADMIN_BOUNDARIES = VILLAGES.map((v) => {
  const b = villageBounds(v)
  const pad = 0.0004
  return {
    name: `${v.village} (Village)`,
    district: v.district,
    taluka: v.taluka,
    boundary: [
      [b.south - pad, b.west - pad],
      [b.north + pad, b.west - pad],
      [b.north + pad, b.east + pad],
      [b.south - pad, b.east + pad],
    ] as LatLng[],
  }
})

export const ROADS = VILLAGES.flatMap((v) => {
  const b = villageBounds(v)
  const midLat = v.origin[0] + Math.floor(v.rows / 2) * CELL_LAT
  const midLng = v.origin[1] + Math.floor(v.cols / 2) * CELL_LNG
  return [
    { name: `${v.village} Village Road`, type: 'Village Road', path: [[midLat, b.west - 0.001], [midLat, b.east + 0.001]] as LatLng[] },
    { name: `${v.village} ZP Road`, type: 'District Road', path: [[b.south - 0.001, midLng], [b.north + 0.001, midLng]] as LatLng[] },
  ]
}).concat([
  {
    name: 'Pune–Ahmednagar Highway (NH 753F)',
    type: 'National Highway',
    path: [
      [18.5725, 73.965],
      [18.5742, 73.9805],
      [18.5739, 73.995],
      [18.5752, 74.01],
    ],
  },
])

export const WATER_BODIES = VILLAGES.map((v) => {
  const b = villageBounds(v)
  const cLat = b.north - CELL_LAT * 0.6
  const cLng = b.east + 0.0035
  const points: LatLng[] = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2
    return [cLat + Math.sin(angle) * 0.0011, cLng + Math.cos(angle) * 0.0016]
  })
  return { name: `${v.village} Talav (Tank)`, type: 'Village Tank', boundary: points }
})

export const BUILDINGS = LAND_RECORDS.filter((r) => r.buildingPermission).map((r) => {
  const [lat, lng] = r.centroid
  const dLat = 0.00045
  const dLng = 0.0006
  return {
    ulpin: r.ulpin,
    name: `Structure on ${r.parcelId}`,
    boundary: [
      [lat - dLat, lng - dLng],
      [lat + dLat, lng - dLng],
      [lat + dLat, lng + dLng],
      [lat - dLat, lng + dLng],
    ] as LatLng[],
  }
})

export const UTILITIES = VILLAGES.flatMap((v) => {
  const b = villageBounds(v)
  return [
    { name: `${v.village} Transformer (MSEDCL)`, type: 'Electric Transformer', position: [b.south + CELL_LAT, b.west + CELL_LNG] as LatLng },
    { name: `${v.village} Water Tank`, type: 'Overhead Water Tank', position: [b.north - CELL_LAT, b.east - CELL_LNG] as LatLng },
    { name: `${v.village} Tube Well`, type: 'Tube Well', position: [b.south + CELL_LAT, b.east - CELL_LNG] as LatLng },
  ]
})

export const ZONING = VILLAGES.flatMap((v) => {
  const b = villageBounds(v)
  const midLat = (b.south + b.north) / 2
  return [
    {
      name: `${v.village} – Residential Zone (R1)`,
      color: '#f59e0b',
      boundary: [[midLat, b.west], [b.north, b.west], [b.north, b.east], [midLat, b.east]] as LatLng[],
    },
    {
      name: `${v.village} – Agricultural Zone (A)`,
      color: '#65a30d',
      boundary: [[b.south, b.west], [midLat, b.west], [midLat, b.east], [b.south, b.east]] as LatLng[],
    },
  ]
})

export const MAP_LAYERS = [
  { id: 'cadastral', name: 'Cadastral Parcels', source: 'Survey & Settlement (Demo)', features: LAND_RECORDS.length },
  { id: 'landuse', name: 'Land Use', source: 'Revenue Dept. (Demo)', features: LAND_RECORDS.length },
  { id: 'zoning', name: 'Zoning', source: 'Town Planning (Demo)', features: ZONING.length },
  { id: 'roads', name: 'Roads', source: 'PWD / ZP (Demo)', features: ROADS.length },
  { id: 'water', name: 'Water Bodies', source: 'Water Resources (Demo)', features: WATER_BODIES.length },
  { id: 'buildings', name: 'Buildings', source: 'Local Bodies (Demo)', features: BUILDINGS.length },
  { id: 'utilities', name: 'Utilities', source: 'MSEDCL / Jal Board (Demo)', features: UTILITIES.length },
  { id: 'admin', name: 'Administrative Boundaries', source: 'Revenue Dept. (Demo)', features: ADMIN_BOUNDARIES.length },
] as const

export type MapLayerId = (typeof MAP_LAYERS)[number]['id']

/* ---------- Services, activity, admin ---------- */

export const SERVICE_TYPES = [
  'Ownership Verification',
  'Land Record Search',
  'Registration Status',
  'Mutation / Record Update',
  'Property Information',
  'Service Request',
] as const

const REQUEST_STATUSES = ['Submitted', 'Under Review', 'Field Verification', 'Approved', 'Rejected'] as const

export const SERVICE_REQUESTS: ServiceRequest[] = Array.from({ length: 18 }, (_, i) => {
  const record = LAND_RECORDS[(i * 7) % LAND_RECORDS.length]
  return {
    applicationId: `LS-2026-${String(104200 + i * 37).padStart(6, '0')}`,
    applicant: personName(),
    ulpin: record.ulpin,
    serviceType: pick(SERVICE_TYPES),
    submittedOn: isoDate(2026, 7, 9),
    status: weighted<ServiceRequest['status']>([
      [REQUEST_STATUSES[0], 20],
      [REQUEST_STATUSES[1], 28],
      [REQUEST_STATUSES[2], 14],
      [REQUEST_STATUSES[3], 30],
      [REQUEST_STATUSES[4], 8],
    ]),
    office: `Tahsil Office, ${record.taluka}`,
  }
}).sort((a, b) => b.submittedOn.localeCompare(a.submittedOn))

export const PARCEL_ACTIVITY = [
  { ulpin: LAND_RECORDS[2].ulpin, parcelId: LAND_RECORDS[2].parcelId, action: 'Boundary re-survey completed (ETS)', actor: 'Survey Officer, Haveli', time: '2 hours ago' },
  { ulpin: LAND_RECORDS[9].ulpin, parcelId: LAND_RECORDS[9].parcelId, action: 'Mutation entry certified', actor: 'Circle Officer, Wagholi', time: '5 hours ago' },
  { ulpin: LAND_RECORDS[15].ulpin, parcelId: LAND_RECORDS[15].parcelId, action: 'Sale deed linked from IGR registry', actor: 'System (Registration sync)', time: 'Yesterday' },
  { ulpin: LAND_RECORDS[27].ulpin, parcelId: LAND_RECORDS[27].parcelId, action: 'Zoning updated per Draft DP', actor: 'Planning Officer, PMRDA', time: 'Yesterday' },
  { ulpin: LAND_RECORDS[40].ulpin, parcelId: LAND_RECORDS[40].parcelId, action: 'Area mismatch flagged (RoR vs map)', actor: 'Anomaly Engine (Demo)', time: '2 days ago' },
]

export const NOTIFICATIONS = [
  { id: 'n1', title: 'Mutation pending approval', body: '12 mutation entries in Haveli taluka await Circle Officer certification.', time: '10 min ago', tone: 'warning' as const },
  { id: 'n2', title: 'Registration sync completed', body: '148 registration documents linked to ULPINs from the IGR demo feed.', time: '1 hour ago', tone: 'success' as const },
  { id: 'n3', title: 'Data discrepancy detected', body: 'Area recorded in RoR differs from GIS area by more than 5% on 4 parcels.', time: '3 hours ago', tone: 'destructive' as const },
  { id: 'n4', title: 'New GIS layer published', body: 'PMRDA Draft DP zoning layer v2.1 is now available.', time: 'Yesterday', tone: 'info' as const },
]

export const ROLES = ['Citizen', 'Survey Officer', 'Revenue Officer', 'Planning Officer', 'Administrator'] as const
export type Role = (typeof ROLES)[number]

export const PERMISSIONS: { id: string; label: string; roles: Role[] }[] = [
  { id: 'view-public', label: 'View public parcel information', roles: ['Citizen', 'Survey Officer', 'Revenue Officer', 'Planning Officer', 'Administrator'] },
  { id: 'apply', label: 'Submit service applications', roles: ['Citizen', 'Administrator'] },
  { id: 'edit-geometry', label: 'Edit parcel geometry', roles: ['Survey Officer', 'Administrator'] },
  { id: 'certify-mutation', label: 'Certify mutation / RoR updates', roles: ['Revenue Officer', 'Administrator'] },
  { id: 'edit-zoning', label: 'Update land use & zoning', roles: ['Planning Officer', 'Administrator'] },
  { id: 'view-owner-pii', label: 'View owner personal details', roles: ['Revenue Officer', 'Administrator'] },
  { id: 'manage-layers', label: 'Publish GIS layers', roles: ['Survey Officer', 'Planning Officer', 'Administrator'] },
  { id: 'manage-users', label: 'Manage users & roles', roles: ['Administrator'] },
  { id: 'view-audit', label: 'View audit logs', roles: ['Administrator'] },
]

export const USERS = [
  { name: 'Priya Deshmukh', email: 'priya.d@landstack.demo', role: 'Administrator' as Role, office: 'State Nodal Cell, Pune', status: 'Active' },
  { name: 'Rahul Shinde', email: 'rahul.s@landstack.demo', role: 'Survey Officer' as Role, office: 'TILR Office, Haveli', status: 'Active' },
  { name: 'Snehal Kulkarni', email: 'snehal.k@landstack.demo', role: 'Revenue Officer' as Role, office: 'Tahsil Office, Haveli', status: 'Active' },
  { name: 'Amol Pawar', email: 'amol.p@landstack.demo', role: 'Planning Officer' as Role, office: 'PMRDA Planning Cell', status: 'Active' },
  { name: 'Vaishali Jadhav', email: 'vaishali.j@landstack.demo', role: 'Revenue Officer' as Role, office: 'Tahsil Office, Sinnar', status: 'Inactive' },
  { name: 'Ramesh Gaikwad', email: 'ramesh.g@landstack.demo', role: 'Citizen' as Role, office: '—', status: 'Active' },
  { name: 'Kiran Thorat', email: 'kiran.t@landstack.demo', role: 'Survey Officer' as Role, office: 'TILR Office, Karad', status: 'Active' },
]

export const AUDIT_LOGS: AuditLog[] = [
  { id: 'a1', user: 'Snehal Kulkarni', role: 'Revenue Officer', action: `Certified mutation #3421 for ${LAND_RECORDS[9].ulpin}`, module: 'Land Records', timestamp: '2026-09-30 10:42', status: 'Success' },
  { id: 'a2', user: 'Rahul Shinde', role: 'Survey Officer', action: `Updated boundary geometry for ${LAND_RECORDS[2].parcelId}`, module: 'GIS', timestamp: '2026-09-30 09:18', status: 'Success' },
  { id: 'a3', user: 'System', role: 'Service', action: 'Registration sync job (IGR demo feed)', module: 'API Integration', timestamp: '2026-09-30 08:00', status: 'Success' },
  { id: 'a4', user: 'Amol Pawar', role: 'Planning Officer', action: 'Published zoning layer v2.1', module: 'GIS Layers', timestamp: '2026-09-29 17:55', status: 'Success' },
  { id: 'a5', user: 'Unknown', role: '—', action: 'Failed login attempt (3x)', module: 'Authentication', timestamp: '2026-09-29 16:21', status: 'Failed' },
  { id: 'a6', user: 'Priya Deshmukh', role: 'Administrator', action: 'Assigned role "Survey Officer" to Kiran Thorat', module: 'Users', timestamp: '2026-09-29 12:03', status: 'Success' },
  { id: 'a7', user: 'Anomaly Engine', role: 'Service', action: `Area mismatch flagged on ${LAND_RECORDS[40].parcelId}`, module: 'Analytics', timestamp: '2026-09-29 06:30', status: 'Warning' },
  { id: 'a8', user: 'Vaishali Jadhav', role: 'Revenue Officer', action: 'Exported RoR extract batch (Sinnar)', module: 'Land Records', timestamp: '2026-09-28 15:47', status: 'Success' },
  { id: 'a9', user: 'Ramesh Gaikwad', role: 'Citizen', action: 'Submitted Ownership Verification request', module: 'Services', timestamp: '2026-09-28 11:12', status: 'Success' },
]

export const MONTHLY_REQUESTS = [
  { month: 'Apr', submitted: 412, resolved: 365 },
  { month: 'May', submitted: 468, resolved: 421 },
  { month: 'Jun', submitted: 503, resolved: 470 },
  { month: 'Jul', submitted: 587, resolved: 519 },
  { month: 'Aug', submitted: 642, resolved: 598 },
  { month: 'Sep', submitted: 701, resolved: 655 },
]

export const DASHBOARD_STATS = {
  totalParcels: 1284560,
  verifiedRecords: 1036211,
  activeApplications: 18432,
  pendingServices: 3219,
}

export const API_ENDPOINTS = [
  { method: 'GET', path: '/api/parcels', description: 'List parcels with ULPIN, area, land use and status', example: '/api/parcels?district=Pune&limit=3', status: 'Connected' },
  { method: 'GET', path: '/api/parcels/{ulpin}', description: 'Full parcel-centric record for a single ULPIN', example: `/api/parcels/${LAND_RECORDS[0].ulpin}`, status: 'Connected' },
  { method: 'GET', path: '/api/land-records', description: 'RoR / ownership information with mutation history', example: '/api/land-records?limit=2', status: 'Demo Mode' },
  { method: 'GET', path: '/api/registration', description: 'Registration deeds linked to ULPIN', example: '/api/registration?limit=2', status: 'Demo Mode' },
  { method: 'GET', path: '/api/services', description: 'Citizen service applications and status', example: '/api/services?limit=3', status: 'Connected' },
  { method: 'GET', path: '/api/gis/layers', description: 'Catalogue of published GIS layers', example: '/api/gis/layers', status: 'Connected' },
] as const
