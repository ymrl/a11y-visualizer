import { test, expect } from './fixtures';
import { openPopup } from './pages/popup';
import { ContentScriptHelper } from './pages/content';

test.describe('Extension State Management', () => {
  test('should persist enabled state across popup sessions', async ({ page, context, extensionId }) => {
    // Open popup and check initial state
    const popup = await openPopup(page, extensionId);
    const initialState = await popup.getEnabledStatus();
    
    // Toggle to opposite state
    await popup.clickEnabledCheckbox();
    const toggledState = await popup.getEnabledStatus();
    expect(toggledState).toBe(!initialState);
    
    // Close and reopen popup
    await page.close();
    const newPage = await context.newPage();
    const newPopup = await openPopup(newPage, extensionId);
    
    // State should persist
    const persistedState = await newPopup.getEnabledStatus();
    expect(persistedState).toBe(toggledState);
  });

  test('should inject content script only when enabled', async ({ page, context, extensionId }) => {
    // Navigate to a test page
    await page.goto('data:text/html,<html><body><h1>Test Page</h1><button>Test Button</button></body></html>');
    
    const contentHelper = new ContentScriptHelper(page);
    await contentHelper.addTestElements();
    
    // Open popup and ensure extension is enabled
    const popupPage = await context.newPage();
    const popup = await openPopup(popupPage, extensionId);
    
    // Enable extension
    await popup.clickEnabledCheckbox();
    const isEnabled = await popup.getEnabledStatus();
    
    if (isEnabled) {
      // Wait for content script to activate
      await page.waitForTimeout(1000);
      
      // Content script should be active
      const isActive = await contentHelper.isContentScriptActive();
      expect(isActive).toBe(true);
      
      const elementsCount = await contentHelper.getA11yElementsCount();
      expect(elementsCount).toBeGreaterThan(0);
    }
  });

  test('should remove content when extension is disabled', async ({ page, context, extensionId }) => {
    // Navigate to test page
    await page.goto('data:text/html,<html><body><h1>Test Page</h1><button>Test Button</button></body></html>');
    
    const contentHelper = new ContentScriptHelper(page);
    await contentHelper.addTestElements();
    
    // Open popup and enable extension
    const popupPage = await context.newPage();
    const popup = await openPopup(popupPage, extensionId);
    await popup.clickEnabledCheckbox();
    
    // Wait for content script to activate
    await page.waitForTimeout(1000);
    
    // Verify content is active
    const initialCount = await contentHelper.getA11yElementsCount();
    expect(initialCount).toBeGreaterThan(0);
    
    // Disable extension
    await popup.clickEnabledCheckbox();
    
    // Wait for content to be removed
    await page.waitForTimeout(1000);
    
    // Content should be removed
    const finalCount = await contentHelper.getA11yElementsCount();
    expect(finalCount).toBe(0);
  });
});