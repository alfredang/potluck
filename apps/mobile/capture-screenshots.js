const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1290, height: 2796 } });
  
  const pages = [
    { url: 'https://potluck.tertiaryinfo.tech', name: 'home' },
    { url: 'https://potluck.tertiaryinfo.tech/chefs', name: 'chefs' },
    { url: 'https://potluck.tertiaryinfo.tech/meals', name: 'meals' },
  ];
  
  for (const p of pages) {
    try {
      await page.goto(p.url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.screenshot({ path: `./screenshots/iphone-${p.name}.png`, fullPage: false });
      console.log(`Captured: ${p.name}`);
    } catch (e) {
      console.error(`Error capturing ${p.name}: ${e.message}`);
    }
  }
  
  await browser.close();
})();
