import { test, expect } from './fixtures';
import { openPopup } from './pages/popup';
import { ContentScriptHelper } from './pages/content';

test.describe('Tab Switching Bug Prevention', () => {
  test('should not show content when disabled after tab switch', async ({ context, extensionId }) => {
    // Create two tabs
    const tab1 = await context.newPage();
    const tab2 = await context.newPage();
    
    // Navigate both tabs to local test pages  
    await tab1.goto('/');
    await tab2.goto('/');
    
    const contentHelper1 = new ContentScriptHelper(tab1);
    const contentHelper2 = new ContentScriptHelper(tab2);
    
    // Open popup and enable extension
    const popupPage = await context.newPage();
    const popup = await openPopup(popupPage, extensionId);
    
    const initialStatus = await popup.getEnabledStatus();
    if (!initialStatus) {
      await popup.clickEnabledCheckbox();
    }
    
    // Close popup
    await popupPage.close();
    
    // Activate tab1 and verify content script
    await tab1.bringToFront();
    await tab1.waitForTimeout(1000);
    
    const tab1Active = await contentHelper1.isContentScriptActive();
    expect(tab1Active).toBe(true);
    
    // Activate tab2 and verify content script
    await tab2.bringToFront();
    await tab2.waitForTimeout(1000);
    
    const tab2Active = await contentHelper2.isContentScriptActive();
    expect(tab2Active).toBe(true);
    
    // Reopen popup to disable extension
    const popupPage2 = await context.newPage();
    const popup2 = await openPopup(popupPage2, extensionId);
    await popup2.clickEnabledCheckbox();
    await popupPage2.close();
    
    // Wait for disable to propagate
    await tab2.waitForTimeout(2000);
    
    // Both tabs should have content removed when extension is disabled
    const tab1AfterDisable = await contentHelper1.isContentScriptActive();
    const tab2AfterDisable = await contentHelper2.isContentScriptActive();
    
    expect(tab1AfterDisable).toBe(false);
    expect(tab2AfterDisable).toBe(false);
  });

  test('should handle rapid tab switching correctly', async ({ context, extensionId }) => {
    // Create multiple tabs
    const tabs = await Promise.all([
      context.newPage(),
      context.newPage(),
      context.newPage()
    ]);
    
    // Navigate all tabs to local test page
    for (let i = 0; i < tabs.length; i++) {
      await tabs[i].goto('/');
    }
    
    // Open popup and enable extension
    const popupPage = await context.newPage();
    const popup = await openPopup(popupPage, extensionId);
    
    const initialStatus = await popup.getEnabledStatus();
    if (!initialStatus) {
      await popup.clickEnabledCheckbox();
    }
    
    await popupPage.close();
    
    const contentHelpers = tabs.map(tab => new ContentScriptHelper(tab));
    
    // Activate each tab and verify content script works
    for (let i = 0; i < tabs.length; i++) {
      await tabs[i].bringToFront();
      await tabs[i].waitForTimeout(1000);
      const isActive = await contentHelpers[i].isContentScriptActive();
      expect(isActive).toBe(true);
    }
    
    // Reopen popup to disable extension
    const popupPage2 = await context.newPage();
    const popup2 = await openPopup(popupPage2, extensionId);
    await popup2.clickEnabledCheckbox();
    await popupPage2.close();
    
    // Wait for state to settle
    await Promise.all(tabs.map(tab => tab.waitForTimeout(2000)));
    
    // All tabs should NOT show content since extension is disabled
    for (let i = 0; i < tabs.length; i++) {
      await tabs[i].bringToFront();
      await tabs[i].waitForTimeout(1000);
      const isActive = await contentHelpers[i].isContentScriptActive();
      expect(isActive).toBe(false);
    }
  });

  test('should handle page reload correctly', async ({ context, extensionId }) => {
    const page = await context.newPage();
    await page.goto('/');
    
    const contentHelper = new ContentScriptHelper(page);
    
    // Enable extension
    const popupPage = await context.newPage();
    const popup = await openPopup(popupPage, extensionId);
    
    const initialStatus = await popup.getEnabledStatus();
    if (!initialStatus) {
      await popup.clickEnabledCheckbox();
    }
    
    await popupPage.close();
    await page.bringToFront();
    await page.waitForTimeout(1000);
    
    // Verify content script is active
    const isActiveBeforeReload = await contentHelper.isContentScriptActive();
    expect(isActiveBeforeReload).toBe(true);
    
    // Reload page while extension is enabled
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Should still show content after reload since extension is enabled
    const isActiveAfterReload = await contentHelper.isContentScriptActive();
    expect(isActiveAfterReload).toBe(true);
  });
});