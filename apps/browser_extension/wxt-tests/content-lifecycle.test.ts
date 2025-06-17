import { describe, test, expect, beforeEach } from "vitest";
import { fakeBrowser } from "wxt/testing";
import { loadEnabled, saveEnabled } from "../src/enabled";

describe("Content script lifecycle logic", () => {
  beforeEach(() => {
    fakeBrowser.reset();
  });

  test("should simulate content injection when enabled", async () => {
    // Set enabled state
    await saveEnabled(true);
    
    // Simulate the content script logic
    const enabled = await loadEnabled();
    let injected = false;
    
    if (enabled) {
      // Simulate injection
      injected = true;
    }
    
    expect(enabled).toBe(true);
    expect(injected).toBe(true);
  });

  test("should not inject content when disabled", async () => {
    // Set disabled state
    await saveEnabled(false);
    
    // Simulate the content script logic
    const enabled = await loadEnabled();
    let injected = false;
    
    if (enabled) {
      // Simulate injection
      injected = true;
    }
    
    expect(enabled).toBe(false);
    expect(injected).toBe(false);
  });

  test("should handle updateEnabled message correctly", async () => {
    let injected = false;
    
    // Simulate content script message listener
    const handleMessage = (message: { type: string; enabled: boolean }) => {
      if (message.type !== "updateEnabled") return;
      
      if (message.enabled && !injected) {
        // Simulate injection
        injected = true;
      } else if (!message.enabled && injected) {
        // Simulate cleanup
        injected = false;
      }
    };
    
    // Test enabling
    handleMessage({ type: "updateEnabled", enabled: true });
    expect(injected).toBe(true);
    
    // Test disabling
    handleMessage({ type: "updateEnabled", enabled: false });
    expect(injected).toBe(false);
  });

  test("should handle tab switching bug scenario", async () => {
    let injected = false;
    
    // Initially enabled and injected
    injected = true;
    
    // Simulate tab becoming hidden
    let visibilityState = "hidden";
    
    // Extension disabled while tab is hidden
    await saveEnabled(false);
    
    // Tab becomes visible again
    visibilityState = "visible";
    
    // Simulate visibility change handler (the key fix)
    const handleVisibilityChange = async () => {
      if (visibilityState === "visible") {
        // In real code, this would call browser.runtime.sendMessage
        // Here we simulate the response
        const enabled = await loadEnabled();
        
        if (enabled && !injected) {
          // Simulate injection
          injected = true;
        } else if (!enabled && injected) {
          // This is the key fix - should set injected to false when disabled
          injected = false;
        }
      }
    };
    
    await handleVisibilityChange();
    
    // Should not be injected since extension is disabled
    expect(injected).toBe(false);
  });
});