# T-Block Origin - Shareable Builds

This directory contains pre-packaged, ready-to-install ZIP archives of **T-Block Origin**:

- **[`TBlockOrigin-latest.zip`](TBlockOrigin-latest.zip)**: Always updated with the latest compiled build.
- **[`TBlockOrigin-chromium.zip`](TBlockOrigin-chromium.zip)**: Packaged release for Chromium-based browsers (Google Chrome, Brave, Microsoft Edge, Vivaldi, Opera, Arc, etc.).

---

## 🚀 How to Install (Quick & Easy)

1. Download or extract [`TBlockOrigin-latest.zip`](TBlockOrigin-latest.zip) into a folder on your system.
2. Open your Chromium browser and navigate to:
   - **Chrome / Brave:** `chrome://extensions`
   - **Microsoft Edge:** `edge://extensions`
   - **Opera:** `opera://extensions`
3. Turn on **Developer mode** (toggle switch in the top-right corner).
4. Click **Load unpacked** (button in the top-left corner).
5. Select the unzipped folder containing `manifest.json`.
6. T-Block Origin is now running and protecting your browser!

---

## 🛠️ Updating the Shareable Archives

To re-compile and re-package the latest build into this directory:

```bash
# Package the current build into share/
make zip

# Or run a full compile and package
make mv3-chromium
```
