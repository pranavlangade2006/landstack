export type LatLng = [number, number]

export type LandUse =
  | 'Agricultural'
  | 'Residential'
  | 'Commercial'
  | 'Industrial'
  | 'Public / Institutional'
  | 'Forest / Open Space'

export type RecordStatus = 'Verified' | 'Pending Verification' | 'Under Mutation' | 'Discrepancy'

export type OwnershipStatus = 'Single Owner' | 'Joint Ownership' | 'Government Land' | 'Disputed'

export type ULPIN = string

export interface Owner {
  name: string
  relation: string
  share: string
  khataNo: string
}

export interface MutationEntry {
  mutationNo: string
  date: string
  type: string
  status: 'Certified' | 'Pending'
}

export interface Ownership {
  owners: Owner[]
  rorType: string
  cultivator: string
  tenancy: string
  mutations: MutationEntry[]
}

export interface Registration {
  documentNo: string
  deedType: string
  registrationDate: string
  subRegistrarOffice: string
  considerationValue: number
  stampDuty: number
  encumbrance: string
}

export interface LandUseZoning {
  zone: string
  permissibleFsi: number
  planReference: string
  permittedUses: string[]
}

export interface BuildingPermission {
  permitNo: string
  status: 'Approved' | 'Under Review' | 'Not Applied'
  builtUpAreaSqm: number
  floors: number
  approvedOn: string | null
  authority: string
}

export interface PropertyTax {
  assessmentNo: string
  annualTax: number
  status: 'Paid' | 'Due' | 'Overdue'
  lastPaidOn: string
  authority: string
}

export interface Utility {
  type: string
  provider: string
  reference: string
  status: 'Active' | 'Not Connected'
}

export interface Restriction {
  type: string
  description: string
  severity: 'Info' | 'Caution' | 'Critical'
}

export interface Parcel {
  ulpin: ULPIN
  parcelId: string
  surveyNo: string
  state: string
  district: string
  taluka: string
  village: string
  areaHa: number
  landUse: LandUse
  ownershipStatus: OwnershipStatus
  recordStatus: RecordStatus
  lastUpdated: string
  centroid: LatLng
  boundary: LatLng[]
}

export interface LandRecord extends Parcel {
  ownership: Ownership
  registration: Registration
  zoning: LandUseZoning
  buildingPermission: BuildingPermission | null
  propertyTax: PropertyTax
  utilities: Utility[]
  restrictions: Restriction[]
}

export type ServiceStatus = 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Field Verification'

export interface ServiceRequest {
  applicationId: string
  applicant: string
  ulpin: ULPIN
  serviceType: string
  submittedOn: string
  status: ServiceStatus
  office: string
}

export interface AuditLog {
  id: string
  user: string
  role: string
  action: string
  module: string
  timestamp: string
  status: 'Success' | 'Failed' | 'Warning'
}
