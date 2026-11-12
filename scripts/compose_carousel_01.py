#!/usr/bin/env python3
"""Fox Trot Instagram carousel preview: 新手跑者常見的 5 個傷害警訊.

Writes only to carousel-01/. Does not touch the live site or git.
"""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "carousel-01"
CAND = OUT / "candidates"
FONT_PATH = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
FONT_INDEX = 3

WHITE = (250, 250, 250)
ORANGE = (255, 122, 26)  # #FF7A1A
SUB = (236, 236, 236)
MUTED = (176, 174, 172)
PANEL = (10, 10, 10)
W, H = 1080, 1350
MARGIN = 72
FOOT_SIZE = 36
FOOT_BOTTOM = 44
PAW = 11
FOOTER = "Fox Trot"


def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_PATH, size=size, index=FONT_INDEX)


def glyph_box(f, sample="國遠跑"):
    b = f.getbbox(sample)
    return b[1], b[3]


def text_width(text: str, f: ImageFont.FreeTypeFont, tracking: int = 0) -> int:
    w = 0
    for i, ch in enumerate(text):
        bbox = f.getbbox(ch)
        w += bbox[2] - bbox[0]
        if i < len(text) - 1:
            w += tracking
    return w


def draw_tracked(draw, xy, text, f, fill, tracking=0):
    x, y = xy
    for i, ch in enumerate(text):
        draw.text((x, y), ch, font=f, fill=fill)
        x += f.getbbox(ch)[2] - f.getbbox(ch)[0] + tracking
    return x


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


def cover_crop(im: Image.Image, w: int, h: int, focus: float = 0.45) -> Image.Image:
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


def add_grain(im: Image.Image, amount: float = 5.0, seed: int = 11) -> Image.Image:
    arr = np.array(im, dtype="float32")
    rng = np.random.default_rng(seed)
    noise = rng.normal(0, amount, arr.shape[:2]).astype("float32")
    arr += noise[..., None]
    return Image.fromarray(np.clip(arr, 0, 255).astype("uint8"), "RGB")


def fade_into_panel(photo: Image.Image, canvas_h: int, start: float, hard: float) -> Image.Image:
    """photo is already canvas-sized or will be pasted at top of a dark canvas."""
    w, ph = photo.size
    card = Image.new("RGB", (w, canvas_h), PANEL)
    card.paste(photo, (0, 0))
    overlay = Image.new("RGBA", (w, canvas_h), (0, 0, 0, 0))
    pix = overlay.load()
    s, e = int(canvas_h * start), int(canvas_h * hard)
    s = max(0, min(s, canvas_h - 1))
    e = max(s + 1, min(e, canvas_h))
    for y in range(s, canvas_h):
        if y < e:
            t = (y - s) / max(1, e - s)
            t = t * t * (3 - 2 * t)
            a = int(255 * t)
        else:
            a = 255
        for x in range(w):
            pix[x, y] = (10, 10, 10, a)
    return Image.alpha_composite(card.convert("RGBA"), overlay).convert("RGB")


def draw_paw(draw, x, y, s, fill):
    pads = [(-1.6, -1.1), (-0.55, -1.6), (0.55, -1.6), (1.6, -1.1)]
    for px, py in pads:
        r = s * 0.28
        cx, cy = x + px * s, y + py * s
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=fill)
    draw.ellipse((x - s * 1.15, y - s * 0.15, x + s * 1.15, y + s * 1.25), fill=fill)


def draw_footer(draw, page: int, total: int = 8):
    ff = font(FOOT_SIZE)
    f_top, f_bot = glyph_box(ff)
    fy = H - FOOT_BOTTOM - f_bot
    paw_x = MARGIN + PAW
    draw_paw(draw, paw_x, fy + (f_bot - f_top) // 2, PAW, MUTED)
    draw.text((paw_x + PAW * 3, fy), FOOTER, font=ff, fill=MUTED)
    counter = f"{page} / {total}"
    cw = text_width(counter, ff)
    draw.text((W - MARGIN - cw, fy), counter, font=ff, fill=MUTED)
    return fy + f_top  # ink top of footer


def base_from_photo(photo, photo_frac, focus, seed, fade_start, fade_hard):
    """photo_frac is the fraction of canvas height the raw photo occupies before fade."""
    ph = int(H * photo_frac)
    top = cover_crop(photo, W, ph, focus=focus)
    top = add_grain(top, 5.0, seed)
    # Build a full canvas with photo at top, then fade
    card = Image.new("RGB", (W, H), PANEL)
    card.paste(top, (0, 0))
    return fade_into_panel(top if ph == H else _padded(top), H, fade_start, fade_hard)


def _padded(top: Image.Image) -> Image.Image:
    card = Image.new("RGB", (W, H), PANEL)
    card.paste(top, (0, 0))
    return card


def compose_hero(photo, layout, out_path):
    card = cover_crop(photo, W, H, focus=layout.get("focus", 0.35))
    card = add_grain(card, 5.0, layout.get("seed", 11))
    card = fade_into_panel(card, H, layout["fade_start"], layout["fade_hard"])
    draw = ImageDraw.Draw(card)
    footer_ink_top = draw_footer(draw, layout["page"])

    # bottom-up: cue, then sub, then headline
    cue_f = font(layout.get("cue_size", 40))
    c_top, c_bot = glyph_box(cue_f)
    gap_before_foot = 28
    cy = footer_ink_top - gap_before_foot - (c_bot - c_top) - c_top
    if layout.get("cue"):
        draw.text((MARGIN, cy), layout["cue"], font=cue_f, fill=ORANGE)
        cue_ink_top = cy + c_top
    else:
        cue_ink_top = footer_ink_top

    sf = font(layout.get("sub_size", 44))
    s_top, s_bot = glyph_box(sf)
    sub_lines = wrap_text(layout.get("sub", ""), sf, W - MARGIN * 2) if layout.get("sub") else []
    sub_h = len(sub_lines) * (s_bot - s_top) + max(0, len(sub_lines) - 1) * 8
    sy = cue_ink_top - (28 if sub_lines else 0) - sub_h - s_top
    y = sy
    for ln in sub_lines:
        draw.text((MARGIN, y), ln, font=sf, fill=SUB)
        y += (s_bot - s_top) + 8
    sub_ink_top = sy + s_top if sub_lines else cue_ink_top

    # headline lines: list of (text, color, size, tracking)
    gap = layout.get("gap_after_head", 28)
    measured = []
    for text, color, size, tracking in layout["headline"]:
        f = font(size)
        b1, b3 = glyph_box(f)
        measured.append((text, color, f, tracking, text_width(text, f, tracking), b1, b3))
    head_h = 0
    head_pad = layout.get("head_pad", 8)
    for i, *rest, b1, b3 in [(0, *m) for m in measured]:
        pass
    head_h = sum(m[6] - m[5] for m in measured) + head_pad * (len(measured) - 1)
    y = sub_ink_top - gap - head_h - measured[0][5]
    for text, color, f, tracking, tw, b1, b3 in measured:
        draw_tracked(draw, (MARGIN, y), text, f, color, tracking)
        y += (b3 - b1) + head_pad

    card.convert("RGB").save(out_path, quality=93, optimize=True, subsampling=0)
    print("wrote", out_path)


def compose_sign(photo, layout, out_path):
    """Photo occupies the top portion; type lives in the lower panel."""
    photo_frac = layout.get("photo_frac", 0.58)
    fade_start = layout.get("fade_start", photo_frac - 0.16)
    fade_hard = layout.get("fade_hard", photo_frac + 0.02)
    top = cover_crop(photo, W, int(H * photo_frac), focus=layout.get("focus", 0.4))
    top = add_grain(top, 5.0, layout.get("seed", 21))
    card = fade_into_panel(_padded(top), H, fade_start, fade_hard)
    draw = ImageDraw.Draw(card)
    footer_ink_top = draw_footer(draw, layout["page"])

    bf = font(layout.get("body_size", 46))
    b_top, b_bot = glyph_box(bf)
    body_lines = []
    for para in layout.get("body", []):
        body_lines.extend(wrap_text(para, bf, W - MARGIN * 2))
    leading = int(layout.get("body_leading", 10))
    body_h = len(body_lines) * (b_bot - b_top) + max(0, len(body_lines) - 1) * leading
    hf = font(layout.get("head_size", 92))
    h_top, h_bot = glyph_box(hf)
    head_lines = wrap_text(layout["headline"], hf, W - MARGIN * 2)
    head_pad = 6
    head_h = len(head_lines) * (h_bot - h_top) + max(0, len(head_lines) - 1) * head_pad
    kf = font(layout.get("kicker_size", 36))
    k_top, k_bot = glyph_box(kf)

    if layout.get("stack") == "from_panel":
        ky = int(H * fade_hard) + int(layout.get("panel_gap", 40)) - k_top
        draw.text((MARGIN, ky), layout["kicker"], font=kf, fill=ORANGE)
        hy = ky + k_bot + 18 - h_top
        y = hy
        for ln in head_lines:
            draw.text((MARGIN, y), ln, font=hf, fill=WHITE)
            y += (h_bot - h_top) + head_pad
        by = y + 26 - b_top
        y = by
        for ln in body_lines:
            draw.text((MARGIN, y), ln, font=bf, fill=SUB)
            y += (b_bot - b_top) + leading
    else:
        by = footer_ink_top - 30 - body_h - b_top
        y = by
        for ln in body_lines:
            draw.text((MARGIN, y), ln, font=bf, fill=SUB)
            y += (b_bot - b_top) + leading
        body_ink_top = by + b_top
        hy = body_ink_top - 26 - head_h - h_top
        y = hy
        for ln in head_lines:
            draw.text((MARGIN, y), ln, font=hf, fill=WHITE)
            y += (h_bot - h_top) + head_pad
        head_ink_top = hy + h_top
        ky = head_ink_top - 18 - (k_bot - k_top) - k_top
        draw.text((MARGIN, ky), layout["kicker"], font=kf, fill=ORANGE)

    card.convert("RGB").save(out_path, quality=93, optimize=True, subsampling=0)
    print("wrote", out_path)


def compose_list(photo, layout, out_path):
    """Same news-card structure as sign slides: photo on top, type in the lower panel."""
    photo_frac = layout.get("photo_frac", 0.50)
    fade_start = layout.get("fade_start", photo_frac - 0.16)
    fade_hard = layout.get("fade_hard", photo_frac + 0.02)
    top = cover_crop(photo, W, int(H * photo_frac), focus=layout.get("focus", 0.45))
    top = add_grain(top, 5.0, layout.get("seed", 31))
    card = fade_into_panel(_padded(top), H, fade_start, fade_hard)
    draw = ImageDraw.Draw(card)
    footer_ink_top = draw_footer(draw, layout["page"])

    tf = font(layout.get("title_size", 68))
    t_top, t_bot = glyph_box(tf)
    title_lines = wrap_text(layout["title"], tf, W - MARGIN * 2)
    title_pad = 6
    title_h = len(title_lines) * (t_bot - t_top) + max(0, len(title_lines) - 1) * title_pad

    item_f = font(layout.get("item_size", 46))
    i_top, i_bot = glyph_box(item_f)
    items = layout["items"]
    box = 28
    row_gap = int(layout.get("row_gap", 18))
    row_h = max(i_bot - i_top, box)
    items_h = len(items) * row_h + max(0, len(items) - 1) * row_gap

    cf = font(layout.get("caveat_size", 40))
    c_top, c_bot = glyph_box(cf)
    caveat = layout.get("caveat", "")
    cav_lines = wrap_text(caveat, cf, W - MARGIN * 2) if caveat else []
    cav_h = len(cav_lines) * (c_bot - c_top) + max(0, len(cav_lines) - 1) * 8

    gap_title_items = 28
    gap_items_cav = 22
    panel_top = int(H * fade_hard) + int(layout.get("panel_gap", 28))
    panel_bot = footer_ink_top - 28
    content = title_h + gap_title_items + items_h + (gap_items_cav + cav_h if cav_lines else 0)
    leftover = (panel_bot - panel_top) - content
    if leftover < 0:
        # tighten gaps first
        shrink = -leftover
        take = min(shrink, max(0, gap_items_cav - 12))
        gap_items_cav -= take
        shrink -= take
        take = min(shrink, max(0, gap_title_items - 14))
        gap_title_items -= take
        shrink -= take
        if shrink > 0:
            row_gap = max(10, row_gap - (shrink // max(1, len(items) - 1)))
            items_h = len(items) * row_h + max(0, len(items) - 1) * row_gap
    else:
        # modest extra air, capped, so the panel does not look empty
        extra_top = min(leftover, 16)
        leftover -= extra_top
        add1 = min(leftover // 2, 12)
        add2 = min(leftover - add1, 12)
        gap_title_items += add1
        gap_items_cav += add2
        panel_top += extra_top

    y = panel_top - t_top
    for ln in title_lines:
        draw.text((MARGIN, y), ln, font=tf, fill=WHITE)
        y += (t_bot - t_top) + title_pad
    y = y - title_pad + t_top + gap_title_items

    for item in items:
        by0 = y + (row_h - box) // 2
        draw.rounded_rectangle((MARGIN, by0, MARGIN + box, by0 + box), radius=4, outline=ORANGE, width=3)
        draw.text(
            (MARGIN + box + 18, y - i_top + (row_h - (i_bot - i_top)) // 2),
            item,
            font=item_f,
            fill=WHITE,
        )
        y += row_h + row_gap
    y = y - row_gap + gap_items_cav

    for ln in cav_lines:
        draw.text((MARGIN, y - c_top), ln, font=cf, fill=ORANGE)
        y += (c_bot - c_top) + 8

    card.convert("RGB").save(out_path, quality=93, optimize=True, subsampling=0)
    print("wrote", out_path)


def compose_cta(photo, layout, out_path):
    """Same news-card structure as sign slides: photo on top, type in the lower panel."""
    photo_frac = layout.get("photo_frac", 0.56)
    fade_start = layout.get("fade_start", photo_frac - 0.16)
    fade_hard = layout.get("fade_hard", photo_frac + 0.02)
    top = cover_crop(photo, W, int(H * photo_frac), focus=layout.get("focus", 0.4))
    top = add_grain(top, 5.0, layout.get("seed", 41))
    card = fade_into_panel(_padded(top), H, fade_start, fade_hard)
    draw = ImageDraw.Draw(card)
    footer_ink_top = draw_footer(draw, layout["page"])

    tag_f = font(layout.get("tag_size", 40))
    g_top, g_bot = glyph_box(tag_f)
    tag = layout.get("tagline", "跑得久，比跑得快更重要。")
    ty = footer_ink_top - 28 - (g_bot - g_top) - g_top
    draw.text((MARGIN, ty), tag, font=tag_f, fill=MUTED)
    tag_ink_top = ty + g_top

    bf = font(layout.get("body_size", 46))
    b_top, b_bot = glyph_box(bf)
    leading = 12
    body_lines = []
    for para in layout.get("body", []):
        body_lines.extend(wrap_text(para, bf, W - MARGIN * 2))
    body_h = len(body_lines) * (b_bot - b_top) + max(0, len(body_lines) - 1) * leading
    by = tag_ink_top - 28 - body_h - b_top
    y = by
    for ln in body_lines:
        draw.text((MARGIN, y), ln, font=bf, fill=SUB)
        y += (b_bot - b_top) + leading
    body_ink_top = by + b_top

    measured = []
    for text, color, size, tracking in layout["headline"]:
        f = font(size)
        b1, b3 = glyph_box(f)
        measured.append((text, color, f, tracking, b1, b3))
    head_pad = 8
    head_h = sum(m[5] - m[4] for m in measured) + head_pad * (len(measured) - 1)
    hy = body_ink_top - 26 - head_h - measured[0][4]
    y = hy
    for text, color, f, tracking, b1, b3 in measured:
        draw_tracked(draw, (MARGIN, y), text, f, color, tracking)
        y += (b3 - b1) + head_pad

    card.convert("RGB").save(out_path, quality=93, optimize=True, subsampling=0)
    print("wrote", out_path)


def contact_sheet(paths, out_path):
    thumbs = [Image.open(p).convert("RGB") for p in paths]
    cols, rows = 4, 2
    gap, pad = 20, 28
    tw = 420
    th = int(round(tw * H / W))
    canvas_w = pad * 2 + cols * tw + (cols - 1) * gap
    canvas_h = pad * 2 + rows * th + (rows - 1) * gap
    sheet = Image.new("RGB", (canvas_w, canvas_h), (18, 18, 18))
    for i, im in enumerate(thumbs):
        t = im.resize((tw, th), Image.Resampling.LANCZOS)
        r, c = divmod(i, cols)
        # wait, 8 slides in 2 rows of 4: row = i // 4, col = i % 4
        r, c = i // cols, i % cols
        x = pad + c * (tw + gap)
        y = pad + r * (th + gap)
        sheet.paste(t, (x, y))
    sheet.save(out_path, quality=92, optimize=True, subsampling=0)
    print("wrote", out_path, sheet.size)


def main():
    cover = Image.open(CAND / "cover-stop-knee-track.jpg")
    gait = Image.open(CAND / "gait-limp-side-b.jpg")
    shin = Image.open(CAND / "point-shin-press-a.jpg")
    dusk = Image.open(CAND / "worsen-slow-knee-dusk-a.jpg")
    ice = Image.open(CAND / "rest-ankle-ice-a.jpg")
    stairs = Image.open(CAND / "stairs-down-knee-a.jpg")
    check = Image.open(CAND / "check-bench-leg-c.jpg")
    cool = Image.open(CAND / "cta-walk-cool-two.jpg")

    slides = []

    pth = OUT / "slide-01.jpg"
    compose_hero(
        cover,
        dict(
            page=1,
            focus=0.30,
            fade_start=0.52,
            fade_hard=0.70,
            seed=11,
            headline=[
                ("這 5 種痛", WHITE, 100, 2),
                ("別硬跑", ORANGE, 168, 4),
            ],
            head_pad=8,
            gap_after_head=28,
            sub="新手跑者常見傷害警訊",
            sub_size=44,
            cue="往左滑，對一下  →",
            cue_size=40,
        ),
        pth,
    )
    slides.append(pth)

    pth = OUT / "slide-02.jpg"
    compose_sign(
        gait,
        dict(
            page=2,
            focus=0.55,
            photo_frac=0.58,
            fade_start=0.42,
            fade_hard=0.60,
            seed=21,
            kicker="1 / 5",
            headline="步伐走樣了",
            head_size=96,
            body=["痛到開始跛、改跑姿，先停下來。", "硬跑可能讓別處一起出問題。"],
            body_size=46,
        ),
        pth,
    )
    slides.append(pth)

    pth = OUT / "slide-03.jpg"
    compose_sign(
        shin,
        dict(
            page=3,
            focus=0.45,
            photo_frac=0.58,
            fade_start=0.42,
            fade_hard=0.60,
            seed=22,
            kicker="2 / 5",
            headline="按一個點就很痛",
            head_size=88,
            body=["骨頭上某個小點按了會痛，先停跑檢查。", "可能是骨骼壓力的警訊，不是自己能判定的。"],
            body_size=46,
        ),
        pth,
    )
    slides.append(pth)

    pth = OUT / "slide-04.jpg"
    compose_sign(
        dusk,
        dict(
            page=4,
            focus=0.55,
            photo_frac=0.58,
            fade_start=0.42,
            fade_hard=0.60,
            seed=23,
            kicker="3 / 5",
            headline="愈跑愈痛",
            head_size=96,
            body=["跑當中愈來愈明顯，或隔天還在痛，", "先減量或停跑。不要等它自己消失。"],
            body_size=46,
        ),
        pth,
    )
    slides.append(pth)

    pth = OUT / "slide-05.jpg"
    compose_sign(
        ice,
        dict(
            page=5,
            focus=0.30,
            photo_frac=0.56,
            fade_start=0.40,
            fade_hard=0.58,
            seed=24,
            kicker="4 / 5",
            headline="腫了，或晚上還痛",
            head_size=84,
            body=["腫起來、休息還在痛、夜間痛，", "盡快找醫師或物理治療師看看。"],
            body_size=46,
        ),
        pth,
    )
    slides.append(pth)

    pth = OUT / "slide-06.jpg"
    compose_sign(
        stairs,
        dict(
            page=6,
            focus=0.55,
            photo_frac=0.58,
            fade_start=0.42,
            fade_hard=0.60,
            seed=25,
            kicker="5 / 5",
            headline="上下樓膝蓋前側痛",
            head_size=84,
            body=["上下樓梯、蹲下時膝蓋前面不舒服，", "先不要硬跑。若持續，請尋求評估。"],
            body_size=46,
        ),
        pth,
    )
    slides.append(pth)

    pth = OUT / "slide-07.jpg"
    compose_list(
        check,
        dict(
            page=7,
            focus=0.40,
            photo_frac=0.50,
            fade_start=0.36,
            fade_hard=0.52,
            seed=31,
            panel_gap=28,
            title="這 5 件事，先對一下",
            title_size=64,
            item_size=46,
            row_gap=16,
            items=[
                "步伐走樣、開始跛了",
                "按一個點就很痛",
                "愈跑愈痛，或隔天還痛",
                "腫了，或休息、夜間還痛",
                "上下樓膝蓋前側痛",
            ],
            caveat="疼痛持續  →  請看醫師或物理治療師",
            caveat_size=40,
        ),
        pth,
    )
    slides.append(pth)

    pth = OUT / "slide-08.jpg"
    compose_cta(
        cool,
        dict(
            page=8,
            focus=0.45,
            photo_frac=0.56,
            fade_start=0.40,
            fade_hard=0.58,
            seed=41,
            headline=[
                ("先停一下", WHITE, 100, 2),
                ("比硬跑完更厲害", ORANGE, 88, 2),
            ],
            body=[
                "收藏這篇，下次跑前對一下。",
                "也分享給那個「痛一點沒關係」的跑友。",
            ],
            tagline="跑得久，比跑得快更重要。",
        ),
        pth,
    )
    slides.append(pth)

    contact_sheet(slides, OUT / "contact-sheet.jpg")

    scale = OUT / "inspect"
    scale.mkdir(exist_ok=True)
    for sp in slides:
        im = Image.open(sp)
        for nw in (360, 540):
            nh = int(round(im.size[1] * nw / im.size[0]))
            im.resize((nw, nh), Image.Resampling.LANCZOS).save(
                scale / f"{sp.stem}-{nw}.jpg", quality=92
            )


if __name__ == "__main__":
    main()
