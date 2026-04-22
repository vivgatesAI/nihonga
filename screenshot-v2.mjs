import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ bypassCSP: true });
  
  // Desktop - fresh load with no cache
  const page = await ctx.newPage({ viewport: { width: 1280, height: 900 } });
  
  // Clear cache by using a cache-busting URL
  await page.goto('https://nihonga-production.up.railway.app/?v=2', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  
  // Desktop above fold
  await page.screenshot({ path: 'v2-desktop-top.png', fullPage: false });
  console.log('Desktop top');
  
  // Scroll to gallery
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'v2-desktop-gallery.png', fullPage: false });
  console.log('Desktop gallery');
  
  // More scroll
  await page.evaluate(() => window.scrollTo(0, 700));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'v2-desktop-lower.png', fullPage: false });
  console.log('Desktop lower');
  
  // Mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('https://nihonga-production.up.railway.app/?v=2mobile', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'v2-mobile-top.png', fullPage: false });
  console.log('Mobile top');
  
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'v2-mobile-gallery.png', fullPage: false });
  console.log('Mobile gallery');
  
  await browser.close();
})();