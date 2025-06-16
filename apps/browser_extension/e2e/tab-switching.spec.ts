import { test, expect } from './fixtures';
import { openPopup } from './pages/popup';
import { ContentScriptHelper } from './pages/content';

test.describe('Tab Switching Bug Prevention', () => {
  test('should not show content when disabled after tab switch', async ({ context, extensionId }) => {
    // Create two tabs
    const tab1 = await context.newPage();
    const tab2 = await context.newPage();
    
    // Navigate both tabs to test pages
    await tab1.goto('data:text/html,<html><body><h1>Tab 1</h1><button>Button 1</button></body></html>');
    await tab2.goto('data:text/html,<html><body><h1>Tab 2</h1><button>Button 2</button></body></html>');
    
    const contentHelper1 = new ContentScriptHelper(tab1);
    const contentHelper2 = new ContentScriptHelper(tab2);
    
    await contentHelper1.addTestElements();
    await contentHelper2.addTestElements();
    
    // Open popup and enable extension
    const popupPage = await context.newPage();
    const popup = await openPopup(popupPage, extensionId);
    await popup.clickEnabledCheckbox();
    
    // Wait for content scripts to activate in both tabs
    await tab1.waitForTimeout(1000);
    await tab2.waitForTimeout(1000);
    
    // Verify content is active in both tabs
    const tab1Initial = await contentHelper1.getA11yElementsCount();
    const tab2Initial = await contentHelper2.getA11yElementsCount();
    expect(tab1Initial).toBeGreaterThan(0);
    expect(tab2Initial).toBeGreaterThan(0);
    
    // Hide tab1 (simulate tab switch away)
    await contentHelper1.triggerVisibilityChange('hidden');
    
    // Disable extension while tab1 is hidden/inactive
    await popup.clickEnabledCheckbox();
    
    // Wait for disable to propagate
    await tab2.waitForTimeout(1000);
    
    // Tab2 (visible) should have content removed immediately
    const tab2AfterDisable = await contentHelper2.getA11yElementsCount();
    expect(tab2AfterDisable).toBe(0);
    
    // Show tab1 again (simulate tab switch back)
    await contentHelper1.triggerVisibilityChange('visible');
    
    // Wait for visibility change to be processed
    await tab1.waitForTimeout(1000);
    
    // Tab1 should NOT show content since extension is disabled
    // This is the key test that would have caught the original bug
    const tab1AfterShow = await contentHelper1.getA11yElementsCount();
    expect(tab1AfterShow).toBe(0);
  });

  test('should handle rapid tab switching correctly', async ({ context, extensionId }) => {
    // Create multiple tabs
    const tabs = await Promise.all([
      context.newPage(),
      context.newPage(),
      context.newPage()
    ]);
    
    // Navigate all tabs and add test elements
    for (let i = 0; i < tabs.length; i++) {
      await tabs[i].goto(`data:text/html,<html><body><h1>Tab ${i + 1}</h1><button>Button ${i + 1}</button></body></html>`);
      const contentHelper = new ContentScriptHelper(tabs[i]);
      await contentHelper.addTestElements();
    }
    
    // Open popup and enable extension
    const popupPage = await context.newPage();
    const popup = await openPopup(popupPage, extensionId);
    await popup.clickEnabledCheckbox();
    
    // Wait for all content scripts to activate
    await Promise.all(tabs.map(tab => tab.waitForTimeout(1000)));
    
    // Rapidly switch tabs (hide all but one, then show them)
    const contentHelpers = tabs.map(tab => new ContentScriptHelper(tab));
    
    // Hide first two tabs
    await contentHelpers[0].triggerVisibilityChange('hidden');
    await contentHelpers[1].triggerVisibilityChange('hidden');
    
    // Disable extension
    await popup.clickEnabledCheckbox();
    await tabs[2].waitForTimeout(500);
    
    // Enable extension again
    await popup.clickEnabledCheckbox();
    await tabs[2].waitForTimeout(500);
    
    // Show hidden tabs
    await contentHelpers[0].triggerVisibilityChange('visible');
    await contentHelpers[1].triggerVisibilityChange('visible');
    
    // Wait for state to settle
    await Promise.all(tabs.map(tab => tab.waitForTimeout(1000)));
    
    // All tabs should show content since extension is now enabled
    for (let i = 0; i < tabs.length; i++) {
      const count = await contentHelpers[i].getA11yElementsCount();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should handle page reload correctly', async ({ context, extensionId }) => {
    const page = await context.newPage();
    await page.goto('data:text/html,<html><body><h1>Test Page</h1><button>Test Button</button></body></html>');
    
    const contentHelper = new ContentScriptHelper(page);
    await contentHelper.addTestElements();
    
    // Enable extension
    const popupPage = await context.newPage();
    const popup = await openPopup(popupPage, extensionId);
    await popup.clickEnabledCheckbox();
    
    // Wait for content script
    await page.waitForTimeout(1000);
    
    // Verify content is active
    const initialCount = await contentHelper.getA11yElementsCount();
    expect(initialCount).toBeGreaterThan(0);
    
    // Disable extension
    await popup.clickEnabledCheckbox();
    await page.waitForTimeout(500);
    
    // Reload page while extension is disabled
    await page.reload();
    await contentHelper.addTestElements();
    await page.waitForTimeout(1000);
    
    // Should not show content after reload since extension is disabled
    const afterReloadCount = await contentHelper.getA11yElementsCount();
    expect(afterReloadCount).toBe(0);
  });
});