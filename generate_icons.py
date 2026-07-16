# -*- coding: utf-8 -*-
"""產生 한글 Studio 的 PWA／Apple／favicon 圖示。"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


BASE = Path(__file__).resolve().parent / "icons"
INK = (17, 16, 15, 255)
PAPER = (244, 240, 231, 255)
PINK = (255, 62, 155, 255)

FONT_CANDIDATES = [
    Path(r"C:\Windows\Fonts\malgunbd.ttf"),
    Path(r"C:\Windows\Fonts\malgun.ttf"),
    Path(r"C:\Windows\Fonts\gulim.ttc"),
]


def find_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for font_path in FONT_CANDIDATES:
        if font_path.exists():
            return ImageFont.truetype(str(font_path), size)
    return ImageFont.load_default()


def draw_star(draw: ImageDraw.ImageDraw, center: tuple[int, int], radius: int) -> None:
    """四角星在小尺寸仍比細線裝飾清楚。"""
    cx, cy = center
    inner = max(2, radius // 4)
    points = [
        (cx, cy - radius),
        (cx + inner, cy - inner),
        (cx + radius, cy),
        (cx + inner, cy + inner),
        (cx, cy + radius),
        (cx - inner, cy + inner),
        (cx - radius, cy),
        (cx - inner, cy - inner),
    ]
    draw.polygon(points, fill=PINK)


def render_icon(size: int, *, maskable: bool = False) -> Image.Image:
    scale = 4
    canvas_size = size * scale
    image = Image.new("RGBA", (canvas_size, canvas_size), INK)
    draw = ImageDraw.Draw(image)

    # maskable 版本把主圖再往安全區內縮，圓形或水滴形裁切都不會傷到「한」。
    inset = int(canvas_size * (0.235 if maskable else 0.165))
    offset = int(canvas_size * 0.035)
    radius = int(canvas_size * 0.065)
    card = (inset, inset, canvas_size - inset, canvas_size - inset)
    shadow = tuple(value + offset for value in card)
    draw.rounded_rectangle(shadow, radius=radius, fill=PINK)
    draw.rounded_rectangle(card, radius=radius, fill=PAPER)

    star_center = (inset + int(canvas_size * 0.025), inset + int(canvas_size * 0.02))
    draw_star(draw, star_center, int(canvas_size * 0.055))

    font = find_font(int(canvas_size * (0.43 if maskable else 0.49)))
    text = "한"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (canvas_size - text_width) / 2 - bbox[0]
    y = (canvas_size - text_height) / 2 - bbox[1] - canvas_size * 0.015
    draw.text((x, y), text, font=font, fill=INK)

    line_y = card[3] - int(canvas_size * 0.075)
    line_x1 = card[0] + int(canvas_size * 0.12)
    line_x2 = card[2] - int(canvas_size * 0.12)
    draw.rounded_rectangle(
        (line_x1, line_y, line_x2, line_y + int(canvas_size * 0.018)),
        radius=int(canvas_size * 0.009),
        fill=PINK,
    )

    return image.resize((size, size), Image.Resampling.LANCZOS).convert("RGB")


def save(name: str, size: int, *, maskable: bool = False) -> None:
    path = BASE / name
    render_icon(size, maskable=maskable).save(path, optimize=True)
    print(f"saved {path}")


def main() -> None:
    BASE.mkdir(parents=True, exist_ok=True)
    save("favicon-32.png", 32)
    save("apple-touch-icon-180.png", 180)
    save("icon-192.png", 192)
    save("icon-512.png", 512)
    save("icon-maskable-512.png", 512, maskable=True)


if __name__ == "__main__":
    main()
