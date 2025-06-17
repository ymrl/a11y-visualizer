import { Page } from '@playwright/test';

export class ContentScriptHelper {
  constructor(private page: Page) {}

  // Check if content script is loaded and active
  async isContentScriptActive(): Promise<boolean> {
    return await this.page.evaluate(() => {
      // Check for the accessibility visualizer root section
      const visualizerSection = document.querySelector('section[aria-label*="Accessibility Visualizer"]');
      return visualizerSection !== null;
    });
  }

  // Get count of a11y visualizer elements
  async getA11yElementsCount(): Promise<number> {
    return await this.page.evaluate(() => {
      console.log('=== A11Y ELEMENT COUNT DEBUG ===');
      
      // Check if visualizer section exists
      const visualizerSection = document.querySelector('section[aria-label*="Accessibility Visualizer"]');
      console.log('Visualizer section found:', !!visualizerSection);
      
      if (!visualizerSection) {
        // Check for any elements that might indicate extension is running
        const allSections = document.querySelectorAll('section');
        console.log('All sections on page:', allSections.length);
        allSections.forEach((section, i) => {
          console.log(`Section ${i}:`, section.outerHTML.substring(0, 200));
        });
        return 0;
      }
      
      console.log('Visualizer section HTML:', visualizerSection.outerHTML.substring(0, 500));
      
      // Check all children of visualizer section
      const children = visualizerSection.children;
      console.log('Visualizer section children:', children.length);
      
      let totalOverlays = 0;
      Array.from(children).forEach((child, index) => {
        console.log(`Child ${index}:`, child.tagName, child.className);
        
        // Check if it's a shadow host
        if (child.shadowRoot) {
          console.log(`Child ${index} has shadow root`);
          const shadowElements = child.shadowRoot.querySelectorAll('*');
          console.log(`Shadow DOM has ${shadowElements.length} elements`);
          
          const overlays = child.shadowRoot.querySelectorAll('.ElementInfo');
          console.log(`Shadow root ${index} has ${overlays.length} ElementInfo overlays`);
          totalOverlays += overlays.length;
          
          // Debug: show first few overlay elements
          Array.from(overlays).slice(0, 3).forEach((overlay, i) => {
            console.log(`Overlay ${i}:`, overlay.className, overlay.style.cssText);
          });
        } else {
          // Check for direct overlays
          const directOverlays = child.querySelectorAll('.ElementInfo');
          console.log(`Child ${index} has ${directOverlays.length} direct ElementInfo overlays`);
          totalOverlays += directOverlays.length;
        }
      });
      
      console.log('=== TOTAL OVERLAYS:', totalOverlays, '===');
      
      // Also debug the actual settings being used
      try {
        // Check if we can access any settings or state from the extension
        const hasSettings = window.localStorage.getItem('a11y-visualizer-settings');
        console.log('Local storage settings:', hasSettings);
      } catch (e) {
        console.log('Could not access settings:', e);
      }
      
      return totalOverlays;
    });
  }

  // Check if specific category elements are visible
  async getCategoryElementsCount(category: string): Promise<number> {
    return await this.page.evaluate((category) => {
      const visualizerSection = document.querySelector('section[aria-label*="Accessibility Visualizer"]');
      if (!visualizerSection) return 0;
      
      // Look for shadow DOM elements containing ElementInfo overlays
      const shadowRoot = visualizerSection.querySelector('div')?.shadowRoot;
      if (!shadowRoot) return 0;
      
      // Count overlays by category class (this might need adjustment based on actual CSS classes)
      const overlays = shadowRoot.querySelectorAll(`.ElementInfo.${category}, .ElementInfo[data-category="${category}"]`);
      return overlays.length;
    }, category);
  }

  // Wait for content script to be ready
  async waitForContentScriptReady(timeout = 5000): Promise<void> {
    await this.page.waitForFunction(() => {
      // Look for the accessibility visualizer section
      return document.querySelector('section[aria-label*="Accessibility Visualizer"]') !== null;
    }, { timeout });
  }

  // Wait for content script to be removed
  async waitForContentScriptRemoved(timeout = 5000): Promise<void> {
    await this.page.waitForFunction(() => {
      // Check that accessibility visualizer section is gone
      return document.querySelector('section[aria-label*="Accessibility Visualizer"]') === null;
    }, { timeout });
  }

  // Get extension state by checking DOM
  async getExtensionState(): Promise<{ active: boolean; elementsCount: number }> {
    return await this.page.evaluate(() => {
      const visualizerSection = document.querySelector('section[aria-label*="Accessibility Visualizer"]');
      if (!visualizerSection) return { active: false, elementsCount: 0 };
      
      const shadowRoot = visualizerSection.querySelector('div')?.shadowRoot;
      const elementsCount = shadowRoot ? shadowRoot.querySelectorAll('.ElementInfo').length : 0;
      
      return {
        active: true,
        elementsCount
      };
    });
  }

  // Simulate page elements that should be detected
  async addTestElements(): Promise<void> {
    await this.page.evaluate(() => {
      console.log('=== ADDING TEST ELEMENTS ===');
      // Add some test elements that should be detected by the extension
      const testElements = [
        '<h1 id="test-h1">Test Heading</h1>',
        '<button id="test-button">Test Button</button>',
        '<img id="test-img" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Test Image">',
        '<a id="test-link" href="#test">Test Link</a>',
        '<input id="test-input" type="text" aria-label="Test Input">',
        '<div id="test-div-button" role="button" aria-label="Custom Button">Custom Button</div>',
        '<div id="test-hidden" aria-hidden="true">Hidden Content</div>',
        '<div id="test-nav" role="navigation" aria-label="Test Navigation">Nav Content</div>'
      ];
      
      testElements.forEach((html, i) => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        const element = wrapper.firstChild as Element;
        document.body.appendChild(element);
        console.log(`Added test element ${i}: ${element.tagName} with id ${element.id}`);
      });
      
      // Log what elements are now on the page
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const buttons = document.querySelectorAll('button, [role="button"]');
      const images = document.querySelectorAll('img');
      const links = document.querySelectorAll('a');
      
      console.log(`Page now has: ${headings.length} headings, ${buttons.length} buttons, ${images.length} images, ${links.length} links`);
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

  // Force disable the extension using the test API
  async forceDisableExtension(): Promise<boolean> {
    return await this.page.evaluate(() => {
      // Use the test API exposed by the content script
      if ((window as any).a11yVisualizerTestAPI) {
        console.log('Using test API to force disable');
        
        // First check if there's content mounted
        const visualizerSection = document.querySelector('section[aria-label*="Accessibility Visualizer"]');
        console.log('Content exists before disable:', !!visualizerSection);
        
        const result = (window as any).a11yVisualizerTestAPI.forceDisable();
        
        // Check if content was removed
        const visualizerSectionAfter = document.querySelector('section[aria-label*="Accessibility Visualizer"]');
        console.log('Content exists after disable:', !!visualizerSectionAfter);
        
        return result;
      } else {
        console.log('Test API not available');
        return false;
      }
    });
  }

  // Force enable the extension by directly triggering message handling
  async forceEnableExtension(): Promise<void> {
    await this.page.evaluate(() => {
      // Simulate the runtime message that would enable the extension
      const enableMessage = {
        type: "updateEnabled",
        enabled: true
      };

      // Try to trigger the message handler directly if possible
      if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.onMessage) {
        try {
          const event = new CustomEvent('browser-runtime-message', {
            detail: enableMessage
          });
          window.dispatchEvent(event);
          
          // @ts-ignore - accessing internal browser API
          const listeners = browser.runtime.onMessage._listeners || [];
          listeners.forEach((listener: any) => {
            try {
              listener(enableMessage, {}, () => {});
            } catch (e) {
              console.log('Listener call failed:', e);
            }
          });
        } catch (e) {
          console.log('Failed to trigger message handlers:', e);
        }
      }
    });
  }
}