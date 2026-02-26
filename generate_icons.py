#!/usr/bin/env python3
"""Generate LoveSpark Link Cleaner icons at 16, 48, 128px.

Design: A pink sparkle/broom icon — represents cleaning links.
Hot pink primary with light pink accents and white sparkle highlights.
"""

import os
import math
from PIL import Image, ImageDraw

HOT_PINK = (232, 69, 124, 255)    # #E8457C — ls-pink-accent
LIGHT_PINK = (255, 182, 193, 255)  # #FFB6C1
DEEP_PINK = (214, 52, 102, 255)   # #D63466 — ls-pink-deep
WHITE = (255, 255, 255, 255)


def draw_sparkle(draw, cx, cy, size, color):
    """Draw a 4-point sparkle/star at (cx, cy)."""
    r = size / 2
    thin = size * 0.12

    # Vertical bar
    draw.ellipse(
        [(cx - thin, cy - r), (cx + thin, cy + r)],
        fill=color
    )
    # Horizontal bar
    draw.ellipse(
        [(cx - r, cy - thin), (cx + r, cy + thin)],
        fill=color
    )


def draw_link_chain(draw, cx, cy, size, color, width):
    """Draw two interlocking chain links (simplified)."""
    link_w = size * 0.35
    link_h = size * 0.22
    gap = size * 0.06
    r = link_h * 0.5

    # Left link
    lx = cx - gap
    draw.rounded_rectangle(
        [(lx - link_w, cy - link_h), (lx + link_w * 0.3, cy + link_h)],
        radius=r,
        outline=color,
        width=max(1, int(width))
    )

    # Right link
    rx = cx + gap
    draw.rounded_rectangle(
        [(rx - link_w * 0.3, cy - link_h), (rx + link_w, cy + link_h)],
        radius=r,
        outline=color,
        width=max(1, int(width))
    )


def generate_icon(size):
    """Generate a single icon at the given size."""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx, cy = size / 2, size / 2
    margin = size * 0.08

    # Background circle — hot pink
    bg_r = (size / 2) - margin
    draw.ellipse(
        [(cx - bg_r, cy - bg_r), (cx + bg_r, cy + bg_r)],
        fill=HOT_PINK
    )

    # Inner circle — subtle depth
    inner_r = bg_r * 0.88
    draw.ellipse(
        [(cx - inner_r, cy - inner_r), (cx + inner_r, cy + inner_r)],
        fill=DEEP_PINK
    )

    if size <= 16:
        # Simple: just a white sparkle at center
        draw_sparkle(draw, cx, cy, size * 0.55, WHITE)
    else:
        # Chain links in the center
        chain_size = size * 0.52
        chain_width = max(2, size * 0.06)
        draw_link_chain(draw, cx, cy + size * 0.02, chain_size, LIGHT_PINK, chain_width)

        # Sparkle breaking the chain — top right
        sparkle_size = size * 0.3
        sx = cx + size * 0.18
        sy = cy - size * 0.18
        draw_sparkle(draw, sx, sy, sparkle_size, WHITE)

        # Small accent sparkle — bottom left
        draw_sparkle(draw, cx - size * 0.22, cy + size * 0.2, sparkle_size * 0.45, LIGHT_PINK)

    return img


def main():
    os.makedirs('icons', exist_ok=True)
    for size in [16, 48, 128]:
        img = generate_icon(size)
        path = f'icons/icon-{size}.png'
        img.save(path, 'PNG', optimize=True)
        print(f'Generated {path} ({size}x{size})')


if __name__ == '__main__':
    main()
