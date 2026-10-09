# Google Material 3 Theme Suite for Super Productivity

> A collection of themes for [Super Productivity](https://super-productivity.com/) built according to the official **Google Material 3 (Material You / M3)** design specifications.

---

## 🌟 Highlights

* **Official Material 3 Color System**: Authentic M3 tonal palette mapping with light and dark mode pairs.
* **Tonal Surface Elevation**: Replaces heavy drop shadows with Material 3 surface elevation (`surface`, `surface-container-low`, `surface-container`, `surface-container-high`, `surface-container-highest`).
* **M3 Shapes & Corner Radii**:
  * 🗂️ **Elevated Task Cards**: 14px rounded container cards with distinct resting, hover, active, and completed states.
  * 🎯 **M3 Squircle Floating Action Button (FAB)**: 16px corner radius with Level 3 elevation.
  * 📌 **M3 Navigation Drawer**: 28px full pill active indicator and hover state layers.
  * 💬 **M3 Dialogs & Menus**: 28px curved modal dialogs and 16px rounded popover menus.
  * 🔍 **Pill Search & Add Task Bar**: 28px rounded input container with subtle elevation.
* **M3 Motion & State Layers**: 8% hover, 12% focus, 12% pressed state opacities with M3 easing curves (`cubic-bezier(0.2, 0.0, 0, 1.0)`).
* **Dual Mode Support**: Every theme file includes **both Light Mode and Dark Mode** in a single file, seamlessly adapting to your Super Productivity theme toggle or system appearance.
* **100% Contract Compliant**: Verified against Super Productivity's theme validation engine (`src/app/core/theme/validate-theme-css.util.ts`) with zero errors and zero warnings.

---

## 🎨 Theme Variants

| Theme File | Palette Flavor | Description | Best Suited For |
| :--- | :--- | :--- | :--- |
| [`google-material-3.css`](./google-material-3.css) | **Google Baseline Blue** | The flagship Google Workspace / Pixel blue tonal palette (`#0b57d0` / `#a8c7fa`). | Daily productivity & all-around workflow |
| [`google-material-3-sage.css`](./google-material-3-sage.css) | **Organic Sage Green** | Nature-inspired calming green tonal palette (`#2e6a38` / `#96d698`). | Stress reduction & sustained deep work |
| [`google-material-3-coral.css`](./google-material-3-coral.css) | **Expressive Coral** | Energizing warm terracotta / coral palette (`#a83829` / `#ffb4a8`). | High-energy sprints & creative sessions |
| [`google-material-3-lavender.css`](./google-material-3-lavender.css) | **Evening Lavender** | Contemplative amethyst & purple palette (`#6c538c` / `#d7bdf9`). | Evening work & reflective planning |
| [`google-material-3-monochrome.css`](./google-material-3-monochrome.css) | **Executive Monochrome** | Android 14 M3 high-contrast grayscale tonal palette. | Minimalist, zero-distraction task execution |

---

## 🚀 How to Install in Super Productivity

### Method 1: In-App Theme Installer (Recommended)

1. In **Super Productivity**, open **Settings** (`Ctrl + ,` on Windows/Linux or `Cmd + ,` on macOS).
2. Navigate to **Theme** (under the Appearance section).
3. Click **"Install theme"** (or drag & drop any `.css` file from this repository into the theme section).
4. Select `google-material-3.css` (or any variant like `google-material-3-sage.css`).
5. The theme will be immediately applied! You can freely toggle between Light and Dark mode using the app's mode switcher.

### Method 2: Manual Placement (User Data Folder)

You can also place the CSS files into your local Super Productivity themes folder:

* **Linux**: `~/.config/superProductivity/themes/`
* **macOS**: `~/Library/Application Support/superProductivity/themes/`
* **Windows**: `%APPDATA%\superProductivity\themes\`

---

## 📐 Material 3 Specification Mapping

Super Productivity uses a 3-layer token system (`primitives`, `semantic aliases`, `category-B tokens`). Here is how Google Material 3 tokens map into Super Productivity:

### 1. Tonal Surface Ladder

| Super Productivity Token | Material 3 Surface Role | Light Mode Value | Dark Mode Value |
| :--- | :--- | :--- | :--- |
| `--surface-0` | `surface-container-lowest` | `#ffffff` | `#0c0e12` |
| `--surface-1` | `surface` (Canvas Background) | `#f8f9fa` | `#111318` |
| `--surface-2` | `surface-container` (Cards / Panels) | `#edf2f7` | `#1f2329` |
| `--surface-3` | `surface-container-high` (Elevated / Active) | `#e3e8ef` | `#282a2f` |
| `--surface-4` | `surface-container-highest` (Modals / Banners) | `#dfe3eb` | `#33353a` |

### 2. Ink & Foreground Typography

| Super Productivity Token | Material 3 Ink Role | Light Mode Value | Dark Mode Value |
| :--- | :--- | :--- | :--- |
| `--ink` | `on-surface` (High emphasis text) | `#1f1f1f` | `#e2e2e6` |
| `--ink-strong` | `on-surface` (Headings) | `#111111` | `#ffffff` |
| `--ink-muted` | `on-surface-variant` (Secondary labels) | `#444746` | `#c4c7c5` |
| `--ink-on-channel` | Keystone RGB Triplet | `31, 31, 31` | `226, 226, 230` |

### 3. State Layer Opacity Scalars

| Token | M3 State Spec | Value |
| :--- | :--- | :--- |
| `--state-hover-alpha` | State Hover | `0.08` (8%) |
| `--state-focus-alpha` | State Focus | `0.12` (12%) |
| `--state-pressed-alpha` | State Pressed | `0.12` (12%) |
| `--state-selected-alpha` | State Selected | `0.12` (12%) |
| `--state-disabled-alpha` | State Disabled | `0.38` (38%) |

---

## 🖥️ Interactive Local Preview

You can test and preview all theme variants and toggle between Light and Dark mode right in your browser:

1. Open [`preview.html`](./preview.html) in your browser:
   ```bash
   # Or start the local preview server:
   npm run preview
   ```
2. Navigate to `http://localhost:3000` to interact with the mock Super Productivity UI.

---

## 🧪 Theme Contract Validation

To verify that all theme CSS files adhere to Super Productivity's theme engine requirements:

```bash
npm test
```

Expected output:
```text
Validating: google-material-3.css
✅ Valid theme CSS
✨ 100% contract compliant! Zero missing tokens.
```

---

## 📄 License

MIT License. Designed for the Super Productivity and open-source productivity community.
