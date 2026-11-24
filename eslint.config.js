import js from "@eslint/js"
import { fixupPluginRules } from "@eslint/compat"
import jsxA11y from "eslint-plugin-jsx-a11y"
import reactHooks from "eslint-plugin-react-hooks"
import globals from "globals"
import tseslint from "typescript-eslint"

// Colours written by hand instead of read from Bastion's tokens: hex, rgb(),
// hsl() and Tailwind palette or arbitrary colour classes. Bastion's own repo
// has a fuller rule; this catches the same mistakes in app code.
const HARDCODED_COLOUR =
  String.raw`/#[0-9a-fA-F]{3,8}\b|\b(rgba?|hsla?|oklch)\(|\b(bg|text|border|ring|fill|stroke)-(\[#|(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone|black|white)\b)/`
const colourMessage =
  "Hard-coded colour. Use a Bastion component or a semantic token (var(--primary), var(--severity-high), ...)."

export default tseslint.config(
  { ignores: ["dist", "node_modules"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    linterOptions: { reportUnusedDisableDirectives: "error" },
  },
  {
    // jsx-a11y only declares support for ESLint 9; fixupPluginRules adapts it.
    files: ["**/*.{jsx,tsx}"],
    plugins: { "jsx-a11y": fixupPluginRules(jsxA11y) },
    rules: jsxA11y.flatConfigs.strict.rules,
  },
  reactHooks.configs.flat.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/**/*.test.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        { selector: `Literal[value=${HARDCODED_COLOUR}]`, message: colourMessage },
        { selector: `TemplateElement[value.raw=${HARDCODED_COLOUR}]`, message: colourMessage },
      ],
    },
  }
)
