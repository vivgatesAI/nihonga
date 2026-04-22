import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage({ viewport: { width: 1280, height: 900 } });
  
  await page.goto('https://nihonga-production.up.railway.app/?nocache=' + Date.now(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000);
  
  // Take screenshots at specific scroll positions
  await page.screenshot({ path: 'v3-top.png', fullPage: false, clip: { x: 0, y: 0, width: 1280, height: 400 } });
  console.log('Top section (400px)');
  
  await page.evaluate(() => window.scrollTo(0, 200));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'v3-grid1.png', fullPage: false });
  console.log('Grid section 1');
  
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'v3-grid2.png', fullPage: false });
  console.log('Grid section 2');
  
  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'v3-grid3.png', fullPage: false });
  console.log('Grid section 3');
  
  await browser.close();
})();