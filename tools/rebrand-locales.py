#!/usr/bin/env python3
"""
Rebrand the bundled UI strings from the upstream names to "T-Block Origin".

This only rewrites brand tokens inside message *values*; it deliberately leaves
upstream URLs and repository names (e.g. uBlockOrigin/uAssets) untouched, since
those are real resources the extension still depends on.

Usage:  python3 tools/rebrand-locales.py
"""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LOCALES = ROOT / "platform" / "mv3" / "extension" / "_locales"

REPLACEMENTS = (
    ("uBlock Origin Lite", "T-Block Origin"),
    ("uBO Lite", "T-Block Origin"),
)

# en-only copy refreshes (the other locales only get brand tokens swapped).
EN_MESSAGE_OVERRIDES = {
    "extShortDesc": (
        "T-Block Origin is a fast, privacy-first content blocker for the "
        "modern web. Blocks ads, trackers, miners and more — right after install."
    ),
    "dashboardName": "T-Block Origin — Dashboard",
    "userScriptsInfo": (
        "Open your browser's extensions page (<code>chrome://extensions</code> in "
        "Chrome or <code>about:addons</code> in Firefox), open <b>T-Block Origin</b> "
        "details, and toggle on <b>Allow user scripts</b> (also referred to as "
        "\u201cunverified third-party scripts\u201d)."
    ),
}


def main():
    count = 0
    for path in sorted(LOCALES.glob("*/messages.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        changed = False
        for key, entry in data.items():
            msg = entry.get("message")
            if not isinstance(msg, str):
                continue
            new = msg
            for old, fresh in REPLACEMENTS:
                if old in new:
                    new = new.replace(old, fresh)
            if path.parent.name == "en" and key in EN_MESSAGE_OVERRIDES:
                new = EN_MESSAGE_OVERRIDES[key]
            if new != msg:
                entry["message"] = new
                changed = True
        if changed:
            path.write_text(
                json.dumps(data, indent=2, ensure_ascii=False) + "\n",
                encoding="utf-8",
            )
            count += 1
    print(f"rebranded {count} locale files")


if __name__ == "__main__":
    main()
