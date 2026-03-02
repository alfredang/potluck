const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const screenshotDir = '/home/orin_nano/.openclaw/workspace/potluck/brand/screenshots/appstore-guide';

async function renderHtmlToScreenshot(htmlFile, outputFilename) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1000, height: 700 } });
  
  try {
    const htmlPath = path.join(screenshotDir, htmlFile);
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
    
    // Wait a bit for fonts to render
    await page.waitForTimeout(500);
    
    const filepath = path.join(screenshotDir, outputFilename);
    await page.screenshot({ path: filepath, fullPage: true });
    console.log(`Rendered: ${outputFilename}`);
    return filepath;
  } catch (error) {
    console.error(`Error rendering ${htmlFile}: ${error.message}`);
    return null;
  } finally {
    await browser.close();
  }
}

async function main() {
  const files = [
    { html: 'terminal-eas-build.html', png: 'terminal-eas-build.png' },
    { html: 'terminal-eas-submit.html', png: 'terminal-eas-submit.png' },
    { html: 'terminal-expo-doctor.html', png: 'terminal-expo-doctor.png' },
    { html: 'terminal-expo-install-fix.html', png: 'terminal-expo-install-fix.png' },
    { html: 'terminal-expo-prebuild.html', png: 'terminal-expo-prebuild.png' },
    { html: 'eas-json-config.html', png: 'eas-json-config.png' },
  ];
  
  for (const f of files) {
    await renderHtmlToScreenshot(f.html, f.png);
  }
}

main().catch(console.error);
