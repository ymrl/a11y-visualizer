import { test as base, chromium, type BrowserContext } from '@playwright/test';
import path from 'path';

const pathToExtension = path.resolve('.output/chrome-mv3');

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({}, use) => {
    const context = await chromium.launchPersistentContext('', {
      headless: process.env.CI ? true : false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--no-sandbox',
      ],
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    let background: { url(): string };
    
    // Wait for service worker (MV3) or background page (MV2)
    [background] = context.serviceWorkers();
    if (!background) {
      background = await context.waitForEvent('serviceworker');
    }

    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
});

export const expect = test.expect;