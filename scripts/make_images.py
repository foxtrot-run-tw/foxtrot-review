#!/usr/bin/env python3
"""Fox Trot risograph / screen-print image maker.

Hand-crafted vector-like shapes, 3 ink plates on paper, grain and
slight misregistration. Every post image (IG 4:5, 1:1, 16:9) must carry
a short punchy Traditional Chinese headline (ideally <= 12 chars), set
with Noto Sans CJK TC Bold — never by an image model. The avatar stays
text-free. After rendering, check the headline at ~360px wide. Future
days should reuse this style.
"""

from __future__ import annotations

import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

# --- palette: 3 inks + paper ----------------------------------------------
PAPER = (236, 222, 196)
RUST = (196, 74, 28)
INK = (34, 27, 23)
TEAL = (42, 102, 94)

FONT_PATH = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
FONT_INDEX = 3  # Noto Sans CJK TC Bold

ROOT = Path(__file__).resolve().parents[1]


def _font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_PATH, size=size, index=FONT_INDEX)


# --- plates ----------------------------------------------------------------
class Plate:
    def __init__(self, w: int, h: int):
        self.w = w
        self.h = h
        self.im = Image.new("L", (w, h), 0)
        self.d = ImageDraw.Draw(self.im)

    def ellipse(self, box, fill=255):
        self.d.ellipse(box, fill=fill)

    def polygon(self, pts, fill=255):
        self.d.polygon([(float(x), float(y)) for x, y in pts], fill=fill)

    def rect(self, box, fill=255):
        self.d.rectangle(box, fill=fill)

    def line(self, p1, p2, width, fill=255):
        self.d.line([p1, p2], fill=fill, width=width)

    def pieslice(self, box, start, end, fill=255):
        self.d.pieslice(box, start, end, fill=fill)

    def arc(self, box, start, end, width, fill=255):
        self.d.arc(box, start, end, fill=fill, width=width)

    def rounded(self, box, radius, fill=255):
        self.d.rounded_rectangle(box, radius=radius, fill=fill)

    def paste_add(self, other: Image.Image, xy=(0, 0)):
        tmp = Image.new("L", self.im.size, 0)
        tmp.paste(other, xy)
        self.im = ImageChops.lighter(self.im, tmp)
        self.d = ImageDraw.Draw(self.im)

    def subtract(self, other: "Plate"):
        self.im = ImageChops.subtract(self.im, other.im)
        self.d = ImageDraw.Draw(self.im)


def capsule(plate: Plate, p1, p2, radius, fill=255):
    x1, y1 = p1
    x2, y2 = p2
    plate.ellipse((x1 - radius, y1 - radius, x1 + radius, y1 + radius), fill)
    plate.ellipse((x2 - radius, y2 - radius, x2 + radius, y2 + radius), fill)
    dx, dy = x2 - x1, y2 - y1
    length = math.hypot(dx, dy) or 1
    nx, ny = -dy / length, dx / length
    pts = [
        (x1 + nx * radius, y1 + ny * radius),
        (x1 - nx * radius, y1 - ny * radius),
        (x2 - nx * radius, y2 - ny * radius),
        (x2 + nx * radius, y2 + ny * radius),
    ]
    plate.polygon(pts, fill)


def rot(points, origin, deg):
    a = math.radians(deg)
    c, s = math.cos(a), math.sin(a)
    ox, oy = origin
    out = []
    for x, y in points:
        dx, dy = x - ox, y - oy
        out.append((ox + dx * c - dy * s, oy + dx * s + dy * c))
    return out


def oval_pts(cx, cy, rx, ry, n=48, rot_deg=0):
    pts = [
        (cx + rx * math.cos(2 * math.pi * i / n), cy + ry * math.sin(2 * math.pi * i / n))
        for i in range(n)
    ]
    return rot(pts, (cx, cy), rot_deg) if rot_deg else pts


# --- fox construction ------------------------------------------------------

def _ear_pair(rust, teal, cx, cy, s):
    """Pointed, outward fox ears with teal inner ear."""
    for sign in (-1, 1):
        tip = (cx + sign * 118 * s, cy - 195 * s)
        base_in = (cx + sign * 12 * s, cy - 78 * s)
        base_out = (cx + sign * 108 * s, cy - 40 * s)
        rust.polygon([base_in, tip, base_out])
        inner_tip = (cx + sign * 96 * s, cy - 155 * s)
        mid_in = (cx + sign * 28 * s, cy - 78 * s)
        mid_out = (cx + sign * 88 * s, cy - 55 * s)
        teal.polygon([mid_in, inner_tip, mid_out])


def draw_fox_head(rust, ink, teal, knockout, cx, cy, s, facing="front", smile=True):
    """Head + ears + face. facing: front | right."""
    if facing == "front":
        _ear_pair(rust, teal, cx, cy, s)
        rust.ellipse((cx - 122 * s, cy - 112 * s, cx + 122 * s, cy + 120 * s))
        knockout.ellipse((cx - 88 * s, cy - 4 * s, cx + 88 * s, cy + 102 * s))
        # jaw strip so the muzzle sits in the face, not a floating oval
        rust.pieslice((cx - 88 * s, cy + 55 * s, cx + 88 * s, cy + 128 * s), 0, 180)
        for sign in (-1, 1):
            ink.ellipse(
                (
                    cx + sign * 40 * s - 18 * s,
                    cy - 36 * s,
                    cx + sign * 40 * s + 18 * s,
                    cy - 2 * s,
                )
            )
        ink.ellipse((cx - 17 * s, cy + 12 * s, cx + 17 * s, cy + 34 * s))
        if smile:
            ink.arc(
                (cx - 50 * s, cy + 28 * s, cx + 50 * s, cy + 88 * s),
                20,
                160,
                width=max(4, int(9 * s)),
            )
    else:
        rust.polygon([
            (cx - 78 * s, cy - 36 * s),
            (cx - 132 * s, cy - 180 * s),
            (cx - 8 * s, cy - 70 * s),
        ])
        rust.polygon([
            (cx - 8 * s, cy - 84 * s),
            (cx + 42 * s, cy - 195 * s),
            (cx + 78 * s, cy - 58 * s),
        ])
        teal.polygon([
            (cx - 4 * s, cy - 82 * s),
            (cx + 34 * s, cy - 155 * s),
            (cx + 54 * s, cy - 68 * s),
        ])
        rust.ellipse((cx - 118 * s, cy - 108 * s, cx + 102 * s, cy + 118 * s))
        knockout.ellipse((cx + 8 * s, cy - 8 * s, cx + 160 * s, cy + 100 * s))
        rust.pieslice((cx + 8 * s, cy + 40 * s, cx + 145 * s, cy + 128 * s), 0, 180)
        ink.ellipse((cx + 18 * s, cy - 42 * s, cx + 56 * s, cy - 4 * s))
        ink.ellipse((cx + 128 * s, cy + 10 * s, cx + 162 * s, cy + 44 * s))
        if smile:
            ink.arc(
                (cx + 32 * s, cy + 22 * s, cx + 112 * s, cy + 88 * s),
                10,
                150,
                width=max(4, int(9 * s)),
            )


def _stamp_rounded(plate, box, radius, angle=0, fill=255, outline=None, width=0):
    """Stamp a rounded rect, optionally rotated, onto a plate."""
    x0, y0, x1, y1 = [float(v) for v in box]
    pw, ph = max(8, x1 - x0), max(8, y1 - y0)
    pad = int(max(24, width + 12, radius + 8))
    tmp = Image.new("L", (int(pw) + pad * 2, int(ph) + pad * 2), 0)
    d = ImageDraw.Draw(tmp)
    rect = (pad, pad, pad + pw, pad + ph)
    if outline is not None and width:
        d.rounded_rectangle(rect, radius=radius, fill=fill)
        inner = (pad + width, pad + width, pad + pw - width, pad + ph - width)
        inner_r = max(0, radius - width)
        d.rounded_rectangle(inner, radius=inner_r, fill=0)
    else:
        d.rounded_rectangle(rect, radius=radius, fill=fill)
    if angle:
        tmp = tmp.rotate(-angle, resample=Image.Resampling.BICUBIC, expand=True, fillcolor=0)
    tw, th = tmp.size
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    plate.paste_add(tmp, (int(round(cx - tw / 2)), int(round(cy - th / 2))))


def _shoe_box(ink, knockout, box, angle=0, soles=None):
    """Paper upper punched through the inks, reserved sole drawn after knockout."""
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0
    radius = max(10, h * 0.42)
    knockout_box = box
    _stamp_rounded(knockout, knockout_box, radius=radius, angle=angle, fill=255)
    if soles is not None:
        soles.append((box, angle, radius))


def draw_fox_run(rust, ink, teal, knockout, cx, cy, s, soles=None):
    """Side-view easy jog, facing right. (cx, cy) is torso center."""
    rust.polygon([
        (cx - 80 * s, cy - 10 * s),
        (cx - 210 * s, cy - 90 * s),
        (cx - 300 * s, cy - 16 * s),
        (cx - 270 * s, cy + 80 * s),
        (cx - 165 * s, cy + 96 * s),
        (cx - 70 * s, cy + 40 * s),
    ])
    knockout.ellipse((cx - 300 * s, cy - 8 * s, cx - 200 * s, cy + 78 * s))

    # back arm
    capsule(rust, (cx - 40 * s, cy + 4 * s), (cx - 125 * s, cy + 95 * s), 26 * s)
    rust.ellipse((cx - 158 * s, cy + 78 * s, cx - 100 * s, cy + 134 * s))

    # torso + neck
    rust.ellipse((cx - 108 * s, cy - 128 * s, cx + 122 * s, cy + 128 * s))
    rust.ellipse((cx + 40 * s, cy - 160 * s, cx + 130 * s, cy - 80 * s))  # neck
    knockout.ellipse((cx - 8 * s, cy - 66 * s, cx + 112 * s, cy + 76 * s))

    # front arm
    capsule(rust, (cx + 55 * s, cy + 2 * s), (cx + 155 * s, cy + 62 * s), 26 * s)
    rust.ellipse((cx + 140 * s, cy + 42 * s, cx + 198 * s, cy + 98 * s))

    # planted rear leg
    capsule(rust, (cx - 28 * s, cy + 95 * s), (cx - 48 * s, cy + 195 * s), 30 * s)
    capsule(rust, (cx - 48 * s, cy + 195 * s), (cx - 8 * s, cy + 262 * s), 28 * s)
    # lifted front leg
    capsule(rust, (cx + 42 * s, cy + 95 * s), (cx + 118 * s, cy + 155 * s), 28 * s)
    capsule(rust, (cx + 118 * s, cy + 155 * s), (cx + 168 * s, cy + 208 * s), 26 * s)

    _shoe_box(ink, knockout, (cx - 78 * s, cy + 248 * s, cx + 42 * s, cy + 312 * s), angle=0, soles=soles)
    _shoe_box(ink, knockout, (cx + 118 * s, cy + 196 * s, cx + 232 * s, cy + 256 * s), angle=20, soles=soles)

    draw_fox_head(rust, ink, teal, knockout, cx + 100 * s, cy - 185 * s, s * 0.92, facing="right")


def draw_fox_stand(rust, ink, teal, knockout, cx, cy, s, wave=False, soles=None):
    """Front-view standing fox. (cx, cy) is torso center."""
    # tail low and further right, clear of the outstretched paw
    rust.polygon([
        (cx + 90 * s, cy + 90 * s),
        (cx + 220 * s, cy + 70 * s),
        (cx + 280 * s, cy + 150 * s),
        (cx + 210 * s, cy + 210 * s),
        (cx + 90 * s, cy + 160 * s),
    ])
    knockout.ellipse((cx + 220 * s, cy + 115 * s, cx + 290 * s, cy + 190 * s))

    capsule(rust, (cx - 100 * s, cy - 16 * s), (cx - 128 * s, cy + 115 * s), 26 * s)
    rust.ellipse((cx - 158 * s, cy + 100 * s, cx - 100 * s, cy + 158 * s))

    rust.ellipse((cx - 118 * s, cy - 112 * s, cx + 118 * s, cy + 138 * s))
    knockout.ellipse((cx - 54 * s, cy - 48 * s, cx + 54 * s, cy + 68 * s))

    if wave:
        capsule(rust, (cx + 100 * s, cy - 28 * s), (cx + 175 * s, cy - 95 * s), 26 * s)
        rust.ellipse((cx + 155 * s, cy - 135 * s, cx + 218 * s, cy - 72 * s))
    else:
        # "hold it" paw, clearly rust
        capsule(rust, (cx + 100 * s, cy - 22 * s), (cx + 188 * s, cy - 30 * s), 26 * s)
        rust.ellipse((cx + 170 * s, cy - 62 * s, cx + 236 * s, cy + 4 * s))

    capsule(rust, (cx - 46 * s, cy + 122 * s), (cx - 52 * s, cy + 228 * s), 30 * s)
    capsule(rust, (cx + 46 * s, cy + 122 * s), (cx + 52 * s, cy + 228 * s), 30 * s)

    _shoe_box(ink, knockout, (cx - 120 * s, cy + 220 * s, cx - 22 * s, cy + 282 * s), soles=soles)
    _shoe_box(ink, knockout, (cx + 22 * s, cy + 220 * s, cx + 120 * s, cy + 282 * s), soles=soles)

    draw_fox_head(rust, ink, teal, knockout, cx, cy - 188 * s, s, facing="front")



# --- print finishing -------------------------------------------------------
def _value_noise(h, w, scale, seed, octaves=4):
    rng = np.random.default_rng(seed)
    acc = np.zeros((h, w), dtype=np.float32)
    amp = 1.0
    total = 0.0
    for i in range(octaves):
        sh, sw = max(2, int(h / (scale / (2**i)))), max(2, int(w / (scale / (2**i))))
        grid = rng.random((sh, sw)).astype(np.float32)
        # upsample
        up = np.array(
            Image.fromarray((grid * 255).astype(np.uint8)).resize((w, h), Image.Resampling.BICUBIC),
            dtype=np.float32,
        ) / 255.0
        acc += up * amp
        total += amp
        amp *= 0.5
    return acc / total


def mottled(mask: Image.Image, seed: int, strength=0.18) -> Image.Image:
    arr = np.array(mask, dtype=np.float32)
    h, w = arr.shape
    n = _value_noise(h, w, scale=90, seed=seed)
    fine = np.random.default_rng(seed + 7).random((h, w)).astype(np.float32)
    factor = 1.0 - strength * (n - 0.5) * 2 - 0.06 * (fine - 0.5)
    factor = np.clip(factor, 0.72, 1.05)
    out = np.clip(arr * factor, 0, 255).astype(np.uint8)
    # slight blur so it feels like ink soak, not digital noise
    return Image.fromarray(out, "L").filter(ImageFilter.GaussianBlur(radius=0.4))


def rough_edges(mask: Image.Image, seed: int, amount=2.0) -> Image.Image:
    """Displace the mask slightly to get a hand-cut edge."""
    arr = np.array(mask, dtype=np.float32)
    h, w = arr.shape
    rng = np.random.default_rng(seed)
    # low-res displacement
    dh = rng.normal(0, 1, (max(8, h // 40), max(8, w // 40))).astype(np.float32)
    dw = rng.normal(0, 1, (max(8, h // 40), max(8, w // 40))).astype(np.float32)
    dhy = np.array(Image.fromarray(dh, "F").resize((w, h), Image.Resampling.BICUBIC))
    dwx = np.array(Image.fromarray(dw, "F").resize((w, h), Image.Resampling.BICUBIC))
    ys, xs = np.indices((h, w))
    xs2 = np.clip(xs + dwx * amount, 0, w - 1)
    ys2 = np.clip(ys + dhy * amount, 0, h - 1)
    # bilinear sample
    x0 = np.floor(xs2).astype(np.int32)
    y0 = np.floor(ys2).astype(np.int32)
    x1 = np.clip(x0 + 1, 0, w - 1)
    y1 = np.clip(y0 + 1, 0, h - 1)
    wx = xs2 - x0
    wy = ys2 - y0
    sampled = (
        arr[y0, x0] * (1 - wx) * (1 - wy)
        + arr[y0, x1] * wx * (1 - wy)
        + arr[y1, x0] * (1 - wx) * wy
        + arr[y1, x1] * wx * wy
    )
    return Image.fromarray(np.clip(sampled, 0, 255).astype(np.uint8), "L")


def paper_texture(w, h, seed=11) -> np.ndarray:
    n = _value_noise(h, w, scale=140, seed=seed, octaves=5)
    rng = np.random.default_rng(seed + 3)
    fine = rng.random((h, w)).astype(np.float32)
    # laid fibers
    fibers = rng.normal(0, 1, (h, max(8, w // 80))).astype(np.float32)
    fibers = np.array(Image.fromarray(fibers, "F").resize((w, h), Image.Resampling.BILINEAR))
    tex = 0.55 + 0.28 * n + 0.08 * fine + 0.07 * (fibers - fibers.mean())
    return np.clip(tex, 0, 1)


def composite(plates: dict, offsets: dict, seed=3) -> Image.Image:
    w, h = plates["rust"].w, plates["rust"].h
    tex = paper_texture(w, h, seed)
    paper = np.stack([
        PAPER[0] * (0.92 + 0.08 * tex),
        PAPER[1] * (0.92 + 0.08 * tex),
        PAPER[2] * (0.94 + 0.06 * tex),
    ], axis=-1)

    def layer(name, color, density):
        mask = plates[name].im
        mask = rough_edges(mask, seed + hash(name) % 1000, amount=2.2)
        mask = mottled(mask, seed + hash(name) % 900, strength=0.2)
        ox, oy = offsets.get(name, (0, 0))
        if ox or oy:
            mask = ImageChops.offset(mask, ox, oy)
        a = np.array(mask, dtype=np.float32) / 255.0 * density
        return a[..., None], np.array(color, dtype=np.float32)

    # knockout is already subtracted from rust before we get here
    rgb = paper
    for name, color, density in (
        ("teal", TEAL, 0.88),
        ("rust", RUST, 0.94),
        ("ink", INK, 0.96),
    ):
        a, col = layer(name, color, density)
        # multiply-ish print blend
        rgb = rgb * (1 - a) + col * a

    # a little overall grain on top
    grain = (np.random.default_rng(seed + 21).random((h, w, 1)) - 0.5) * 7
    rgb = np.clip(rgb + grain, 0, 255).astype(np.uint8)
    return Image.fromarray(rgb, "RGB")


def new_plates(w, h):
    return {k: Plate(w, h) for k in ("rust", "ink", "teal", "knockout")}


def apply_knockout(plates):
    # Do not punch the ink plate: eyes, nose and smile sit on the cream muzzle.
    plates["rust"].subtract(plates["knockout"])
    plates["teal"].subtract(plates["knockout"])


def finish_shoes(plates, soles):
    """Ink outline + sole, drawn after knockout so uppers stay paper-colored."""
    ink = plates["ink"]
    for box, angle, radius in soles:
        x0, y0, x1, y1 = box
        h = y1 - y0
        # chunky outline
        _stamp_rounded(ink, box, radius=radius, angle=angle, fill=255, outline=True, width=max(6, h * 0.12))
        # sole occupies the bottom ~30%
        sole = (x0 - 1, y0 + h * 0.68, x1 + 1, y1)
        _stamp_rounded(ink, sole, radius=max(6, radius * 0.45), angle=angle, fill=255)


def draw_text(plates, lines, x, y, size, fill="ink", align="left", tracking=0, line_gap=0.12):
    """Draw short CJK lines onto an ink plate (and a slight rust misreg underlayer)."""
    font = _font(size)
    # measure
    widths = []
    heights = []
    for line in lines:
        bbox = font.getbbox(line)
        widths.append(bbox[2] - bbox[0])
        heights.append(bbox[3] - bbox[1])
    max_w = max(widths) if widths else 0
    # char-by-char for tracking
    cy = y
    for line, lw, lh in zip(lines, widths, heights):
        if align == "center":
            lx = x - (lw + tracking * (len(line) - 1)) / 2
        elif align == "right":
            lx = x - (lw + tracking * (len(line) - 1))
        else:
            lx = x
        # total width with tracking
        # recompute start if tracking
        if tracking:
            chars_w = sum(font.getbbox(ch)[2] - font.getbbox(ch)[0] for ch in line) + tracking * (len(line) - 1)
            if align == "center":
                lx = x - chars_w / 2
            elif align == "right":
                lx = x - chars_w
        cx = lx
        target = plates[fill]
        under = plates["rust"] if fill == "ink" else plates["ink"]
        for ch in line:
            # slight rust/ink under-layer for misregistration of type
            under.d.text((cx + 2, cy + 2), ch, font=font, fill=110)
            target.d.text((cx, cy), ch, font=font, fill=255)
            cw = font.getbbox(ch)[2] - font.getbbox(ch)[0]
            cx += cw + tracking
        cy += size * (1 + line_gap)


# --- compositions ----------------------------------------------------------
def save(img: Image.Image, path: Path, size):
    out = img.resize(size, Image.Resampling.LANCZOS)
    path.parent.mkdir(parents=True, exist_ok=True)
    out.save(path, quality=93, optimize=True, subsampling=0)
    print("wrote", path, out.size)



def make_ig(dest: Path):
    W, H = 2160, 2700
    p = new_plates(W, H)
    # sun sits mid-right, clear of the headline
    p["teal"].ellipse((W - 460, 820, W - 40, 1240))
    p["teal"].rounded((-40, H - 620, W + 40, H + 80), 0)
    soles = []
    draw_fox_run(p["rust"], p["ink"], p["teal"], p["knockout"], cx=1000, cy=1680, s=2.05, soles=soles)
    apply_knockout(p)
    finish_shoes(p, soles)
    draw_text(
        p, ["先別一次", "跑太遠"],
        x=W / 2, y=180, size=280, fill="ink", align="center", tracking=-4, line_gap=0.04,
    )
    img = composite(p, offsets={"rust": (3, -2), "teal": (-3, 3), "ink": (0, 0)}, seed=21)
    save(img, dest, (1080, 1350))


def make_wide(dest: Path):
    W, H = 3840, 2160
    p = new_plates(W, H)
    # short solid path on the left; dashed "too far" path on the right
    path_top, path_bot = H - 520, H - 200
    p["teal"].rounded((80, path_top, 2100, path_bot), 50)
    x = 2200
    while x < W - 80:
        p["teal"].rounded((x, path_top + 16, min(x + 90, W - 80), path_bot - 16), 20)
        x += 180
    # smaller fox so the top headline stays clear of the ears
    # feet sit on the path; lifted shoe reaches toward the dashes but does not land
    soles = []
    draw_fox_run(p["rust"], p["ink"], p["teal"], p["knockout"], cx=2000, cy=1200, s=1.52, soles=soles)
    apply_knockout(p)
    finish_shoes(p, soles)
    draw_text(
        p, ["今天少跳一步"],
        x=W / 2, y=100, size=380, fill="ink", align="center", tracking=12, line_gap=0.0,
    )
    img = composite(p, offsets={"rust": (4, -2), "teal": (-4, 3), "ink": (1, 0)}, seed=33)
    save(img, dest, (1920, 1080))


def make_square(dest: Path):
    W, H = 2160, 2160
    p = new_plates(W, H)
    # circle big enough to hold the whole fox, including shoes
    p["teal"].ellipse((W / 2 - 820, 40, W / 2 + 820, 1680))
    soles = []
    draw_fox_stand(p["rust"], p["ink"], p["teal"], p["knockout"], cx=W / 2 - 10, cy=860, s=1.95, wave=False, soles=soles)
    apply_knockout(p)
    finish_shoes(p, soles)
    draw_text(p, ["加一成就好"], x=W / 2, y=1740, size=250, fill="ink", align="center", tracking=4)
    img = composite(p, offsets={"rust": (3, -2), "teal": (-3, 4), "ink": (0, 1)}, seed=44)
    save(img, dest, (1080, 1080))


def make_avatar(dest: Path):
    W, H = 1024, 1024
    p = new_plates(W, H)
    p["teal"].ellipse((50, 50, W - 50, H - 50))
    draw_fox_head(p["rust"], p["ink"], p["teal"], p["knockout"], W / 2, H / 2 + 70, s=2.35, facing="front")
    apply_knockout(p)
    img = composite(p, offsets={"rust": (2, -2), "teal": (-2, 2), "ink": (0, 0)}, seed=8)
    save(img, dest, (512, 512))


def main():
    out = ROOT / "images" / "2026-11-11"
    make_ig(out / "ig-4x5.jpg")
    make_wide(out / "wide-16x9.jpg")
    make_square(out / "square-1x1.jpg")
    make_avatar(out / "avatar.jpg")


if __name__ == "__main__":
    main()
