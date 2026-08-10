import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    correctness: "error",
    nursery: "off",
    pedantic: "off",
    perf: "warn",
    restriction: "warn",
    style: "warn",
    suspicious: "error",
  },
  ignorePatterns: [
    ".next/**",
    "out/**",
    "styled-system/**",
    "src-tauri/target/**",
    "src-tauri/gen/**",
    "next-env.d.ts",
  ],
  plugins: [
    "eslint",
    "unicorn",
    "react",
    "react-perf",
    "oxc",
    "import",
    "jsdoc",
    "jsx-a11y",
    "node",
    "promise",
  ],
  rules: {
    // Suspicious
    "react/react-in-jsx-scope": "off",

    // Perf
    "react-perf/jsx-no-new-array-as-prop": "off",
    "react-perf/jsx-no-new-function-as-prop": "off",

    // Import
    "import/no-unassigned-import": ["error", { allow: ["**/*.css"] }],

    // Restriction
    "react/jsx-filename-extension": "off",
    "react/jsx-max-depth": "off",
    "react/jsx-no-literals": "off",
    "react/only-export-components": "off",
    // Panda CSS relies on className-based styling
    "react/forbid-component-props": "off",
    "oxc/no-async-await": "off",
    "oxc/no-optional-chaining": "off",
    "oxc/no-rest-spread-properties": "off",
    "unicorn/no-null": "off",
    "no-ternary": "off",
    "no-undefined": "off",
    "import/exports-last": "off",
    "import/no-relative-parent-imports": "off",

    // Style / conventions for this codebase
    "func-style": "off",
    "id-length": "off",
    "no-duplicate-imports": ["error", { allowSeparateTypeImports: true }],
    "no-magic-numbers": "off",
    "sort-imports": "off",
    "sort-keys": "off",
    "import/group-exports": "off",
    "import/no-named-export": "off",
    "import/no-namespace": "off",
    "import/prefer-default-export": "off",
    // React components use PascalCase filenames
    "unicorn/filename-case": "off",
    // Tauri Channel exposes `onmessage` rather than addEventListener
    "unicorn/prefer-add-event-listener": "off",
    // Side-effect then() callbacks are used with external event bridges
    "promise/always-return": "off",
    // Loop flags are mutated from async callbacks (false positive for this pattern)
    "no-unmodified-loop-condition": "off",
    // ErrorBoundary fallbackRender / Suspense fallback pass render props
    "react/no-unstable-nested-components": ["error", { allowAsProps: true }],
    // Mobile pane switcher uses a form with tab roles for progressive enhancement
    "jsx-a11y/no-noninteractive-element-to-interactive-role": "off",
  },
  overrides: [
    {
      files: ["src/app/**/*.{ts,tsx}"],
      rules: {
        // Next.js App Router conventions
        "import/no-default-export": "off",
        "react/no-multi-comp": "off",
      },
    },
    {
      files: [
        "next.config.ts",
        "oxfmt.config.ts",
        "oxlint.config.ts",
        "panda.config.ts",
        "postcss.config.mjs",
      ],
      rules: {
        "import/no-default-export": "off",
      },
    },
  ],
});
