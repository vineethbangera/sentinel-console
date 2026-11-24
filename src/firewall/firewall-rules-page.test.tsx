import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import axe from "axe-core"

import { FirewallRulesPage } from "./firewall-rules-page"

afterEach(cleanup)

describe("FirewallRulesPage", () => {
  it("has one heading, a description and a labelled search field", async () => {
    const { container } = render(<FirewallRulesPage />)
    expect(screen.getByRole("heading", { level: 1, name: "Firewall rules" })).toBeTruthy()
    expect(screen.getByText(/Rules apply top to bottom/)).toBeTruthy()

    const search = screen.getByRole("searchbox", { name: "Search firewall rules" })
    // The design shows the invalid state, but there's no error to explain it.
    expect(search.getAttribute("aria-invalid")).toBeNull()

    // jsdom can't measure colour, so contrast is left to the browser check.
    const results = await axe.run(container, { rules: { "color-contrast": { enabled: false } } })
    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([])
  })
})
