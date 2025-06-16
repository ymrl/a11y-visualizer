// @vitest-environment happy-dom

import { describe, test, expect, beforeEach } from "vitest";
import { fakeBrowser } from "wxt/testing";
import { loadEnabled, saveEnabled, ENABLED_KEY } from "../src/enabled";

describe("Extension enabled state (Browser Mode)", () => {
  beforeEach(() => {
    fakeBrowser.reset();
    // Clear DOM for browser mode tests
    if (typeof document !== "undefined") {
      document.body.innerHTML = "";
    }
  });

  test("should default to disabled state", async () => {
    const enabled = await loadEnabled();
    expect(enabled).toBe(false);
  });

  test("should save and load enabled state", async () => {
    await saveEnabled(true);
    const enabled = await loadEnabled();
    expect(enabled).toBe(true);
  });

  test("should save and load disabled state", async () => {
    await saveEnabled(false);
    const enabled = await loadEnabled();
    expect(enabled).toBe(false);
  });

  test("should handle storage key consistency", async () => {
    // Directly check storage key to ensure it matches background script
    await fakeBrowser.storage.local.set({ [ENABLED_KEY]: true });
    const result = await fakeBrowser.storage.local.get(ENABLED_KEY);
    expect(result[ENABLED_KEY]).toBe(true);

    // Verify loadEnabled uses the same key
    const enabled = await loadEnabled();
    expect(enabled).toBe(true);
  });

  test("should persist state across multiple operations", async () => {
    await saveEnabled(true);
    await saveEnabled(false);
    await saveEnabled(true);
    
    const enabled = await loadEnabled();
    expect(enabled).toBe(true);
  });

  test("should work with real DOM manipulation", async () => {
    // Test DOM access in browser mode
    const testElement = document.createElement("div");
    testElement.setAttribute("data-testid", "extension-test");
    testElement.textContent = "Extension is enabled";
    document.body.appendChild(testElement);

    const found = document.querySelector('[data-testid="extension-test"]');
    expect(found).toBeTruthy();
    expect(found?.textContent).toBe("Extension is enabled");

    // Test with extension state
    await saveEnabled(true);
    const enabled = await loadEnabled();
    
    if (enabled) {
      testElement.style.display = "block";
    } else {
      testElement.style.display = "none";
    }

    expect(testElement.style.display).toBe("block");
  });
});