import { Page } from '@playwright/test';

export class ContentScriptHelper {
  constructor(private page: Page) {}

  // Check if content script is loaded and active
  async isContentScriptActive(): Promise<boolean> {
    return await this.page.evaluate(() => {
      // Check for any a11y visualizer elements
      const a11yElements = document.querySelectorAll('[data-a11y-visualizer]');
      return a11yElements.length > 0;
    });
  }

  // Get count of a11y visualizer elements
  async getA11yElementsCount(): Promise<number> {
    return await this.page.evaluate(() => {
      const elements = document.querySelectorAll('[data-a11y-visualizer]');
      return elements.length;
    });
  }

  // Check if specific category elements are visible
  async getCategoryElementsCount(category: string): Promise<number> {
    return await this.page.evaluate((category) => {
      const elements = document.querySelectorAll(`[data-a11y-category="${category}"]`);
      return elements.length;
    }, category);
  }

  // Wait for content script to be ready
  async waitForContentScriptReady(timeout = 5000): Promise<void> {
    await this.page.waitForFunction(() => {
      // Look for the root element or any sign that content script is active
      return document.querySelector('[data-a11y-visualizer-root]') !== null;
    }, { timeout });
  }

  // Wait for content script to be removed
  async waitForContentScriptRemoved(timeout = 5000): Promise<void> {
    await this.page.waitForFunction(() => {
      // Check that no a11y visualizer elements exist
      return document.querySelectorAll('[data-a11y-visualizer]').length === 0;
    }, { timeout });
  }

  // Get extension state by checking DOM
  async getExtensionState(): Promise<{ active: boolean; elementsCount: number }> {
    return await this.page.evaluate(() => {
      const elements = document.querySelectorAll('[data-a11y-visualizer]');
      return {
        active: elements.length > 0,
        elementsCount: elements.length
      };
    });
  }

  // Simulate page elements that should be detected
  async addTestElements(): Promise<void> {
    await this.page.evaluate(() => {
      // Add some test elements that should be detected by the extension
      const testElements = [
        '<h1>Test Heading</h1>',
        '<button>Test Button</button>',
        '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Test Image">',
        '<a href="#test">Test Link</a>',
        '<input type="text" aria-label="Test Input">',
        '<div role="button" aria-label="Custom Button">Custom Button</div>',
        '<div aria-hidden="true">Hidden Content</div>',
        '<div role="navigation" aria-label="Test Navigation">Nav Content</div>'
      ];
      
      testElements.forEach(html => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        document.body.appendChild(wrapper.firstChild as Element);
      });
    });
  }

  // Check for specific WAI-ARIA elements
  async getWaiAriaElementsCount(): Promise<number> {
    return await this.page.evaluate(() => {
      const elements = document.querySelectorAll('[role], [aria-label], [aria-hidden], [aria-current], [aria-expanded]');
      return elements.length;
    });
  }

  // Trigger a visibility change event
  async triggerVisibilityChange(state: 'visible' | 'hidden'): Promise<void> {
    await this.page.evaluate((state) => {
      Object.defineProperty(document, 'visibilityState', {
        value: state,
        configurable: true
      });
      document.dispatchEvent(new Event('visibilitychange'));
    }, state);
  }
}