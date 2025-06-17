import { Page } from '@playwright/test';

export async function openPopup(page: Page, extensionId: string) {
  // Method 1: Use keyboard shortcut to open real popup
  try {
    // Navigate to any page first to have focus
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Use the keyboard shortcut defined in manifest to open popup
    await page.keyboard.press('Control+Shift+KeyA');
    
    // Wait for popup window to appear
    const context = page.context();
    const popupPromise = context.waitForEvent('page', { timeout: 5000 });
    const popupPage = await popupPromise;
    
    // Verify this is the correct popup
    if (popupPage.url().includes(extensionId) && popupPage.url().includes('popup.html')) {
      await popupPage.waitForLoadState('networkidle');
      console.log('Successfully opened real popup via keyboard shortcut');
      return createPopupInterface(popupPage);
    }
  } catch (error) {
    console.log('Keyboard shortcut method failed:', error);
  }
  
  // Fallback: Use tab-based approach
  console.log('Falling back to tab-based popup approach');
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await page.waitForLoadState('networkidle');
  return createPopupInterface(page);
}

function createPopupInterface(popupPage: Page) {
  const popup = {
    // Enable/Disable functionality
    getEnabledCheckbox: () => popupPage.waitForSelector('input[data-testid="enabled-checkbox"]', { timeout: 5000 }),
    
    clickEnabledCheckbox: async () => {
      const checkbox = await popup.getEnabledCheckbox();
      await checkbox.click();
      
      // Since we're in tab mode instead of popup mode, manually trigger message sending
      const enabled = await checkbox.isChecked();
      
      // Send comprehensive messages to ensure content scripts receive them
      await popupPage.evaluate(async (enabled) => {
        // Method 1: Send to background script
        if (typeof browser !== 'undefined' && browser.runtime) {
          browser.runtime.sendMessage({
            type: "updateEnabled",
            enabled: enabled,
          });
        }
        
        // Method 2: Send to ALL tabs (not just active ones)
        if (typeof browser !== 'undefined' && browser.tabs) {
          try {
            // Get all tabs
            const allTabs = await browser.tabs.query({});
            
            // Filter content tabs and send messages
            const contentTabs = allTabs.filter(tab => 
              tab.url && 
              !tab.url.startsWith('chrome-extension://') &&
              !tab.url.startsWith('chrome://') &&
              !tab.url.startsWith('about:')
            );
            
            console.log(`Sending disable message to ${contentTabs.length} content tabs`);
            
            // Send message to each content tab
            for (const tab of contentTabs) {
              if (tab.id) {
                try {
                  await browser.tabs.sendMessage(tab.id, {
                    type: "updateEnabled",
                    enabled: enabled,
                  });
                  console.log(`Message sent to tab ${tab.id}: ${tab.url}`);
                } catch (error) {
                  console.log(`Failed to send message to tab ${tab.id}:`, error);
                }
              }
            }
          } catch (error) {
            console.log('Failed to query tabs:', error);
          }
        }
      }, enabled);
      
      // Wait longer for message propagation to content scripts
      await popupPage.waitForTimeout(2000);
    },
    
    getEnabledStatus: async () => {
      const checkbox = await popup.getEnabledCheckbox();
      return await checkbox.isChecked();
    },
    
    // Settings sections
    getSettingsEditor: () => popupPage.waitForSelector('[data-testid="settings-editor"]'),
    
    // Host-specific settings
    getHostTitle: () => popupPage.waitForSelector('[data-testid="host-title"]'),
    
    getHostTitleText: async () => {
      const hostTitle = await popup.getHostTitle();
      return await hostTitle.textContent();
    },
    
    // Reset button
    getResetButton: () => popupPage.waitForSelector('[data-testid="reset-button"]'),
    
    clickResetButton: async () => {
      const resetBtn = await popup.getResetButton();
      await resetBtn.click();
      await popupPage.waitForTimeout(100);
    },
    
    // Apply button
    getApplyButton: () => popupPage.waitForSelector('[data-testid="apply-button"]'),
    
    clickApplyButton: async () => {
      const applyBtn = await popup.getApplyButton();
      await applyBtn.click();
      await popupPage.waitForTimeout(100);
    },
    
    // Category settings
    getCategoryCheckbox: (category: string) => 
      popupPage.waitForSelector(`input[data-testid="category-${category}"]`),
    
    toggleCategory: async (category: string) => {
      const checkbox = await popup.getCategoryCheckbox(category);
      await checkbox.click();
      await popupPage.waitForTimeout(100);
    },
    
    getCategoryStatus: async (category: string) => {
      const checkbox = await popup.getCategoryCheckbox(category);
      return await checkbox.isChecked();
    },
    
    // Wait for popup to be ready
    waitForPopupReady: () => popupPage.waitForLoadState('networkidle'),
    
    // Close the popup
    close: () => popupPage.close(),
    
    // Get the popup page reference
    page: popupPage,
  };
  
  return popup;
}