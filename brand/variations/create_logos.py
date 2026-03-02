#!/usr/bin/env python3
"""
PotLuckHub Logo Design Variations
Professional app icons for a home cooking marketplace
"""

from PIL import Image, ImageDraw, ImageFilter
import math
import os

# Configuration
SIZE = 1024
OUTPUT_DIR = "/home/orin_nano/.openclaw/workspace/potluck/brand/variations"

def create_gradient_background(draw, bbox, color1, color2, direction="vertical"):
    """Create a gradient fill"""
    x0, y0, x1, y1 = bbox
    if direction == "vertical":
        steps = y1 - y0
        for i in range(steps):
            ratio = i / steps
            r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
            g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
            b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
            draw.line([(x0, y0 + i), (x1, y0 + i)], fill=(r, g, b))
    else:
        steps = x1 - x0
        for i in range(steps):
            ratio = i / steps
            r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
            g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
            b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
            draw.line([(x0 + i, y0), (x0 + i, y1)], fill=(r, g, b))

def draw_rounded_rectangle(draw, bbox, radius, fill):
    """Draw a rounded rectangle"""
    x0, y0, x1, y1 = bbox
    draw.rectangle([x0 + radius, y0, x1 - radius, y1], fill=fill)
    draw.rectangle([x0, y0 + radius, x1, y1 - radius], fill=fill)
    draw.pieslice([x0, y0, x0 + 2*radius, y0 + 2*radius], 180, 270, fill=fill)
    draw.pieslice([x1 - 2*radius, y0, x1, y0 + 2*radius], 270, 360, fill=fill)
    draw.pieslice([x0, y1 - 2*radius, x0 + 2*radius, y1], 90, 180, fill=fill)
    draw.pieslice([x1 - 2*radius, y1 - 2*radius, x1, y1], 0, 90, fill=fill)

def add_shadow(img, offset=20, blur=30):
    """Add a soft shadow to the icon"""
    shadow = Image.new('RGBA', (img.width + offset*2, img.height + offset*2), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.ellipse([offset, offset, img.width + offset, img.height + offset], fill=(0, 0, 0, 50))
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur))
    return shadow

# ============================================================================
# DESIGN 1: Pot & Spoon
# ============================================================================
def create_design_1():
    print("Creating Design 1: Pot & Spoon...")
    
    # Create base image with gradient background
    img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Gradient background (orange to coral)
    color1 = (255, 140, 50)   # Orange
    color2 = (255, 90, 80)    # Coral
    create_gradient_background(draw, (0, 0, SIZE, SIZE), color1, color2, "diagonal")
    
    # Add subtle inner shadow/vignette
    for i in range(100):
        alpha = int(30 * (1 - i/100))
        draw.ellipse([i*5, i*5, SIZE - i*5, SIZE - i*5], outline=(0, 0, 0, alpha))
    
    # Draw cooking pot (white silhouette)
    pot_color = (255, 255, 255)
    pot_center_x = SIZE // 2
    pot_center_y = SIZE // 2 + 50
    
    # Pot body - rounded rectangle shape
    pot_width = 380
    pot_height = 280
    pot_top = pot_center_y - pot_height // 2
    pot_left = pot_center_x - pot_width // 2
    
    # Main pot body
    draw_rounded_rectangle(draw, (pot_left, pot_top, pot_left + pot_width, pot_top + pot_height), 60, pot_color)
    
    # Pot rim (slightly darker)
    rim_color = (245, 245, 245)
    draw_rounded_rectangle(draw, (pot_left - 10, pot_top - 30, pot_left + pot_width + 10, pot_top + 20), 30, rim_color)
    
    # Pot handles
    handle_color = (240, 240, 240)
    # Left handle
    draw.ellipse([pot_left - 60, pot_center_y - 40, pot_left, pot_center_y + 40], fill=handle_color)
    # Right handle  
    draw.ellipse([pot_left + pot_width, pot_center_y - 40, pot_left + pot_width + 60, pot_center_y + 40], fill=handle_color)
    
    # Pot legs
    leg_color = (235, 235, 235)
    draw.ellipse([pot_left + 80, pot_top + pot_height - 20, pot_left + 140, pot_top + pot_height + 30], fill=leg_color)
    draw.ellipse([pot_left + pot_width - 140, pot_top + pot_height - 20, pot_left + pot_width - 80, pot_top + pot_height + 30], fill=leg_color)
    
    # Wooden spoon
    spoon_color = (210, 150, 80)  # Wood brown
    spoon_x = pot_center_x + 180
    spoon_y = pot_center_y - 80
    
    # Spoon handle
    draw.rounded_rectangle([spoon_x - 15, spoon_y - 200, spoon_x + 15, spoon_y + 80], radius=8, fill=spoon_color)
    
    # Spoon bowl
    draw.ellipse([spoon_x - 50, spoon_y + 60, spoon_x + 50, spoon_y + 130], fill=spoon_color)
    
    # Steam lines (3 wavy lines)
    steam_color = (255, 255, 255, 180)
    for i, offset in enumerate([-60, 0, 60]):
        x = pot_center_x + offset
        y = pot_top - 40
        points = []
        for j in range(5):
            points.append((x + math.sin(j * 0.8) * 15, y - j * 30))
        draw.line(points, fill=steam_color, width=12)
    
    # Add subtle highlight
    highlight = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    highlight_draw = ImageDraw.Draw(highlight)
    highlight_draw.ellipse([100, 100, SIZE//2, SIZE//2 - 50], fill=(255, 255, 255, 30))
    
    final = Image.alpha_composite(img, highlight)
    
    # Save
    filename = os.path.join(OUTPUT_DIR, "design-1-pot-spoon.png")
    final.save(filename, "PNG")
    print(f"  Saved: {filename}")
    return filename

# ============================================================================
# DESIGN 2: Fork & Heart (Negative Space)
# ============================================================================
def create_design_2():
    print("Creating Design 2: Fork & Heart...")
    
    img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Gradient background (deep orange to warm red)
    color1 = (220, 80, 30)    # Deep orange
    color2 = (180, 40, 50)    # Warm red
    create_gradient_background(draw, (0, 0, SIZE, SIZE), color1, color2, "diagonal")
    
    # Add subtle inner glow
    for i in range(80):
        alpha = int(25 * (1 - i/80))
        draw.ellipse([i*6, i*6, SIZE - i*6, SIZE - i*6], outline=(255, 180, 100, alpha))
    
    center_x = SIZE // 2
    center_y = SIZE // 2
    
    # Draw fork (left side)
    fork_color = (255, 255, 255)
    fork_x = center_x - 120
    
    # Fork tines
    tine_width = 25
    tine_gap = 35
    for i in range(4):
        x = fork_x + i * tine_gap
        draw.rounded_rectangle([x, center_y - 200, x + tine_width, center_y + 50], radius=12, fill=fork_color)
    
    # Fork handle
    draw.rounded_rectangle([fork_x + 45, center_y - 50, fork_x + 80, center_y + 250], radius=20, fill=fork_color)
    
    # Fork neck curve
    draw.ellipse([fork_x + 30, center_y - 80, fork_x + 90, center_y + 20], fill=fork_color)
    
    # Draw spoon (right side)
    spoon_x = center_x + 80
    
    # Spoon bowl (oval)
    draw.ellipse([spoon_x - 50, center_y - 180, spoon_x + 50, center_y + 80], fill=fork_color)
    
    # Spoon handle
    draw.rounded_rectangle([spoon_x - 15, center_y + 50, spoon_x + 15, center_y + 280], radius=12, fill=fork_color)
    
    # Spoon neck
    draw.ellipse([spoon_x - 30, center_y + 30, spoon_x + 30, center_y + 90], fill=fork_color)
    
    # Create heart shape in the center (negative space from fork/spoon)
    heart_color = (255, 255, 255)
    heart_size = 200
    heart_top = center_y - heart_size // 2 + 20
    heart_left = center_x - heart_size // 2
    
    # Draw heart using bezier-like curves
    # Left lobe
    draw.ellipse([heart_left, heart_top + 40, heart_left + heart_size//2, heart_top + heart_size], fill=heart_color)
    # Right lobe
    draw.ellipse([heart_left + heart_size//2, heart_top + 40, heart_left + heart_size, heart_top + heart_size], fill=heart_color)
    # Bottom point
    heart_bottom = heart_top + heart_size - 40
    draw.polygon([
        (heart_left + heart_size//4, heart_top + heart_size - 20),
        (heart_left + heart_size//2, heart_bottom + 60),
        (heart_left + heart_size*3//4, heart_top + heart_size - 20)
    ], fill=heart_color)
    
    # Cut out center to create the "negative space" effect between fork and spoon
    draw.ellipse([center_x - 30, center_y - 20, center_x + 30, center_y + 60], fill=(220, 80, 30))
    
    # Save
    filename = os.path.join(OUTPUT_DIR, "design-2-fork-heart.png")
    img.save(filename, "PNG")
    print(f"  Saved: {filename}")
    return filename

# ============================================================================
# DESIGN 3: Home Plate
# ============================================================================
def create_design_3():
    print("Creating Design 3: Home Plate...")
    
    img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background: Teal to light teal gradient
    color1 = (45, 160, 150)    # Teal
    color2 = (100, 210, 180)  # Light teal/mint
    create_gradient_background(draw, (0, 0, SIZE, SIZE), color1, color2, "vertical")
    
    # Subtle circle in background
    draw.ellipse([SIZE//2 - 400, SIZE//2 - 400, SIZE//2 + 400, SIZE//2 + 400], fill=(255, 255, 255, 15))
    
    center_x = SIZE // 2
    center_y = SIZE // 2 + 80
    
    # House/Roof shape (above the plate)
    roof_color = (255, 255, 255)
    roof_top = center_y - 340
    roof_left = center_x - 180
    roof_right = center_x + 180
    
    # Roof triangle
    draw.polygon([
        (center_x, roof_top),
        (roof_left, roof_top + 180),
        (roof_right, roof_top + 180)
    ], fill=roof_color)
    
    # Roof detail line
    draw.line([(center_x, roof_top + 30), (center_x, roof_top + 180)], fill=(240, 240, 240), width=8)
    
    # House base (small rectangle)
    house_base_y = roof_top + 160
    draw.rounded_rectangle([center_x - 100, house_base_y, center_x + 100, house_base_y + 60], radius=10, fill=roof_color)
    
    # Door
    door_color = (45, 160, 150)
    draw.rounded_rectangle([center_x - 30, house_base_y + 15, center_x + 30, house_base_y + 60], radius=5, fill=door_color)
    
    # Plate/Dish (below the house)
    plate_color = (255, 255, 255)
    plate_width = 400
    plate_height = 120
    plate_left = center_x - plate_width // 2
    plate_top = center_y - plate_height // 2
    
    # Main plate (ellipse)
    draw.ellipse([plate_left, plate_top, plate_left + plate_width, plate_top + plate_height], fill=plate_color)
    
    # Inner plate (smaller ellipse)
    inner_color = (245, 245, 245)
    draw.ellipse([plate_left + 40, plate_top + 20, plate_left + plate_width - 40, plate_top + plate_height - 20], fill=inner_color)
    
    # Food/steam from plate
    steam_color = (255, 255, 255, 200)
    for i, offset in enumerate([-80, 0, 80]):
        x = center_x + offset
        y = plate_top - 20
        points = []
        for j in range(4):
            points.append((x + math.sin(j * 0.9) * 12, y - j * 25))
        draw.line(points, fill=steam_color, width=10)
    
    # Add accent circle (orange dot - representing food/warmth)
    draw.ellipse([center_x - 20, center_y + 30, center_x + 20, center_y + 70], fill=(255, 140, 50))
    
    # Save
    filename = os.path.join(OUTPUT_DIR, "design-3-home-plate.png")
    img.save(filename, "PNG")
    print(f"  Saved: {filename}")
    return filename

# ============================================================================
# DESIGN 4: Letter P (Lettermark)
# ============================================================================
def create_design_4():
    print("Creating Design 4: Letter P...")
    
    img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background: Orange to amber gradient
    color1 = (255, 160, 30)    # Bright orange
    color2 = (255, 200, 50)    # Amber/gold
    create_gradient_background(draw, (0, 0, SIZE, SIZE), color1, color2, "diagonal")
    
    # Subtle radial highlight
    for i in range(100):
        alpha = int(20 * (1 - i/100))
        draw.ellipse([i*5, i*5, SIZE - i*5, SIZE - i*5], outline=(255, 255, 200, alpha))
    
    center_x = SIZE // 2
    center_y = SIZE // 2
    
    # Draw stylized "P" letter
    p_color = (255, 255, 255)
    
    # P stem (vertical bar)
    stem_width = 120
    stem_height = 500
    stem_x = center_x - 180
    stem_y = center_y - stem_height // 2
    draw.rounded_rectangle([stem_x, stem_y, stem_x + stem_width, stem_y + stem_height], radius=30, fill=p_color)
    
    # P bowl (curved part)
    bowl_width = 280
    bowl_height = 320
    bowl_x = stem_x + stem_width - 40
    bowl_y = stem_y + 20
    
    # Main bowl shape
    draw.ellipse([bowl_x, bowl_y, bowl_x + bowl_width, bowl_y + bowl_height], fill=p_color)
    
    # Cut out inner part of P to make it hollow
    inner_color = (255, 160, 30)  # Match background
    inner_x = bowl_x + 50
    inner_y = bowl_y + 50
    draw.ellipse([inner_x, inner_y, inner_x + bowl_width - 100, inner_y + bowl_height - 100], fill=inner_color)
    
    # Add pot elements to make it look like a pot
    # Pot handles on the sides of the stem
    handle_color = (255, 240, 220)
    draw.ellipse([stem_x - 50, center_y - 30, stem_x + 10, center_y + 60], fill=handle_color)
    draw.ellipse([stem_x + stem_width - 10, center_y - 30, stem_x + stem_width + 50, center_y + 60], fill=handle_color)
    
    # Steam rising from the top of P
    steam_color = (255, 255, 255, 220)
    for i, offset in enumerate([-40, 0, 40, 60]):
        x = center_x + 80 + offset
        y = stem_y - 20
        points = []
        for j in range(5):
            points.append((x + math.sin(j * 0.7 + i) * 15, y - j * 28))
        draw.line(points, fill=steam_color, width=14)
    
    # Small pot detail at bottom of P
    pot_detail_color = (255, 220, 180)
    draw.ellipse([stem_x + 20, stem_y + stem_height - 80, stem_x + stem_width - 20, stem_y + stem_height], fill=pot_detail_color)
    
    # Save
    filename = os.path.join(OUTPUT_DIR, "design-4-letter-p.png")
    img.save(filename, "PNG")
    print(f"  Saved: {filename}")
    return filename

# ============================================================================
# DESIGN 5: Community Bowl
# ============================================================================
def create_design_5():
    print("Creating Design 5: Community Bowl...")
    
    img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background: Sunset gradient (orange to pink)
    color1 = (255, 130, 50)    # Orange
    color2 = (255, 90, 120)    # Pink/coral
    color3 = (200, 70, 140)    # Magenta
    create_gradient_background(draw, (0, 0, SIZE, SIZE), color1, color2, "vertical")
    
    # Add pink overlay
    overlay = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    overlay_draw.rectangle([0, SIZE//2, SIZE, SIZE], fill=(200, 70, 140, 80))
    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)
    
    # Subtle center glow
    for i in range(60):
        alpha = int(15 * (1 - i/60))
        draw.ellipse([SIZE//2 - 300 + i*5, SIZE//2 - 300 + i*5, SIZE//2 + 300 - i*5, SIZE//2 + 300 - i*5], 
                    outline=(255, 220, 180, alpha))
    
    center_x = SIZE // 2
    center_y = SIZE // 2 + 50
    
    # Large sharing bowl (center)
    bowl_color = (255, 255, 255)
    bowl_width = 380
    bowl_height = 180
    bowl_left = center_x - bowl_width // 2
    bowl_top = center_y - bowl_height // 2
    
    # Bowl shape (half ellipse)
    draw.ellipse([bowl_left, bowl_top, bowl_left + bowl_width, bowl_top + bowl_height], fill=bowl_color)
    
    # Bowl inner (darker white)
    inner_bowl_color = (245, 245, 245)
    draw.ellipse([bowl_left + 30, bowl_top + 20, bowl_left + bowl_width - 30, bowl_top + bowl_height - 10], fill=inner_bowl_color)
    
    # Food in bowl
    food_color = (255, 180, 100)
    draw.ellipse([bowl_left + 60, bowl_top + 30, bowl_left + bowl_width - 60, bowl_top + bowl_height - 20], fill=food_color)
    
    # Steam from food
    steam_color = (255, 255, 255, 200)
    for i, offset in enumerate([-50, 0, 50]):
        x = center_x + offset
        y = bowl_top - 10
        points = []
        for j in range(4):
            points.append((x + math.sin(j * 0.8) * 10, y - j * 22))
        draw.line(points, fill=steam_color, width=10)
    
    # Small figures/hands around the bowl (representing community)
    figure_color = (255, 255, 255)
    
    # Figure 1 - Top left
    f1_x, f1_y = center_x - 280, center_y - 200
    draw.ellipse([f1_x - 25, f1_y - 50, f1_x + 25, f1_y], fill=figure_color)  # Head
    draw.ellipse([f1_x - 50, f1_y, f1_x + 50, f1_y + 120], fill=figure_color)  # Body
    
    # Figure 2 - Top right
    f2_x, f2_y = center_x + 280, center_y - 200
    draw.ellipse([f2_x - 25, f2_y - 50, f2_x + 25, f2_y], fill=figure_color)
    draw.ellipse([f2_x - 50, f2_y, f2_x + 50, f2_y + 120], fill=figure_color)
    
    # Figure 3 - Bottom left
    f3_x, f3_y = center_x - 250, center_y + 200
    draw.ellipse([f3_x - 22, f3_y - 45, f3_x + 22, f3_y], fill=figure_color)
    draw.ellipse([f3_x - 45, f3_y, f3_x + 45, f3_y + 100], fill=figure_color)
    
    # Figure 4 - Bottom right
    f4_x, f4_y = center_x + 250, center_y + 200
    draw.ellipse([f4_x - 22, f4_y - 45, f4_x + 22, f4_y], fill=figure_color)
    draw.ellipse([f4_x - 45, f4_y, f4_x + 45, f4_y + 100], fill=figure_color)
    
    # Small hearts floating (community/love symbol)
    heart_color = (255, 255, 255)
    # Heart 1
    h1_x, h1_y = center_x - 180, center_y - 280
    draw.ellipse([h1_x, h1_y + 15, h1_x + 30, h1_y + 45], fill=heart_color)
    draw.ellipse([h1_x + 30, h1_y + 15, h1_x + 60, h1_y + 45], fill=heart_color)
    draw.polygon([(h1_x + 15, h1_y + 35), (h1_x + 30, h1_y + 55), (h1_x + 45, h1_y + 35)], fill=heart_color)
    
    # Heart 2
    h2_x, h2_y = center_x + 150, center_y - 260
    draw.ellipse([h2_x, h2_y + 12, h2_x + 25, h2_y + 37], fill=heart_color)
    draw.ellipse([h2_x + 25, h2_y + 12, h2_x + 50, h2_y + 37], fill=heart_color)
    draw.polygon([(h2_x + 12, h1_y + 30), (h2_x + 25, h1_y + 47), (h2_x + 38, h1_y + 30)], fill=heart_color)
    
    # Save
    filename = os.path.join(OUTPUT_DIR, "design-5-community-bowl.png")
    img.save(filename, "PNG")
    print(f"  Saved: {filename}")
    return filename

# ============================================================================
# Main
# ============================================================================
if __name__ == "__main__":
    print("=" * 60)
    print("PotLuckHub Logo Design Variations")
    print("=" * 60)
    
    # Create all designs
    files = []
    files.append(create_design_1())
    files.append(create_design_2())
    files.append(create_design_3())
    files.append(create_design_4())
    files.append(create_design_5())
    
    print("\n" + "=" * 60)
    print("SUMMARY - Files Created:")
    print("=" * 60)
    
    for f in files:
        size = os.path.getsize(f)
        print(f"  {os.path.basename(f):35} {size:,} bytes")
    
    print(f"\nTotal: {len(files)} designs created")
    print(f"Location: {OUTPUT_DIR}")
