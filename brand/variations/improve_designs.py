#!/usr/bin/env python3
"""
PotLuckHub Logo Design Variations - IMPROVED
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
    elif direction == "diagonal":
        # Diagonal gradient
        for i in range(SIZE):
            ratio = i / SIZE
            r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
            g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
            b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
            draw.line([(0, i), (SIZE, i)], fill=(r, g, b))
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

# ============================================================================
# DESIGN 3: Home Plate (IMPROVED)
# ============================================================================
def create_design_3():
    print("Creating Design 3: Home Plate (improved)...")
    
    img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background: Teal to light teal gradient
    color1 = (40, 155, 145)    # Teal
    color2 = (95, 200, 180)    # Light teal/mint
    create_gradient_background(draw, (0, 0, SIZE, SIZE), color1, color2, "diagonal")
    
    # Subtle center highlight
    for i in range(60):
        alpha = int(15 * (1 - i/60))
        draw.ellipse([SIZE//2 - 350 + i*5, SIZE//2 - 350 + i*5, 
                     SIZE//2 + 350 - i*5, SIZE//2 + 350 - i*5], 
                    outline=(255, 255, 255, alpha))
    
    center_x = SIZE // 2
    center_y = SIZE // 2
    
    # House/Roof shape (above the plate) - clearly visible
    roof_color = (255, 255, 255)
    
    # Roof triangle (main roof)
    roof_top = center_y - 280
    roof_points = [
        (center_x, roof_top),                           # Top point
        (center_x - 200, center_y - 100),               # Bottom left
        (center_x + 200, center_y - 100)                # Bottom right
    ]
    draw.polygon(roof_points, fill=roof_color)
    
    # Chimney
    draw.rectangle([center_x + 100, roof_top + 40, center_x + 150, roof_top + 100], fill=roof_color)
    
    # House body
    house_top = center_y - 100
    house_bottom = center_y + 20
    draw.rounded_rectangle([center_x - 180, house_top, center_x + 180, house_bottom], 
                          radius=15, fill=roof_color)
    
    # Door (orange accent)
    door_color = (255, 130, 50)
    draw.rounded_rectangle([center_x - 35, house_top + 10, center_x + 35, house_bottom],
                          radius=8, fill=door_color)
    
    # Windows
    window_color = (40, 155, 145)
    draw.rounded_rectangle([center_x - 120, house_top + 25, center_x - 60, house_top + 70],
                          radius=5, fill=window_color)
    draw.rounded_rectangle([center_x + 60, house_top + 25, center_x + 120, house_top + 70],
                          radius=5, fill=window_color)
    
    # Plate/Dish (below the house - clearly visible)
    plate_color = (255, 255, 255)
    plate_width = 380
    plate_height = 100
    plate_left = center_x - plate_width // 2
    plate_top = center_y + 80
    
    # Main plate (ellipse)
    draw.ellipse([plate_left, plate_top, plate_left + plate_width, plate_top + plate_height], 
                 fill=plate_color)
    
    # Inner plate rim
    inner_color = (240, 240, 240)
    draw.ellipse([plate_left + 35, plate_top + 15, 
                 plate_left + plate_width - 35, plate_top + plate_height - 15], 
                fill=inner_color)
    
    # Food on plate (orange circle)
    food_color = (255, 140, 50)
    draw.ellipse([plate_left + 100, plate_top + 25,
                 plate_left + plate_width - 100, plate_top + plate_height - 25],
                fill=food_color)
    
    # Steam rising from food
    steam_color = (255, 255, 255, 220)
    for i, offset in enumerate([-60, 0, 60]):
        x = center_x + offset
        y = plate_top
        points = []
        for j in range(4):
            points.append((x + math.sin(j * 0.9) * 12, y - j * 20))
        draw.line(points, fill=steam_color, width=10)
    
    # Save
    filename = os.path.join(OUTPUT_DIR, "design-3-home-plate.png")
    img.save(filename, "PNG")
    print(f"  Saved: {filename}")
    return filename

# ============================================================================
# DESIGN 5: Community Bowl (IMPROVED)
# ============================================================================
def create_design_5():
    print("Creating Design 5: Community Bowl (improved)...")
    
    img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background: Sunset gradient (orange to pink)
    color1 = (255, 130, 50)    # Orange
    color2 = (255, 80, 100)    # Pink/coral
    create_gradient_background(draw, (0, 0, SIZE, SIZE), color1, color2, "diagonal")
    
    # Subtle center glow
    for i in range(60):
        alpha = int(12 * (1 - i/60))
        draw.ellipse([SIZE//2 - 300 + i*5, SIZE//2 - 300 + i*5, 
                     SIZE//2 + 300 - i*5, SIZE//2 + 300 - i*5], 
                    outline=(255, 220, 180, alpha))
    
    center_x = SIZE // 2
    center_y = SIZE // 2 + 60
    
    # Large sharing bowl (center) - clearly visible
    bowl_color = (255, 255, 255)
    bowl_width = 360
    bowl_height = 200
    
    # Bowl shape
    bowl_left = center_x - bowl_width // 2
    bowl_top = center_y - bowl_height // 2
    
    # Main bowl
    draw.ellipse([bowl_left, bowl_top, bowl_left + bowl_width, bowl_top + bowl_height], 
                 fill=bowl_color)
    
    # Bowl rim (inner)
    inner_color = (245, 245, 245)
    draw.ellipse([bowl_left + 30, bowl_top + 20, 
                 bowl_left + bowl_width - 30, bowl_top + bowl_height - 10], 
                fill=inner_color)
    
    # Food in bowl
    food_color = (255, 160, 80)
    draw.ellipse([bowl_left + 60, bowl_top + 35, 
                 bowl_left + bowl_width - 60, bowl_top + bowl_height - 25], 
                fill=food_color)
    
    # Steam from food
    steam_color = (255, 255, 255, 200)
    for i, offset in enumerate([-50, 0, 50]):
        x = center_x + offset
        y = bowl_top - 10
        points = []
        for j in range(4):
            points.append((x + math.sin(j * 0.8) * 10, y - j * 22))
        draw.line(points, fill=steam_color, width=10)
    
    # Community hands/figures around the bowl
    # Using simple circular "people" icons arranged around the bowl
    
    # Top left figure
    fl_x, fl_y = center_x - 300, center_y - 220
    draw.ellipse([fl_x - 20, fl_y - 35, fl_x + 20, fl_y + 5], fill=(255, 255, 255, 230))  # Head
    draw.ellipse([fl_x - 40, fl_y + 5, fl_x + 40, fl_y + 80], fill=(255, 255, 255, 230))    # Body
    
    # Top right figure  
    fr_x, fr_y = center_x + 300, center_y - 220
    draw.ellipse([fr_x - 20, fr_y - 35, fr_x + 20, fr_y + 5], fill=(255, 255, 255, 230))
    draw.ellipse([fr_x - 40, fr_y + 5, fr_x + 40, fr_y + 80], fill=(255, 255, 255, 230))
    
    # Bottom left figure
    bl_x, bl_y = center_x - 280, center_y + 250
    draw.ellipse([bl_x - 18, bl_y - 30, bl_x + 18, bl_y + 5], fill=(255, 255, 255, 230))
    draw.ellipse([bl_x - 35, bl_y + 5, bl_x + 35, bl_y + 70], fill=(255, 255, 255, 230))
    
    # Bottom right figure
    br_x, br_y = center_x + 280, center_y + 250
    draw.ellipse([br_x - 18, br_y - 30, br_x + 18, br_y + 5], fill=(255, 255, 255, 230))
    draw.ellipse([br_x - 35, br_y + 5, br_x + 35, br_y + 70], fill=(255, 255, 255, 230))
    
    # Small hearts floating above (community/love)
    heart_color = (255, 255, 255)
    
    # Heart 1 - top
    hx1, hy1 = center_x - 150, center_y - 300
    draw.ellipse([hx1, hy1 + 12, hx1 + 24, hy1 + 36], fill=heart_color)
    draw.ellipse([hx1 + 24, hy1 + 12, hx1 + 48, hy1 + 36], fill=heart_color)
    draw.polygon([(hx1 + 12, hy1 + 28), (hx1 + 24, hy1 + 45), (hx1 + 36, hy1 + 28)], fill=heart_color)
    
    # Heart 2 - top right
    hx2, hy2 = center_x + 120, center_y - 280
    draw.ellipse([hx2, hy2 + 10, hx2 + 20, hy2 + 30], fill=heart_color)
    draw.ellipse([hx2 + 20, hy2 + 10, hx2 + 40, hy2 + 30], fill=heart_color)
    draw.polygon([(hx2 + 10, hy2 + 24), (hx2 + 20, hy2 + 38), (hx2 + 30, hy2 + 24)], fill=heart_color)
    
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
    print("PotLuckHub Logo Design Variations - IMPROVED")
    print("=" * 60)
    
    # Recreate improved designs 3 and 5
    create_design_3()
    create_design_5()
    
    print("\n" + "=" * 60)
    print("IMPROVED designs saved!")
    print("=" * 60)
