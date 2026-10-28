import puppeteer from '/home/kellyb_dev/projects/hex-aim/packages/core/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
import { renderDashboardHtml } from '/home/kellyb_dev/projects/hex-aim/apps/web/dist/ui/dashboardHtml.js';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

const outDir = '/home/kellyb_dev/.gemini/antigravity-cli/brain/2a57ade8-54e4-4bb4-96ee-7a219b0f335d';
if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

async function main() {
  console.log('🚀 Launching headless Chrome to capture student scope bar and scope ring...');
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 2 });

  const html = renderDashboardHtml();
  await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });

  // 1. Capture Lara with rotating scope ring above tabs
  console.log('📸 Capturing Lara Active Scope Ring...');
  const laraScopePath = path.join(outDir, 'live_aim_scope_bar_lara.png');
  await page.screenshot({ path: laraScopePath, fullPage: false });
  console.log(`✅ Saved: ${laraScopePath}`);

  // 2. Switch to Maya
  console.log('📸 Switching to Maya...');
  await page.evaluate(() => {
    // @ts-ignore
    setStudent('maya');
  });
  await new Promise(r => setTimeout(r, 400));
  const mayaScopePath = path.join(outDir, 'live_aim_scope_bar_maya.png');
  await page.screenshot({ path: mayaScopePath, fullPage: false });
  console.log(`✅ Saved: ${mayaScopePath}`);

  // 3. Switch to Blank Templates and trigger toast
  console.log('📸 Switching to Blank Templates and triggering non-blocking toast...');
  await page.evaluate(() => {
    // @ts-ignore
    document.querySelectorAll('.nav-tab')[4].click();
  });
  await new Promise(r => setTimeout(r, 300));
  await page.evaluate(() => {
    // @ts-ignore
    downloadVectorPdf('sci-w8');
  });
  await new Promise(r => setTimeout(r, 300));
  const toastPath = path.join(outDir, 'live_aim_toast_verification.png');
  await page.screenshot({ path: toastPath, fullPage: false });
  console.log(`✅ Saved: ${toastPath}`);

  await browser.close();
  console.log('🎉 All scope ring and toast screenshots captured successfully!');
}

main().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
