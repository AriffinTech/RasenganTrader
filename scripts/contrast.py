"""WCAG contrast check for tokens.css (light + dark).

Usage: python3 scripts/contrast.py
Exits non-zero if any required pair falls below its minimum ratio.
"""
import math
import pathlib
import re
import sys

TOKENS = pathlib.Path(__file__).resolve().parent.parent / "tokens.css"

# (foreground, background, minimum ratio, note)
PAIRS = [
    ("ink", "paper", 4.5, "body text"),
    ("ink-soft", "paper-2", 4.5, "secondary text on cards"),
    ("neutral", "paper-3", 4.5, "muted-foreground on hover surfaces"),
    ("brand", "paper", 4.5, "text-primary on page"),
    ("brand", "paper-2", 4.5, "text-primary on cards"),
    ("brand", "paper-3", 4.5, "text-primary on hover surfaces"),
    ("brand-ink", "brand-fill", 4.5, "CTA label"),
    ("brand-ink", "brand-fill-hover", 4.5, "CTA label on hover"),
    ("brand-on", "brand", 4.5, "bg-primary + text-primary-foreground"),
    ("status-success", "paper-2", 4.5, "Open badge"),
    ("status-warning", "paper-2", 4.5, "Opening Soon badge"),
    ("status-info", "paper-2", 4.5, "Sesi Rakaman badge"),
    ("error", "paper-2", 4.5, "error text"),
]


def parse_block(css: str, selector: str) -> dict[str, tuple[float, float, float]]:
    out = {}
    for block in re.finditer(re.escape(selector) + r"\s*\{(.*?)\}", css, re.S):
        for name, l, c, h in re.findall(r"--color-([a-z0-9-]+):\s*oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)\)", block.group(1)):
            out[name] = (float(l) / 100, float(c), float(h))
    return out


def oklch_to_linear_srgb(L, C, h):
    a, b = C * math.cos(math.radians(h)), C * math.sin(math.radians(h))
    l_ = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
    m_ = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
    s_ = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3
    rgb = (
        4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
        -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
        -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_,
    )
    return [min(1.0, max(0.0, v)) for v in rgb]


def ratio(fg, bg):
    lum = lambda c: 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
    a, b = sorted((lum(oklch_to_linear_srgb(*fg)), lum(oklch_to_linear_srgb(*bg))), reverse=True)
    return (a + 0.05) / (b + 0.05)


def main() -> int:
    css = TOKENS.read_text()
    light = parse_block(css, ":root")
    dark = {**light, **parse_block(css, ".dark")}
    failures = 0
    for theme, tokens in (("light", light), ("dark", dark)):
        print(f"\n{theme}")
        for fg, bg, minimum, note in PAIRS:
            r = ratio(tokens[fg], tokens[bg])
            ok = r >= minimum
            failures += not ok
            print(f"  {'PASS' if ok else 'FAIL'} {r:5.2f}  {fg} on {bg}  ({note})")
    print(f"\n{failures} failure(s)")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
