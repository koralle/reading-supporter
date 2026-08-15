import { defineConfig } from "oxfmt";

export default defineConfig({
  // Match existing Next.js source style to avoid a repo-wide reformat.
  bracketSameLine: false,
  bracketSpacing: true,
  ignorePatterns: [
    "pnpm-lock.yaml",
    ".next/**",
    "out/**",
    "styled-system/**",
    "src-tauri/target/**",
    "src-tauri/gen/**",
    // Keep docs / editor config out of autoformat churn for this setup
    "*.md",
    "*.jsonc",
  ],
  jsxSingleQuote: false,
  semi: true,
  singleAttributePerLine: false,
  singleQuote: false,
  sortImports: false,
  sortPackageJson: {
    sortScripts: true,
  },
  trailingComma: "all",
});
