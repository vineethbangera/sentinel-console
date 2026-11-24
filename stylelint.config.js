// App CSS is layout only. Colours must come from Bastion's token variables.
const message = "Use a Bastion token variable, such as var(--border), not a literal colour."

export default {
  extends: ["stylelint-config-standard"],
  rules: {
    "color-no-hex": [true, { message }],
    "color-named": ["never", { message }],
    "function-disallowed-list": [["rgb", "rgba", "hsl", "hsla", "hwb", "lab", "lch", "oklab", "oklch"], { message }],
    "selector-class-pattern": null,
  },
}
