#!/usr/bin/env python3
"""Render HTML mockups to screenshots using Playwright."""

import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

SCREENSHOT_DIR = Path("/home/orin_nano/.openclaw/workspace/potluck/brand/screenshots/eas-guide")

HTML_FILES = [
    "term_install.html",
    "term_login.html",
    "term_init.html",
    "term_configure.html",
    "term_build_ios.html",
    "term_build_android.html",
    "term_submit.html",
    "term_credentials.html",
    "term_expo_doctor.html",
    "code_eas_json.html",
    "code_app_json.html",
    "code_npmrc.html",
    "architecture_diagram.html",
]

async def render_html():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1280, "height": 800})
        
        for html_file in HTML_FILES:
            try:
                html_path = SCREENSHOT_DIR / html_file
                png_name = html_file.replace(".html", ".png")
                png_path = SCREENSHOT_DIR / png_name
                
                print(f"Rendering: {html_file}")
                page = await context.new_page()
                
                # Wait for fonts to load
                await page.goto(f"file://{html_path}", wait_until="networkidle")
                await page.wait_for_timeout(500)
                
                # Take screenshot
                await page.screenshot(path=str(png_path), full_page=False)
                print(f"  Saved: {png_name}")
                
                await page.close()
            except Exception as e:
                print(f"  Error: {e}")
        
        await browser.close()
        print("\nDone!")

if __name__ == "__main__":
    asyncio.run(render_html())
