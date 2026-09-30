const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
const num = new Intl.NumberFormat('en-IN')
const date = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })

export const formatINR = (value: number) => inr.format(value)
export const formatNumber = (value: number) => num.format(value)
export const formatDate = (iso: string) => date.format(new Date(`${iso}T00:00:00Z`))
export const formatArea = (ha: number) => `${ha.toFixed(2)} ha`
export const haToAcres = (ha: number) => (ha * 2.47105).toFixed(2)
