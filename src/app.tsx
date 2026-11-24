import { useEffect, useState } from "react"
import { Button } from "@vineethbangera/ui"
import { dark, light } from "@vineethbangera/tokens"

import { AlertsPage } from "./alerts/alerts-page"

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

  return (
    <>
      <header className="topbar">
        <span className="brand">Sentinel</span>
        <nav aria-label="Main">
          <a href="/" aria-current="page">Alerts</a>
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
        <AlertsPage data={emptyDemo ? [] : undefined} />
      </main>
    </>
  )
}
