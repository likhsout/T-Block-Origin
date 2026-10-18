<p align="center">
  <img src="platform/mv3/extension/img/tblock.svg" height="96" width="96" alt="T-Block Origin Logo">
</p>

<h1 align="center">T-Block Origin</h1>

<p align="center">
  <strong>Fast, privacy-first, and native Manifest V3 content blocker with Material Design 3.</strong>
</p>

<p align="center">
  <a href="https://github.com/likhsout/T-Block-Origin/blob/master/LICENSE.txt"><img src="https://img.shields.io/badge/License-GPL%20v3-blue.svg?style=flat-square" alt="License: GPL v3"></a>
  <a href="https://developer.chrome.com/docs/extensions/develop/migrate"><img src="https://img.shields.io/badge/Manifest-V3-success.svg?style=flat-square" alt="Manifest V3 Ready"></a>
  <a href="https://github.com/likhsout/T-Block-Origin/releases/latest"><img src="https://img.shields.io/github/v/release/likhsout/T-Block-Origin?color=blue&style=flat-square" alt="GitHub Release"></a>
  <a href="https://github.com/likhsout/T-Block-Origin/releases/latest"><img src="https://img.shields.io/badge/Download-Release%20ZIP-orange.svg?style=flat-square" alt="Download Release ZIP"></a>
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#quick-install">Quick Install</a> •
  <a href="#filtering-modes">Filtering Modes</a> •
  <a href="#themes--appearance">Themes</a> •
  <a href="#building-from-source">Build</a> •
  <a href="#project-structure">Structure</a> •
  <a href="#attribution--acknowledgements">Attribution</a> •
  <a href="#license">License</a>
</p>

---

## Overview

**T-Block Origin** is a next-generation browser content blocker developed by [likhsout](https://github.com/likhsout) for Google Chrome, Brave, Microsoft Edge, Vivaldi, Arc, and all modern Chromium browsers.

Designed from the ground up for **Manifest V3**, T-Block Origin runs natively inside Chromium's C++ `declarativeNetRequest` (DNR) subsystem. This means zero JavaScript execution latency on network calls, virtually non-existent CPU and RAM footprint, and unbreakable privacy protection that prevents web pages from profiling your blocking habits.

Paired with a completely bespoke **Material Design 3 (M3)** interface, T-Block Origin delivers fluid micro-animations, customizable dynamic themes, OLED pure black styling, and intuitive site-by-site control.

---

## ✨ Key Features

### ⚡ True Native Manifest V3 Performance
- **Declarative Filtering:** Request blocking occurs inside the browser engine before network sockets open.
- **Zero Page Lag:** No background content script injection delays or script thread stalls during page navigation.
- **Ultra-Lean Resource Usage:** Minimal memory overhead compared to legacy extensions.

### 🎨 Modern Material Design 3 Interface
- **Hero Protection Panel:** Displays live protection state, the active filtering tier, and a real-time count of blocked requests.
- **Fluid Stepped Slider:** Smooth 4-position slider with calibrated travel for intuitive site filtering adjustment.
- **Tactile Settings Rows:** Interactive setting items with M3 switches, responsive hover states, and smooth spring animations.
- **Dynamic Colorways:** Multiple Material You palettes (Baseline Purple, Emerald Privacy, Sapphire Ocean, Coral Energy) and a true 100% OLED Pure Black mode.

### 🛡️ Granular 4-Tier Protection
Every site can be tuned individually to match your balance between privacy and convenience:
1. **Level 0 (Off):** Filtering disabled for trusted intranets or fragile sites.
2. **Level 1 (Basic):** Essential network blocklists without cosmetic element hiding.
3. **Level 2 (Optimal / Default):** Balanced privacy, tracker defense, and ad blocking.
4. **Level 3 (Complete):** Maximum protection with strict cosmetic hiding, scriptlets, and annoyance filtering.

### 🎯 Interactive In-Page Tools
- **Element Zapper:** Temporarily destroy intrusive banners, paywall overlays, or floating popups with a single click.
- **Element Picker:** Visually create permanent cosmetic blocking filters for any webpage element.
- **Unpicker:** Review and revoke custom cosmetic rules created for the current domain.

### 📝 Integrated Filter Authoring
- Built-in **CodeMirror 6** editor featuring full syntax highlighting, automatic linting, and rapid custom rule authoring.
- Comprehensive support for ABP/uBO filter rule syntax, host redirection, and procedural cosmetic filters.

---

## 🚀 Quick Install

You don't need to build from source to use T-Block Origin. Download the pre-built bundle directly from **[GitHub Releases](https://github.com/likhsout/T-Block-Origin/releases/latest)** or from the [`share/`](share/) folder:

1. **Download:** Get the latest build archive: **[`TBlockOrigin-chromium.zip`](https://github.com/likhsout/T-Block-Origin/releases/latest)** (or local [`share/TBlockOrigin-latest.zip`](share/TBlockOrigin-latest.zip)).
2. **Extract:** Unzip the downloaded archive into a folder on your computer.
3. **Open Extensions Page:** In your browser, navigate to:
   - **Google Chrome / Brave:** `chrome://extensions`
   - **Microsoft Edge:** `edge://extensions`
   - **Opera:** `opera://extensions`
4. **Enable Developer Mode:** Toggle on **Developer mode** (switch in the top-right corner).
5. **Load Extension:** Click **Load unpacked** (top-left) and select the extracted folder containing `manifest.json`.
6. **Done!** Pin the T-Block Origin icon to your toolbar for one-click access.

---

## 📊 Filtering Modes

| Level | Mode | What It Blocks | Recommended For |
| :---: | :--- | :--- | :--- |
| **0** | **Off** | Protection disabled. All requests pass through untouched. | Testing or broken internal sites. |
| **1** | **Basic** | Major tracking servers and malicious domains (network rules only). | Fragile enterprise or banking portals. |
| **2** | **Optimal** | **Default.** Full ad blocking, tracking prevention, and cosmetic hiding. | Everyday browsing for 99% of sites. |
| **3** | **Complete** | Strict blocking, cosmetic filters, annoyance banners, and scriptlet injection. | Privacy purists and media-heavy sites. |

---

## 🎨 Themes & Appearance

T-Block Origin includes full Material Design 3 theming support, customizable directly from the Dashboard:

- 🟣 **Baseline Purple:** The signature Material Design 3 palette.
- 🟢 **Emerald Privacy:** Crisp, nature-inspired green accents.
- 🔵 **Sapphire Ocean:** Calm, professional deep blue hues.
- 🟠 **Coral Energy:** Vibrant, warm orange-red highlights.
- ⬛ **OLED Pure Black:** Absolute `#000000` backgrounds for maximum contrast and battery conservation on OLED/AMOLED screens.

---

## 🛠️ Building from Source

### Prerequisites
- **Node.js** (v20+) & **npm**
- **Python 3**
- **GNU Make** and `zip`

### Build Instructions
```bash
# 1. Clone the repository
git clone https://github.com/likhsout/T-Block-Origin.git
cd T-Block-Origin

# 2. Install dependencies
npm ci

# 3. Compile the extension and rulesets
make mv3-chromium
```

### Output Directories
- **Unpacked Extension:** `dist/build/TBlockOrigin.chromium/`
- **Shareable ZIP Bundle:** `share/TBlockOrigin-latest.zip` (automatically updated on every build)

### Linting and Automated Checks
```bash
npm run lint    # ESLint check on all extension scripts
npm test        # Comprehensive build and manifest verification
```

---

## 📁 Project Structure

```text
T-Block-Origin/
├── platform/
│   └── mv3/                # Manifest V3 extension core
│       └── extension/      # Popup, dashboard, styling, and background service worker
│           ├── css/        # Material Design 3 stylesheets (m3.css, popup.css, etc.)
│           ├── js/         # Extension logic, settings, and theme handlers
│           ├── img/        # Brand assets, vectors, and shield icons
│           └── lib/        # CodeMirror 6 filter editor bundle
├── share/                  # Pre-packaged shareable ZIP releases
│   ├── TBlockOrigin-latest.zip
│   └── TBlockOrigin-chromium.zip
├── tools/                  # Build scripts and ruleset compiler
├── dist/                   # Build artifacts (generated during make)
├── Makefile                # Build automation targets
├── package.json            # Project manifest & scripts
└── README.md               # Project documentation
```

---

## 📜 Attribution & Acknowledgements

**T-Block Origin** is licensed under the [GNU General Public License v3.0 (GPLv3)](LICENSE.txt).

T-Block Origin is developed and maintained by **[likhsout](https://github.com/likhsout)**. It is built upon the declarative filtering engine and core concepts of **uBlock Origin Lite** and **uBlock Origin**, created by **Raymond Hill (gorhill)** and open-source contributors.

We express our sincere admiration and gratitude to Raymond Hill and the open-source ad-blocking community for their decades of tireless work in defense of internet privacy and user agency. All original copyright notices and license terms are preserved in accordance with GPLv3.

---

## 📄 License

This project is licensed under the terms of the **GNU General Public License v3.0**. See the [`LICENSE.txt`](LICENSE.txt) file for complete details.
