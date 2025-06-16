import { Page } from '@playwright/test';

export async function openPopup(page: Page, extensionId: string) {
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await page.waitForLoadState('networkidle');

  const popup = {
    // Enable/Disable functionality
    getEnabledCheckbox: () => page.waitForSelector('input[data-testid="enabled-checkbox"]', { timeout: 5000 }),
    
    clickEnabledCheckbox: async () => {
      const checkbox = await popup.getEnabledCheckbox();
      await checkbox.click();
      // Wait for state change to propagate
      await page.waitForTimeout(100);
    },
    
    getEnabledStatus: async () => {
      const checkbox = await popup.getEnabledCheckbox();
      return await checkbox.isChecked();
    },
    
    // Settings sections
    getSettingsEditor: () => page.waitForSelector('[data-testid="settings-editor"]'),
    
    // Host-specific settings
    getHostTitle: () => page.waitForSelector('[data-testid="host-title"]'),
    
    getHostTitleText: async () => {
      const hostTitle = await popup.getHostTitle();
      return await hostTitle.textContent();
    },
    
    // Reset button
    getResetButton: () => page.waitForSelector('[data-testid="reset-button"]'),
    
    clickResetButton: async () => {
      const resetBtn = await popup.getResetButton();
      await resetBtn.click();
      await page.waitForTimeout(100);
    },
    
    // Apply button
    getApplyButton: () => page.waitForSelector('[data-testid="apply-button"]'),
    
    clickApplyButton: async () => {
      const applyBtn = await popup.getApplyButton();
      await applyBtn.click();
      await page.waitForTimeout(100);
    },
    
    // Category settings
    getCategoryCheckbox: (category: string) => 
      page.waitForSelector(`input[data-testid="category-${category}"]`),
    
    toggleCategory: async (category: string) => {
      const checkbox = await popup.getCategoryCheckbox(category);
      await checkbox.click();
      await page.waitForTimeout(100);
    },
    
    getCategoryStatus: async (category: string) => {
      const checkbox = await popup.getCategoryCheckbox(category);
      return await checkbox.isChecked();
    },
    
    // Wait for popup to be ready
    waitForPopupReady: () => page.waitForLoadState('networkidle'),
  };
  
  return popup;
}