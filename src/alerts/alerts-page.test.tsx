import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import axe from "axe-core"

import { AlertsPage } from "./alerts-page"

afterEach(cleanup)

const rows = () => within(screen.getByRole("table", { name: "Alerts" })).getAllByRole("row").slice(1)

// jsdom has no layout or colour, so contrast is checked by Bastion's story
// tests in a real browser instead. Every other axe rule runs here.
async function expectNoAxeViolations(container: HTMLElement) {
  const results = await axe.run(container, { rules: { "color-contrast": { enabled: false } } })
  expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([])
}

describe("AlertsPage", () => {
  it("lists every alert, most serious first", async () => {
    const { container } = render(<AlertsPage />)
    expect(rows()).toHaveLength(10)
    expect(rows()[0]?.textContent).toContain("Critical")
    expect(rows()[9]?.textContent).toContain("Info")
    await expectNoAxeViolations(container)
  })

  it("filters by severity, with the pressed state on the button", async () => {
    const user = userEvent.setup()
    render(<AlertsPage />)
    const group = screen.getByRole("group", { name: "Filter by severity" })
    const high = within(group).getByRole("button", { name: /High/ })

    await user.click(high)
    expect(high.getAttribute("aria-pressed")).toBe("true")
    expect(rows()).toHaveLength(3)
    for (const row of rows()) expect(row.textContent).toContain("High")
  })

  it("shows an empty state when nothing matches, and clears the filters", async () => {
    const user = userEvent.setup()
    const { container } = render(<AlertsPage />)

    await user.type(screen.getByRole("searchbox", { name: "Search alerts" }), "no-such-host")
    expect(screen.getByText("No alerts match these filters")).toBeTruthy()
    await expectNoAxeViolations(container)

    await user.click(screen.getAllByRole("button", { name: "Clear filters" })[0]!)
    expect(rows()).toHaveLength(10)
  })

  it("shows a different empty state when there are no alerts at all", () => {
    render(<AlertsPage data={[]} />)
    expect(screen.getByText("No alerts")).toBeTruthy()
    expect(screen.queryByRole("button", { name: "Clear filters" })).toBeNull()
  })
})
