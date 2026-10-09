# CLAUDE.md — Google Material 3 Theme Suite for Super Productivity

## Project Overview
This repository provides a Google Material 3 (Material You / M3) theme suite for [Super Productivity](https://super-productivity.com/), featuring authentic tonal surface elevations, 14px container cards for tasks, squircle FABs, pill navigation drawers, and dual Light/Dark modes in each theme file.

## Available Themes
- `google-material-3.css`: Baseline Google Blue / Workspace (Flagship)
- `google-material-3-sage.css`: Organic Sage Green (Focus & calm)
- `google-material-3-coral.css`: Expressive Coral / Terracotta (Energy & sprints)
- `google-material-3-lavender.css`: Evening Lavender / Amethyst (Evening planning)
- `google-material-3-monochrome.css`: Executive Monochrome (Minimalist grayscale)

## Essential Commands
- **Run validation**: `npm test` or `node scripts/validate-theme.js <file.css>`
- **Run preview server**: `npm run preview` (opens http://localhost:3000)

## Theming Rules & Constraints
- **Contract Compliance**: All themes must declare all required (`--surface-1`, `--surface-2`, `--ink`, `--ink-on-channel`) and recommended (`--surface-0`, `--surface-3`, `--surface-4`, `--ink-strong`, `--ink-muted`, `--separator`, `--divider`, `--scrim`) tokens.
- **Selector Specificity**: Light mode primitives go under `body`, Dark mode primitives go under `body.isDarkTheme`.
- **Security Restrictions**: Do not use `@import`, remote/relative `url()` or `src()`, `image()`, or `image-set()`. Keep under 500 KB.
