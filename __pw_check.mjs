import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', err => errors.push(String(err)));

await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
await page.screenshot({ path: '__pw_top_light.png' });

// dark mode toggle (first glass pill button)
await page.locator('button').first().click();
await page.waitForTimeout(600);
await page.screenshot({ path: '__pw_top_dark.png' });

// back to light
await page.locator('button').first().click();
await page.waitForTimeout(600);

// open menu
await page.locator('button').nth(1).click();
await page.waitForTimeout(800);
await page.screenshot({ path: '__pw_menu.png' });
await page.locator('button').nth(1).click();
await page.waitForTimeout(800);

// scroll to likes carousel
await page.locator('#likes').scrollIntoViewIfNeeded();
await page.waitForTimeout(1500);
await page.screenshot({ path: '__pw_likes.png' });

// scroll to music section to trigger animation
await page.locator('#music-title').scrollIntoViewIfNeeded();
await page.waitForTimeout(1500);
await page.screenshot({ path: '__pw_music_anim.png' });
await page.waitForTimeout(4000);
await page.screenshot({ path: '__pw_music_done.png' });

// scroll to cafes
await page.locator('#cafes-title').scrollIntoViewIfNeeded();
await page.waitForTimeout(1500);
await page.screenshot({ path: '__pw_cafe_anim.png' });
await page.waitForTimeout(5000);
await page.screenshot({ path: '__pw_cafe_done.png' });

console.log('CONSOLE_ERRORS:', JSON.stringify(errors));
await browser.close();
