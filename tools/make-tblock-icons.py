#!/usr/bin/env python3
"""
Generate T-Block Origin brand assets (shield icons + logo).

Usage:  python3 tools/make-tblock-icons.py

Outputs into platform/mv3/extension/img/:
    icon_16.png  icon_32.png  icon_48.png  icon_64.png  icon_128.png  icon_512.png
    icon_16_off.png ... icon_128_off.png
    tblock.svg            (dashboard header logo)

The mark: a Material-3 inspired shield with a violet -> indigo gradient and a
bold white "T".  The "_off" variants are the same mark in neutral grey, used to
signal that filtering is disabled for the current tab.
"""

from PIL import Image, ImageDraw
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "platform" / "mv3" / "extension" / "img"

# --- brand palette -----------------------------------------------------------
ON_TOP = (0x8B, 0x5C, 0xF6)   # violet 500
ON_BOTTOM = (0x4F, 0x46, 0xE5)  # indigo 600
OFF_TOP = (0xBD, 0xBD, 0xBD)
OFF_BOTTOM = (0x75, 0x75, 0x75)

SS = 4  # supersampling factor


def _lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def _bezier(p0, p1, p2, p3, steps=48):
    pts = []
    for i in range(1, steps + 1):
        t = i / steps
        mt = 1 - t
        x = (mt ** 3) * p0[0] + 3 * (mt ** 2) * t * p1[0] + 3 * mt * (t ** 2) * p2[0] + (t ** 3) * p3[0]
        y = (mt ** 3) * p0[1] + 3 * (mt ** 2) * t * p1[1] + 3 * mt * (t ** 2) * p2[1] + (t ** 3) * p3[1]
        pts.append((x, y))
    return pts


def shield_points(s):
    """Return shield outline points for a canvas of size s (normalized 0..1)."""
    def P(x, y):
        return (x * s, y * s)

    pts = []
    # start just after the top-left rounded corner
    pts.append(P(0.145, 0.075))
    pts.append(P(0.855, 0.075))            # top edge
    # top-right round
    pts += _bezier(P(0.885, 0.075), P(0.9, 0.09), P(0.9, 0.11), P(0.9, 0.16), steps=8)
    pts.append(P(0.9, 0.50))               # right side straight
    # right side converge to bottom tip
    pts += _bezier(P(0.9, 0.50), P(0.9, 0.72), P(0.72, 0.865), P(0.5, 0.965), steps=48)
    # bottom tip up the left side
    pts += _bezier(P(0.5, 0.965), P(0.28, 0.865), P(0.1, 0.72), P(0.1, 0.50), steps=48)
    pts.append(P(0.1, 0.16))               # left side straight
    # top-left round
    pts += _bezier(P(0.1, 0.11), P(0.1, 0.09), P(0.115, 0.075), P(0.145, 0.075), steps=8)
    return pts


def t_block(s):
    """Return the two rectangles (bar + stem) forming the 'T'."""
    def rect(x0, y0, x1, y1):
        return [x0 * s, y0 * s, x1 * s, y1 * s]

    return [
        rect(0.295, 0.285, 0.705, 0.405),   # bar
        rect(0.425, 0.285, 0.575, 0.665),   # stem
    ]


def render(size, top, bottom):
    s = size * SS
    canvas = Image.new("RGBA", (s, s), (0, 0, 0, 0))

    # gradient layer
    grad = Image.new("RGBA", (s, s))
    gd = ImageDraw.Draw(grad)
    for y in range(s):
        gd.line([(0, y), (s, y)], fill=_lerp(top, bottom, y / max(1, s - 1)))

    # shield mask
    mask = Image.new("L", (s, s), 0)
    ImageDraw.Draw(mask).polygon(shield_points(s), fill=255)

    shield = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    shield.paste(grad, (0, 0), mask)

    # white "T"
    tm = Image.new("L", (s, s), 0)
    td = ImageDraw.Draw(tm)
    for r in t_block(s):
        td.rectangle(r, fill=255)
    white = Image.new("RGBA", (s, s), (255, 255, 255, 255))
    shield.paste(white, (0, 0), tm)

    return shield.resize((size, size), Image.LANCZOS)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for size in (16, 32, 48, 64, 128, 512):
        render(size, ON_TOP, ON_BOTTOM).save(OUT / f"icon_{size}.png")
        if size <= 128:
            render(size, OFF_TOP, OFF_BOTTOM).save(OUT / f"icon_{size}_off.png")
    print(f"wrote icons to {OUT}")

    svg = SVG.replace("__TOP__", "#8B5CF6").replace("__BOTTOM__", "#4F46E5")
    (OUT / "tblock.svg").write_text(svg, encoding="utf-8")
    print(f"wrote {OUT / 'tblock.svg'}")


SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="T-Block Origin">
  <defs>
    <linearGradient id="tb" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="__TOP__"/>
      <stop offset="1" stop-color="__BOTTOM__"/>
    </linearGradient>
  </defs>
  <path fill="url(#tb)" d="M12 1.4 3.2 3.6v7.5c0 5.1 3.7 9.6 8.8 11.5 5.1-1.9 8.8-6.4 8.8-11.5V3.6Z"/>
  <path fill="#fff" d="M7.1 6.9h9.8v2.9h-3.45v7.3h-2.9v-7.3H7.1Z"/>
</svg>
"""


if __name__ == "__main__":
    main()
