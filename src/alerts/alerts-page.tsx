import { useState } from "react"
import {
  Button,
  DataTable,
  Input,
  SeverityBadge,
  type DataTableColumn,
  type Severity,
} from "@vineethbangera/ui"

import { alerts as allAlerts, formatAge, severities, statuses, type Alert, type AlertStatus } from "./alerts"

const columns: DataTableColumn<Alert>[] = [
  { id: "severity", header: "Severity", cell: (row) => <SeverityBadge severity={row.severity} /> },
  {
    id: "alert",
    header: "Alert",
    cell: (row) => (
      <div className="alert-cell">
        <span>{row.title}</span>
        <span className="muted mono">{row.id}</span>
      </div>
    ),
  },
  { id: "host", header: "Host", cell: (row) => <span className="mono">{row.host}</span> },
  { id: "status", header: "Status", cell: (row) => row.status },
  { id: "age", header: "Detected", cell: (row) => <span className="muted">{formatAge(row.ageMinutes)}</span> },
]

const rank = (row: Alert) => severities.indexOf(row.severity)

export function AlertsPage({ data = allAlerts }: { data?: Alert[] }) {
  const [query, setQuery] = useState("")
  const [severity, setSeverity] = useState<Severity | null>(null)
  const [status, setStatus] = useState<AlertStatus | null>(null)

  const filtering = query !== "" || severity !== null || status !== null
  const clearFilters = () => {
    setQuery("")
    setSeverity(null)
    setStatus(null)
  }

  const needle = query.trim().toLowerCase()
  const visible = data
    .filter((row) => !needle || `${row.id} ${row.title} ${row.host}`.toLowerCase().includes(needle))
    .filter((row) => severity === null || row.severity === severity)
    .filter((row) => status === null || row.status === status)
    .sort((a, b) => rank(a) - rank(b) || a.ageMinutes - b.ageMinutes)

  // Counts ignore the severity filter, so every button shows what it would show.
  const countFor = (level: Severity) =>
    data.filter((row) => row.severity === level && (status === null || row.status === status)).length

  return (
    <section className="page" aria-labelledby="alerts-title">
      <header className="page-header">
        <div>
          <h1 id="alerts-title">Alerts</h1>
          <p className="muted">
            {data.length === 0
              ? "No alerts."
              : `${visible.length} of ${data.length} alerts, most serious first.`}
          </p>
        </div>
      </header>

      <div className="severity-filter" role="group" aria-label="Filter by severity">
        {severities.map((level) => (
          <Button
            key={level}
            variant={severity === level ? "secondary" : "ghost"}
            size="sm"
            aria-pressed={severity === level}
            onClick={() => setSeverity(severity === level ? null : level)}
          >
            <SeverityBadge severity={level} count={countFor(level)} />
          </Button>
        ))}
      </div>

      <DataTable
        aria-label="Alerts"
        columns={columns}
        data={visible}
        getRowId={(row) => row.id}
        toolbar={
          <>
            <div className="search">
              <Input
                type="search"
                placeholder="Search by ID, alert or host"
                aria-label="Search alerts"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <div role="group" aria-label="Filter by status" className="status-filter">
              {statuses.map((value) => (
                <Button
                  key={value}
                  variant={status === value ? "default" : "outline"}
                  size="sm"
                  aria-pressed={status === value}
                  onClick={() => setStatus(status === value ? null : value)}
                >
                  {value}
                </Button>
              ))}
            </div>
            {filtering && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </>
        }
        rowActions={(row) => (
          <Button variant="outline" size="sm" aria-label={`Investigate ${row.id}`}>
            Investigate
          </Button>
        )}
        emptyState={
          data.length === 0 ? (
            <div className="empty">
              <strong>No alerts</strong>
              <span>Sentinel hasn't raised any alerts. New ones appear here as they fire.</span>
            </div>
          ) : (
            <div className="empty">
              <strong>No alerts match these filters</strong>
              <span>Try a different search, or clear the filters to see all {data.length} alerts.</span>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          )
        }
      />
    </section>
  )
}
