import { useEffect, useState } from "react"
import { Button } from "@vineethbangera/ui"
import { dark, light } from "@vineethbangera/tokens"

import { AlertsPage } from "./alerts/alerts-page"
import { FirewallRulesPage } from "./firewall/firewall-rules-page"

// Two pages, chosen by path. Plain links reload the page; a router isn't
// worth adding until there are more pages or shared state between them.
const pages = [
  { path: "/", label: "Alerts", title: "Alerts" },
  { path: "/firewall-rules", label: "Firewall rules", title: "Firewall rules" },
] as const

const currentPath = pages.some((page) => page.path === window.location.pathname)
  ? window.location.pathname
  : "/"

type Theme = "light" | "dark"

const initialTheme = (): Theme =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

// Add ?demo=empty to the URL to see the page with no alerts at all.
const emptyDemo = new URLSearchParams(window.location.search).get("demo") === "empty"

export function App() {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    // The browser's own UI (tab strip on mobile) matches the page background.
    const meta =
      document.querySelector<HTMLMetaElement>('meta[name="theme-color"]') ??
      document.head.appendChild(Object.assign(document.createElement("meta"), { name: "theme-color" }))
    meta.content = (theme === "dark" ? dark : light).background
  }, [theme])

  useEffect(() => {
    const page = pages.find((p) => p.path === currentPath)
    document.title = `${page?.title ?? "Alerts"} · Sentinel`
  }, [])

  return (
    <>
      <header className="topbar">
        <span className="brand">Sentinel</span>
        <nav aria-label="Main">
          {pages.map((page) => (
            <a
              key={page.path}
              href={page.path}
              aria-current={page.path === currentPath ? "page" : undefined}
            >
              {page.label}
            </a>
          ))}
        </nav>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "Light theme" : "Dark theme"}
        </Button>
      </header>
      <main>
        {currentPath === "/firewall-rules" ? (
          <FirewallRulesPage />
        ) : (
          <AlertsPage data={emptyDemo ? [] : undefined} />
        )}
      </main>
    </>
  )
}
