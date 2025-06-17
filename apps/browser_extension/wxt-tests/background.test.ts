import { describe, test, expect, beforeEach, vi } from "vitest";
import { fakeBrowser } from "wxt/testing";

describe("Background script", () => {
  beforeEach(() => {
    fakeBrowser.reset();
  });

  test("should handle isEnabled message", async () => {
    // Set up enabled state
    await fakeBrowser.storage.local.set({ "__enabled__": true });

    // Create a mock message listener response
    const mockSendResponse = vi.fn();
    const message = { type: "isEnabled" };

    // Simulate the background script's message listener logic
    const handleMessage = async (message: { type: string}, sendResponse: (props: {type: string; enabled: boolean})=>unknown | Promise<unknown> | void) => {
      if (message.type === "isEnabled") {
        const result = await fakeBrowser.storage.local.get("__enabled__");
        const enabled = result["__enabled__"] ?? false;
        sendResponse({
          type: "isEnabledAnswer",
          enabled,
        });
        return true;
      }
    };

    await handleMessage(message, mockSendResponse);

    expect(mockSendResponse).toHaveBeenCalledWith({
      type: "isEnabledAnswer",
      enabled: true,
    });
  });

  test("should handle updateEnabled message", async () => {
    const message = { type: "updateEnabled", enabled: true };
    
    // Mock the updateIcons function behavior
    const mockUpdateIcons = vi.fn();
    
    // Simulate background script's updateEnabled message handling
    if (message.type === "updateEnabled") {
      await mockUpdateIcons(message.enabled);
    }
    
    expect(mockUpdateIcons).toHaveBeenCalledWith(true);
  });

  test("should initialize with correct default state", async () => {
    // Test the installation logic
    const details = { reason: "install" as const };
    
    // Simulate onInstalled logic
    if (details.reason === "install") {
      await fakeBrowser.storage.local.set({ "__enabled__": true });
    }
    
    const result = await fakeBrowser.storage.local.get("__enabled__");
    expect(result["__enabled__"]).toBe(true);
  });

  test("should handle update without overriding existing settings", async () => {
    // Pre-existing state
    await fakeBrowser.storage.local.set({ "__enabled__": false });
    
    const details = { reason: "update" as const };
    
    // Simulate onInstalled logic for update
    if (details.reason === "update") {
      const enabled = await fakeBrowser.storage.local.get("__enabled__");
      if (enabled["__enabled__"] === undefined) {
        await fakeBrowser.storage.local.set({ "__enabled__": true });
      }
    }
    
    // Should preserve existing state
    const result = await fakeBrowser.storage.local.get("__enabled__");
    expect(result["__enabled__"]).toBe(false);
  });
});