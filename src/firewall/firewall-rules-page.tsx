import { Input } from "@vineethbangera/ui"

// Built from the "Sentinel-test" Figma frame (node 1:1656), which so far has
// only the page title and a search field. The rules table, filters and
// actions aren't designed yet, so the search has nothing to filter.
export function FirewallRulesPage() {
  return (
    <section className="page" aria-labelledby="firewall-title">
      <header className="page-header page-header-divided">
        <h1 id="firewall-title">Firewall rules</h1>
        <p className="muted">Traffic allowed or blocked at the network edge. Rules apply top to bottom.</p>
      </header>

      <div className="firewall-search">
        <Input type="search" placeholder="Search by name, port or IP" aria-label="Search firewall rules" />
      </div>
    </section>
  )
}
