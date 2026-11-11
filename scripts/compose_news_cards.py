#!/usr/bin/env python3
"""Compose Fox Trot news-style social cards.

Documentary photo + code-rendered typography (Noto Sans CJK TC Bold).
Brand accent (highlighted keyword) is orange #FF7A1A.

Default I/O:
  photos  images/source/heti-room-{34,11,169}.jpg
  output  images/YYYY-MM-DD/{ig-4x5,square-1x1,wide-16x9,avatar}.jpg
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
FONT_PATH = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
FONT_INDEX = 3  # Noto Sans CJK TC Bold

WHITE = (250, 250, 250)
ORANGE = (255, 122, 26)  # #FF7A1A
SUB = (236, 236, 236)
FOOTER_INK = (176, 174, 172)


def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_PATH, size=size, index=FONT_INDEX)


def cover_crop(im: Image.Image, w: int, h: int, focus: float = 0.45) -> Image.Image:
    """Scale to cover, then crop. focus=0 is top, 1 is bottom."""
    im = im.convert("RGB")
    sw, sh = im.size
    scale = max(w / sw, h / sh)
    nw, nh = int(round(sw * scale)), int(round(sh * scale))
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    left = max(0, (nw - w) // 2)
    max_top = max(0, nh - h)
    top = int(round(max_top * focus))
    top = max(0, min(top, max_top))
    return im.crop((left, top, left + w, top + h))


def add_grain(im: Image.Image, amount: float = 5.5, seed: int = 11) -> Image.Image:
    import numpy as np

    arr = __import__("numpy").array(im, dtype="float32")
    rng = __import__("numpy").random.default_rng(seed)
    noise = rng.normal(0, amount, arr.shape[:2]).astype("float32")
    arr += noise[..., None]
    return Image.fromarray(__import__("numpy").clip(arr, 0, 255).astype("uint8"), "RGB")


def dark_panel(
    base: Image.Image,
    start: float,
    hard: float,
    right_ease: float = 0.0,
    right_from: float = 0.55,
) -> Image.Image:
    """Bottom gradient. If right_ease>0, mid-gradient is lighter on the right
    so a mid-distance figure can remain visible; the solid band stays opaque."""
    w, h = base.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    pix = overlay.load()
    s, e = int(h * start), int(h * hard)
    for y in range(s, h):
        if y < e:
            t = (y - s) / max(1, e - s)
            t = t * t * (3 - 2 * t)
            a0 = int(255 * t)  # start at 0 so the veil has no hard shelf
        else:
            a0 = 255
        for x in range(w):
            a = a0
            if right_ease and y < e:
                tx = (x / w - right_from) / max(0.01, 1.0 - right_from)
                if tx > 0:
                    tx = min(1.0, tx)
                    a = int(a * (1.0 - right_ease * tx * tx))
            pix[x, y] = (10, 10, 10, a)
    out = Image.alpha_composite(base.convert("RGBA"), overlay)
    return out.convert("RGB")


def text_width(text: str, f: ImageFont.FreeTypeFont, tracking: int = 0) -> int:
    w = 0
    for i, ch in enumerate(text):
        bbox = f.getbbox(ch)
        w += bbox[2] - bbox[0]
        if i < len(text) - 1:
            w += tracking
    return w


def draw_tracked(draw: ImageDraw.ImageDraw, xy, text, f, fill, tracking=0):
    x, y = xy
    for i, ch in enumerate(text):
        draw.text((x, y), ch, font=f, fill=fill)
        x += f.getbbox(ch)[2] - f.getbbox(ch)[0] + tracking
    return x


def draw_paw(draw: ImageDraw.ImageDraw, x: int, y: int, s: int, fill):
    """Tiny unobtrusive fox-paw mark, not a logo."""
    pads = [(-1.6, -1.1), (-0.55, -1.6), (0.55, -1.6), (1.6, -1.1)]
    for px, py in pads:
        r = s * 0.28
        cx, cy = x + px * s, y + py * s
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=fill)
    draw.ellipse((x - s * 1.15, y - s * 0.15, x + s * 1.15, y + s * 1.25), fill=fill)


def glyph_box(f, sample="國遠跑"):
    b = f.getbbox(sample)
    return b[1], b[3]


def wrap_text(text: str, f, max_w: int) -> list[str]:
    lines, buf = [], ""
    for ch in text:
        trial = buf + ch
        if text_width(trial, f, 0) <= max_w:
            buf = trial
        else:
            if buf:
                lines.append(buf)
            buf = ch
    if buf:
        lines.append(buf)
    return lines


def compose(photo: Image.Image, size, layout: dict, out_path: Path):
    w, h = size
    card = cover_crop(photo, w, h, focus=layout.get("focus", 0.42))
    card = add_grain(card, amount=5.0, seed=layout.get("seed", 11))
    card = dark_panel(card, start=layout["grad_start"], hard=layout["grad_hard"], right_ease=layout.get("right_ease", 0.0), right_from=layout.get("right_from", 0.55))
    draw = ImageDraw.Draw(card)
    margin = layout["margin"]

    # Footer anchored from the bottom
    ff = font(layout["foot_size"])
    f_top, f_bot = glyph_box(ff)
    footer_ink_h = f_bot - f_top
    fy = h - layout["footer_bottom"] - f_bot
    paw_s = layout["paw"]
    paw_x = margin + paw_s
    draw_paw(draw, paw_x, fy + footer_ink_h // 2, paw_s, FOOTER_INK)
    draw.text((paw_x + paw_s * 3, fy), layout["footer"], font=ff, fill=FOOTER_INK)

    # Subhead above footer
    sf = font(layout["sub_size"])
    s_top, s_bot = glyph_box(sf)
    sub_lines = wrap_text(layout["subhead"], sf, w - margin * 2)
    sub_gap = int(layout.get("sub_leading", max(4, layout["sub_size"] * 0.22)))
    sub_block_h = 0
    for i, _ in enumerate(sub_lines):
        sub_block_h += s_bot - s_top
        if i < len(sub_lines) - 1:
            sub_block_h += sub_gap
    gap_sub_foot = layout.get("gap_before_footer", 24)
    sy = fy + f_top - gap_sub_foot - sub_block_h - s_top
    y = sy
    for ln in sub_lines:
        draw.text((margin, y), ln, font=sf, fill=SUB)
        y += (s_bot - s_top) + sub_gap
    sub_ink_top = sy + s_top

    # Headline above subhead
    gap_after_head = layout.get("gap_after_head", 22)
    head_pad = int(layout.get("head_pad", 6))
    measured = []
    for line in layout["headline"]:
        chunks = []
        total = 0
        max_top = 0
        max_bottom = 0
        for text, color, size, tracking in line:
            f = font(size)
            b1, b3 = glyph_box(f)
            max_top = min(max_top, b1)
            max_bottom = max(max_bottom, b3)
            tw = text_width(text, f, tracking)
            chunks.append((text, color, f, tracking, tw, b1, b3))
            total += tw
        measured.append((chunks, total, max_top, max_bottom))

    head_h = 0
    for i, (_, _, max_top, max_bottom) in enumerate(measured):
        head_h += max_bottom - max_top
        if i < len(measured) - 1:
            head_h += head_pad

    y = sub_ink_top - gap_after_head - head_h - measured[0][2]
    for chunks, total, max_top, max_bottom in measured:
        x = margin if layout.get("align") != "center" else (w - total) // 2
        for text, color, f, tracking, tw, b1, b3 in chunks:
            draw_tracked(draw, (x, y), text, f, color, tracking)
            x += tw
        y += (max_bottom - max_top) + head_pad

    card = card.convert("RGB")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    card.save(out_path, quality=93, optimize=True, subsampling=0)
    print("wrote", out_path, card.size)



def make_avatar(photo: Image.Image, out_path: Path, size: int = 512) -> None:
    """Square scenic crop (apartments and rooftop water tanks, no person)."""
    w, h = photo.size
    # Upper-right buildings; stay above the runner (head is around y=0.45).
    box = (int(w * 0.50), int(h * 0.02), int(w * 0.98), int(h * 0.42))
    crop = photo.crop(box)
    side = min(crop.size)
    # Center the crop square
    cx, cy = crop.size[0] // 2, crop.size[1] // 2
    half = side // 2
    crop = crop.crop((cx - half, cy - half, cx - half + side, cy - half + side))
    crop = crop.resize((size, size), Image.Resampling.LANCZOS)
    # light grain for consistency
    import numpy as np
    arr = np.array(crop, dtype="float32")
    rng = np.random.default_rng(41)
    noise = rng.normal(0, 4.0, arr.shape[:2]).astype("float32")
    arr += noise[..., None]
    crop = Image.fromarray(np.clip(arr, 0, 255).astype("uint8"), "RGB")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    crop.save(out_path, quality=90, optimize=True, subsampling=0)
    print("wrote", out_path, crop.size)


def main():
    src = ROOT / "images" / "source"
    out = ROOT / "images" / "2026-11-11"
    photo_v = Image.open(src / "heti-room-34.jpg")
    photo_sq = Image.open(src / "heti-room-11.jpg")
    photo_h = Image.open(src / "heti-room-169.jpg")

    sub = "比近 30 天最長一跑多超過約 10%"
    foot = "Fox Trot  ・  BJSM 2025 研究"

    compose(
        photo_v,
        (1080, 1350),
        dict(
            focus=0.15,
            grad_start=0.52,
            grad_hard=0.70,
            margin=68,
            headline=[
                [("先別一次", WHITE, 100, 2)],
                [("跑太遠", ORANGE, 152, 4)],
            ],
            head_pad=8,
            gap_after_head=36,
            gap_before_footer=28,
            subhead=sub,
            sub_size=48,
            footer=foot,
            foot_size=36,
            footer_bottom=44,
            paw=11,
            seed=31,
        ),
        out / "ig-4x5.jpg",
    )

    compose(
        photo_sq,
        (1080, 1080),
        dict(
            focus=0.20,
            grad_start=0.46,
            grad_hard=0.66,
            margin=64,
            headline=[
                [("先別一次", WHITE, 92, 2)],
                [("跑太遠", ORANGE, 136, 4)],
            ],
            head_pad=8,
            gap_after_head=32,
            gap_before_footer=26,
            subhead=sub,
            sub_size=46,
            footer=foot,
            foot_size=34,
            footer_bottom=40,
            paw=10,
            seed=32,
        ),
        out / "square-1x1.jpg",
    )

    compose(
        photo_h,
        (1920, 1080),
        dict(
            focus=0.40,
            grad_start=0.22,
            grad_hard=0.78,
            right_ease=0.55,
            right_from=0.52,
            margin=88,
            headline=[
                [("先別一次", WHITE, 132, 4)],
                [("跑太遠", ORANGE, 168, 5)],
            ],
            head_pad=8,
            gap_after_head=28,
            gap_before_footer=26,
            subhead=sub,
            sub_size=80,
            footer=foot,
            foot_size=56,
            footer_bottom=36,
            paw=13,
            seed=33,
        ),
        out / "wide-16x9.jpg",
    )

    make_avatar(photo_sq, out / "avatar.jpg")


if __name__ == "__main__":
    main()
