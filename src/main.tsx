import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

// Bastion's stylesheet carries the token variables (Light on :root, Dark on
// .dark) and the styles for every Bastion component.
import "@vineethbangera/ui/styles.css"
import "./app.css"

import { App } from "./app"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
