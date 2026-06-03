# -*- coding: utf-8 -*-
"""
產生 PWA app icon（192 / 512）
- 粉色底 + 白色「한」字（用 Windows 內建的 Malgun Gothic 韓文字型）
- 背景填滿整個方形 → maskable icon 被裁成圓/方都不會切到字
"""
import os
from PIL import Image, ImageDraw, ImageFont

# icon 輸出目錄（用絕對路徑，避免 cwd 不同存錯地方）
BASE = r"C:\Users\User\projects\korean-hangul\icons"
os.makedirs(BASE, exist_ok=True)

# 韓文字型（Windows 內建）
FONT_CANDIDATES = [
    r"C:\Windows\Fonts\malgun.ttf",     # Malgun Gothic
    r"C:\Windows\Fonts\malgunbd.ttf",   # Malgun Gothic Bold
    r"C:\Windows\Fonts\gulim.ttc",      # 退而求其次
]

def find_font(size):
    for fp in FONT_CANDIDATES:
        if os.path.exists(fp):
            return ImageFont.truetype(fp, size)
    return ImageFont.load_default()

def make_icon(size, path):
    img = Image.new("RGBA", (size, size), (255, 127, 176, 255))  # 粉色填滿
    d = ImageDraw.Draw(img)
    font = find_font(int(size * 0.5))
    text = "한"
    # 量字的邊界框，置中
    bbox = d.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (size - tw) / 2 - bbox[0]
    y = (size - th) / 2 - bbox[1]
    d.text((x, y), text, font=font, fill=(255, 255, 255, 255))
    img.save(path)
    print("saved", path)

make_icon(192, os.path.join(BASE, "icon-192.png"))
make_icon(512, os.path.join(BASE, "icon-512.png"))
print("done")
