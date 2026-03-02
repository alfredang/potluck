const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const screenshotDir = '/home/orin_nano/.openclaw/workspace/potluck/brand/screenshots/appstore-guide';

async function captureScreenshot(url, filename, viewport = { width: 1280, height: 800 }) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport });
  
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    const filepath = path.join(screenshotDir, filename);
    await page.screenshot({ path: filepath, fullPage: true });
    console.log(`Captured: ${filename}`);
    return filepath;
  } catch (error) {
    console.error(`Error capturing ${filename}: ${error.message}`);
    return null;
  } finally {
    await browser.close();
  }
}

async function main() {
  const urls = [
    { url: 'https://expo.dev/accounts/potluckhub/projects/potluck/builds', filename: 'expo-builds.png' },
    { url: 'https://expo.dev/accounts/potluckhub/projects/potluck/submissions', filename: 'expo-submissions.png' },
    { url: 'https://developer.apple.com/help/app-store-connect/create-an-app-record/add-a-new-app', filename: 'apple-add-new-app.png' },
    { url: 'https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds', filename: 'apple-upload-builds.png' },
    { url: 'https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview', filename: 'apple-testflight.png' },
  ];
  
  for (const u of urls) {
    await captureScreenshot(u.url, u.filename);
  }
}

main().catch(console.error);
