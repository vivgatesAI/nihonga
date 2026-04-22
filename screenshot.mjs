import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('https://nihonga-production.up.railway.app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'nihonga-desktop.png', fullPage: false });
  console.log('Desktop screenshot saved');
  
  // Mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('https://nihonga-production.up.railway.app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'nihonga-mobile.png', fullPage: false });
  console.log('Mobile screenshot saved');
  
  // Scroll down to see gallery
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('https://nihonga-production.up.railway.app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'nihonga-gallery.png', fullPage: false });
  console.log('Gallery section screenshot saved');
  
  await browser.close();
})();