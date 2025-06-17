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
    // Navigate to local test page
    await page.goto('/');
    
    const contentHelper = new ContentScriptHelper(page);
    
    // Open popup and ensure extension is enabled 
    const popupPage = await context.newPage();
    const popup = await openPopup(popupPage, extensionId);

    const initialStatus = await popup.getEnabledStatus();
    if (!initialStatus) {
      await popup.clickEnabledCheckbox();
    }
    
    // Verify enabled status
    const enabledStatus = await popup.getEnabledStatus();
    expect(enabledStatus).toBe(true);
    
    // Close popup and bring content page to front
    await popupPage.close();
    await page.bringToFront();
    
    // Wait for content script to initialize
    await page.waitForTimeout(2000);
    
    // Check if content script is active
    const isActive = await contentHelper.isContentScriptActive();
    expect(isActive).toBe(true);
  });

  test('should remove content when extension is disabled', async ({ page, context, extensionId }) => {
    // Navigate to local test page
    await page.goto('/');
    
    const contentHelper = new ContentScriptHelper(page);
    
    // Open popup and enable extension
    const popupPage = await context.newPage();
    const popup = await openPopup(popupPage, extensionId);
    
    const initialStatus = await popup.getEnabledStatus();
    if (!initialStatus) {
      await popup.clickEnabledCheckbox();
    }
    
    // Verify content script is active when enabled
    await popupPage.close();
    await page.bringToFront();
    await page.waitForTimeout(1000);
    
    const isActiveWhenEnabled = await contentHelper.isContentScriptActive();
    expect(isActiveWhenEnabled).toBe(true);
    
    // Reopen popup to disable extension
    const popupPage2 = await context.newPage();
    const popup2 = await openPopup(popupPage2, extensionId);
    await popup2.clickEnabledCheckbox();
    
    // Verify it's disabled
    const disabledStatus = await popup2.getEnabledStatus();
    expect(disabledStatus).toBe(false);
    
    await popupPage2.close();
    await page.bringToFront();
    await page.waitForTimeout(2000); // Wait longer for unmount to complete
    
    // Content script section should be removed when disabled
    const isActiveWhenDisabled = await contentHelper.isContentScriptActive();
    expect(isActiveWhenDisabled).toBe(false);
  });
});