#!/usr/bin/env python3
"""Day 2 (2026-11-12, B) news cards. Reuses compose() from compose_news_cards."""
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
from PIL import Image
from compose_news_cards import compose, make_avatar, WHITE, ORANGE, ROOT

src = ROOT / "images" / "source"
out = ROOT / "images" / "2026-11-12"
pv = Image.open(src / "yilan-paddy-11.jpg")
ph = Image.open(src / "yilan-paddy-169.jpg")
sub = "四場台灣賽事　截止日一次看"
foot = "Fox Trot  ・  以官方報名頁為準"

compose(pv, (1080, 1350), dict(focus=0.0, grad_start=0.56, grad_hard=0.72, margin=68,
    headline=[[("報名季到了", WHITE, 100, 2)], [("先挑跑得完的", ORANGE, 136, 3)]],
    head_pad=8, gap_after_head=36, gap_before_footer=28, subhead=sub, sub_size=48,
    footer=foot, foot_size=36, footer_bottom=44, paw=11, seed=41), out / "ig-4x5.jpg")

compose(pv, (1080, 1080), dict(focus=0.0, grad_start=0.54, grad_hard=0.68, margin=64,
    headline=[[("報名季到了", WHITE, 92, 2)], [("先挑跑得完的", ORANGE, 128, 3)]],
    head_pad=8, gap_after_head=32, gap_before_footer=26, subhead=sub, sub_size=46,
    footer=foot, foot_size=34, footer_bottom=40, paw=10, seed=42), out / "square-1x1.jpg")

compose(ph, (1920, 1080), dict(focus=0.40, grad_start=0.25, grad_hard=0.78, right_ease=0.6, right_from=0.55,
    margin=88, headline=[[("報名季到了", WHITE, 128, 4)], [("先挑跑得完的", ORANGE, 164, 5)]],
    head_pad=8, gap_after_head=28, gap_before_footer=26, subhead=sub, sub_size=80,
    footer=foot, foot_size=56, footer_bottom=36, paw=13, seed=43), out / "wide-16x9.jpg")

make_avatar(pv, out / "avatar.jpg")
