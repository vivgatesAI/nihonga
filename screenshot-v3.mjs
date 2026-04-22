import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage({ viewport: { width: 1280, height: 900 } });
  
  await page.goto('https://nihonga-production.up.railway.app/?nocache=' + Date.now(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(6000);
  
  // Get the actual rendered DOM info
  const info = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const grid = document.querySelector('.grid');
    const cards = document.querySelectorAll('button.text-left');
    const images = document.querySelectorAll('img');
    const allText = document.body.innerText.substring(0, 500);
    
    return {
      hasNav: !!nav,
      navPos: nav ? getComputedStyle(nav).position : null,
      gridCount: grid ? grid.children.length : 0,
      cardCount: cards.length,
      imageCount: images.length,
      bodyText: allText,
      bodyClasses: document.body.className,
      firstChild: document.body.children[0]?.tagName + '.' + document.body.children[0]?.className?.substring(0, 50),
    };
  });
  
  console.log('DOM Info:', JSON.stringify(info, null, 2));
  
  // Screenshot with explicit no-cache
  await page.screenshot({ path: 'v3-fresh-desktop.png', fullPage: false });
  console.log('Fresh desktop screenshot saved');
  
  // Full page screenshot 
  await page.screenshot({ path: 'v3-fullpage.png', fullPage: true });
  console.log('Full page screenshot saved');
  
  await browser.close();
})();