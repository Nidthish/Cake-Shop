import os
import sys
import cv2
import numpy as np
from PIL import Image, ImageFilter

def upscale_image_1024(input_path: str, webp_out: str, jpg_out: str):
    """
    Upscale 89x89 cake images strictly from public/PRODUCT_IMAGES/cakes/NORMAL CAKES
    to 1024x1024 with maximum clarity, edge preservation, and smooth bakery textures.
    Outputs both .webp and high-res .jpg.
    """
    img = cv2.imread(input_path)
    if img is None:
        raise ValueError(f"Could not load image: {input_path}")

    # Step 1: Smooth 89x89 blockiness using bilateral filter on source
    smooth_src = cv2.bilateralFilter(img, d=5, sigmaColor=30, sigmaSpace=30)

    # Step 2: Progressive 2-stage Lanczos4 interpolation to 1024x1024
    mid = cv2.resize(smooth_src, (256, 256), interpolation=cv2.INTER_LANCZOS4)
    mid_smooth = cv2.edgePreservingFilter(mid, flags=1, sigma_s=15, sigma_r=0.25)
    up = cv2.resize(mid_smooth, (1024, 1024), interpolation=cv2.INTER_LANCZOS4)

    # Step 3: Polish in PIL with unsharp mask for crisp cake toppings and outlines
    rgb = cv2.cvtColor(up, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(rgb)
    sharpened = pil_img.filter(ImageFilter.UnsharpMask(radius=1.5, percent=150, threshold=2))

    # Save 1024x1024 WebP
    sharpened.save(webp_out, 'WEBP', quality=95, method=6, dpi=(72, 72))

    # Save 1024x1024 JPEG
    sharpened.save(jpg_out, 'JPEG', quality=95, dpi=(72, 72), subsampling=0)

def main():
    normal_dir = os.path.abspath(r'public/PRODUCT_IMAGES/cakes/NORMAL CAKES')

    if not os.path.exists(normal_dir):
        print(f"Error: Directory does not exist: {normal_dir}")
        sys.exit(1)

    # Only read from public/PRODUCT_IMAGES/cakes/NORMAL CAKES
    files = sorted([f for f in os.listdir(normal_dir) if f.lower().endswith('.jpg')])
    print(f"Found {len(files)} cake JPG images in {normal_dir}")

    success_count = 0
    for f in files:
        base = os.path.splitext(f)[0]
        in_path = os.path.join(normal_dir, f)
        webp_path = os.path.join(normal_dir, f"{base}.webp")
        jpg_path = os.path.join(normal_dir, f"{base}.jpg")

        try:
            upscale_image_1024(in_path, webp_path, jpg_path)
            success_count += 1
            print(f"[{success_count}/{len(files)}] Upscaled {base} -> 1024x1024 WebP & JPG")
        except Exception as e:
            print(f"[ERROR] Failed {f}: {e}")

    print(f"\n[DONE] Successfully upscaled all {success_count} cake images to 1024x1024 WebP in {normal_dir}!")

if __name__ == '__main__':
    main()
