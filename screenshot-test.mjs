import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  
  // Desktop - above fold
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('https://nihonga-production.up.railway.app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: 'test-desktop-top.png', fullPage: false });
  console.log('Desktop top saved');
  
  // Desktop - scrolled down to gallery
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'test-desktop-mid.png', fullPage: false });
  console.log('Desktop mid saved');

  // Desktop - further down
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'test-desktop-bottom.png', fullPage: false });
  console.log('Desktop bottom saved');
  
  // Mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('https://nihonga-production.up.railway.app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: 'test-mobile-top.png', fullPage: false });
  console.log('Mobile top saved');
  
  // Mobile scrolled
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'test-mobile-mid.png', fullPage: false });
  console.log('Mobile mid saved');
  
  // Full page screenshot for comprehensive review
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('https://nihonga-production.up.railway.app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: 'test-fullpage.png', fullPage: true });
  console.log('Full page saved');
  
  await browser.close();
})();