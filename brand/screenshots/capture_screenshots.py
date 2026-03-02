#!/usr/bin/env python3
"""Capture screenshots of Expo/EAS pages using Playwright."""

import asyncio
import os
from pathlib import Path
from playwright.async_api import async_playwright

SCREENSHOT_DIR = Path("/home/orin_nano/.openclaw/workspace/potluck/brand/screenshots/eas-guide")
SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)

PAGES = [
    # Expo Website
    ("expo_homepage", "https://expo.dev/"),
    ("expo_signup", "https://expo.dev/signup"),
    ("expo_project", "https://expo.dev/accounts/potluckhub/projects/potluck"),
    ("expo_builds", "https://expo.dev/accounts/potluckhub/projects/potluck/builds"),
    ("expo_credentials", "https://expo.dev/accounts/potluckhub/projects/potluck/credentials"),
    # EAS Documentation
    ("eas_build_setup", "https://docs.expo.dev/build/setup/"),
    ("eas_json_config", "https://docs.expo.dev/build/eas-json/"),
    ("eas_submit_intro", "https://docs.expo.dev/submit/introduction/"),
    ("eas_build_intro", "https://docs.expo.dev/build/introduction/"),
    ("eas_overview", "https://docs.expo.dev/eas/"),
]

async def capture_screenshots():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1280, "height": 800},
            device_scale_factor=2  # Retina screenshots
        )
        
        for name, url in PAGES:
            try:
                page = await context.new_page()
                print(f"Capturing: {name} -> {url}")
                await page.goto(url, wait_until="networkidle", timeout=30000)
                await page.wait_for_timeout(1000)  # Extra wait for any lazy load
                
                filepath = SCREENSHOT_DIR / f"{name}.png"
                await page.screenshot(path=str(filepath), full_page=True)
                print(f"  Saved: {filepath}")
                
                await page.close()
            except Exception as e:
                print(f"  Error capturing {name}: {e}")
        
        await browser.close()
        print("\nDone!")

if __name__ == "__main__":
    asyncio.run(capture_screenshots())
