import type { Severity } from "@vineethbangera/ui"

export type AlertStatus = "Open" | "Investigating" | "Resolved"

export type Alert = {
  id: string
  title: string
  host: string
  severity: Severity
  status: AlertStatus
  /** Minutes since the alert fired. A real console would use timestamps. */
  ageMinutes: number
}

// Most serious first, so tables and filters can sort by it.
export const severities: Severity[] = ["critical", "high", "medium", "low", "info"]

export const statuses: AlertStatus[] = ["Open", "Investigating", "Resolved"]

// Sample alerts for a fictional estate. All hosts use documentation ranges.
export const alerts: Alert[] = [
  { id: "ALR-2041", title: "Ransomware file-rename burst on file share", host: "fs-02.corp.example", severity: "critical", status: "Open", ageMinutes: 4 },
  { id: "ALR-2040", title: "Credential dumping tool detected (LSASS access)", host: "ws-1187.corp.example", severity: "critical", status: "Investigating", ageMinutes: 22 },
  { id: "ALR-2039", title: "Impossible travel sign-in for admin account", host: "idp.example", severity: "high", status: "Open", ageMinutes: 37 },
  { id: "ALR-2038", title: "Outbound traffic to known C2 domain", host: "10.20.4.17", severity: "high", status: "Investigating", ageMinutes: 58 },
  { id: "ALR-2037", title: "New service installed by unsigned binary", host: "srv-db-01.corp.example", severity: "high", status: "Open", ageMinutes: 95 },
  { id: "ALR-2036", title: "Public S3 bucket policy changed", host: "aws:prod-logs", severity: "medium", status: "Open", ageMinutes: 140 },
  { id: "ALR-2035", title: "Multiple failed MFA prompts", host: "idp.example", severity: "medium", status: "Resolved", ageMinutes: 210 },
  { id: "ALR-2034", title: "TLS certificate expires in 7 days", host: "api.example.com", severity: "low", status: "Open", ageMinutes: 380 },
  { id: "ALR-2033", title: "Endpoint agent out of date", host: "ws-0942.corp.example", severity: "low", status: "Resolved", ageMinutes: 720 },
  { id: "ALR-2032", title: "New device enrolled for user", host: "mdm.example", severity: "info", status: "Resolved", ageMinutes: 1460 },
]

export function formatAge(minutes: number) {
  if (minutes < 60) return `${minutes} min ago`
  if (minutes < 1440) return `${Math.round(minutes / 60)} h ago`
  return `${Math.round(minutes / 1440)} d ago`
}
