# T-Block Origin - Shareable Builds

This directory contains the pre-packaged, ready-to-install ZIP archive of **T-Block Origin**:

- **[`TBlockOrigin-v1.0.0.zip`](TBlockOrigin-v1.0.0.zip)**: Official release archive packaged for Chromium-based browsers (Google Chrome, Brave, Microsoft Edge, Vivaldi, Opera, Arc, etc.).

---

## 🚀 How to Install (Quick & Easy)

1. Download or extract [`TBlockOrigin-v1.0.0.zip`](TBlockOrigin-v1.0.0.zip) into a folder on your system.
2. Open your Chromium browser and navigate to:
   - **Chrome / Brave:** `chrome://extensions`
   - **Microsoft Edge:** `edge://extensions`
   - **Opera:** `opera://extensions`
3. Turn on **Developer mode** (toggle switch in the top-right corner).
4. Click **Load unpacked** (button in the top-left corner).
5. Select the unzipped folder containing `manifest.json`.
6. T-Block Origin is now running and protecting your browser!

---

## 🛠️ Updating the Shareable Archive

To re-compile and re-package the latest version into this directory:

```bash
# Package the current build into share/
make zip

# Or run a full compile and package
make mv3-chromium
```
